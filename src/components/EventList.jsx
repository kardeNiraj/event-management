import { useEffect, useState } from "react";

import { FiSearch } from "react-icons/fi";
import { RegisterModal } from "./Modals";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const EventList = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Loader state
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState({ upcoming: [], past: [] });

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true); // Show loader
      try {
        // Fetching upcoming and past events
        const upcomingResponse = await fetch(
          "http://3.110.1.182:9000/api/event/get-event_filtered/?filter=Upcoming",
          { headers: { accept: "application/json" } }
        );
        const pastResponse = await fetch(
          "http://3.110.1.182:9000/api/event/get-event_filtered/?filter=Past",
          { headers: { accept: "application/json" } }
        );

        const upcomingData = await upcomingResponse.json();
        const pastData = await pastResponse.json();

        if (upcomingData.success && pastData.success) {
          setEvents({
            upcoming: upcomingData.data.Event,
            past: pastData.data.Event,
          });
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setIsLoading(false); // Hide loader once fetching is done
      }
    };

    fetchEvents();
  }, []);

  const handleEventClick = (eventId) => navigate(`/events/${eventId}`);

  const handleRegisterClick = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setShowRegisterModal(true);
  };

  const handleSearch = (e) => setSearchQuery(e.target.value);

  // Filter events based on search query
  const filteredEvents = events[activeTab].filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      {/* Search and Create Event Section */}
      <div className="flex justify-between items-center gap-4 mb-6">
        <div className="flex-1 items-center relative">
          <FiSearch className="absolute left-3 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search events..."
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* Tabs Section */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === "upcoming"
                ? "bg-blue-100 text-blue-600"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming Events
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === "past"
                ? "bg-blue-100 text-blue-600"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("past")}
          >
            Past Events
          </button>
        </div>
      </div>

      {/* Event Cards Grid or Loader */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full text-blue-600"></div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => handleEventClick(event.id)}
                className="border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              >
                <img
                  src={
                    event.image
                      ? `http://3.110.1.182:9000${event.image}`
                      : "https://source.unsplash.com/random/800x600?event"
                  }
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-gray-600">
                      {new Date(event.start_date_time).toLocaleString()}
                    </p>
                    {/* <p className="text-gray-600">
                      {event.registeredStudents} registered
                    </p> */}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                      {event.category}
                    </span>
                    {/* {!isAdmin && <button
                      onClick={handleRegisterClick}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Register Now
                    </button>} */}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-12 text-gray-500">
              No events found matching your search
            </div>
          )}
        </div>
      )}

      {/* Register Modal */}
      {showRegisterModal && (
        <RegisterModal onClose={() => setShowRegisterModal(false)} />
      )}
    </div>
  );
};

export default EventList;
