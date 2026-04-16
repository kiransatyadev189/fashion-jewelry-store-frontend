import { Navigate } from "react-router-dom";

export default function UserProtectedRoute({ children }) {
  const token = localStorage.getItem("userToken");
  const role = localStorage.getItem("userRole");

  if (!token || role !== "ROLE_USER") {
    return <Navigate to="/login" replace />;
  }

  return children;
}