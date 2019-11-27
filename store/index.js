import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'
import Vue from 'vue'

let vuexLocalStorage = null

if (process.browser) {
  vuexLocalStorage = new VuexPersist({
    key: 'vuex', // The key to store the state on in the storage provider.
    storage: window.localStorage // or window.sessionStorage or localForage
  })
}

const getDefaultState = () => {
  return {
    accessToken: '',
    dataUsuario: {},
    funcionalidades: [],
    funcionalidadesPorRol: [],
    rolActual: null
  }
}

const createStore = () => {
  return new Vuex.Store({
    state: () => getDefaultState(),
    mutations: {
      GET_TOKEN: function(state, data) {
        state.accessToken = 'Bearer ' + data.accessToken
        state.dataUsuario = data.dataUsuario
      },
      REFRESH_TOKEN: function(state, token) {
        state.accessToken = 'Bearer ' + token
      },
      RESET: function(state) {
        Object.assign(state, getDefaultState())
      },
      LOAD_FUNCIONALIDADES: function(state, funcionalidadesPorRol) {
        state.funcionalidadesPorRol = funcionalidadesPorRol
        state.funcionalidades = state.funcionalidadesPorRol[0].nav
        state.rolActual = state.funcionalidadesPorRol[0].rol_id
      },
      SET_CURRENT_ROL: function(state, rol) {
        if (!rol) {
          return
        }
        state.rolActual = rol
        state.funcionalidades = state.funcionalidadesPorRol.filter(
          funcRol => funcRol.rol_id === rol
        )[0].nav
        this.$router.push('/bienvenido')
      }
    },
    actions: {
      login: function(context, payload) {
        return this.$axios
          .post('/api/auth/get_token', payload)
          .then(resp => {
            context.commit('GET_TOKEN', resp.data)
          })
          .catch(error => {
            Vue.prototype.$toastr.error(
              error.response.data,
              'Error de credenciales'
            )
          })
      },
      cerrarSesion: function(context) {
        context.commit('RESET')
      },
      refreshToken: function(context) {
        return this.$axios
          .post('/api/auth/refresh_token', {
            accessToken: context.state.accessToken,
            dataUsuario: context.state.dataUsuario
          })
          .then(resp => {
            if (resp.data.accessToken) {
              context.commit('REFRESH_TOKEN', resp.data.accessToken)
            }
          })
          .catch(error => {
            console.log(error.data)
          })
      },
      cargarFuncionalidades: function(context) {
        return this.$axios
          .get('/api/funcionalidad/listar_nav')
          .then(resp => {
            context.commit('LOAD_FUNCIONALIDADES', resp.data)
          })
          .catch(err => {
            console.log(err.response.data)
            context.commit('LOAD_FUNCIONALIDADES', [])
          })
      },
      cambiarRol: function(context, rol) {
        context.commit('SET_CURRENT_ROL', rol)
      }
    },
    getters: {
      accessToken: state => state.accessToken,
      dataUsuario: state => state.dataUsuario,
      funcionalidades: state => state.funcionalidades,
      rolActual: state => state.rolActual
    },
    plugins: [vuexLocalStorage.plugin]
  })
}

export default createStore
