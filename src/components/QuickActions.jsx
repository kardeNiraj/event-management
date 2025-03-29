import React, { useState, useEffect, useRef } from 'react';
import { FaQrcode, FaTimes, FaCheckCircle, FaCamera } from 'react-icons/fa';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QuickActions = () => {
  const [showScanner, setShowScanner] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const scannerRef = useRef(null);

  const handleScan = async (decodedText) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://3.110.1.182:9000/api/attendance/add-qr-attendance/', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRFTOKEN': '6kKzU79TCKm4Hs06tt9G91WeQGjvgdGz'
        },
        body: JSON.stringify({
          qr_code: decodedText,
          user: 1
        })
      });

      const data = await response.json();
      if (data.success) {
        setSuccess(true);
        setScanResult(decodedText);
        setTimeout(() => {
          closeScanner();
        }, 1500);
      } else {
        setError(data.message || "Invalid QR Code");
      }
    } catch (err) {
      setError("Failed to verify QR code");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const closeScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(error => {
        console.error("Failed to clear scanner", error);
      });
      scannerRef.current = null;
    }
    setShowScanner(false);
    setSuccess(false);
    setCameraActive(false);
    setError('');
  };

  const startScanner = () => {
    setCameraActive(true);
    // Small delay to ensure DOM is ready
    setTimeout(() => {
      try {
        const scanner = new Html5QrcodeScanner("qr-scanner", {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          facingMode: "environment"
        });

        scanner.render(
          (decodedText) => {
            scanner.clear().then(() => {
              handleScan(decodedText);
            }).catch(error => {
              console.error("Failed to clear scanner", error);
            });
          },
          (error) => {
            console.error("Scanner error:", error);
            setError("Failed to access camera. Please check permissions.");
          }
        );
        scannerRef.current = scanner;
      } catch (error) {
        console.error("Scanner initialization error:", error);
        setError("Failed to initialize scanner");
      }
    }, 100);
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => {
          console.error("Failed to clear scanner on unmount", error);
        });
      }
    };
  }, []);

  return (
    <div className="p-4">
      {/* Quick Actions Button */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 max-w-md">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <button 
          onClick={() => setShowScanner(true)}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaQrcode className="w-5 h-5" />
          Scan QR Code
        </button>
      </div>

      {/* Scanner Popup */}
      {showScanner && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Scan QR Code</h1>
              <button 
                onClick={closeScanner}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close scanner"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>

            {!cameraActive ? (
              <div className="text-center py-8">
                <button
                  onClick={startScanner}
                  className="flex flex-col items-center justify-center gap-3 bg-blue-50 text-blue-600 p-6 rounded-lg w-full"
                >
                  <FaCamera className="w-12 h-12" />
                  <span className="text-lg font-medium">Open Camera</span>
                  <span className="text-sm text-gray-500">We'll need camera permission to scan QR codes</span>
                </button>
              </div>
            ) : (
              <>
                <div id="qr-scanner" className="w-full aspect-square bg-gray-200 rounded-lg overflow-hidden mb-4"></div>
                
                {loading && (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Verifying QR code...</p>
                  </div>
                )}

                {success && (
                  <div className="text-center py-4 text-green-600">
                    <FaCheckCircle className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-lg font-medium">Attendance recorded!</p>
                    <p className="text-sm mt-2 font-mono bg-gray-100 p-2 rounded">
                      {scanResult}
                    </p>
                  </div>
                )}

                {error && (
                  <div className="text-center py-4 text-red-600">
                    <p className="font-medium">{error}</p>
                    <button
                      onClick={startScanner}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickActions;