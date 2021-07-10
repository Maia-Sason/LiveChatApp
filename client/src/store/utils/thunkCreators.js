import axios from "axios";
import socket from "../../socket";
import { setConversationList } from "../conversationList";
import {
  updateReadConversation,
  gotConversations,
  addConversation,
  setNewMessage,
  setSearchedUsers,
} from "../conversations";
import { addConvoId } from "../conversationList";
import { gotUser, setFetchingStatus, gotOnlineUsers } from "../user";
import { Socket } from "socket.io-client";

axios.interceptors.request.use(async function (config) {
  const token = await localStorage.getItem("messenger-token");
  config.headers["x-access-token"] = token;

  return config;
});

// USER THUNK CREATORS

export const fetchUser = () => async (dispatch) => {
  dispatch(setFetchingStatus(true));
  try {
    const { data } = await axios.get("/auth/user");
    dispatch(gotUser(data));

    socket.emit("authenticate-pass", { id: data.id });
    socket.emit("go-online", data.id);
  } catch (error) {
    console.error(error);
  } finally {
    dispatch(setFetchingStatus(false));
  }
};

export const fetchOnlineUsers = (data) => async (dispatch) => {
  const { onlineUsers } = await axios.get("/api/user-online");

  dispatch(gotOnlineUsers(onlineUsers));
};

export const register = (credentials) => async (dispatch) => {
  try {
    const { data } = await axios.post("/auth/register", credentials);
    await localStorage.setItem("messenger-token", data.token);
    socket.emit("authenticate", { token: data.token, id: data.id });
    socket.emit("go-online", data.id);
    delete data.token;
    dispatch(gotUser(data));

    // socket.emit("go-online", data.id);
  } catch (error) {
    console.error(error);
    dispatch(gotUser({ error: error.response.data.error || "Server Error" }));
  }
};

export const login = (credentials) => async (dispatch) => {
  try {
    const { data } = await axios.post("/auth/login", credentials);
    await localStorage.setItem("messenger-token", data.token);
    dispatch(gotUser(data));
    socket.emit("authenticate", { token: data.token, id: data.id });
    socket.emit("go-online", data.id);
    delete data.token;
  } catch (error) {
    console.error(error);
    dispatch(gotUser({ error: error.response.data.error || "Server Error" }));
  }
};

export const logout = (id) => async (dispatch) => {
  try {
    await axios.delete("/auth/logout");
    await localStorage.removeItem("messenger-token");
    dispatch(gotUser({}));
    socket.emit("logout", id);
  } catch (error) {
    console.error(error);
  }
};

// CONVERSATIONS THUNK CREATORS

const typingMessage = (bool, id) => {
  socket.emit("user-typing", { bool, id });
};

export const userTypingMessage = (bool, id) => {
  typingMessage(bool, id);
};

const readMessage = async (data) => {
  socket.emit("read-message", data);
};

export const fetchConversations = () => async (dispatch) => {
  try {
    const { data } = await axios.get("/api/conversations");
    dispatch(gotConversations(data.conversations));
    dispatch(setConversationList(data.convoId));
  } catch (error) {
    console.error(error);
  }
};

// Send conversationId and update entire conversation to read for certain user.
export const readConversation = (body) => async (dispatch) => {
  try {
    const { data } = await axios.put("/api/conversations/read", body);

    if (data.id) {
      dispatch(updateReadConversation(data));
    }

    // Would be good to send a socket action here probably if we wanted to add
    // live reading.
    //  ie: await readMessage(data, body)
    readMessage(data);
  } catch (error) {
    console.error(error);
  }
};

const saveMessage = async (body) => {
  const { data } = await axios.post("/api/messages", body);
  return data;
};

const sendMessage = (data, body) => {
  socket.emit("new-message", {
    message: data.message,
    recipientId: body.recipientId,
    sender: data.sender,
    conversationId: body.conversationId,
  });
};

// message format to send: {recipientId, text, conversationId}
// conversationId will be set to null if its a brand new conversation
// On send new message, set body.count to 0 for user who sent a message.
export const postMessage = (body) => async (dispatch) => {
  try {
    const data = await saveMessage(body);

    if (!body.conversationId) {
      dispatch(addConvoId(data.message.conversationId));
      dispatch(addConversation(body.recipientId, data.message));
    } else {
      dispatch(setNewMessage(data.message));
      dispatch(readConversation({ id: body.conversationId }));
    }

    body.count = 0;
    sendMessage(data, body);
  } catch (error) {
    console.error(error);
  }
};

export const searchUsers = (searchTerm) => async (dispatch) => {
  try {
    const { data } = await axios.get(`/api/users/${searchTerm}`);
    dispatch(setSearchedUsers(data));
  } catch (error) {
    console.error(error);
  }
};
