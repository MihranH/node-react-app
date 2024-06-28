import { actionTypes } from '../actions/auth';

const initialState = {
  user: {},
};
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_USER_SUCCESS: {
      return {
        ...state,
        user: action.payload,
      };
    }
    case actionTypes.LOGIN_USER_SUCCESS: {
      return {
        ...state,
        user: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};

export default userReducer;
