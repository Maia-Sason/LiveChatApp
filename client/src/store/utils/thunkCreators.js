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
import store from "..";

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
    if (data.id) {
      socket.open();
    }

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
    socket.open();

    socket.emit("go-online", data.id);
    delete data.token;
    dispatch(gotUser(data));
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
    socket.open();
    socket.emit("go-online", data.id);
    delete data.token;
  } catch (error) {
    console.error(error);
    dispatch(gotUser({ error: error.response.data.error || "Server Error" }));
  }
};

export const logout = () => async (dispatch) => {
  try {
    await axios.delete("/auth/logout");
    await localStorage.removeItem("messenger-token");
    dispatch(gotUser({}));
    socket.emit("logout");
  } catch (error) {
    console.error(error);
  }
};

// CONVERSATIONS THUNK CREATORS

export const userTypingMessage = (bool, id) => {
  const storeCopy = store.getState();
  const userId = storeCopy.user.id;
  socket.emit("user-typing", { bool, id, userId });
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
    const storeCopy = store.getState();
    const { data } = await axios.put("/api/conversations/read", body);

    if (data.id) {
      dispatch(updateReadConversation(data));
    }
    data.currentUser = storeCopy.user.id;
    // Socket live reading
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

    const storeCopy = store.getState();
    if (!body.conversationId) {
      if (!storeCopy.conversationList.includes(data.message.conversationId)) {
        dispatch(addConvoId(data.message.conversationId));
      }
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

export const usersById = (id) => async (dispatch) => {
  try {
    const { data } = await axios.get(`/api/users/user-id/${id}`);
    dispatch(setSearchedUsers(data));
  } catch (error) {
    console.log(error);
  }
};
