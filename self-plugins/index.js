import * as services from './bootstrap-msg-box'

const install = (Vue, options = {}) => {
  // Setup language, en-US for default
  
  // Register services
  Object.keys(services).forEach(key => {
    const service = services[key]
    Object.keys(service).forEach(serviceKey => {
      let _key = options.prefix ? options.prefix + '_' + serviceKey : serviceKey
      Vue.prototype['$' + _key] = service[serviceKey]
    })
  })
}

export default {install}