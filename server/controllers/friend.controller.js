import User from "../models/User.model.js";

// GET all friends

export const getFriends = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await User.findById(req.user._id).populate(
      'friends',
      'username email profile publicKey'
    );

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user.friends);
  } catch (error) {
    console.error('Fetch friends error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


// GET all pending requests

export const getRequests = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await User.findById(req.user._id).populate(
      'requests',
      'username email bio profile'
    );

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user.requests);
  } catch (error) {
    console.error('Fetch friend requests error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


// POST: send a friend request

export const postRequest = async (req, res) => {
  try {
    const { friendId } = req.body;
    if (!friendId) return res.status(400).json({ error: "Friend ID is required" });

    if (friendId === req.user._id.toString())
      return res.status(400).json({ error: "You can't send a request to yourself" });

    const [user, friend] = await Promise.all([
      User.findById(req.user._id),
      User.findById(friendId),
    ]);

    if (!friend) return res.status(404).json({ error: "User not found" });
    if (user.friends.includes(friend._id))
      return res.status(400).json({ error: "Already friends" });

    if (friend.requests.includes(user._id))
      return res.status(400).json({ error: "Request already sent" });

    friend.requests.push(user._id);
    await friend.save();

    res.json({ message: "Friend request sent" });
  } catch (error) {
    console.error('Friend request error:', error);
    res.status(500).json({ error: "Server error" });
  }
};

// PUT: accept a friend request

export const acceptRequest = async (req, res) => {
  try {
    const requestUserId = req.params.id; // ID of the user who sent the request
    const currentUserId = req.user._id;

    if (!requestUserId) return res.status(400).json({ error: 'Request ID is required' });

    const [currentUser, requestUser] = await Promise.all([
      User.findById(currentUserId),
      User.findById(requestUserId),
    ]);

    if (!currentUser || !requestUser)
      return res.status(404).json({ error: 'User not found' });

    // Check if the request exists
    if (!currentUser.requests.includes(requestUserId))
      return res.status(400).json({ error: 'No such friend request' });

    // Remove from requests
    currentUser.requests = currentUser.requests.filter(
      (id) => id.toString() !== requestUserId
    );

    // Add each other as friends
    currentUser.friends.push(requestUser._id);
    requestUser.friends.push(currentUser._id);

    await Promise.all([currentUser.save(), requestUser.save()]);

    res.json({ message: 'Friend request accepted', friend: requestUser });
  } catch (error) {
    console.error('Accept request error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


// PUT: reject a friend request

export const rejectRequest = async (req, res) => {
  try {
    const requestUserId = req.params.id; // ID of the user who sent the request
    const currentUserId = req.user._id;

    const currentUser = await User.findById(currentUserId);
    if (!currentUser) return res.status(404).json({ error: "User not found" });

    if (!currentUser.requests.includes(requestUserId))
      return res.status(400).json({ error: "No such friend request" });

    // Remove from requests
    currentUser.requests = currentUser.requests.filter(
      (id) => id.toString() !== requestUserId
    );

    await currentUser.save();

    res.json({ message: "Friend request rejected" });
  } catch (error) {
    console.error('Reject request error:', error);
    res.status(500).json({ error: "Server error" });
  }
};


// search users by username
export const searchUsers = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const query = req.query.username?.trim();
    if (!query) return res.status(400).json({ error: "Username is required" });

    const users = await User.find({
      username: { $regex: query, $options: "i" },
      _id: { $ne: req.user._id },
    })
      .select("_id username email bio")
      .limit(20);

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// unfriend a friend
export const unfriendUser = async (req, res) => {
  try {
    const currentUserId = req.user._id; // from auth middleware
    const { friendId } = req.params;

    if (!friendId) {
      return res.status(400).json({ error: "Friend ID is required" });
    }

    // Remove friend from current user
    await User.findByIdAndUpdate(currentUserId, {
      $pull: { friends: friendId },
    });

    // Remove current user from friend's friend list
    await User.findByIdAndUpdate(friendId, {
      $pull: { friends: currentUserId },
    });

    res.status(200).json({ message: "Friend removed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// get public key
export const getUserPublicKey = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user and only return the public key field
    const user = await User.findById(userId).select("publicKey username");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({
      username: user.username,
      publicKey: user.publicKey,
    });
  } catch (error) {
    console.error("Error fetching public key:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

