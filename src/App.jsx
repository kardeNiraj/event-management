import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import EventList from "./components/EventList";
import StatsCard from "./components/StatsCard";
import QuickActions from "./components/QuickActions";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import EventDetails from "./pages/EventDetails";
import CreateEvent from "./pages/CreateEvent";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Protected Route wrapper component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function AppContent() {
  const { isAdmin } = useAuth();
  return (
    <div>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <div className="p-5">
              <Header />
              <div className="grid lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3">
                  <EventList />
                </div>
                <div className="lg:col-span-1 space-y-6">
                  {!isAdmin && <StatsCard />}
                  <QuickActions />
                </div>
              </div>
            </div>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route
          path="/create-event"
          element={
            <ProtectedRoute requireAdmin>
              <CreateEvent />
            </ProtectedRoute>
          }
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
