import React, { createContext, useContext } from "react";

import { io } from "socket.io-client";

const serverUrl = "http://167.99.183.90";

const socket = io(serverUrl);

export const SocketContext = createContext(socket);

export const SocketProvider = ({ children }) => (
  <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
);

export const useSocket = () => {
  return useContext(SocketContext);
};
