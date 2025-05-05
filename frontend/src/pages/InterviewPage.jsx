import { useState } from "react";


import JoinRoomForm from "../components/JoinRoomForm";
import VideoCall from "../components/VideoCall"
import CreateRoomForm from "../components/CreateRoom";
import { getToken } from "../utils/api";

const InterviewPage = () => {
  const [tokenData, setTokenData] = useState(null);

  // Handles room creation or joining by HR or Candidate
  const handleConnect = async ({ roomName, userName }) => {
    const res = await getToken(roomName, userName);
    setTokenData({ ...res.data });
  };

  return (
    <div className="p-4">
      {!tokenData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">HR: Create Room</h2>
            <CreateRoomForm onCreated={handleConnect} />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Candidate: Join Room</h2>
            <JoinRoomForm onJoin={handleConnect} />
          </div>
        </div>
      ) : (
        <VideoCall token={tokenData.token} serverUrl={tokenData.url} />
      )}
    </div>
  );
};

export default InterviewPage;
