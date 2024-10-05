import mongoose, { InferSchemaType } from "mongoose";

const jeloSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true, default: () => new mongoose.Types.ObjectId(), },
  ime: { type: String, required: true },
  cijena: { type: Number, required: true },
});

export type JeloType = InferSchemaType<typeof jeloSchema>

const restaurantSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  imeRestorana: { type: String, required: true },
  grad: { type: String, required: true },
  drzava: { type: String, required: true },
  cijenaDostave: { type: Number, required: true },
  procijenjenoVrijemeDostave: { type: Number, required: true },
  vrsteJela: [{ type: String, required: true }],
  jelovnik: [jeloSchema],
  urlSlike: { type: String, required: true },
  zadnjiUpdate: { type: Date, required: true },
});

const Restoran = mongoose.model("Restoran", restaurantSchema);

export default Restoran;