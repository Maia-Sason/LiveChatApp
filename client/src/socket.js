import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
  updateReadConversation,
  updateUserTypingStatus,
} from "./store/conversations";

const jwt = localStorage.getItem("messenger-token");

let socket = io(window.location.origin);

socket.on("disconnect", () => {
  console.log("disconnected from server");
});

socket.on("connect", () => {
  socket.on("authenticated", () => {
    console.log("connected to server");
  });
  socket.on("unauthorized", (msg) => {
    console.log("unauthorized, disconnecting");
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
    console.log("Adding online user");
    store.dispatch(addOnlineUser(id));
  });

  socket.on("remove-offline-user", (id) => {
    store.dispatch(removeOfflineUser(id));
  });

  socket.on("new-message", (data) => {
    console.log("Recieved message");

    store.dispatch(setNewMessage(data.message, data.sender));
  });

  socket.on("read-message", (data) => {
    const storeCopy = store.getState();
    data.live = true;
    if (data.id !== null) {
      if (data.otherUser.id === storeCopy.user.id) {
        store.dispatch(updateReadConversation(data));
      }
    }
  });

  socket.on("user-typing", (data) => {
    const storeCopy = store.getState();
    if (storeCopy.conversationList.includes(data.id)) {
      store.dispatch(updateUserTypingStatus(data));
    }
  });
});

export default socket;
