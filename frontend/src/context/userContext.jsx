import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { authDataContext } from "./AuthContext.jsx";
import axios from "axios";
import { io } from "socket.io-client";

export const UserDataContext = createContext(null);

function UserContext({ children }) {
  const [userData, setUserData] = useState(null);
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [postData, setPostData] = useState([]);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const { serverUrl } = useContext(authDataContext);

  // ------------------- SOCKET INIT -------------------
  useEffect(() => {
    if (!serverUrl) return;

    const newSocket = io(serverUrl, {
      auth: { token: localStorage.getItem("token") }, // or cookie-based auth
    });

    setSocket(newSocket);

    newSocket.on("connect", () => console.log("Socket connected:", newSocket.id));
    newSocket.on("disconnect", () => console.log("Socket disconnected"));

    // Track online users
    newSocket.on("onlineUsers", (users) => setOnlineUsers(users));

    return () => newSocket.disconnect();
  }, [serverUrl]);

  // ------------------- SEND / LISTEN EVENTS -------------------
  const sendSocketEvent = useCallback(
    (event, data) => {
      if (socket) socket.emit(event, data);
    },
    [socket]
  );

  const listenSocketEvent = useCallback(
    (event, callback) => {
      if (!socket) return;
      socket.on(event, callback);
      return () => socket.off(event, callback);
    },
    [socket]
  );

  // ------------------- FETCH USER -------------------
  const getCurrentUser = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/user/currentuser`, {
        withCredentials: true,
      });
      setUserData(res.data?.data || null);
    } catch (err) {
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserById = useCallback(
    async (id) => {
      try {
        setLoading(true);
        const res = await axios.get(`${serverUrl}/api/user/${id}`, {
          withCredentials: true,
        });
        setProfileUser(res.data);
      } catch (err) {
        console.error("Fetch user by id error:", err);
        setProfileUser(null);
      } finally {
        setLoading(false);
      }
    },
    [serverUrl]
  );

  // ------------------- FETCH POSTS -------------------
  const getPost = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/post/getpost`, {
        withCredentials: true,
      });
      setPostData(result.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ------------------- INITIAL LOAD -------------------
  useEffect(() => {
    if (serverUrl) {
      getCurrentUser();
      getPost();
    }
  }, [serverUrl]);

  const value = useMemo(
    () => ({
      userData,
      setUserData,
      profileUser,
      fetchUserById,
      loading,
      edit,
      setEdit,
      postData,
      setPostData,
      getPost,
      socket,
      onlineUsers,
      sendSocketEvent,
      listenSocketEvent,
    }),
    [userData, profileUser, loading, postData, socket, onlineUsers]
  );

  return <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>;
}

export default UserContext;
