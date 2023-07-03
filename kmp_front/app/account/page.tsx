"use client";
import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { getAccountInformation } from "@/utils/fetchAPI";

export default function Home() {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { data: session } = useSession();
  console.log("Session : ", session);

  async function handleLogin() {
    try {
      const response = await signIn("credentials", {
        username: username,
        password: password,
        redirect: false,
      });
      // Gérer la réponse du backend ici (par exemple, enregistrement du jeton d'authentification)
      // ...
      // Rediriger l'utilisateur vers une autre page
    } catch (error) {
      console.error(error);
    }
  }

  async function handleLogout() {
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
        {session?.user ? (
          <div>
            <h1>Name : {name} </h1>
            <button className="btn btn-primary my-5" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
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
          </div>
        )}
      </div>
    </>
  );
}
