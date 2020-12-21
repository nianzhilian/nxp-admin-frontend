const mutations = {
  clearToken: state => state.user.token = '',
  setSourceInfo(state, payload) {
    state.sourceInfo = payload;
  }
}

export default mutations
