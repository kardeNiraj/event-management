import { FiAward, FiCalendar, FiCheck, FiEdit, FiLock } from "react-icons/fi";

import { useState } from "react";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profilePic, setProfilePic] = useState(
    "https://via.placeholder.com/150"
  );
  const [studentInfo, setStudentInfo] = useState({
    name: "John Doe",
    email: "john.doe@stanford.edu",
    bio: "Computer Science Student | Tech Enthusiast",
    college: "Stanford University",
    degree: "B.S. Computer Science",
    graduationYear: "2025",
    gpa: "3.8/4.0",
    phone: "+1 (555) 123-4567",
  });

  const [eventsProgress] = useState([
    {
      id: 1,
      title: "Tech Hackathon",
      progress: 85,
      status: "Ongoing",
      date: "2023-11-15",
    },
    {
      id: 2,
      title: "AI Workshop",
      progress: 100,
      status: "Completed",
      date: "2023-09-20",
    },
    {
      id: 3,
      title: "Startup Pitch",
      progress: 30,
      status: "Upcoming",
      date: "2024-02-10",
    },
  ]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditSave = () => {
    setIsEditing(!isEditing);
    // Add save to backend logic here
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm p-8">
        {/* Profile Header */}
        <div className="flex justify-between items-start mb-8">
          <h1 className="text-3xl font-bold text-gray-800">{isAdmin ? "Student Profile" : "Admin Profile"}</h1>
          <button
            onClick={handleEditSave}
            className="flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200"
          >
            {isEditing ? (
              <FiCheck className="w-5 h-5" />
            ) : (
              <FiEdit className="w-5 h-5" />
            )}
            {isEditing ? "Save Changes" : "Edit Profile"}
          </button>
        </div>

        {/* Profile Content */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column */}
          <div className="md:w-1/3 space-y-6">
            <div className="text-center">
              <div className="relative inline-block">
                <img
                  src={profilePic}
                  alt="Profile"
                  className="w-32 h-32 rounded-full mx-auto mb-4 cursor-pointer"
                  onClick={() => document.getElementById("fileInput").click()}
                />
                <input
                  type="file"
                  id="fileInput"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <span className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-sm">
                  <FiEdit className="w-4 h-4 text-blue-600" />
                </span>
              </div>

              {isEditing ? (
                <input
                  type="text"
                  value={studentInfo.name}
                  onChange={(e) =>
                    setStudentInfo({ ...studentInfo, name: e.target.value })
                  }
                  className="text-xl font-bold text-center mb-2 border rounded-lg p-2"
                />
              ) : (
                <h2 className="text-xl font-bold text-gray-800">
                  {studentInfo.name}
                </h2>
              )}
              <p className="text-gray-600">{studentInfo.bio}</p>
            </div>

            <div className="p-6 border rounded-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FiAward className="text-blue-600" />
                Academic Information
              </h3>
              <div className="space-y-3">
                <ProfileField
                  label="College"
                  value={studentInfo.college}
                  editing={isEditing}
                />
                <ProfileField
                  label="Degree"
                  value={studentInfo.degree}
                  editing={isEditing}
                />
                <ProfileField
                  label="Graduation Year"
                  value={studentInfo.graduationYear}
                  editing={isEditing}
                />
                <ProfileField
                  label="GPA"
                  value={studentInfo.gpa}
                  editing={isEditing}
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="md:w-2/3 space-y-6">
            {/* Event Progress Section */}
            <div className="p-6 border rounded-lg">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <FiCalendar className="text-blue-600" />
                Event Participation Progress
              </h3>
              <div className="space-y-4">
                {eventsProgress.map((event) => (
                  <div
                    key={event.id}
                    className="p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{event.title}</h4>
                      <span
                        className={`text-sm px-2 py-1 rounded-full ${
                          event.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : event.status === "Ongoing"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {event.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${event.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {event.progress}%
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      Event Date: {event.date}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Section */}
            <div className="p-6 border rounded-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FiLock className="text-blue-600" />
                Security Settings
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Password</span>
                  <button className="text-blue-600 hover:text-blue-800">
                    Change Password
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span>Two-Factor Authentication</span>
                  <button className="text-blue-600 hover:text-blue-800">
                    Enable 2FA
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Profile Field Component
const ProfileField = ({ label, value, editing }) => {
  const [fieldValue, setFieldValue] = useState(value);

  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-600">{label}:</span>
      {editing ? (
        <input
          type="text"
          value={fieldValue}
          onChange={(e) => setFieldValue(e.target.value)}
          className="w-32 px-2 py-1 border rounded-md"
        />
      ) : (
        <span className="font-medium">{fieldValue}</span>
      )}
    </div>
  );
};

export default Profile;
