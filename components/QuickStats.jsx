import React from "react";

const QuickStats = () => {
  return (
    <>
      <h2 className="text-lg font-semibold mb-4">Quick Stats</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">Total Events</div>
          <div className="text-2xl font-semibold mt-1">24</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">Registered Users</div>
          <div className="text-2xl font-semibold mt-1">1,245</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">Active Events</div>
          <div className="text-2xl font-semibold mt-1">8</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">Avg. Attendance</div>
          <div className="text-2xl font-semibold mt-1">85%</div>
        </div>
      </div>
    </>
  );
};

export default QuickStats;
