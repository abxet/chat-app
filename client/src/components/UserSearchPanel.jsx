import React, { useState } from "react";
import { Search, UserPlus } from "lucide-react";

const UserSearchPanel = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([
    "George",
    "Hannah",
    "Isaac",
    "Jane"
  ]); // mock results

  const handleSendRequest = (name) => {
    alert(`Friend request sent to ${name}`);
    // Optionally remove from results or update UI
  };

  // Filter results based on search term
  const filteredResults = results.filter((r) =>
    r.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-3">
      {/* Search Bar */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-3 py-2 rounded-lg bg-gray-900 text-white placeholder-gray-400 border-b-2 border-teal-600 focus:outline-none focus:border-teal-400"
        />
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-500 pointer-events-none"
        />
      </div>

      {/* Search results */}
      {filteredResults.length ? (
        filteredResults.map((name) => (
          <div
            key={name}
            className="flex items-center justify-between p-2 rounded hover:bg-gray-700 text-white"
          >
            <span>{name}</span>
            <button
              onClick={() => handleSendRequest(name)}
              className="bg-teal-500 hover:bg-teal-600 px-2 py-1 rounded text-white text-sm flex items-center space-x-1"
            >
              <UserPlus size={14} />
              <span>Add</span>
            </button>
          </div>
        ))
      ) : (
        <p className="text-gray-400 text-sm">No users found</p>
      )}
    </div>
  );
};

export default UserSearchPanel;
