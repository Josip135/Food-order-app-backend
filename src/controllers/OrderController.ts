import Stripe from "stripe";
import { Request, Response } from "express";
import Restoran, { JeloType } from "../models/restaurant";
import Narudzba from "../models/order";

const STRIPE = new Stripe(process.env.STRIPE_API_KEY as string);

const FRONTEND_URL = process.env.FRONTEND_URL as string;

const STRIPE_ENPOINT_SECRET = process.env.STRIPE_WEBHOOK_SECRET as string;

const getMyOrders = async (req: Request, res: Response) => {
  try {
    const narudzbe = await Narudzba.find({ user: req.userId }).populate("restoran").populate("user");

    res.json(narudzbe);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Nešto je pošlo po krivu!" });
  }
}

type CheckoutSessionRequest = {
  cartItems: {
    jeloId: string;
    ime: string;
    kolicina: string;
  }[];
  detaljiDostave: {
    email: string;
    ime: string;
    adresa: string;
    grad: string;
  };
  restoranId: string;
}

const stripeWebHookHandler = async (req: Request, res: Response) => {
  //console.log("RECEIVED EVENT");
  //console.log("================");
  //console.log("event: ", req.body);
  //res.send();
  let event;

  try {
    const sig = req.headers["stripe-signature"];
    event = STRIPE.webhooks.constructEvent(req.body, sig as string, STRIPE_ENPOINT_SECRET);
  } catch (error: any) {
    console.log(error);
    return res.status(400).send(`Webhook error: ${error.message}`)
  }

  if (event.type === "checkout.session.completed") {
    const narudzba = await Narudzba.findById(event.data.object.metadata?.narudzbaId);

    if (!narudzba) {
      return res.status(404).json({ message: "Narudžba nije pronađena!" });
    }

    narudzba.ukupanZbroj = event.data.object.amount_total;
    narudzba.status = "placena";

    await narudzba.save();
  }

  res.status(200).send();
}

const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const checkoutSessionRequest: CheckoutSessionRequest = req.body;

    const restoran = await Restoran.findById(checkoutSessionRequest.restoranId);

    if (!restoran) {
      throw new Error("Restoran nije pronađen!");
    }

    const novaNarudzba = new Narudzba({
      restoran: restoran,
      user: req.userId,
      status: "postavljena",
      detaljiDostave: checkoutSessionRequest.detaljiDostave,
      cartItems: checkoutSessionRequest.cartItems,
      createdAt: new Date(),
    })

    const lineItems = createLineItems(checkoutSessionRequest, restoran.jelovnik);

    const session = await createSession(
      lineItems,
      novaNarudzba._id.toString(),
      restoran.cijenaDostave,
      restoran._id.toString()
    );

    if (!session.url) {
      return res.status(500).json({ message: "Error creating stripe session!" });
    }

    await novaNarudzba.save();

    res.json({ url: session.url });

  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.raw.message });
  }

}

const createLineItems = (checkoutSessionRequest: CheckoutSessionRequest, jelovnik: JeloType[]) => {
  //1. Za svaki cartItem, dohvati jelo objekt iz restorana (za dobit cijenu)
  //2. Za svaki cartItem, konvertiraj ga u stripe line item
  //3. vrati line item polje

  //1.
  const lineItems = checkoutSessionRequest.cartItems.map((cartItem) => {
    const jelo = jelovnik.find((item) => item._id.toString() === cartItem.jeloId.toString());

    if (!jelo) {
      throw new Error(`Jelo nije pronađeno: ${cartItem.jeloId}`);
    }

    //2.
    const line_item: Stripe.Checkout.SessionCreateParams.LineItem = {
      price_data: {
        currency: "eur",
        unit_amount: jelo.cijena,
        product_data: {
          name: jelo.ime,
        },
      },
      quantity: parseInt(cartItem.kolicina),
    };

    return line_item;
  });

  return lineItems;
};

const createSession = async (lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
  narudzbaId: string,
  cijenaDostave: number,
  restoranId: string) => {
  const sessionData = await STRIPE.checkout.sessions.create({
    line_items: lineItems,
    shipping_options: [
      {
        shipping_rate_data: {
          display_name: "Dostava",
          type: "fixed_amount",
          fixed_amount: {
            amount: cijenaDostave,
            currency: "eur",
          },
        },
      },
    ],
    mode: "payment",
    metadata: {
      narudzbaId,
      restoranId,
    },
    success_url: `${FRONTEND_URL}/order-status?success=true`,
    cancel_url: `${FRONTEND_URL}/detail/${restoranId}?cancelled=true`
  });

  return sessionData;
};

export default {
  getMyOrders,
  createCheckoutSession,
  stripeWebHookHandler,
}