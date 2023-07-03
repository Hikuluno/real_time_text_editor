"use client";
import { login, logout } from "@/utils/fetchAPI";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleLogin() {
    const response = await login(username, password);
  }

  async function handleLogout() {
    const response = await logout();
    router.push("/");
  }

  return (
    <>
      <div className="flex items-center justify-center h-screen">
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">User</span>
          </label>
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            type="password"
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn btn-primary my-5" onClick={handleLogin}>
            Login
          </button>
          <button className="btn btn-primary my-5" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
