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

    newConvo.latestMessageText = message.text;
    // Necessary for newConvo to populate online, but dangerous bc it sends to everyone
    return [...state, newConvo];
  }

  return state.map((convo) => {
    if (convo.id === message.conversationId) {
      const convoCopy = { ...convo };
      convoCopy.messages.unshift(message);

      if (message.senderId === payload.storeCopy.user.id) {
        convoCopy.latestMessageRead = true;
      } else {
        convoCopy.latestMessageRead = message.read;
      }
      convoCopy.count = 0;
      convoCopy.messages.map((message) => {
        if (!message.read && message.senderId !== payload.storeCopy.user.id) {
          convoCopy.count = convoCopy.count + 1;
        }
      });
      convoCopy.latestMessageText = message.text;

      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addNewConvoToStore = (state, storeCopy, recipientId, message) => {
  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      const newConvo = { ...convo };

      newConvo.id = message.conversationId;
      newConvo.messages.push(message);
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
  return state.map((convo) => {
    if (convo.id === payload.id) {
      const newConvo = { ...payload };

      return newConvo;
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
