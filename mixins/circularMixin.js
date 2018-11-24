const circularMixin = {
  data: function () {
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
    getAreasWs: function () {
      return this.$axios
        .$get('/area/list')
        .then(resp => {
          this.listaArea = resp
        })
        .catch(error => { })
    },
    getEntidadesWs: function () {
      return this.$axios
        .$get('/entidad/list')
        .then(resp => {
          this.listaEntidad = resp
        })
        .catch(error => {
          console.log(error)
        })
    },
    getResponsablesWs: function () {
      return this.$axios
        .$get('/responsable/list')
        .then(resp => {
          this.listaResponsable = resp
        })
        .catch(error => {
          console.log(error)
        })
    }
  },
  beforeMount: function() {
    this.getAreasWs()
    this.getEntidadesWs()
    this.getResponsablesWs()
  }
}

export default circularMixin