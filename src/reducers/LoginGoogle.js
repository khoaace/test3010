import {
  LOGIN_GOOGLE,
  LOGIN_GOOGLE_SUCCESS,
  LOGIN_GOOGLE_FAILURE,
  IS_LOGINED
} from "../constants";
const initialState = {
  user: [],
  logined: false,
  isLogin: false,
  error: false
};

export default function dataReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_GOOGLE:
      return {
        ...state,
        user: [],
        isLogin: true
      };
    case LOGIN_GOOGLE_SUCCESS:
      return {
        ...state,
        isLogin: false,
        logined: true,
        user: action.user
      };
    case LOGIN_GOOGLE_FAILURE:
      return {
        ...state,
        user: [],
        isLogin: false,
        logined: false,
        error: true
      };
    case IS_LOGINED:
      return {
        ...state,
        logined: true,
        user: action.user
      };

    default:
      return state;
  }
}
