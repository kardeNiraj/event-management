import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const BackButton = ({ className = "" }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className={`fixed top-4 left-4 z-50 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow ${className}`}
      aria-label="Go back"
    >
      <FiArrowLeft className="w-6 h-6 text-gray-700" />
    </button>
  );
};

export default BackButton; 