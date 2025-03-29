import { FiUpload, FiUserPlus, FiX } from "react-icons/fi";
import { useEffect, useState } from "react";

// For Register the Event
export const RegisterModal = ({ onClose, eventDetails }) => {
  const user_id = localStorage.getItem("user_id")

  const [members, setMembers] = useState([]); // Start with empty members array
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    collegeName: "",
  });

  const totalMembers = () => {
    return 1 + members.length; // Count includes the main participant
  }

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    return /^[0-9]{10}$/.test(phone);
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate main form
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }
    if (!formData.collegeName.trim()) {
      newErrors.collegeName = "College name is required";
    }

    // Validate team members only if minTeamMembers > 1
    if (eventDetails?.minTeamMembers > 1) {
      if (totalMembers() < eventDetails?.minTeamMembers) {
        newErrors.teamSize = `Minimum ${eventDetails?.minTeamMembers} team members required`;
      }
      if (totalMembers() > eventDetails?.maxTeamMembers) {
        newErrors.teamSize = `Maximum ${eventDetails?.maxTeamMembers} team members allowed`;
      }

      // Validate additional team members
      members.forEach((member, index) => {
        const memberErrors = {};
        if (!member.name.trim()) {
          memberErrors.name = "Name is required";
        }
        if (!member.email.trim()) {
          memberErrors.email = "Email is required";
        } else if (!validateEmail(member.email)) {
          memberErrors.email = "Invalid email format";
        }
        if (!member.phone.trim()) {
          memberErrors.phone = "Phone is required";
        } else if (!validatePhone(member.phone)) {
          memberErrors.phone = "Phone must be 10 digits";
        }
        if (Object.keys(memberErrors).length > 0) {
          newErrors[`member${index}`] = memberErrors;
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addMember = () => {
    if (totalMembers() >= eventDetails?.maxTeamMembers) {
      setErrors(prev => ({
        ...prev,
        teamSize: `Maximum ${eventDetails?.maxTeamMembers} team members allowed`
      }));
      return;
    }
    setMembers([...members, { name: "", email: "", phone: "" }]);
  };

  const removeMember = (index) => {
    if (eventDetails?.minTeamMembers > 1 && totalMembers() <= eventDetails?.minTeamMembers) {
      setErrors(prev => ({
        ...prev,
        teamSize: `Minimum ${eventDetails?.minTeamMembers} team members required`
      }));
      return;
    }
    const newMembers = [...members];
    newMembers.splice(index, 1);
    setMembers(newMembers);
  };

  const handleMemberChange = (index, field, value) => {
    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setMembers(newMembers);
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const data = {
          user: user_id,
          event: eventDetails.id,
          team_members: members
        };

        const response = await fetch("http://3.110.1.182:9000/api/registration/add-registration/", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });

        if (!response.ok) {
          throw new Error("Failed to add registration");
        }

        console.log("Form submitted:", { ...formData, members });
        onClose();
      } catch (error) {
        console.error("Error submitting form:", error);
        setErrors(prev => ({
          ...prev,
          submit: "Failed to submit registration. Please try again."
        }));
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Event Registration</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Main Form */}
          <div className="space-y-4 border-b pb-4">
            <h3 className="font-semibold">Your Details</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleFormChange("name", e.target.value)}
                className={`w-full p-2 border rounded-md ${
                  errors.name ? "border-red-500" : ""
                }`}
                required
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleFormChange("email", e.target.value)}
                className={`w-full p-2 border rounded-md ${
                  errors.email ? "border-red-500" : ""
                }`}
                required
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleFormChange("phone", e.target.value)}
                className={`w-full p-2 border rounded-md ${
                  errors.phone ? "border-red-500" : ""
                }`}
                required
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                College Name
              </label>
              <input
                type="text"
                value={formData.collegeName}
                onChange={(e) => handleFormChange("collegeName", e.target.value)}
                className={`w-full p-2 border rounded-md ${
                  errors.collegeName ? "border-red-500" : ""
                }`}
                required
              />
              {errors.collegeName && (
                <p className="text-red-500 text-sm mt-1">{errors.collegeName}</p>
              )}
            </div>
          </div>

          {/* Team Members Section - Always visible but optional for single participant events */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Team Members {eventDetails?.minTeamMembers <= 1 ? "(Optional)" : ""}
                </label>
                {eventDetails?.minTeamMembers > 1 && (
                  <p className="text-sm text-gray-500">
                    {eventDetails?.minTeamMembers} - {eventDetails?.maxTeamMembers} members required
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={addMember}
                className="flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                <FiUserPlus className="mr-1" /> Add Member
              </button>
            </div>

            {errors.teamSize && (
              <p className="text-red-500 text-sm mb-2">{errors.teamSize}</p>
            )}

            {members.map((member, index) => (
              <div key={index} className="mb-4 p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Member {index + 1}</h4>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeMember(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  <div>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => handleMemberChange(index, "name", e.target.value)}
                      className={`w-full p-2 border rounded-md ${
                        errors[`member${index}`]?.name ? "border-red-500" : ""
                      }`}
                      placeholder="Name"
                    />
                    {errors[`member${index}`]?.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[`member${index}`].name}
                      </p>
                    )}
                  </div>

                  <div>
                    <input
                      type="email"
                      value={member.email}
                      onChange={(e) => handleMemberChange(index, "email", e.target.value)}
                      className={`w-full p-2 border rounded-md ${
                        errors[`member${index}`]?.email ? "border-red-500" : ""
                      }`}
                      placeholder="Email"
                    />
                    {errors[`member${index}`]?.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[`member${index}`].email}
                      </p>
                    )}
                  </div>

                  <div>
                    <input
                      type="tel"
                      value={member.phone}
                      onChange={(e) => handleMemberChange(index, "phone", e.target.value)}
                      className={`w-full p-2 border rounded-md ${
                        errors[`member${index}`]?.phone ? "border-red-500" : ""
                      }`}
                      placeholder="Phone"
                    />
                    {errors[`member${index}`]?.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[`member${index}`].phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            Submit Registration
          </button>
        </form>
      </div>
    </div>
  );
};

//  New event Creation model
// export const CreateEventModal = ({ onClose }) => {
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-6 w-full max-w-md">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-bold">Create New Event</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700"
//           >
//             <FiX className="w-6 h-6" />
//           </button>
//         </div>

//         <form className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Event Name
//             </label>
//             <input
//               type="text"
//               className="w-full p-2 border rounded-md"
//               required
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Start Date
//               </label>
//               <input
//                 type="date"
//                 className="w-full p-2 border rounded-md"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Start Time
//               </label>
//               <input
//                 type="time"
//                 className="w-full p-2 border rounded-md"
//                 required
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 End Date
//               </label>
//               <input
//                 type="date"
//                 className="w-full p-2 border rounded-md"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 End Time
//               </label>
//               <input
//                 type="time"
//                 className="w-full p-2 border rounded-md"
//                 required
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Max Team Size
//             </label>
//             <input
//               type="number"
//               min="1"
//               className="w-full p-2 border rounded-md"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Event Category
//             </label>
//             <select className="w-full p-2 border rounded-md" required>
//               <option value="">Select Category</option>
//               <option value="technology">Technology</option>
//               <option value="arts">Arts</option>
//               <option value="sports">Sports</option>
//               <option value="academic">Academic</option>
//             </select>
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
//           >
//             Create Event
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export const CreateEventModal = ({ onClose }) => {
//   const [eventImage, setEventImage] = useState(null);
//   const [previewImage, setPreviewImage] = useState("");

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPreviewImage(reader.result);
//         setEventImage(file);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!eventImage) {
//       alert("Please upload an event image");
//       return;
//     }
//     // Handle form submission with eventImage
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-6 w-full max-w-md">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-bold">Create New Event</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700"
//           >
//             <FiX className="w-6 h-6" />
//           </button>
//         </div>

//         <form className="space-y-4" onSubmit={handleSubmit}>
//           {/* Image Upload */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Event Image (Required)
//             </label>
//             <div className="flex items-center justify-center w-full">
//               <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:border-blue-500">
//                 {previewImage ? (
//                   <img
//                     src={previewImage}
//                     alt="Preview"
//                     className="h-32 w-full object-cover rounded-lg"
//                   />
//                 ) : (
//                   <div className="flex flex-col items-center">
//                     <FiUpload className="w-6 h-6 text-gray-400 mb-2" />
//                     <p className="text-sm text-gray-500">
//                       Click to upload image (JPEG/PNG)
//                     </p>
//                   </div>
//                 )}
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleImageUpload}
//                   className="hidden"
//                   required
//                 />
//               </label>
//             </div>
//           </div>

//           {/* Event Name */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Event Name
//             </label>
//             <input
//               type="text"
//               className="w-full p-2 border rounded-md"
//               required
//             />
//           </div>

//           {/* Other form fields */}
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Start Date
//               </label>
//               <input
//                 type="date"
//                 className="w-full p-2 border rounded-md"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Start Time
//               </label>
//               <input
//                 type="time"
//                 className="w-full p-2 border rounded-md"
//                 required
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 End Date
//               </label>
//               <input
//                 type="date"
//                 className="w-full p-2 border rounded-md"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 End Time
//               </label>
//               <input
//                 type="time"
//                 className="w-full p-2 border rounded-md"
//                 required
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Max Team Size
//             </label>
//             <input
//               type="number"
//               min="1"
//               className="w-full p-2 border rounded-md"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Event Category
//             </label>
//             <select className="w-full p-2 border rounded-md" required>
//               <option value="">Select Category</option>
//               <option value="technology">Technology</option>
//               <option value="arts">Arts</option>
//               <option value="sports">Sports</option>
//               <option value="academic">Academic</option>
//             </select>
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
//           >
//             Create Event
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };
