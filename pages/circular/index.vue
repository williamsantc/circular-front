<template>
  <b-card>
    <b-card-header>
      <h4>{{ tituloFuncionlidad }}</h4>
    </b-card-header>
    <b-card-body>
      <b-row>
        <b-col md="6" order="2" order-sm="1">
          <b-btn variant="outline-primary"
                 @click="crudSettings.toogleFilter = !crudSettings.toogleFilter"
                 aria-controls="collapseFilter">
            <i class="fa fa-search" aria-hidden="true"></i> filtro de búsqueda 
            <i :class="(crudSettings.toogleFilter ? 'fa fa-angle-up': 'fa fa-angle-down')" aria-hidden="true"></i>
          </b-btn>
        </b-col>
        <b-col md="6" order="1" order-sm="2" align="right">
          <b-btn variant="primary"
                 @click="$router.push('/circular/gestionar')">
            <i class="fa fa-plus" aria-hidden="true"></i> Nueva circular
        </b-btn>
        </b-col>
      </b-row>
      <b-collapse class="mt-2" v-model="crudSettings.toogleFilter" id="collapseFilter">
        <b-row>
          <b-col md="6">
            <b-form-group label="Asunto:">
              <b-input v-model="filtro.circ_asunto" placeholder="Ingrese datos de búsqueda"></b-input>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="Entidad:">
              <multiselect v-model="entidad" 
                           :options="listaEntidad" 
                           placeholder="Seleccione una opción" 
                           label="enti_nombre" 
                           track-by="enti_nombre">
              </multiselect>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="6">
            <b-form-group label="Responsable:">
              <multiselect v-model="responsable" 
                           :options="listaResponsable" 
                           placeholder="Seleccione una opción" 
                           label="resp_nombre" 
                           track-by="resp_nombre">
              </multiselect>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="Area:">
              <multiselect v-model="area" 
                           :options="listaArea" 
                           placeholder="Seleccione una opción" 
                           label="area_nombre" 
                           track-by="area_nombre">
              </multiselect>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="6">
            <b-form-group label="Fecha Desde:">
              <b-input v-model="filtro.circ_fechadesde" type="date"></b-input>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group v-model="filtro.circ_fechahasta" label="Fecha Hasta:">
              <b-input type="date"></b-input>
            </b-form-group>
          </b-col>
        </b-row>
      </b-collapse>
      <br>
      <b-row>
        <b-col>
          
          <h4 v-if="listaCircular.length <= 0">No hay registros</h4>
          <b-table v-else stacked="md"
                   :items="listaCircular" 
                   :fields="fields"
                   striped
                   :per-page="crudSettings.perPage"
                   :current-page="crudSettings.currentPage"
                   hover>
            <template slot="acciones" slot-scope="data">
              <b-row>
                <b-col cols="1">
                  <b-btn variant="primary" size="sm" 
                         v-b-tooltip.hover title="Modificar"
                         class="m-1"
                         @click="sendModificar(data.item)">
                    <i class="fa fa-pencil" aria-hidden="true"></i>
                  </b-btn>
                </b-col>
                <b-col cols="1">
                  <b-btn variant="danger" size="sm"
                         @click="eliminarCircular(data.item.circ_id)" 
                         class="m-1"
                         v-b-tooltip.hover title="Eliminar">
                    <i class="fa fa-trash" aria-hidden="true"></i>
                  </b-btn>
                </b-col>
              </b-row>
            </template>
          </b-table>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-pagination v-if="listaCircular.length > crudSettings.perPage"
                        align="center"
                        :total-rows="listaCircular.length" 
                        :per-page="crudSettings.perPage" 
                        v-model="crudSettings.currentPage" />
        </b-col>
      </b-row>
    </b-card-body>
    <b-card-footer>
      <br>
    </b-card-footer>
  </b-card>
</template>

<script>
import Vue from 'vue'
import _ from 'lodash'
import circularMixin from '@/mixins/circularMixin'

const CRUD_SETTIINGS = require('@/utils/crudSettings')

const FILTRO = {
  circ_asunto: '',
  enti_id: '',
  resp_id: '',
  area_id: '',
  circ_fechadesde: '',
  circ_fechahasta: ''
}

export default {
  name: 'listado-circular',
  mixins: [circularMixin],
  data: function() {
    return {
      crudSettings: JSON.parse(JSON.stringify(CRUD_SETTIINGS)),
      listaCircular: [],
      filtro: JSON.parse(JSON.stringify(FILTRO)),
      fields: [
        { key: 'circ_asunto', label: 'Asunto'},
        { key: 'circ_fecha', label: 'Fecha Emisión'},
        { key: 'entidad.enti_nombre', label: 'Entidad'},
        { key: 'area.area_nombre', label: 'Area'},
        { key: 'responsable.resp_nombre', label: 'Responsable'},
        'acciones'
      ],
      tituloFuncionlidad: 'Gestionar Circulares'
    }
  },
  watch: {
    filtro: {
      handler: 'getCircularWs',
      immediate: true,
      deep: true
    },
    area: function(newValue) {
      this.filtro.area_id = newValue ? newValue.area_id : ''
    },
    entidad: function(newValue) {
      this.filtro.enti_id = newValue ? newValue.enti_id : ''
    },
    responsable: function(newValue) {
      this.filtro.resp_id = newValue ? newValue.resp_id : ''
    }
  },
  methods: {
    getCircularWs: _.debounce(function() {
      return this.$axios
        .$get('/circular/list', {params: this.filtro})
        .then(resp => {
          this.listaCircular = resp
          console.log(this.listaCircular)
          this.crudSettings.toogleFilter = false
        })
        .catch(error => {
          console.log(error)
        })
    }, 500),
    eliminarCircular: function(circ_id) {
      return this.$confirm({
        title: this.tituloFuncionlidad,
        content: '¿Está seguro que desea eliminar la circular seleccionada?'
      })
        .then(success => {
          return this.$axios
            .$post('/cicular/eliminar', { circ_id: circ_id })
            .then(resp => {
              this.$toastr.success(resp.msg, 'OK')
            })
            .catch(error => {
              this.$toastr.error(error.msg, 'ERROR')
            })
            .then(() => {
              this.getCircularWs()
            })
        })
        .catch(cancel => {
          this.$toastr.info('Solicitud cancelada', 'INFO')
        })
    },
    sendModificar: function(circular) {}
  }
}
</script>

<style scoped>
</style>
