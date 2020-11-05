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
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
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
    }
  },
  modules: {
  }
})
