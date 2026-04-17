import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import API_BASE_URL from "../api";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validToken, setValidToken] = useState(null);

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setValidToken(false);
        return;
      }

      try {
        const res = await fetch(
          `${API_BASE_URL}/api/auth/validate-reset-token?token=${encodeURIComponent(token)}`
        );

        const data = await res.json();
        setValidToken(!!data.valid);
      } catch (err) {
        console.error("Token validation error:", err);
        setValidToken(false);
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    if (!newPassword || !confirmPassword) {
      setMessage("Please fill all fields");
      setIsError(true);
      return;
    }

    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters");
      setIsError(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      setIsError(true);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          newPassword,
        }),
      });

      const text = await res.text();

      if (!res.ok) {
        throw new Error(text || "Reset failed");
      }

      setMessage(text || "Password reset successful. Redirecting to login...");
      setIsError(false);

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error("Reset password error:", err);
      setMessage(err.message || "Unable to reset password");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  if (validToken === null) {
    return (
      <div className="page auth-page">
        <div className="auth-card">
          <h2>Reset Password</h2>
          <p className="auth-subtext">Validating reset link...</p>
        </div>
      </div>
    );
  }

  if (!validToken) {
    return (
      <div className="page auth-page">
        <div className="auth-card">
          <h2>Invalid or Expired Link</h2>
          <p className="auth-subtext">
            This password reset link is invalid or has expired.
          </p>
          <p className="auth-switch">
            <Link to="/forgot-password">Request a new reset link</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page auth-page">
      <div className="auth-card">
        <h2>Reset Password</h2>
        <p className="auth-subtext">Enter your new password below.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
          />

          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />

          <button type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {message && (
          <p className={isError ? "auth-error" : "auth-success"}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}