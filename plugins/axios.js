import Vue from 'vue';

export default function ({ store, app }) {

  app.$axios.onRequest(config => {
    config.headers.common['Authorization'] = store.state.accessToken
  })

  app.$axios.onResponseError(error => {
    const code = parseInt(error.response && error.response.status)
    
    if (code === 403 && app.router.history.current.name !==  'login') {
      store.dispatch('cerrarSesion')
      app.router.push('/login')
      
      Vue.prototype.$toastr.error('No se detectaron las credenciales', 'Inicie sesión')
    } else if (code === 401) {
      
      return store.dispatch('refreshToken').then(() => {

        error.config.headers['Authorization'] = store.state.accessToken
        return app.$axios.request(error.config)
      })
    }

    return Promise.reject(error)

  })

}