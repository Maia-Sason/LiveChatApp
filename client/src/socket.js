import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
  updateReadConversation,
  updateUserTypingStatus,
} from "./store/conversations";

const socket = io(window.location.origin);

socket.on("connect", () => {
  console.log("connected to server");

  socket.on("add-online-user", (id) => {
    console.log("Adding online user");
    store.dispatch(addOnlineUser(id));
  });

  socket.on("remove-offline-user", (id) => {
    store.dispatch(removeOfflineUser(id));
  });

  socket.on("new-message", (data) => {
    const storeCopy = store.getState();
    console.log("Recieved message");

    // Try adding another data structure to get convo ids. an array we can find in.
    if (
      data.recipientId === storeCopy.user.id ||
      (!data.sender && storeCopy.conversationList.includes(data.conversationId))
    ) {
      store.dispatch(setNewMessage(data.message, data.sender));
    }
  });

  socket.on("read-message", (data) => {
    const storeCopy = store.getState();
    data.live = true;
    if (data.id !== null) {
      //   if (data.otherUser.id === storeCopy.user.id) {
      //     store.dispatch(updateReadConversation(data));
      //   }
    }
  });

  socket.on("user-typing", (data) => {
    const storeCopy = store.getState();
    if (storeCopy.conversationList.includes(data.id)) {
      store.dispatch(updateUserTypingStatus(data));
    }
  });

  socket.on("close", () => {
    console.log("Socket connection closed.");
    socket.removeAllListeners();
  });
});

export default socket;
