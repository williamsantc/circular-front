const circularMixin = {
  data: function() {
    return {
      listaArea: [],
      listaEntidad: [],
      listaResponsable: [],
      area: {},
      entidad: {},
      responsable: {}
    }
  },
  methods: {
    getAreasWs: function() {
      return this.$axios
        .$get('/api/area/list')
        .then(resp => {
          this.listaArea = resp
        })
        .catch(error => {})
    },
    getEntidadesWs: function() {
      return this.$axios
        .$get('/api/entidad/list')
        .then(resp => {
          this.listaEntidad = resp
        })
        .catch(error => {
          console.log(error)
        })
    },
    getResponsablesWs: function() {
      return this.$axios
        .$get('/api/responsable/list')
        .then(resp => {
          this.listaResponsable = resp
        })
        .catch(error => {
          console.log(error)
        })
    },
    cargarListasForaneas: function() {
      return this.getAreasWs().then(() => {
        this.getEntidadesWs().then(() => {
          this.getResponsablesWs().then(() => {
            return true
          })
        })
      })
    }
  }
}

export default circularMixin
