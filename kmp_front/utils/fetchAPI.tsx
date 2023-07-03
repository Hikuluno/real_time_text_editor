const url = "http://localhost:8000";

export async function getData() {
  const res = await fetch(`${url}/test`);

  // Recommendation: handle errors
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.text();
}

export async function login(username: string, password: string) {
  try {
    const response = await fetch(`${url}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      const { access_token, refresh_token } = data;
      // Gérer la réponse du backend ici (par exemple, enregistrement du jeton d'authentification)
    } else {
      throw new Error("Échec de l'authentification");
    }
  } catch (error) {
    console.error(error);
  }
}

export async function logout() {
  try {
    const response = await fetch(`${url}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
    } else {
      throw new Error("Échec de la déconnexion");
    }
  } catch (error) {
    console.error(error);
  }
}
