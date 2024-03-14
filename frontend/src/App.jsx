import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "./App.css";

let socket;

function App() {
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);

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

    return () => {
      socket.off("chat-history");
      socket.off("ping-recd");
    };
  }, []);

  return (
    <div>
      <div>
        {history.map((item, index) => (
          <div key={index}>
            <div>{item.message}</div>
          </div>
        ))}
      </div>
      <div>
        <input
          onChange={(event) => setMessage(event.target.value)}
          value={message}
          placeholder="type your message here..."
        />
        <button onClick={emitEvent}>Send</button>
      </div>
    </div>
  );
}

export default App;
