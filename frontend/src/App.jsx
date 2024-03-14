import { useState } from "react";

const socket = io.connect("http://localhost:4001");

function App() {
  const [message, setMessage] = useState("");

  const emitEvent = () => {
    socket.emit("ping", message);
    setMessage("");
  };

  return (
    <>
      <h1>CHAT</h1>
      <div>
        <input
          onChange={(event) => setMessage(event.target.value)}
          value={message}
          placeholder="type your message here..."
        />
        <button onClick={emitEvent}>Send</button>
      </div>
    </>
  );
}

export default App;
