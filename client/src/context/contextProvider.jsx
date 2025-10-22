// context 
import { createContext } from "react";

// will store user data from sign in and sign up
const UserContext = createContext();

// will provide the user data to chat component
const UserProvider = ({ children, user }) => {
  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;


// we will give this user data to chat component via context provider

