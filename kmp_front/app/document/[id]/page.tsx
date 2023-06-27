"use client";

import { getData } from "@/utils/api";
import dynamic from "next/dynamic";
import WebSocketComponent from "@/utils/websocketclient";
import { time } from "console";
import {
  ChangeEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useParams } from "next/navigation";

export default function Home() {
  const [documentLoaded, setDocumentLoaded] = useState(false);
  const [quill, setQuill] = useState<Quill>();
  const toolbarOptions = [
    ["bold", "italic", "underline", "strike"], // toggled buttons

    [{ align: [] }, { list: "ordered" }, { list: "bullet" }],

    [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    [{ font: [] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    ["image", "video"],

    ["clean"], // remove formatting button
  ];
  const wrapperRef = useCallback((wrapper: any) => {
    if (wrapper == null) return;
    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    const q = new Quill(editor, {
      theme: "snow",
      modules: {
        toolbar: toolbarOptions,
      },
    });
    q.disable();
    q.setText("Loading ...");
    setQuill(q);
  }, []);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>();
  const [meTyping, setMeTyping] = useState(false);
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const socket = WebSocketComponent();
  const documentId = useParams();
  const autosaveTime = 3000;

  //On receive message
  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        console.log("Received message:", event.data);
        // Handle received messages from the server
        try {
          const data = JSON.parse(event.data);
          const type: String = data.type;
          const message = data.message;
          var message2 = {
            ops: [
              { insert: "Hello " },
              { insert: "World!", attributes: { bold: true } },
              { insert: "\n" },
            ],
          };
          if (type === "update_message") {
            quill?.updateContents(message);
          } else if (type === "typing_notification") {
            setIsOtherTyping(message);
          } else if (type === "handle_documentId") {
            console.log("message1! : ", message);
            console.log("message2! : ", message2);
            quill?.enable();
            quill?.setContents(message, "api");
          }
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      };
    }
  }, [socket, quill]);

  //Update on text-change
  useEffect(() => {
    if (socket == null || quill == null) return;
    quill.on("text-change", handleTextChange);

    return () => {
      quill.off("text-change", handleTextChange);
    };
  }, [socket, quill]);

  //Autosave document
  useEffect(() => {
    if (socket == null || quill == null) return;

    const interval = setInterval(() => {
      socket.send(
        JSON.stringify({ type: "save_document", message: quill.getContents() })
      );
    }, autosaveTime);
    return () => {
      clearInterval(interval);
    };
  }, [socket, quill]);

  //Load or create document
  useEffect(() => {
    if (socket == null || quill == null) return;
    if (documentLoaded) return;
    socket.send(
      JSON.stringify({ type: "handle_documentId", message: documentId })
    );
    setDocumentLoaded(true);
  }, [socket, quill, documentId]);

  function handleTextChange(delta: any, oldDelta: any, source: any) {
    if (source !== "user") return;
    setMeTyping(true);

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "update_message", message: delta }));
      if (!meTyping)
        socket.send(
          JSON.stringify({ type: "typing_notification", message: true })
        );
      clearTimeout(timeoutRef.current); // Efface le délai d'attente précédent

      timeoutRef.current = setTimeout(() => {
        socket.send(
          JSON.stringify({ type: "typing_notification", message: false })
        ); // Envoie la socket après 1 seconde
        setMeTyping(false);
      }, 1000);
    }
  }

  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <div className="flex-col ">
          <div id="editor" ref={wrapperRef}></div>
          <p>{isOtherTyping ? "Someone is typing..." : ""}</p>
        </div>
      </div>
    </>
  );
}
