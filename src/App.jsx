import React from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import { SocketProvider } from "./utils/socket";
import { AuthProvider } from "./utils/auth";

import CreateOrJoinRoom from "./components/CreateOrJoinRoom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Room } from "./components/Room";

import "./index.css";

const App = () => {
  return (
    <SocketProvider>
      <AuthProvider>
        <div className="flex items-center justify-center w-screen h-screen">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<CreateOrJoinRoom />} />
              <Route
                path="/room"
                element={
                  <ProtectedRoute>
                    <Room />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </div>
      </AuthProvider>
    </SocketProvider>
  );
};

export default App;
