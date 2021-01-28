export default {
  isLoggedIn(state) {
    return !!state.authUser;
  },
  authUser(state) {
    return state.authUser;
  }
};
