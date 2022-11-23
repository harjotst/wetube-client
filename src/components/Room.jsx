import React, { useState, useEffect } from "react";

import SocketVideoSearch from "./socket/SocketVideoSearch";
import SocketPlayer from "./socket/SocketPlayer";
import SocketMessages from "./socket/SocketMessages";

import { useAuth } from "../utils/auth";
import { useSocket } from "../utils/socket";
import { leaveRoom } from "../utils/routes";

export const Room = () => {
  const socket = useSocket();

  const { user, token, logout } = useAuth();

  const [initialPlayerData, setInitialPlayerData] = useState();

  const beforeUnload = () => {
    leaveRoom(token).catch((reason) => {
      console.error(reason);
    });
  };

  useEffect(() => {
    socket.emit(
      "join-room",
      user.username,
      user.room,
      user.roomId,
      (playerData) => {
        setInitialPlayerData(playerData);
      }
    );
    return () => {
      logout();
      socket.emit("user-left");
    };
  }, []);

  useEffect(() => {
    window.addEventListener("beforeunload", beforeUnload);
    return () => {
      beforeUnload();
      window.removeEventListener("beforeunload", beforeUnload);
    };
  }, []);

  return (
    <div className="flex flex-row w-full h-full border border-black border-r-2 p-2">
      <div className="flex flex-col flex-grow">
        <SocketVideoSearch />
        <div className="flex-grow">
          {initialPlayerData ? (
            <SocketPlayer initialPlayerState={initialPlayerData} />
          ) : (
            <div className="w-full h-full"></div>
          )}
        </div>
      </div>
      <SocketMessages />
    </div>
  );
};
