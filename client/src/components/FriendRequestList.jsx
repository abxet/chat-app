
// components/FriendRequestList
import React from "react";
import { UserPlus, UserMinus } from 'lucide-react'

const FriendRequestList = ({ requests, onAccept, onReject }) => {
  return (
    <div className="space-y-3">
      <p className="text-gray-400 font-semibold mb-2">Friend Requests</p>

      {requests.length ? (
        requests.map((request) => (
          <div
            key={request._id}
            className="flex items-center justify-between p-2 rounded hover:bg-gray-700 text-white"
          >
            <div className="flex flex-col">
              <span className="font-medium">{request.username}</span>
              <span className="text-gray-400 text-sm">{request.email}</span>
            </div>
            <div className="flex gap-2">
              {/* Accept Friend Request */}
              <button
                onClick={() => onAccept(request)}
                className="flex items-center justify-center bg-teal-500 hover:bg-teal-600 px-3 py-2 rounded text-white text-sm transition-colors duration-200"
              >
                <UserPlus className="w-5 h-5" />
              </button>

              {/* Reject Friend Request */}
              <button
                onClick={() => onReject(request)}
                className="flex items-center justify-center bg-red-500 hover:bg-red-600 px-3 py-2 rounded text-white text-sm transition-colors duration-200"
              >
                <UserMinus className="w-5 h-5" />
              </button>
            </div>

          </div>
        ))
      ) : (
        <p className="text-gray-400 text-sm">No new requests</p>
      )}
    </div>
  );
};

export default FriendRequestList;
