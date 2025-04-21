import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken") || ""
  );
  const [roleId, setRoleId] = useState(localStorage.getItem("roleId") || "");
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );

  useEffect(() => {
    if (!accessToken) {
      const storedToken = localStorage.getItem("accessToken");
      const storedRole = localStorage.getItem("roleId");
      const storedUsername = localStorage.getItem("username");

      if (storedToken) {
        setAccessToken(storedToken);
        setRoleId(storedRole);
        setUsername(storedUsername);
      }
    }
  }, []);

  const storeUsernameInLS = (user) => {
    setUsername(user);
    localStorage.setItem("username", user);
  };

  const storeTokenInLS = (token) => {
    setAccessToken(token);
    localStorage.setItem("accessToken", token);
  };

  const storeRoleIdInLS = (id) => {
    setRoleId(id);
    localStorage.setItem("roleId", id);
  };

  const isLoggedIn = !!accessToken;
  const role_id = roleId;

  const logoutUser = () => {
    setAccessToken("");
    setRoleId("");
    setUsername("");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("roleId");
    localStorage.removeItem("username");
  };

  const login = (userData) => {
    storeTokenInLS(userData.accessToken);
    storeRoleIdInLS(userData.roleId);
    storeUsernameInLS(userData.username);
  };

  return (
    <AuthContext.Provider
      value={{
        storeTokenInLS,
        storeRoleIdInLS,
        storeUsernameInLS,
        logoutUser,
        login,
        isLoggedIn,
        role_id,
        username,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const contextValue = useContext(AuthContext);
  if (contextValue === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return contextValue;
};
