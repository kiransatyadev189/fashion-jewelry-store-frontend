import { useState } from "react";
import API_BASE_URL from "../api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    if (!email.trim()) {
      setMessage("Please enter your email address");
      setIsError(true);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${API_BASE_URL}/api/auth/forgot-password?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Request failed");
      }

      const responseText = await res.text();

      setMessage(
        responseText || "If this email exists, a reset link has been sent."
      );
      setIsError(false);
    } catch (err) {
      console.error("Forgot password error:", err);
      setMessage("Unable to process request. Please try again.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page auth-page">
      <div className="auth-card">
        <h2>Forgot Password</h2>
        <p className="auth-subtext">
          Enter your email to reset your password
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
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