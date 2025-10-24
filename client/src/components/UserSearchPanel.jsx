
// components/UserSearchPanel
import { useState } from "react";
import axios from "axios";
import { UserPlus, Search } from "lucide-react";

const UserSearchPanel = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/api/friends/search?username=${searchTerm}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setResults(res.data);
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendFriendRequest = async (friendId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/friends/requests",
        { friendId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Friend request sent!");
    } catch (error) {
      console.error("Error sending friend request:", error);
      alert("Could not send request");
    }
  };

  return (
    <div className="text-white space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search by username"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          // className="flex-1 bg-gray-800 text-white p-2 rounded"
          className="w-full pl-3 pr-3 py-2 bg-gray-900 text-white placeholder-gray-400 border-b-2 border-teal-600 focus:outline-none focus:border-teal-400"
        />
        <button
          onClick={handleSearch}
          className="bg-teal-500 text-white px-3 py-2 rounded  flex items-center gap-2"
        >
          <Search size={18} className="text-white" />
        </button>

      </div>

      {loading && <p className="text-gray-400">Searching...</p>}

      {!loading && results.length > 0 && (
        <div className="space-y-2">
          {results.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between bg-gray-800 p-2 rounded"
            >
              <div>
                <p className="font-semibold">{user.username}</p>
                <p className="text-gray-400 text-sm">{user.email}</p>
              </div>
              <button
                onClick={() => sendFriendRequest(user._id)}
                className="bg-green-600 p-2 rounded hover:bg-green-500"
                title="Send Friend Request"
              >
                <UserPlus size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      {!loading && results.length === 0 && searchTerm && (
        <p className="text-gray-400">No users found.</p>
      )}
    </div>
  );
};

export default UserSearchPanel;
