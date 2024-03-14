import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import "./App.css";

let socket;

function App() {
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);
  const chatContainerRef = useRef(null);

  const emitEvent = () => {
    socket.emit("ping", message);
    setMessage("");
  };

  useEffect(() => {
    if (!socket) {
      socket = io.connect("http://localhost:4001", {
        auth: {
          sessionID: localStorage.getItem("sessionID") || null,
        },
      });

      socket.on("connect", () => {
        const sessionID = socket.id;
        localStorage.setItem("sessionID", sessionID);

        setHistory((prevHistory) =>
          prevHistory.map((item) => ({
            ...item,
            self: item.id === socket.id,
          }))
        );
      });
    }

    socket.on("chat-history", (initialHistory) => {
      setHistory(
        initialHistory.map((item) => ({
          ...item,
          self: item.id === socket.id,
        }))
      );
    });

    socket.on("ping-recd", (data) => {
      setHistory((prevHistory) => [
        ...prevHistory,
        { id: data.id, message: data.message, self: data.id === socket.id },
      ]);
    });

    scrollToBottom();

    return () => {
      socket.off("chat-history");
      socket.off("ping-recd");
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const scrollToBottom = () => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  };

  return (
    <div className="app">
      <div ref={chatContainerRef} className="chat-container">
        {history.map((item, index) => (
          <div key={index} className={item.self ? "message-self" : "message"}>
            <div
              className={item.self ? "message-content-self" : "message-content"}
            >
              {item.message}
            </div>
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          onChange={(event) => setMessage(event.target.value)}
          value={message}
          className="message-input"
          placeholder="Type your message here..."
        />
        <button onClick={emitEvent} className="send-button">
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
