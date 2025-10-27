import mongoose from "mongoose";

// create the User schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // STORE PUBLIC KEY AND ENCRYPTED PRIVATE KEY
    publicKey: { type: String },
    encryptedPrivateKey: { type: String },
    
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // array of friend IDs
    requests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // incoming friend requests

    profile: {
        firstName: String,
        lastName: String,
        profilePic: String,
        bio: String,
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;