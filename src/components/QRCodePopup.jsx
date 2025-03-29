import { useEffect, useState } from "react";

import { FaTimes } from "react-icons/fa";
import { QRCodeCanvas } from "qrcode.react";

const QRCodePopup = ({ eventId, onClose }) => {
  const [qrValue, setQrValue] = useState("");
  const [timeLeft, setTimeLeft] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQRCode = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(
        `http://3.110.1.182:9000/api/attendance/get-attendance-qr/?event_id=${eventId}`
      );
      const data = await response.json();

      if (data.success && data.data?.qr_code) {
        setQrValue(data.data.qr_code);
      } else {
        throw new Error(data.message || "Failed to generate QR code");
      }
    } catch (err) {
      console.error("Error fetching QR code:", err);
      setError(err.message);
      // Fallback to local generation if API fails
      setQrValue(`${eventId}-${Date.now()}-${Math.random().toString(36).substring(7)}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchQRCode();

    // Set up interval for refreshing QR code
    const interval = setInterval(() => {
      fetchQRCode();
      setTimeLeft(10);
    }, 10000);

    // Set up countdown timer
    const countdown = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 10));
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(countdown);
    };
  }, [eventId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-8 max-w-2xl w-full relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
        >
          <FaTimes />
        </button>
        
        <h2 className="text-2xl font-bold text-center mb-6">Event Attendance QR Code</h2>
        
        <div className="flex flex-col items-center">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 mb-4">
              <p>{error}</p>
              <p className="text-sm text-gray-500">Using fallback QR code</p>
            </div>
          ) : null}

          <div className="border-4 border-blue-500 p-4 rounded-lg">
            {qrValue && (
              <QRCodeCanvas 
                value={qrValue} 
                size={300}
                level="H"
                includeMargin={true}
              />
            )}
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-lg font-medium mb-2">Scan this QR code to mark attendance</p>
            <p className="text-gray-600">
              QR code {error ? "will refresh" : "refreshes"} in{" "}
              <span className="font-bold">{timeLeft}</span> seconds
            </p>
          </div>
          
          <div className="mt-8 bg-blue-50 p-4 rounded-lg w-full">
            <h3 className="font-semibold text-blue-800 mb-2">Instructions:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Display this QR code at the event entrance</li>
              <li>Attendees should scan using the event app</li>
              <li>QR code auto-refreshes every 10 seconds for security</li>
              {error && (
                <li className="text-yellow-700">
                  Note: Using fallback QR code due to server issue
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodePopup;