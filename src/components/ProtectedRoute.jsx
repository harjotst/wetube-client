import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../utils/auth";

export const ProtectedRoute = ({ children }) => {
  const auth = useAuth();

  if (!auth.user) return <Navigate to="/" />;

  return <>{children}</>;
};
