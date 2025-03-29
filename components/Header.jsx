import React from "react";

const Header = () => {
  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <h1 className="text-xl font-semibold text-gray-900">
            Event Management System
          </h1>
          <nav className="hidden md:flex space-x-4">
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Dashboard
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Events
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Analytics
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Settings
            </a>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <button className="border rounded px-3 py-1 hover:bg-gray-100 flex items-center">
            <i className="fas fa-bell mr-2"></i> Notifications
          </button>
          <div className="cursor-pointer">
            <img
              src="https://public.readdy.ai/ai/img_res/b0d2d2955931f33c95abf32b525c31d8.jpg"
              alt="User"
              className="w-8 h-8 rounded-full"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
