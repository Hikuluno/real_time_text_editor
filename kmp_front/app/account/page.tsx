"use client";
import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { getAccountInformation } from "@/utils/fetchAPI";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const { data: session } = useSession();

  async function handleLogin() {
    const response = await signIn("credentials", {
      username: username,
      password: password,
      redirect: false,
    });
    // login successful
    if (response?.ok) {
      return;
    }
    // login failed
    console.error("responseIsNotOK");
    setError("Invalid credentials");
  }

  async function handleLogout() {
    setUsername("");
    setPassword("");
    setError("");
    signOut({ redirect: false });
  }

  // TRIGGER LOGIN BUTTON WHEN PRESS ENTER IN INPUT FIELDS
  const handleKeyDown = (event: { key: string }) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  // GET ACCOUNT INFORMATION
  useEffect(() => {
    if (session?.user) {
      getAccountInformation(session)
        .then((response) => response.json())
        .then((data) => {
          console.log("Account Information: ", data);
          setName(data.username);
        })
        .catch((error) => {
          console.error("Error fetching account information: ", error);
        });
    }
  }, [session]);

  return (
    <>
      <div className="flex items-center justify-center h-screen">
        {session?.user ? ( //IF LOGGED
          <div>
            <h1>Name : {name} </h1>
            <button className="btn btn-primary my-5" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          // IF NOT LOGGED
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
              onKeyDown={handleKeyDown}
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
              onKeyDown={handleKeyDown}
            />
            <button className="btn btn-primary my-5" onClick={handleLogin}>
              Login
            </button>
            {error && (
              <div className="alert alert-error">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
