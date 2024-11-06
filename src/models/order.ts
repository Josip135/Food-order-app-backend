import mongoose from "mongoose";

const narudzbaSchema = new mongoose.Schema({
  restoran: { type: mongoose.Schema.Types.ObjectId, ref: "Restoran" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  detaljiDostave: {
    email: { type: String, required: true },
    ime: { type: String, required: true },
    adresa: { type: String, required: true },
    grad: { type: String, required: true },
  },
  cartItems: [
    {
      jeloId: { type: String, required: true },
      kolicina: { type: Number, required: true },
      ime: { type: String, required: true },
    },
  ],
  ukupanZbroj: Number,
  status: {
    type: String,
    enum: ["postavljena", "placena", "uIzradi", "uTokuDostave", "dostavljena"],
  },
  createdAt: { type: Date, default: Date.now }
});

const Narudzba = mongoose.model("Narudzba", narudzbaSchema);
export default Narudzba;

//whsec_07fbf169b59d579013750e9f8c8d8a3b776cbf1bab3dc0669b5eea008fbe1d85
/*C:\Users\user>stripe --version
stripe version 1.21.8

C:\Users\user>stripe login
Your pairing code is: fond-safe-laud-mighty
This pairing code verifies your authentication with Stripe.
Press Enter to open the browser or visit https://dashboard.stripe.com/stripecli/confirm_auth?t=nR56MpIiCwMchVCe5wIfkr8cEw4NrtDV (^C to quit)
> Done! The Stripe CLI is configured for your account with account id acct_1Q4qP6AXGnUhr3cK

Please note: this key will expire after 90 days, at which point you'll need to re-authenticate.

C:\Users\user>stripe listen --forward-to localhost:7000/api/order/checkout/webhook
> Ready! You are using Stripe API Version [2024-06-20]. Your webhook signing secret is whsec_07fbf169b59d579013750e9f8c8d8a3b776cbf1bab3dc0669b5eea008fbe1d85 (^C to quit)*/