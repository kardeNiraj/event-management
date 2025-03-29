import React from "react";

// Mock data for events
const upcomingEvents = [
  {
    id: 1,
    title: "Annual Tech Innovation Summit 2025",
    date: "2025-04-15",
    time: "09:00 AM",
    category: "Technology",
    capacity: 200,
    registered: 156,
    image:
      "https://public.readdy.ai/ai/img_res/2ce9b247ed5023c3556b0fca6252d80f.jpg",
  },
  {
    id: 2,
    title: "Global Leadership Workshop",
    date: "2025-04-20",
    time: "02:00 PM",
    category: "Leadership",
    capacity: 100,
    registered: 89,
    image:
      "https://public.readdy.ai/ai/img_res/7e58b81e011c6a905e6bb1ca23af424b.jpg",
  },
  {
    id: 3,
    title: "Creative Arts Exhibition",
    date: "2025-04-25",
    time: "10:00 AM",
    category: "Arts",
    capacity: 300,
    registered: 245,
    image:
      "https://public.readdy.ai/ai/img_res/1b031a29963128156bdb94ca43828f9d.jpg",
  },
];

const EventsSection = () => {
  return (
    <div className="p-6 bg-white shadow rounded">
      {/* Tab Buttons */}
      <div className="mb-4 border-b pb-2 flex space-x-4">
        <button className="px-4 py-2 border-b-2 border-blue-500 font-semibold">
          Upcoming Events
        </button>
        <button className="px-4 py-2 text-gray-600 hover:text-gray-900">
          Past Events
        </button>
      </div>
      {/* Events List */}
      <div className="overflow-y-auto h-96 pr-4">
        {upcomingEvents.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-lg shadow-sm border p-4 mb-4"
          >
            <div className="flex gap-4">
              <div className="w-48 h-24 overflow-hidden rounded-lg">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{event.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      <i className="fas fa-calendar-alt mr-2"></i>
                      {event.date} at {event.time}
                    </p>
                  </div>
                  <div className="bg-gray-200 text-gray-800 rounded px-2 py-1 text-xs">
                    {event.category}
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {event.registered} / {event.capacity} registered
                  </div>
                  <button className="rounded px-4 py-2 bg-green-500 text-white hover:bg-green-600">
                    Register Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsSection;
