import { auth, provider } from "../config/firebase";

export const loginGG = () => {
  return new Promise((resolve, reject) => {
    auth.signInWithPopup(provider).then(result => {
      const user = result.user;
      if (user) resolve(user);
      else reject("error");
    });
  });
};

export const checkLoginedGG = () => {
  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged(user => {
      if (user) resolve(user);
      else reject("error");
    });
  });
};

export const logoutGG = () => {
  return new Promise((resolve, reject) => {
    auth.signOut().then(result => {
      resolve("OK");
    });
  });
};
