import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'

let vuexLocalStorage = null;

if (process.browser) {
    vuexLocalStorage = new VuexPersist({
      key: 'vuex', // The key to store the state on in the storage provider.
      storage: window.localStorage, // or window.sessionStorage or localForage
    })
}

const createStore = () => {
  return new Vuex.Store({
    state: () => ({
      counter: 0
    }),
    mutations: {
      increment (state) {
        state.counter++
      }
    }
  })
}

export default createStore