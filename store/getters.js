export default {
  isLoggedIn: state => {
    try {
      return state.authUser.uid !== null;
    } catch {
      return false;
    }
  },
  authUser(state) {
    return state.authUser
  }
};
