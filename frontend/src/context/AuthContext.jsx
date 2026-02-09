import { createContext } from "react";

export const authDataContext = createContext(null);

const AuthContext = ({ children }) => {
  const serverUrl = "https://echosphere-backend-e47j.onrender.com"

  return (
    <authDataContext.Provider value={{ serverUrl }}>
      {children}
    </authDataContext.Provider>
  );
};

export default AuthContext;
