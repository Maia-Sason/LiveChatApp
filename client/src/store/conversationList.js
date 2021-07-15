const SET_CONVERSATION_LIST = "SET_CONVERSATION_LIST";
const ADD_CONVERSATION_LIST = "ADD_CONVERSATION_LIST";

export const setConversationList = (list) => {
  return {
    type: SET_CONVERSATION_LIST,
    list,
  };
};

export const addConvoId = (id) => {
  return {
    type: ADD_CONVERSATION_LIST,
    id,
  };
};

const reducer = (state = [], action) => {
  switch (action.type) {
    case SET_CONVERSATION_LIST: {
      return action.list;
    }
    case ADD_CONVERSATION_LIST: {
      return [...state, action.id];
    }
    default:
      return state;
  }
};

export default reducer;
