import {
  FiBell,
  FiLogOut,
  FiPlus,
  FiSearch,
  FiSettings,
  FiUser,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const menuRef = useRef(null);
  const notificationsRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, logout } = useAuth();

  const fetchNotifications = async () => {
    try {
      const response = await fetch(
        "http://3.110.1.182:9000/api/notification/get-notification/"
      );
      if (!response.ok) {
        throw new Error("Failed to get notifications!");
      }
      const data = await response.json();
      if (data.success && data.data?.Notification) {
        setNotifications(data.data.Notification);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    navigate('/profile');
    setShowProfileMenu(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowProfileMenu(false);
  };

  return (
    <header className="mb-8">
      {/* Top Row - Title and User Icons */}
      <div className="flex justify-between items-center mb-6">
        <Link to="/" className="hover:opacity-80">
        <div className="flex gap-2 items-center">
          <Logo className='w-20 h-20' />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Event Management System
            </h1>
            <p className="text-sm text-gray-500">SAIT Indore</p>
          </div>
          </div>
        </Link>

        <div className="flex items-center space-x-4">
          {/* Create Event Button - Only show for admin */}
          {isAdmin && (
            <Link
              to="/create-event"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <FiPlus className="w-5 h-5 mr-2" />
              Create Event
            </Link>
          )}

          {/* Notification Button with Dropdown */}
          <div className="relative" ref={notificationsRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-100"
            >
              <FiBell className="w-5 h-5" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification, index) => (
                    <div key={notification.id}>
                      <div className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                        {notification.message}
                      </div>
                      {index < notifications.length - 1 && (
                        <div className="border-t border-gray-100"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile/Login Button */}
          {isAuthenticated ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="p-2 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-100"
              >
                <FiUser className="w-5 h-5" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200 z-50">
                  <button
                    onClick={handleProfileClick}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FiSettings className="mr-2" />
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FiLogOut className="mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <FiUser className="w-5 h-5 mr-2" />
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
