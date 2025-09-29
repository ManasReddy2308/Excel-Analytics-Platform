// src/context/FileContext.jsx
import React, { createContext, useContext, useState } from "react";

const FileContext = createContext();

export const FileProvider = ({ children }) => {
  const [fileData, setFileData] = useState(null);

  return (
    <FileContext.Provider value={{ fileData, setFileData }}>
      {children}
    </FileContext.Provider>
  );
};

// ✅ This hook will be imported in DashboardPage & ChartsPage
export const useFileData = () => useContext(FileContext);
