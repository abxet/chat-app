import { useState } from "react";
import { UserPlus, Search } from "lucide-react";
import api from "../api/axiosInstance"; // Adjust the path if needed

const UserSearchPanel = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);

    try {
      const res = await api.get(
        `/friends/search?username=${encodeURIComponent(searchTerm)}`
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
      await api.post("/friends/requests", {
        friendId,
      });

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
          className="w-full pl-3 pr-3 py-2 dark:bg-gray-900 dark:text-white text-gray-600 placeholder-gray-400 border-b-2 border-teal-600 focus:outline-none focus:border-teal-400"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />

        <button
          onClick={handleSearch}
          className="bg-teal-500 text-white px-3 py-2 rounded flex items-center gap-2"
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
              className="flex items-center justify-between bg-white text-gray-600 dark:bg-gray-800 p-2 rounded"
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
                <UserPlus size={18} className="text-white" />
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