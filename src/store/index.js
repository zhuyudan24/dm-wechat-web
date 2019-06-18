import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    bodyH: document.documentElement.clientHeight,
    reqLoading: false,
    memberId: 'ff80808163a6ab7a0163a6abd0710000'
  },
  mutations: {
    setReqLoading(state, data) {
      state.reqLoading = data;
    },
    setMemberId(state, data) {
      state.memberId = data;
    }
  },
  actions: {
    SetLoading({ commit }, flag) {
      commit('setReqLoading', flag);
    },
    modifyMemberId({ commit }, val) {
      commit('setMemberId', val);
    }
  }
})
