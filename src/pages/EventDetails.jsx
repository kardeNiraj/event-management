import {
  Alert,
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Textarea,
  getKeyValue,
} from "@heroui/react";
import {
  FaCalendarAlt,
  FaQrcode,
  FaRegClock,
  FaTicketAlt,
  FaTimes,
  FaTrophy,
  FaUsers,
} from "react-icons/fa";
import { useEffect, useState } from "react";

import BackButton from "../components/BackButton";
import QRCodePopup from "../components/QRCodePopup";
import { RegisterModal } from "../components/Modals";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const EventDetails = () => {
  const tabs = ["Details", "Dates & Deadlines", "Prizes", "Feedback", "FAQs"];
  const adminTabs = [
    "Details",
    "Dates & Deadlines",
    "Prizes",
    "Feedback",
    "FAQs",
    "Registrations",
    "Attendees",
    "Analytics",
    "Settings",
  ];
  const [activeTab, setActiveTab] = useState("details");
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [eventData, setEventData] = useState(null);
  const [feedbackData, setFeedbackData] = useState(null);
  const [feedback, setFeedback] = useState("")
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const { isAdmin } = useAuth();

  const navigate = useNavigate()

  // Format date without timezone conversion
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";

    try {
      const date = new Date(dateString);
      const year = date.getUTCFullYear();
      const month = date.toLocaleString("default", {
        month: "long",
        timeZone: "UTC",
      });
      const day = date.getUTCDate();
      const weekday = date.toLocaleString("default", {
        weekday: "short",
        timeZone: "UTC",
      });
      let hours = date.getUTCHours();
      const minutes = date.getUTCMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";

      hours = hours % 12;
      hours = hours ? hours : 12;

      return `${weekday}, ${month} ${day}, ${year} ${hours}:${minutes} ${ampm}`;
    } catch (e) {
      console.error("Error formatting date:", e);
      return dateString;
    }
  };

  // Fetch the event data from the API
  useEffect(() => {
    async function fetchEventData() {
      try {
        setIsLoading(true);
        const response = await fetch(
          "http://3.110.1.182:9000/api/event/get-event_by_id/?event_id=5"
        );
        const apiResponse = await response.json();

        const feedbackResponse = await fetch(
          "http://3.110.1.182:9000/api/feedback/get-feedback/"
        );
        const feedbackJson = await feedbackResponse.json();

        if (apiResponse.success && apiResponse.data.Event) {
          const event = apiResponse.data.Event;

          const transformedData = {
            id: event.id,
            title: event.title || "Untitled Event",
            prize: event.prizes || "No prize details available",
            image: event.image
              ? `http://3.110.1.182:9000${event.image}`
              : "https://via.placeholder.com/1200x400",
            registeredStudents: event.registered?.length || 0,
            registeredStudentsList: event.registered || [],
            feedbacksList: event.feedbacks || [],
            attendeesList: event.attendances || [],
            date: `${formatDate(event.start_date_time)} - ${formatDate(
              event.end_date_time
            )}`,
            registrationStarts: formatDate(event.created_at),
            registrationDeadline: formatDate(event.registration_date_time),
            location: event.location || "Location details unavailable",
            description: event.description || "No description available",
            category: event.category || "General",
            status: event.status || "Upcoming",
            fees: event.fees === "0" ? "Free" : `₹${event.fees}`,
            faq: event.faq || "No FAQs available",
            googleLocation: event.google_location,
            minTeamMembers: event.min_team_members,
            maxTeamMembers: event.max_team_members,
            maxParticipants: event.max_participents,
            startDateTime: event.start_date_time,
            endDateTime: event.end_date_time,
          };

          setEventData(transformedData);
        }
        if (feedbackJson.success && feedbackJson?.data?.Feedback) {
          setFeedbackData(feedbackJson.data.Feedback ?? []);
        }
      } catch (error) {
        console.error("Error fetching event data:", error);
        setEventData(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEventData();
  }, []);

  // Prepare attendees data for table
  const prepareAttendeesData = () => {
    if (!eventData?.attendeesList) return [];

    return eventData.attendeesList.map((attendance, index) => ({
      key: `${index}`,
      name: attendance.user?.name || "Unknown",
      email: attendance.user?.email || "",
      college: attendance.user?.college_name || "Not specified",
      registrationDate: formatDate(attendance.created_at),
      status: attendance.check_in_time ? "Present" : "Absent",
      attendanceTime: attendance.check_in_time
        ? formatDate(attendance.check_in_time)
        : "Not checked in",
    }));
  };

  // Prepare registrations data for table
  const prepareRegistrationsData = () => {
    if (!eventData?.registeredStudentsList) return [];

    return eventData.registeredStudentsList.map((registration, index) => ({
      key: `${index}`,
      name: registration.user?.name || "Unknown",
      email: registration.user?.email || "",
      college: registration.user?.college_name || "Not specified",
      registrationDate: formatDate(registration.registration_date),
      status: registration.attended ? "Attended" : "Registered",
      teamSize: registration.team_members?.length || 1,
      teamMembers: registration.team_members || [],
    }));
  };

  // Define table columns
  const attendeeColumns = [
    { key: "name", label: "NAME" },
    { key: "email", label: "EMAIL" },
    { key: "college", label: "COLLEGE" },
    { key: "registrationDate", label: "REGISTRATION DATE" },
    { key: "status", label: "STATUS" },
    { key: "attendanceTime", label: "CHECKED IN AT" },
  ];

  const registrationColumns = [
    { key: "name", label: "NAME" },
    { key: "email", label: "EMAIL" },
    { key: "college", label: "COLLEGE" },
    { key: "registrationDate", label: "REGISTRATION DATE" },
    { key: "status", label: "STATUS" },
    { key: "teamSize", label: "TEAM SIZE" },
  ];

  // Team Members Popup Component
  const TeamMembersPopup = ({ team, onClose }) => {
    if (!team) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Team Members</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>

          <div className="space-y-4">
            {team.map((member, index) => (
              <div key={index} className="border-b pb-3 last:border-b-0">
                <p className="font-medium">{member.name}</p>
                <p className="text-gray-600 text-sm">{member.email}</p>
                <p className="text-gray-500 text-sm">
                  {member.college_name || "College not specified"}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (!eventData) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-600">
            Failed to load event data. Please try again later.
          </p>
        </div>
      );
    }

    switch (activeTab.toLowerCase()) {
      case "details":
        return (
          <div className="space-y-8">
            <Section title="Event Description">
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {eventData.description}
              </p>
            </Section>

            <Section title="Registration Statistics">
              <div className="space-y-4">
                <InfoItem
                  icon={<FaUsers />}
                  text={`Total Registrations: ${eventData.registeredStudents}`}
                />
                <InfoItem
                  icon={<FaUsers />}
                  text={`Registration Fees: ${eventData.fees}`}
                />
                <InfoItem
                  icon={<FaUsers />}
                  text={`Max Participants: ${
                    eventData.maxParticipants || "No limit"
                  }`}
                />
                <InfoItem
                  icon={<FaUsers />}
                  text={`Team Size: ${eventData.minTeamMembers || 1}-${
                    eventData.maxTeamMembers || "No limit"
                  }`}
                />
              </div>
            </Section>

            <Section title="Event Timeline">
              <div className="space-y-4">
                <InfoItem icon={<FaRegClock />} text={eventData.date} />
                <InfoItem
                  icon={<FaCalendarAlt />}
                  text={`Registration Deadline: ${eventData.registrationDeadline}`}
                />
              </div>
            </Section>

            <Section title="Venue Details">
              <div className="space-y-4">
                <InfoItem icon={<FaTicketAlt />} text={eventData.location} />
                {eventData.googleLocation && (
                  <a
                    href={eventData.googleLocation}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-2"
                  >
                    <FaTicketAlt className="text-blue-600" />
                    View on Google Maps
                  </a>
                )}
              </div>
            </Section>
          </div>
        );
      case "dates & deadlines":
        return (
          <div className="space-y-8">
            <Section title="Important Dates">
              <div className="space-y-4">
                <InfoItem
                  icon={<FaCalendarAlt />}
                  text={`Registration Opens: ${eventData.registrationStarts}`}
                />
                <InfoItem
                  icon={<FaCalendarAlt />}
                  text={`Registration Closes: ${eventData.registrationDeadline}`}
                />
                <InfoItem
                  icon={<FaCalendarAlt />}
                  text={`Event Starts: ${eventData.date.split(" - ")[0]}`}
                />
                <InfoItem
                  icon={<FaCalendarAlt />}
                  text={`Event Ends: ${
                    eventData.date.split(" - ")[1] || "Not specified"
                  }`}
                />
              </div>
            </Section>
          </div>
        );
      case "prizes":
        return (
          <div className="space-y-8">
            <Section title="Prize Pool">
              <div className="space-y-4">
                <InfoItem icon={<FaTrophy />} text="Prize Details:" />
                <div className="whitespace-pre-line text-gray-600 pl-9">
                  {eventData.prize}
                </div>
              </div>
            </Section>
          </div>
        );
      case "feedback":
        return (
          <div className="space-y-8">
            <Section title="Event Feedback">
              {feedbackData?.length > 0 ? (
                <div className="space-y-4">
                  {feedbackData?.map((feedback, index) => (
                    <div key={index} className="border-b pb-4">
                      <p className="font-medium">
                        {feedback.user?.name || "Anonymous"}
                      </p>
                      <p className="text-gray-600">{feedback.comment}</p>
                      <p className="text-sm text-gray-500">
                        {formatDate(feedback.created_at)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">
                  No feedback yet. Be the first to review!
                </p>
              )}
            </Section>
            <Textarea placeholder="Add your valuable feedback here!" value={(e) => setFeedback(e.target.value)} />
            <Button
              variant="solid"
              className="bg-black py-2 px-5 text-white rounded-md"
              onPress={async () => {
                try {
                  const data = {
                    event: eventData.id,
                    user: "1",
                    comments: feedback
                  }

                  const response = await fetch("http://3.110.1.182:9000/api/feedback/add-feedback/", {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                  });

                  const result = await response.json();

                  if (response.ok && result.success) {
                    // Clear the feedback input
                    setFeedback("");
                    // Show success message
                    Alert.alert("Success", "Your feedback has been submitted successfully!");
                    // Refresh the page to show new feedback
                    window.location.reload();
                  } else {
                    throw new Error(result.message || "Failed to submit feedback");
                  }
                } catch (error) {
                  console.error("Error submitting feedback:", error);
                  Alert.alert(
                    "Error",
                    "Failed to submit feedback. Please try again later."
                  );
                }
              }}
            >
              Submit
            </Button>
          </div>
        );
      case "faqs":
        return (
          <div className="space-y-8">
            <Section title="Frequently Asked Questions">
              <div className="whitespace-pre-line text-gray-600">
                {eventData.faq}
              </div>
            </Section>
          </div>
        );
      case "registrations":
        return (
          <div className="space-y-8">
            <Section title="Event Registrations">
              <div className="overflow-x-auto">
                <Table aria-label="Event registrations table">
                  <TableHeader columns={registrationColumns}>
                    {(column) => (
                      <TableColumn key={column.key}>{column.label}</TableColumn>
                    )}
                  </TableHeader>
                  <TableBody
                    items={prepareRegistrationsData()}
                    emptyContent={"No registration data available."}
                  >
                    {(item) => (
                      <TableRow key={item.key}>
                        {(columnKey) => (
                          <TableCell>
                            {columnKey === "status" ? (
                              <span
                                className={`px-2 py-1 rounded-full text-sm ${
                                  getKeyValue(item, columnKey) === "Attended"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {getKeyValue(item, columnKey)}
                              </span>
                            ) : columnKey === "teamSize" ? (
                              <button
                                onClick={() =>
                                  setSelectedTeam(item.teamMembers)
                                }
                                className="text-blue-600 hover:underline"
                              >
                                {getKeyValue(item, columnKey)} members
                              </button>
                            ) : (
                              getKeyValue(item, columnKey)
                            )}
                          </TableCell>
                        )}
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </Section>

            {selectedTeam && (
              <TeamMembersPopup
                team={selectedTeam}
                onClose={() => setSelectedTeam(null)}
              />
            )}
          </div>
        );
      case "attendees":
        return (
          <div className="space-y-8">
            <Section title="Event Attendees">
              <div className="overflow-x-auto">
                <Table aria-label="Event attendees table">
                  <TableHeader columns={attendeeColumns}>
                    {(column) => (
                      <TableColumn key={column.key}>{column.label}</TableColumn>
                    )}
                  </TableHeader>
                  <TableBody
                    items={prepareAttendeesData()}
                    emptyContent={"No attendance data available."}
                  >
                    {(item) => (
                      <TableRow key={item.key}>
                        {(columnKey) => (
                          <TableCell>
                            {columnKey === "status" ? (
                              <span
                                className={`px-2 py-1 rounded-full text-sm ${
                                  getKeyValue(item, columnKey) === "Present"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {getKeyValue(item, columnKey)}
                              </span>
                            ) : (
                              getKeyValue(item, columnKey)
                            )}
                          </TableCell>
                        )}
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </Section>
          </div>
        );
      case "analytics":
        return (
          <div className="space-y-8">
            <Section title="Event Analytics">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white p-4 rounded-lg shadow border">
                  <h3 className="font-semibold text-gray-800">Registrations</h3>
                  <p className="text-2xl font-bold">
                    {eventData.registeredStudents}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border">
                  <h3 className="font-semibold text-gray-800">Attendees</h3>
                  <p className="text-2xl font-bold">
                    {eventData.attendeesList?.length || 0}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border">
                  <h3 className="font-semibold text-gray-800">
                    Attendance Rate
                  </h3>
                  <p className="text-2xl font-bold">
                    {eventData.registeredStudents > 0
                      ? `${Math.round(
                          (eventData.attendeesList?.length /
                            eventData.registeredStudents) *
                            100
                        )}%`
                      : "N/A"}
                  </p>
                </div>
              </div>

              {/* New Summary Section */}
              <div className="bg-white p-6 rounded-lg shadow border">
                <h3 className="text-xl font-semibold mb-4">Event Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">
                      Registration Status
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Total Capacity:</span>
                        <span className="font-medium">
                          {eventData.maxParticipants > 0
                            ? eventData.maxParticipants
                            : "Unlimited"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Available Slots:</span>
                        <span className="font-medium">
                          {eventData.maxParticipants > 0
                            ? eventData.maxParticipants -
                              eventData.registeredStudents
                            : "Unlimited"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Team Registrations:</span>
                        <span className="font-medium">
                          {eventData.registeredStudentsList?.filter(
                            (reg) => reg.team_members?.length > 1
                          ).length || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">
                      Attendance Insights
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Checked In:</span>
                        <span className="font-medium">
                          {eventData.attendeesList?.length || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pending Check-in:</span>
                        <span className="font-medium">
                          {eventData.registeredStudents -
                            (eventData.attendeesList?.length || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Check-in:</span>
                        <span className="font-medium">
                          {eventData.attendeesList?.length > 0
                            ? formatDate(
                                eventData.attendeesList[
                                  eventData.attendeesList.length - 1
                                ].check_in_time
                              )
                            : "No check-ins yet"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional summary metrics */}
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-medium text-gray-700 mb-3">
                    Quick Stats
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-800">Teams Registered</p>
                      <p className="text-xl font-bold">
                        {eventData.registeredStudentsList?.filter(
                          (reg) => reg.team_members?.length > 1
                        ).length || 0}
                      </p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-green-800">Individuals</p>
                      <p className="text-xl font-bold">
                        {eventData.registeredStudentsList?.filter(
                          (reg) =>
                            !reg.team_members || reg.team_members?.length <= 1
                        ).length || 0}
                      </p>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <p className="text-sm text-yellow-800">Avg Team Size</p>
                      <p className="text-xl font-bold">
                        {eventData.registeredStudentsList?.length > 0
                          ? Math.round(
                              eventData.registeredStudentsList.reduce(
                                (sum, reg) =>
                                  sum + (reg.team_members?.length || 1),
                                0
                              )
                            ) / eventData.registeredStudentsList.length
                          : 0}
                      </p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <p className="text-sm text-purple-800">Max Team Size</p>
                      <p className="text-xl font-bold">
                        {eventData.maxTeamMembers > 0
                          ? eventData.maxTeamMembers
                          : "None"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Final Text Summary from API */}
              {eventData.summary && (
                <div className="mt-8 bg-gray-50 p-6 rounded-lg border">
                  <h3 className="text-lg font-semibold mb-3">
                    Event Summary Report
                  </h3>
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-line text-gray-700">
                      {eventData.summary}
                    </p>
                  </div>
                </div>
              )}
            </Section>
          </div>
        );
      case "settings":
        return (
          <div className="space-y-8">
            <Section title="Event Settings">
              <div className="space-y-4">
                <InfoItem
                  icon={<FaUsers />}
                  text="Event Status"
                  subText={eventData.status}
                />
                <InfoItem
                  icon={<FaUsers />}
                  text="Registration Fees"
                  subText={eventData.fees}
                />
                <InfoItem
                  icon={<FaUsers />}
                  text="Category"
                  subText={eventData.category}
                />
                <InfoItem
                  icon={<FaUsers />}
                  text="Team Size"
                  subText={`${eventData.minTeamMembers || 1}-${
                    eventData.maxTeamMembers || "No limit"
                  } members`}
                />
                <InfoItem
                  icon={<FaUsers />}
                  text="Max Participants"
                  subText={eventData.maxParticipants || "No limit"}
                />
              </div>
            </Section>
          </div>
        );
      default:
        return (
          <div className="space-y-8">
            <Section title={activeTab}>
              <p className="text-gray-600">
                Content for this tab is not available yet.
              </p>
            </Section>
          </div>
        );
    }
  };

  if (isLoading && !eventData) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BackButton />

      {/* Hero Section */}
      <div className="relative h-96">
        <img
          src={eventData?.image || "https://via.placeholder.com/1200x400"}
          alt={eventData?.title || "Event"}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4">
              {eventData?.title || "Loading..."}
            </h1>
            <p className="text-lg">{eventData?.category}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="sticky top-0 bg-white z-10 border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {(isAdmin ? adminTabs : tabs).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`px-6 py-4 whitespace-nowrap ${
                  activeTab === tab.toLowerCase()
                    ? "border-b-2 border-blue-600 text-blue-600 font-medium"
                    : "text-gray-500 hover:text-blue-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Main Content */}
          <div className={`${isAdmin ? "lg:col-span-3" : "lg:col-span-2"}`}>
            {renderTabContent()}
          </div>

          {/* Registration Box - Only show for non-admin users */}
          {!isAdmin && !isLoading && eventData && (
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => setIsRegisterModalOpen(true)}
                    className="w-full bg-blue-600 text-white py-4 text-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Register Now
                  </button>

                  <div className="p-6 space-y-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-3 flex items-center gap-2 text-blue-800">
                        <FaUsers className="text-blue-600" />
                        Participation Stats
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Registered</span>
                          <span className="font-medium text-blue-800">
                            {eventData.registeredStudents}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">
                            Max Participants
                          </span>
                          <span className="font-medium text-blue-800">
                            {eventData.maxParticipants || "No limit"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Team Size</span>
                          <span className="font-medium text-blue-800">
                            {eventData.minTeamMembers || 1}-
                            {eventData.maxTeamMembers || "No limit"} Members
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-3 flex items-center gap-2 text-yellow-800">
                        <FaTrophy className="text-yellow-600" />
                        Prize Pool
                      </h3>
                      <p className="text-yellow-800 font-medium">
                        {eventData.prize.split("\n")[0]}
                      </p>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-3 flex items-center gap-2 text-green-800">
                        <FaCalendarAlt className="text-green-600" />
                        Event Date
                      </h3>
                      <p className="text-green-800">{eventData.date}</p>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-3 flex items-center gap-2 text-purple-800">
                        <FaTicketAlt className="text-purple-600" />
                        Registration Fees
                      </h3>
                      <p className="text-purple-800">{eventData.fees}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* QR Code Button - Only show for admin users */}
      {isAdmin && !isLoading && eventData && (
        <button
          onClick={() => setShowQRCode(true)}
          className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2"
          aria-label="Generate QR Code"
        >
          <FaQrcode className="w-6 h-6" />
          <span className="hidden md:inline">Generate QR Code</span>
        </button>
      )}

      {/* QR Code Popup */}
      {showQRCode && eventData && (
        <QRCodePopup
          eventId={eventData.id}
          onClose={() => setShowQRCode(false)}
        />
      )}

      {/* Team Members Popup */}
      {selectedTeam && (
        <TeamMembersPopup
          team={selectedTeam}
          onClose={() => setSelectedTeam(null)}
        />
      )}

      {/* Register Modal */}
      {isRegisterModalOpen && (
        <RegisterModal
          onClose={() => setIsRegisterModalOpen(false)}
          eventDetails={eventData}
        />
      )}
    </div>
  );
};

// Helper Components
const Section = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
    {children}
  </div>
);

const InfoItem = ({ icon, text, subText }) => (
  <div className="flex items-start gap-3">
    <div className="text-blue-600 mt-1">{icon}</div>
    <div>
      <span className="text-gray-600">{text}</span>
      {subText && <p className="text-gray-500 text-sm">{subText}</p>}
    </div>
  </div>
);

export default EventDetails;
