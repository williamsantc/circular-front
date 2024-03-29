<template>
  <b-card>
    <b-card-header>
      <h4>{{ tituloFuncionlidad }}</h4>
    </b-card-header>
    <b-card-body>
      <b-row align-h="between">
        <b-col
          md="4"
          sm="4"
          order="2"
          order-sm="1">
          <b-btn
            variant="outline-primary"
            aria-controls="collapseFilter"
            @click="crudSettings.toogleFilter = !crudSettings.toogleFilter"
          >
            <i
              class="fa fa-search"
              aria-hidden="true"/> Filtrar búsqueda
            <i
              :class="(crudSettings.toogleFilter ? 'fa fa-angle-up': 'fa fa-angle-down')"
              aria-hidden="true"
            />
          </b-btn>
        </b-col>
        <b-col
          md="4"
          sm="4"
          order="1"
          order-sm="2"
          align="right">
          <b-btn
            variant="primary"
            @click="$router.push('/circular/gestionar')">
            <i
              class="fa fa-plus"
              aria-hidden="true"/> Nueva circular
          </b-btn>
        </b-col>
      </b-row>
      <b-collapse
        id="collapseFilter"
        v-model="crudSettings.toogleFilter"
        class="mt-2">
        <b-row>
          <b-col md="6">
            <b-form-group label="Asunto:">
              <b-input
                v-model="filtro.circ_asunto"
                placeholder="Ingrese datos de búsqueda"/>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="Entidad:">
              <multiselect
                v-model="entidad"
                :options="listaEntidad"
                placeholder="Seleccione una opción"
                label="enti_nombre"
                track-by="enti_nombre"
              />
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="6">
            <b-form-group label="Responsable:">
              <multiselect
                v-model="responsable"
                :options="listaResponsable"
                placeholder="Seleccione una opción"
                label="resp_nombre"
                track-by="resp_nombre"
              />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="Area:">
              <multiselect
                v-model="area"
                :options="listaArea"
                placeholder="Seleccione una opción"
                label="area_nombre"
                track-by="area_nombre"
              />
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="6">
            <b-form-group label="Fecha Desde:">
              <b-input
                v-model="filtro.circ_fechadesde"
                type="date"/>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="Fecha Hasta:">
              <b-input
                v-model="filtro.circ_fechahasta"
                type="date"/>
            </b-form-group>
          </b-col>
        </b-row>
      </b-collapse>
      <br>
      <b-row>
        <b-col>
          <b-alert
            v-if="listaCircular.length <= 0"
            show
            variant="info">No hay registros</b-alert>
          <b-table
            v-else
            :items="listaCircularMutated"
            :fields="fields"
            :per-page="crudSettings.perPage"
            :current-page="crudSettings.currentPage"
            stacked="md"
            striped
            fixed
            hover
          >
            <template
              slot="acciones"
              slot-scope="data">
              <b-btn
                variant="primary"
                size="sm"
                title="Modificar"
                class="mr-1"
                @click="sendModificar(data.item)"
              >
                <i
                  class="fa fa-pencil"
                  aria-hidden="true"/>
              </b-btn>
              <b-btn
                variant="danger"
                size="sm"
                title="Eliminar"
                @click="eliminarCircular(data.item.circ_id)"
              >
                <i
                  class="fa fa-trash"
                  aria-hidden="true"/>
              </b-btn>
              <b-btn
                variant="success"
                size="sm"
                class="ml-1"
                title="Descargar"
                @click="generarPDF(data.item)"
              >
                <i
                  ref="downloadFile"
                  :class="data.item.downloadIcon"
                  aria-hidden="true"/>
              </b-btn>
            </template>
          </b-table>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-pagination
            v-if="listaCircularMutated.length > crudSettings.perPage"
            :total-rows="listaCircularMutated.length"
            :per-page="crudSettings.perPage"
            v-model="crudSettings.currentPage"
            align="center"
          />
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
import createPDF from '@/utils/createPDF'

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
  name: 'ListadoCircular',
  mixins: [circularMixin],
  data: function() {
    return {
      crudSettings: JSON.parse(JSON.stringify(CRUD_SETTIINGS)),
      listaCircular: [],
      filtro: JSON.parse(JSON.stringify(FILTRO)),
      fields: [
        { key: 'circ_asunto', label: 'Asunto' },
        { key: 'circ_fecha', label: 'Fecha Emisión' },
        { key: 'entidad.enti_nombre', label: 'Entidad' },
        { key: 'area.area_nombre', label: 'Area' },
        { key: 'responsable.resp_nombre', label: 'Responsable' },
        'acciones'
      ],
      tituloFuncionlidad: 'Gestionar Circulares'
    }
  },
  computed: {
    listaCircularMutated: function() {
      return this.listaCircular.map(circular => ({
        ...circular,
        downloadIcon: 'fa fa-file-pdf-o'
      }))
    }
  },
  watch: {
    filtro: {
      handler: _.debounce(function() {
        this.getCircularWs()
      }, 500),
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
  beforeMount: function() {
    this.cargarListasForaneas()
  },
  beforeMount: function() {
    this.cargarListasForaneas()
    this.getCircularWs()
  },
  methods: {
    generarPDF: function(circular) {
      circular.downloadIcon = 'fa fa-spinner fa-spin fa-1x fa-fw'
      createPDF(circular)
      circular.downloadIcon = 'fa fa-file-pdf-o'
    },
    getCircularWs: function() {
      return this.$axios
        .$get('/api/circular/list', { params: this.filtro })
        .then(resp => {
          this.listaCircular = resp
          this.crudSettings.toogleFilter = false
        })
        .catch(error => {
          console.log(error.response.data)
        })
    },
    eliminarCircular: function(circ_id) {
      return this.$confirm({
        title: this.tituloFuncionlidad,
        content: '¿Está seguro que desea eliminar la circular seleccionada?'
      })
        .then(success => {
          return this.$axios
            .$post('/api/circular/eliminar', { circ_id: circ_id })
            .then(resp => {
              this.$toastr.success(resp.msg, 'OK')
            })
            .catch(error => {
              this.$toastr.error(error.response.data.msg, 'ERROR')
            })
            .then(() => {
              this.getCircularWs()
            })
        })
        .catch(cancel => {
          this.$toastr.info('Solicitud cancelada', 'INFO')
        })
    },
    sendModificar: function(circular) {
      this.$router.push({
        name: 'circular-gestionar',
        params: {
          circular: circular
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
