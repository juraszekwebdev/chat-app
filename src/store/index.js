import Vue from 'vue'
import Vuex from 'vuex'
import {auth} from "@/api/firebase";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    alert: {
      status: '',
      message: ''
    },
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
    chat: {
      channels: [],
      members: [],
    }
  },
  getters: {
    isLoggedIn: state => !!state.user
  },
  mutations: {
    alertError(state, message) {
      state.alert.status = 'danger'
      state.alert.message = message
    },
    alertSuccess(state, message) {
      state.alert.status = 'success'
      state.alert.message = message
    },
    clearAlert(state) {
      state.alert.status = ''
      state.alert.message = ''
    },
    setUser(state, payload) {
      state.user = payload;
    },
    logoutUser(state) {
      auth.signOut().then(() => {
        localStorage.removeItem("user");
        state.user = null;
      })
    },
    initChannels(state, payload) {
      state.chat.channels = payload;
    },
    initMembers(state, payload) {
      state.chat.members = payload;
    },
    updateMemberStatus(state, {user, status}) {
      const index = state.chat.members.findIndex(o => o.uid === user.uid);
      state.chat.members[index].isActive = status;
    }
  },
  actions: {
    alertError({commit}, message) {
      commit("alertError", message)
    },
    alertSuccess({commit}, message) {
      commit("alertSuccess", message)
    },
    clearAlert({commit}) {
      commit("clearAlert")
    },
    setUser({commit}, payload) {
      commit("setUser", payload)
    },
    logoutUser({commit}) {
      commit("logoutUser")
    },
    initChannelsData({commit}, payload) {
      commit("initChannels", payload)
    },
    initMembersData({commit}, payload) {
      commit("initMembers", payload)
    },
    updateMemberStatus({commit}, payload) {
      commit("updateMemberStatus", payload)
    }
  },
  modules: {
  }
})
