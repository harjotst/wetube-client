import React, { createContext, useContext } from "react";

import { io } from "socket.io-client";

const serverUrl = "http://127.0.0.1:4000";

const socket = io(serverUrl);

export const SocketContext = createContext(socket);

export const SocketProvider = ({ children }) => (
  <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
);

export const useSocket = () => {
  return useContext(SocketContext);
};
