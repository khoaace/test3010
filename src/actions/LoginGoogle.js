import {
  LOGIN_GOOGLE,
  LOGIN_GOOGLE_SUCCESS,
  LOGIN_GOOGLE_FAILURE
} from "./constants";

import { loginGG, checkLoginedGG } from "../helpers/googleSignIn";
import { IS_LOGINED } from "../constants";

export function loginGoogle() {
  return {
    type: LOGIN_GOOGLE
  };
}

export function loginGoogleSuccess(user) {
  return {
    type: LOGIN_GOOGLE_SUCCESS,
    user
  };
}

export function loginGoogleFailure() {
  return {
    type: LOGIN_GOOGLE_FAILURE
  };
}

export function isLogined(user) {
  return {
    type: IS_LOGINED,
    user
  };
}

export function userLogin() {
  return dispatch => {
    dispatch(loginGoogle());
    loginGG()
      .then(user => {
        dispatch(loginGoogleSuccess(user));
      })
      .catch(err => {
        dispatch(loginGoogleFailure());
      });
  };
}

export function checkLogined() {
  return dispatch => {
    dispatch(loginGoogle());
    checkLoginedGG()
      .then(user => {
        dispatch(isLogined(user));
      })
      .catch(err => {
        dispatch(loginGoogleFailure());
      });
  };
}
