export const addMessageToStore = (state, payload) => {
  const { message, sender } = payload;
  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
      count: 1,
    };

    // Check if convo already exists as fake, if yes, don't add new convo, just update this one
    newConvo.latestMessageText = message.text;
    let exist = false;
    state.map((convo) => {
      if (sender.id === convo.otherUser.id) {
        exist = true;
      }
    });
    if (exist) {
      return state.map((convo) => {
        if (sender.id === convo.otherUser.id) {
          return newConvo;
        } else {
          return convo;
        }
      });
    }

    return [...state, newConvo];
  }

  return state.map((convo) => {
    if (convo.id === message.conversationId) {
      const convoCopy = { ...convo };

      convoCopy.messages.push(message);

      convoCopy.count = convo.count;

      if (message.senderId === payload.storeCopy.user.id) {
        convoCopy.latestMessageRead = true;
      } else {
        convoCopy.latestMessageRead = message.read;
        convoCopy.count = convoCopy.count + 1;
      }

      convoCopy.latestMessageText = message.text;

      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addNewConvoToStore = (state, storeCopy, recipientId, message) => {
  let exist = false;
  state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      exist = true;
    }
  });

  if (!exist) {
    // If convo doesn't exist because user hasn't searched the recipient yet, add it to store.
    const newConvo = {};
    newConvo.otherUser = { id: recipientId, username: "bob" };
    newConvo.id = message.conversationId;
    newConvo.message = [message];
    newConvo.count = 0;
    if (message.senderId === storeCopy.user.id) {
      newConvo.latestMessageRead = true;
    } else {
      newConvo.latestMessageRead = message.read;
      newConvo.count = 1;
    }
    newConvo.latestMessageText = message.text;
    return [...state, newConvo];
  }

  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      const newConvo = { ...convo };

      newConvo.id = message.conversationId;
      newConvo.messages.push(message);

      // Set convo count to 0 or 1 for a new conversation
      newConvo.count = 0;
      if (message.senderId === storeCopy.user.id) {
        newConvo.latestMessageRead = true;
      } else {
        newConvo.latestMessageRead = message.read;
        newConvo.count = 1;
      }
      newConvo.latestMessageText = message.text;

      return newConvo;
    } else {
      return convo;
    }
  });
};

export const updateConversationStatus = (state, payload) => {
  // On trigger, update the conversation so that messages are read.
  return state.map((convo) => {
    if (convo.id === payload.id && !payload.live) {
      const newConvo = { ...payload };
      newConvo.live = convo.live;
      return newConvo;
    } else if (convo.id === payload.id && payload.live) {
      // If conversation was recieved from websockets only update messages from payload.
      const newConvo = { ...convo };
      newConvo.messages = payload.messages;
      return newConvo;
    } else {
      return convo;
    }
  });
};

export const setTypingStatusStore = (state, bool, id) => {
  return state.map((convo) => {
    if (convo.id === id) {
      const convoCopy = { ...convo };
      convoCopy.live = bool;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = true;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = false;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = { otherUser: user, messages: [] };
      newState.push(fakeConvo);
    }
  });

  return newState;
};
