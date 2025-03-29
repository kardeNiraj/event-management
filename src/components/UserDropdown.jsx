// import { useState, useRef, useEffect } from "react";
// import { FiUser, FiSettings, FiLogOut } from "react-icons/fi";
// import { useNavigate } from "react-router-dom";

// const UserDropdown = () => {
//   const [showDropdown, setShowDropdown] = useState(false);
//   const dropdownRef = useRef(null);
//   const navigate = useNavigate();

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShowDropdown(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleLogout = () => {
//     // Add your logout logic here
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   return (
//     <div className="relative" ref={dropdownRef}>
//       <button
//         onClick={() => setShowDropdown(!showDropdown)}
//         className="p-2 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-100"
//       >
//         <FiUser className="w-5 h-5" />
//       </button>

//       {showDropdown && (
//         <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200">
//           <button
//             onClick={() => navigate("/profile")}
//             className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//           >
//             <FiSettings className="mr-2" />
//             Profile
//           </button>
//           <button
//             onClick={handleLogout}
//             className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//           >
//             <FiLogOut className="mr-2" />
//             Logout
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserDropdown;
