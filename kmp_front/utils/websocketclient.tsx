import React, { useEffect, useState } from "react";

const WebSocketComponent = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const websocketURL = "ws://localhost:8000/ws";
    const socket = new WebSocket(websocketURL);

    socket.onopen = () => {
      console.log("Websocket connection established");
      // Send initial data to the server
      setSocket(socket);
    };

    socket.onclose = () => {
      console.log("Websocket connection closed");
    };

    return () => {
      socket.close();
    };
  }, []);

  return socket;
};

export default WebSocketComponent;
