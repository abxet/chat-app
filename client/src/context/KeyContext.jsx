import { createContext, useState, useContext, useEffect } from "react";

const KeyContext = createContext();

export const KeyProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { username, publicKey }
  const [secretKey, setSecretKey] = useState(null);

  // Load from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedSecretKey = localStorage.getItem("secretKey");

    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedSecretKey) setSecretKey(savedSecretKey);
  }, []);

  // Save to localStorage whenever we call saveUserData
  const saveUserData = (username, publicKey, secretKeyValue) => {
    const userData = { username, publicKey };
    setUser(userData);
    setSecretKey(secretKeyValue);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("secretKey", secretKeyValue);
  };

  return (
    <KeyContext.Provider value={{ user, setUser, secretKey, setSecretKey, saveUserData }}>
      {children}
    </KeyContext.Provider>
  );
};

export const useKeyContext = () => {
  const context = useContext(KeyContext);
  if (!context) throw new Error("useKeyContext must be used within a KeyProvider");
  return context;
};
