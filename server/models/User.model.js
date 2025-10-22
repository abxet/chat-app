import mongoose from "mongoose";

// create friends schema
const friendsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    friendId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

// create the User schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    friends : [friendsSchema],
    profile : {
        firstName: String,
        lastName: String,
        profilePic: String,
        bio: String,
    }
});

// create the User model
const User = mongoose.model("User", userSchema);

export default User;