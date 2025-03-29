// import React from "react";

// const EventDashboard = () => {
//   const events = [
//     {
//       title: "Annual Tech Innovation Summit 2025",
//       date: "2025-04-15 at 09:00 AM",
//       registered: "156 / 200",
//       category: "Technology",
//     },
//     {
//       title: "Global Leadership Workshop",
//       date: "2025-04-20 at 02:00 PM",
//       registered: "89 / 100",
//       category: "Leadership",
//     },
//     {
//       title: "Creative Arts Exhibition",
//       date: "2025-04-25 at 10:00 AM",
//       registered: "245 / 300",
//       category: "Arts",
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-2xl font-bold text-gray-800 mb-4">
//           Dashboard Events Analytics Settings
//         </h1>
//         <input
//           type="text"
//           placeholder="Search events..."
//           className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//       </div>

//       <div className="grid lg:grid-cols-4 gap-8">
//         {/* Left Column - Events List */}
//         <div className="lg:col-span-3">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-xl font-semibold text-gray-700">
//               Upcoming Events
//             </h2>
//             <button className="text-blue-600 hover:text-blue-800 font-medium">
//               Past Events
//             </button>
//           </div>

//           {events.map((event, index) => (
//             <div
//               key={index}
//               className="bg-white rounded-lg shadow-sm p-6 mb-4 border border-gray-200"
//             >
//               <h3 className="text-lg font-semibold text-gray-800 mb-2">
//                 {event.title}
//               </h3>
//               <p className="text-gray-600 mb-2">{event.date}</p>
//               <p className="text-gray-600 mb-4">
//                 {event.registered} registered
//               </p>

//               <div className="flex justify-between items-center">
//                 <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
//                   {event.category}
//                 </span>
//                 <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
//                   Register Now
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Right Column - Stats & Notifications */}
//         <div className="lg:col-span-1">
//           {/* Quick Stats */}
//           <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
//             <h2 className="text-lg font-semibold text-gray-800 mb-4">
//               Quick Stats
//             </h2>
//             <div className="space-y-4">
//               <div>
//                 <p className="text-gray-600">Total Events</p>
//                 <p className="text-xl font-bold text-gray-800">24</p>
//               </div>
//               <div>
//                 <p className="text-gray-600">Active Events</p>
//                 <p className="text-xl font-bold text-gray-800">8</p>
//               </div>
//               <div>
//                 <p className="text-gray-600 mb-2">Registration Trends</p>
//                 <div className="flex justify-between text-gray-600 text-sm">
//                   {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map(
//                     (month, i) => (
//                       <span key={i}>{month}</span>
//                     )
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Notifications */}
//           <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
//             <h2 className="text-lg font-semibold text-gray-800 mb-4">
//               Notifications
//             </h2>
//             <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
//               Create Event
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EventDashboard;
