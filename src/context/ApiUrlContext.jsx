// src/contexts/ApiUrlContext.jsx
import React, { createContext, useContext } from "react";

// 1. Create the Context
const ApiUrlContext = createContext(null);

// 2. Create a custom hook for easy access
export const useApiUrl = () => {
  const context = useContext(ApiUrlContext);
  if (!context) {
    throw new Error("useApiUrl must be used within an ApiUrlProvider");
  }
  return context;
};

// 3. Create the Provider component
export const ApiUrlProvider = ({ children }) => {
  // Read the environment variable
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // You can add a fallback or error check here if apiUrl is missing

  return (
    <ApiUrlContext.Provider value={apiUrl}>{children}</ApiUrlContext.Provider>
  );
};
