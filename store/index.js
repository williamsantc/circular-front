import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'
import Vue from 'vue'

let vuexLocalStorage = null;

if (process.browser) {
  vuexLocalStorage = new VuexPersist({
    key: 'vuex', // The key to store the state on in the storage provider.
    storage: window.localStorage, // or window.sessionStorage or localForage
  })
}

const getDefaultState = () => {
  return {
    accessToken: '',
    dataUsuario: {}
  }
}

const createStore = () => {
  return new Vuex.Store({
    state: () => (getDefaultState()),
    mutations: {
      GET_TOKEN: function (state, data) {
        state.accessToken = 'Bearer ' + data.accessToken
        state.dataUsuario = data.dataUsuario
      },
      REFRESH_TOKEN: function(state, token) {
        state.accessToken = 'Bearer ' + token
      },
      RESET: function (state) {
        Object.assign(state, getDefaultState())
      }
    },
    actions: {
      login: function (context, payload) {
        return this.$axios.post('/api/auth/get_token', payload).then(resp => {
          context.commit('GET_TOKEN', resp.data)
        }).catch(error => {
          Vue.prototype.$toastr.error(error.response.data)
        })

      },
      cerrarSesion: function (context) {
        context.commit('RESET')
      },
      refreshToken: function (context) {
        return this.$axios.post('/api/auth/refresh_token', context.state.accessToken).then(resp => {
          context.commit('REFRESH_TOKEN', resp.data.refreshToken)
        }).catch(error => {
          console.log(error.data)
        })
        
      }
    },
    getters: {
      accessToken: state => state.accessToken,
      dataUsuario: state => state.dataUsuario
    }
  })
}

export default createStore