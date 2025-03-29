import React, { useState } from "react";
import EventsSection from "./EventsSection";
import AnalyticsSection from "./AnalyticsSection";

const MainContent = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Search and Actions */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex-1 max-w-lg relative">
          <input
            type="text"
            placeholder="Search events..."
            className="pl-10 border border-gray-200 rounded w-full py-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        </div>
        <div className="flex space-x-4">
          <button className="rounded px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 flex items-center">
            <i className="fas fa-plus mr-2"></i> Create Event
          </button>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <EventsSection />
        </div>
        <div className="space-y-8">
          <AnalyticsSection />
        </div>
      </div>
    </main>
  );
};

export default MainContent;
