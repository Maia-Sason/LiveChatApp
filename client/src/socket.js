import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
  updateReadConversation,
  updateUserTypingStatus,
  addConversation,
} from "./store/conversations";
import { usersById } from "./store/utils/thunkCreators";
import { addConvoId } from "./store/conversationList";

let socket = io(window.location.origin, {
  autoConnect: false,
  withCredentials: true,
  auth: async (cb) => {
    cb({
      auth: await localStorage.getItem("messenger-token"),
    });
  },
});

socket.on("disconnect", () => {
  console.log("disconnected from server");
});

socket.on("connect", () => {
  console.log("connecting");
});

socket.on("add-online-user", (id) => {
  const storeCopy = store.getState();
  console.log("Adding online user");
  store.dispatch(addOnlineUser(id));
  socket.emit("add-users-to-new", {
    idToAdd: storeCopy.user.id,
    idToRecieve: id,
  });
});

socket.on("add-users-to-new", (id) => {
  // This is for adding online users to new online users
  console.log("Adding online user");
  store.dispatch(addOnlineUser(id));
});

socket.on("remove-offline-user", (id) => {
  store.dispatch(removeOfflineUser(id));
});

socket.on("new-message", (data) => {
  console.log("Recieved message");
  const storeCopy = store.getState();
  if (!storeCopy.conversationList.includes(data.message.conversationId)) {
    store.dispatch(addConvoId(data.message.conversationId));
  }
  store.dispatch(setNewMessage(data.message, data.sender));
});

socket.on("new-made-convo", async (data) => {
  // When user sends a new message to a new convo, all user's connections recieve convo.
  const storeCopy = store.getState();
  if (!storeCopy.conversationList.includes(data.message.conversationId)) {
    store.dispatch(addConvoId(data.message.conversationId));
  }
  await store.dispatch(usersById(data.recipientId));
  store.dispatch(addConversation(data.recipientId, data.message));
});

socket.on("read-message", (data) => {
  const storeCopy = store.getState();
  data.live = true;
  if (data.id !== null) {
    if (storeCopy.conversationList.includes(data.id)) {
      store.dispatch(updateReadConversation(data));
    }
  }
});

socket.on("read-message-concurrently", (data) => {
  // This is for a user's logged in accounts to all updated once he/she read message from any other account.
  store.dispatch(updateReadConversation(data));
});

socket.on("user-typing", (data) => {
  const storeCopy = store.getState();
  if (data.userId !== storeCopy.user.id) {
    if (storeCopy.conversationList.includes(data.id)) {
      store.dispatch(updateUserTypingStatus(data));
    }
  }
});

export default socket;
