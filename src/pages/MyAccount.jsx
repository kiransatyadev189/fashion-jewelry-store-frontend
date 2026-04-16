import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function MyAccount() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const name = localStorage.getItem("userName");
    const email = localStorage.getItem("userEmail");
    const role = localStorage.getItem("userRole");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    setUser({
      name: name || "",
      email: email || "",
      role: role || "USER",
    });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");

    navigate("/login", { replace: true });
  };

  return (
    <div className="page my-account-page">
      <div className="my-account-card">
        <h1>My Account</h1>
        <p className="my-account-subtext">
          Manage your profile and account actions.
        </p>

        <div className="account-info">
          <div className="account-info-row">
            <span className="account-label">Full Name</span>
            <span className="account-value">{user.name || "Not available"}</span>
          </div>

          <div className="account-info-row">
            <span className="account-label">Email</span>
            <span className="account-value">{user.email || "Not available"}</span>
          </div>

          <div className="account-info-row">
            <span className="account-label">Role</span>
            <span className="account-value">{user.role || "USER"}</span>
          </div>
        </div>

        <div className="account-actions">
          <Link to="/track-order" className="account-btn secondary">
            Track Order
          </Link>

          <button className="account-btn logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}