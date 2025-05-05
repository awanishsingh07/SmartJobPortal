import { useState } from "react";
import Button from "./Button";

const CreateRoomForm = ({ onCreated }) => {
  const [roomName, setRoomName] = useState("");
  const [userName, setUserName] = useState("");

  const handleCreate = () => {
    if (roomName && userName) onCreated({ roomName, userName });
  };

  return (
    <div className="space-y-4">
      <input
        placeholder="Room ID (e.g., hr-round-1)"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        className="p-2 border rounded w-full"
      />
      <input
        placeholder="HR Name"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        className="p-2 border rounded w-full"
      />
      <Button onClick={handleCreate}>Create & Join Room</Button>
    </div>
  );
};

export default CreateRoomForm;
