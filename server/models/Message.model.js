
// models/Message.model.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  // text: { type: String, required: true },
  // STORE CT
  ciphertext: { type: String, required: true },
  nonce: { type: String, required: true },
  fromPublicKey: { type: String, required: true },
  toPublicKey: { type: String, required: true },
  status : {type: String, required : true, enum : ["sent","delivered","seen","sending","error"], default:"sending"},
},
  { timestamps: true } 
);

export default mongoose.model("Message", messageSchema);
