import React from "react";

const FriendRequestList = ({ requests, onAccept }) => {
  return (
    <div className="space-y-3">
      <p className="text-gray-400 font-semibold mb-2">Friend Requests</p>

      {requests.length ? (
        requests.map((name) => (
          <div
            key={name}
            className="flex items-center justify-between p-2 rounded hover:bg-gray-700 text-white"
          >
            <span>{name}</span>
            <button
              onClick={() => onAccept(name)}
              className="bg-teal-500 hover:bg-teal-600 px-2 py-1 rounded text-white text-sm"
            >
              Accept
            </button>
          </div>
        ))
      ) : (
        <p className="text-gray-400 text-sm">No new requests</p>
      )}
    </div>
  );
};

export default FriendRequestList;
