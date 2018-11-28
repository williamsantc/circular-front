import Vue from 'vue';

export default function ({ store, app }) {

  app.$axios.onRequest(config => {
    config.headers.common['Authorization'] = store.state.accessToken
  })

  app.$axios.onResponseError(error => {
    const code = parseInt(error.response && error.response.status)

    if (code === 403) {
      app.router.push('/login')
      Vue.prototype.$toastr.error('No se detectaron las credenciales', 'Inicie sesión')
    } else if (code === 401) {

    }

  })
}