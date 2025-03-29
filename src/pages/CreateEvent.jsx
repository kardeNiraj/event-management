import { FiImage } from "react-icons/fi";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useState } from "react";

const CreateEvent = () => {
  const [teamSizeMin, setTeamSizeMin] = useState(1);
  const [teamSizeMax, setTeamSizeMax] = useState(1);
  const [feesAmount, setFeesAmount] = useState("Free");
  const [coverImage, setCoverImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Workshop");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setCoverImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const navigate = useNavigate(); // Initialize navigate function
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target.elements;

    const formData = new FormData();
    formData.append("title", form.title.value);
    formData.append("description", form.description.value);
    formData.append("category", selectedCategory);
    formData.append("start_date_time", form.start_date_time.value);
    formData.append("end_date_time", form.end_date_time.value);
    formData.append("registration_date_time", form.registration_date_time.value);
    formData.append("min_team_members", form.min_team_members.value);
    formData.append("max_team_members", form.max_team_members.value);
    formData.append("max_participants", form.max_participants.value);
    formData.append("location", form.location.value);
    formData.append("google_location", form.google_location.value);
    formData.append("fees", feesAmount === "Free" ? "0" : feesAmount.replace("Rs ", ""));
    formData.append("status", "Upcoming");
    formData.append("prizes", form.prizes.value);
    formData.append("faq", form.faq.value);
    formData.append("image", coverImage);

    try {
      const response = await fetch("http://3.110.1.182:9000/api/event/add-event/", {
        method: "POST",
        headers: {
          "X-CSRFTOKEN": "6kKzU79TCKm4Hs06tt9G91WeQGjvgdGz",
          Accept: "application/json",
        },
        body: formData,
      });

      if (response.ok) {
        alert("Event created successfully!");
        navigate("/events"); // Redirect to the event listing page
      } else {
        alert("Failed to create event. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please check your network and try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Create New Event</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2">Basic Information</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Name</label>
              <input name="title" type="text" className="w-full p-3 border rounded-lg" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Details</label>
              <textarea
                name="description"
                className="w-full p-3 border rounded-lg h-32"
                placeholder="Enter detailed description, line breaks will be preserved."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Image
              </label>
              <div className="border-2 border-dashed rounded-lg p-4">
                <label className="flex flex-col items-center justify-center cursor-pointer">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="h-48 object-cover mb-4"
                    />
                  ) : (
                    <FiImage className="w-12 h-12 text-gray-400 mb-2" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    required
                  />
                  <p className="text-gray-500 text-center">
                    Click to upload cover image (Recommended ratio 16:9)
                  </p>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                className="w-full p-3 border rounded-lg"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="Workshop">Workshop</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Seminar">Seminar</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date & Time</label>
              <input name="start_date_time" type="datetime-local" className="w-full p-3 border rounded-lg" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date & Time</label>
              <input name="end_date_time" type="datetime-local" className="w-full p-3 border rounded-lg" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Registration Deadline</label>
              <input name="registration_date_time" type="datetime-local" className="w-full p-3 border rounded-lg" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Team Members</label>
                <input
                  name="min_team_members"
                  type="number"
                  min="1"
                  value={teamSizeMin}
                  onChange={(e) => setTeamSizeMin(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Team Members</label>
                <input
                  name="max_team_members"
                  type="number"
                  min={teamSizeMin}
                  value={teamSizeMax}
                  onChange={(e) => setTeamSizeMax(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Participants</label>
              <input name="max_participants" type="number" min="1" className="w-full p-3 border rounded-lg" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input name="location" type="text" className="w-full p-3 border rounded-lg" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Google Location URL</label>
              <input name="google_location" type="url" className="w-full p-3 border rounded-lg" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fees</label>
              <select
                className="w-full p-3 border rounded-lg"
                onChange={(e) => setFeesAmount(e.target.value)}
                value={feesAmount}
              >
                <option value="Free">Free</option>
                <option value="Rs 100">Rs 100</option>
                <option value="Rs 200">Rs 200</option>
                <option value="Rs 500">Rs 500</option>
                <option value="Rs 1000">Rs 1000</option>
                <option value="Custom">Custom</option>
              </select>

              {feesAmount === "Custom" && (
                <input
                  type="number"
                  className="mt-3 w-full p-3 border rounded-lg"
                  placeholder="Enter custom fees amount"
                  onChange={(e) => setFeesAmount(`Rs ${e.target.value}`)}
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prizes Information</label>
              <textarea
                name="prizes"
                className="w-full p-3 border rounded-lg h-24"
                placeholder="Enter prize details point-wise or in list format."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">FAQs & Discussions</label>
              <textarea
                name="faq"
                className="w-full p-3 border rounded-lg h-24"
                placeholder="Enter FAQ or discussion points."
              />
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white py-4 text-lg rounded-lg hover:bg-blue-700">
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
