"use client";

import { AxiosPublic } from "@/config/axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("admin-token");
    if (token) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await AxiosPublic.post("/api-token-auth/", {
        username,
        password,
      });

      const token = res?.data?.token;
      if (!token || typeof token !== "string") {
        setError("Login failed. Please check your credentials.");
        return;
      }

      localStorage.setItem("admin-token", token);
      navigate("/admin/dashboard", { replace: true });
    } catch {
      setError("Login failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-[420px] rounded-lg border border-gray-200 bg-white px-10 py-12 text-center">
        {/* Logo */}
        <div className="mb-4 flex justify-center">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-10 w-auto"
            loading="eager"
            decoding="async"
          />
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Welcome Back!
        </h2>

        {/* Subtitle */}


        {error ? (
          <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-left text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <form onSubmit={onSubmit}>
          {/* Username */}
          <div className="mb-5 text-left">
            <label className="mb-1 block text-sm text-gray-800">User Name</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your user name"
              autoComplete="username"
              className="w-full rounded-md bg-orange-50 px-3 py-2.5 text-sm outline-none placeholder:text-gray-400 focus:ring-1 focus:ring-orange-400"
            />
          </div>

          {/* Password */}
          <div className="mb-6 text-left">
            <label className="mb-1 block text-sm text-gray-800">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="w-full rounded-md bg-orange-50 px-3 py-2.5 pr-10 text-sm outline-none placeholder:text-gray-400 focus:ring-1 focus:ring-orange-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                👁
              </button>
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-orange-500 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Logging in..." : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
}
