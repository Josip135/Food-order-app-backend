import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  auth0Id: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  ime: {
    type: String,
  },
  adresa: {
    type: String,
  },
  grad: {
    type: String,
  },
  drzava: {
    type: String,
  },
})

const User = mongoose.model("User", userSchema);
export default User;