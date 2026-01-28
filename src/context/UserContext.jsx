import { createContext, useEffect, useState } from "react";

export const userContext = createContext(null);

// Pure function for login validation - can be tested independently
export const validateAndFindUser = (credentials, allUsers) => {
  if (!credentials || !credentials.email || !credentials.password) {
    return null;
  }

  for (let i = 0; i < allUsers.length; i++) {
    if (
      allUsers[i].email === credentials.email &&
      allUsers[i].password === credentials.password
    ) {
      return allUsers[i];
    }
  }

  return null;
};

// Pure function for storing user in localStorage
export const storeUserInLocalStorage = (user) => {
  if (!user) return false;

  try {
    localStorage.setItem("currentUser", btoa(JSON.stringify(user)));
    localStorage.setItem("login", true);
    return true;
  } catch (error) {
    console.error("Error storing user:", error);
    return false;
  }
};

// Pure function for removing user from localStorage
export const removeUserFromLocalStorage = () => {
  localStorage.setItem("currentUser", null);
  localStorage.setItem("login", false);
};

export default function UserContext({ children }) {
  // Synchronizuj isLoggedIn z localStorage przy starcie
  const getInitialLogin = () => {
    const login = localStorage.getItem("login");
    return login === "true";
  };
  const [isLoggedIn, setIsLoggedIn] = useState(getInitialLogin());
  const [currentUser, setCurrentUser] = useState({});
  const [allUsers, setAllUsers] = useState([]);

  const login = (values) => {
    console.log("login called from context", values);
    console.log("all users from context", allUsers);

    const foundUser = validateAndFindUser(values, allUsers);

    if (foundUser) {
      console.log("user found", foundUser);
      swal("Congratulations!", "Login Successful", "success");
      setIsLoggedIn(true);
      storeUserInLocalStorage(foundUser);
      return true;
    } else {
      swal("Error", "Invalid credentials", "error");
      return false;
    }
  };

  const logout = () => {
    removeUserFromLocalStorage();
    setIsLoggedIn(false);
  };

  return (
    <div>
      <userContext.Provider
        value={{
          isLoggedIn,
          currentUser,
          setIsLoggedIn,
          login,
          logout,
          setAllUsers,
        }}
      >
        {children}
      </userContext.Provider>
    </div>
  );
}
