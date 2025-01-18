import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [searchfilters, setSearchFilters] = useState({});
  const [userNotifications, setUserNotifications] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notificationsCount, setNotificationsCount] = useState(0);
  // toadt
  const [toast, setToast] = useState({ message: "", visible: false });
  const toastTimeoutRef = useRef(null);


  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const isValid = validateToken(token);
      if (isValid) {
        fetchUserData(token);
        fetchUserNotifications(token);
        connectSocket(token);
      } else {
        handleLogout();
      }
    } else {
      setLoading(false);
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const validateToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        return false;
      }
      return true;
    } catch (error) {
      console.error("Invalid token:", error);
      return false;
    }
  };

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/air-bnb/profile/user-info`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(response.data);
      setUserRole(response.data.role);
    } catch (error) {
      console.error("Error fetching user data:", error);
      handleLogout();
    } finally {
      setLoading(false);
    }
  };
  const fetchUserNotifications = async (token) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/profile/get-notifications`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserNotifications(response.data);
      //console.log(response.data) 
    }
    catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const connectSocket = (token) => {
    if (socket) {
      socket.disconnect();
    }

    const payload = JSON.parse(atob(token.split(".")[1]));
    const userId = payload.id;

    const newSocket = io(import.meta.env.VITE_REACT_APP_API_BASE_URL, {
      auth: { token, userId },
    });

    newSocket.on("connect", () => {
      console.log(`Connected to server with socket ID: ${newSocket.id}`);
    });

    newSocket.on("notification", (data) => {
      //console.log(`Notification received:`, data);
      setNotifications((prev) => [...prev, data]);
      console.log(data.message)
      showToast(data.message);
      //setNotificationsCount(notificationsCount + 1);
      setNotificationsCount((prev) => prev + 1);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    setSocket(newSocket);
  };

  const login = async (token) => {
    localStorage.setItem("token", token);
    await fetchUserData(token);
    connectSocket(token);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setUserRole(null);
    setNotifications([]);
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };

  const logout = () => {
    handleLogout();
  };

  const showToast = (message) => {
    setToast({ message, visible: true });
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = setTimeout(() => {
      setToast({ message: "", visible: false });
    }, 6000); 
  };

  const closeToast = () => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast({ message: "", visible: false });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userRole,
        loading,
        login,
        logout,
        socket,
        notifications,
        notificationsCount,
        userNotifications,
        setSearchFilters,
        searchfilters,
        toast, showToast, closeToast,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
