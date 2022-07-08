import React, { useCallback, useEffect, useState } from "react";

let logoutTimer;

const AuthContext = React.createContext({
  token: "",
  isLogged: false,
  logIn: (token) => {},
  logOut: () => {},
});

export const AuthContextProvider = (props) => {
  const initialToken = localStorage.getItem("token");
  const [token, setToken] = useState(initialToken);

  const isLogged = !!token;

  const logIn = (token, deadLine) => {
    localStorage.setItem("token", token);
    localStorage.setItem("deadLine", deadLine);
    logoutTimer = setTimeout(logOut, deadLine - Date.now());
    setToken(token);
  };

  const logOut = useCallback(() => {
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("deadLine");
    clearTimeout(logoutTimer);
  }, []);

  useEffect(() => {
    if (token) {
      let timeLeft = localStorage.getItem("deadLine") - Date.now();
      if (timeLeft < 6000) timeLeft = 0;
      logoutTimer = setTimeout(logOut, timeLeft);
    }
  }, [token, logOut]);

  const context = {
    token,
    isLogged,
    logIn,
    logOut,
  };

  return (
    <AuthContext.Provider value={context}>
      {props.children}
    </AuthContext.Provider>
  );
};

// export default AuthContext;
