import mongoose from "mongoose";

const jeloSchema = new mongoose.Schema({
  ime: { type: String, required: true },
  cijena: { type: Number, required: true },
});

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