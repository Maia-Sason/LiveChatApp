// ACTIONS

const GET_USER = "GET_USER";
const SET_FETCHING_STATUS = "SET_FETCHING_STATUS";
const GET_ONLINE_USERS = "GET_ONLINE_USERS";

// ACTION CREATORS

export const gotOnlineUsers = (users) => {
  return {
    type: GET_ONLINE_USERS,
    users,
  };
};
export const gotUser = (user) => {
  return {
    type: GET_USER,
    user,
  };
};

export const setFetchingStatus = (isFetching) => ({
  type: SET_FETCHING_STATUS,
  isFetching,
});

// REDUCER

const reducer = (state = { isFetching: true }, action) => {
  switch (action.type) {
    case GET_USER:
      return action.user;
    case GET_ONLINE_USERS:
      return {
        ...state,
        onlineUsers: action.users,
      };
    case SET_FETCHING_STATUS:
      return {
        ...state,
        isFetching: action.isFetching,
      };
    default:
      return state;
  }
};

export default reducer;
