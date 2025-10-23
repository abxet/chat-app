// user context
import { createContext, useState } from "react";

// create user context
export const UserContext = createContext();

// user provider component
export const UserProvider = ({ children, user }) => {
  // set user state
  const [userData, setUserData] = useState(user);

  // update user data
  const updateUserData = (newUserData) => {
    setUserData(newUserData);
  };

  // return user provider
  return (
    <UserContext.Provider value={{ userData, updateUserData }}>
      {children}
    </UserContext.Provider>
  );
};