import { useState } from "react";
import Button from "./Button";

const JoinRoomForm = ({ onJoin }) => {
  const [roomName, setRoomName] = useState("");
  const [userName, setUserName] = useState("");

  const handleJoin = () => {
    if (roomName && userName) onJoin({ roomName, userName });
  };

  return (
    <div className="space-y-4">
      <input
        placeholder="Room ID"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        className="p-2 border rounded w-full"
      />
      <input
        placeholder="Your Name"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        className="p-2 border rounded w-full"
      />
      <Button onClick={handleJoin}>Join Room</Button>
    </div>
  );
};

export default JoinRoomForm;
