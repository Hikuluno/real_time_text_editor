import { Session } from "next-auth";
import { useSession } from "next-auth/react";

export const url = "http://localhost:8000";

export async function getData() {
  const res = await fetch(`${url}/test`);

  // Recommendation: handle errors
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.text();
}

export async function getAccountInformation(session: Session) {
  return await fetch(`${url}/account`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.user.access_token}`,
    },
  });
}
