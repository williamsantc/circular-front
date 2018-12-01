<template>
  <b-card>
    <b-card-header>
      <h4>Almacenar circular</h4>
    </b-card-header>
    <b-card-body>
      <b-row>
        <b-col md="6" order="2" order-sm="1">
          <b-btn
            variant="outline-primary"
            @click="crudSettings.toogleFilter = !crudSettings.toogleFilter"
            aria-controls="collapseFilter"
          >
            <i class="fa fa-search" aria-hidden="true"></i> filtro de búsqueda
            <i
              :class="(crudSettings.toogleFilter ? 'fa fa-angle-up': 'fa fa-angle-down')"
              aria-hidden="true"
            ></i>
          </b-btn>
        </b-col>
        <b-col md="6" order="1" order-sm="2" align="right">
          <b-btn variant="primary" @click="crudSettings.showModal = !crudSettings.showModal">
            <i class="fa fa-plus" aria-hidden="true"></i> Almacenar
          </b-btn>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <br>
          <b-alert show variant="info" v-if="listaAlmacenar.length <= 0">No hay registros</b-alert>
          <b-table
            v-else
            stacked="md"
            :items="listaAlmacenar"
            :fields="fields"
            striped
            fixed
            :per-page="crudSettings.perPage"
            :current-page="crudSettings.currentPage"
            hover
          >
            <template slot="circ_id" slot-scope="data">{{ calcularNumeracion(data.item.circ_id) }}</template>
            <template slot="acciones" slot-scope="data">
              <b-btn
                variant="primary"
                size="sm"
                title="Modificar"
                class="mr-1"
                @click="sendModificar(data.item)"
              >
                <i class="fa fa-pencil" aria-hidden="true"></i>
              </b-btn>
              <b-btn
                variant="danger"
                size="sm"
                @click="eliminar(data.item.alma_id)"
                title="Eliminar"
              >
                <i class="fa fa-trash" aria-hidden="true"></i>
              </b-btn>
              <b-btn
                variant="success"
                size="sm"
                title="Descargar"
                @click="descargarCircular(data.item)"
                class="ml-1"
              >
                <i class="fa fa-download" aria-hidden="true"></i>
              </b-btn>
            </template>
          </b-table>
        </b-col>
      </b-row>
      <b-pagination
        v-if="listaAlmacenar.length > crudSettings.perPage"
        align="center"
        :total-rows="listaAlmacenar.length"
        :per-page="crudSettings.perPage"
        v-model="crudSettings.currentPage"
      />
      <b-modal v-model="crudSettings.showModal" :title="tituloFuncionlidad">
        <b-row>
          <b-col>
            <b-form-group label="Circular a almacenar">
              <multiselect
                v-model="circular"
                :options="listaCircularSelect"
                placeholder="Seleccione una opción"
                label="trackBy"
                :show-labels="false"
                ref="circ_id"
                track-by="trackBy"
              ></multiselect>
            </b-form-group>
            <b-form-group label="Descripción para almacenar">
              <b-form-textarea
                placeholder="Ingrese descripcion"
                :rows="6"
                no-resize
                @keydown.native="validarCantidadCaracteres($event, almacenar.form.alma_descripcion, 200)"
                ref="alma_descripcion"
                v-model="almacenar.form.alma_descripcion"
                :max-rows="6"
              ></b-form-textarea>
            </b-form-group>
            <b-form-group label="Cargar Circular">
              <b-form-file
                v-model="almacenar.form.alma_file"
                :state="Boolean(almacenar.form.alma_file)"
                ref="alma_file"
                placeholder="Seleccione la circular a almacenar"
                accept="application/pdf"
              ></b-form-file>
            </b-form-group>
          </b-col>
        </b-row>
        <div slot="modal-footer">
          <b-btn
            class="float-right"
            variant="primary"
            @click="gestionarAlmacenar"
          >{{ crudSettings.msgBtn }}</b-btn>
        </div>
      </b-modal>
    </b-card-body>
    <b-card-footer>
      <br>
    </b-card-footer>
  </b-card>
</template>

<script>
import Vue from 'vue'
import _ from 'lodash'
import { calcularNumeracion } from '@/utils/createPDF'
import validarForm from '@/mixins/validarForm'

const CRUD_SETTIINGS = require('@/utils/crudSettings')

const ALMACENAR = {
  form: {
    circ_id: '',
    alma_id: '',
    alma_file: null,
    alma_descripcion: ''
  },
  config: {
    alma_id: {
      type: 'String',
      required: false,
      msg: 'Error interno'
    },
    circ_id: {
      type: 'Select',
      required: true,
      msg: 'Circular'
    },
    alma_descripcion: {
      type: 'String',
      required: true,
      msg: 'Descripción',
      limite: 200
    },
    alma_file: {
      type: 'File',
      required: true,
      msg: 'Archivo PDF',
      accept: ['application/pdf'],
      maxSize: 5242880
    }
  }
}

export default {
  name: 'almacenar',
  mixins: [validarForm],
  data: function() {
    return {
      tituloFuncionlidad: 'Almacenar Circular',
      crudSettings: JSON.parse(JSON.stringify(CRUD_SETTIINGS)),
      almacenar: JSON.parse(JSON.stringify(ALMACENAR)),
      listaCircular: [],
      listaAlmacenar: [],
      circular: null,
      fields: [
        { key: 'circ_id', label: 'Numeración circular' },
        { key: 'alma_descripcion', label: 'Descripción circular almacenada' },
        { key: 'circular.circ_asunto', label: 'Asunto circular' },
        'acciones'
      ]
    }
  },
  computed: {
    listaCircularSelect: function() {
      return this.listaCircular.map(circular => ({
        ...circular,
        trackBy: circular.circ_id + ' - ' + circular.circ_asunto
      }))
    }
  },
  watch: {
    circular: function(newValue) {
      this.almacenar.form.circ_id = newValue ? newValue.circ_id : ''
    },
    'crudSettings.showModal': function(newValue) {
      if (newValue) {
        return
      }

      Vue.nextTick(() => {
        this.almacenar = JSON.parse(JSON.stringify(ALMACENAR))
        this.circular = null
        this.$refs.alma_file.reset()
        this.crudSettings.msgBtn = 'Registrar'
      })
    }
  },
  methods: {
    calcularNumeracion,
    getAlmacenarWs: function() {
      return this.$axios
        .$get('/api/almacenar_plain/list')
        .then(resp => {
          this.listaAlmacenar = resp
        })
        .catch(error => {
          console.log(error.response.data)
        })
    },
    sendModificar: function(almacenar) {
      this.almacenar.form.alma_id = almacenar.alma_id
      this.almacenar.form.alma_descripcion = almacenar.alma_descripcion
      this.almacenar.form.alma_file = null

      this.circular = this.listaCircularSelect.find(circular => {
        return circular.circ_id === almacenar.circ_id
      })
      this.$refs.alma_file.reset()
      this.crudSettings.msgBtn = 'Guardar Cambios'
      this.crudSettings.showModal = !this.crudSettings.showModal
    },
    eliminar: function(alma_id) {
      return this.$confirm({
        title: this.tituloFuncionlidad,
        content: '¿Está seguro que desea eliminar la circular almacenada?'
      })
        .then(success => {
          return this.$axios
            .$post('/api/almacenar_plain/eliminar', { alma_id: alma_id })
            .then(resp => {
              this.$toastr[resp.variant](resp.msg, resp.title)
            })
            .catch(error => {
              this.$toastr.error(error.response.data.msg, 'ERROR')
            })
            .then(() => {
              this.getEntidadesWs()
            })
        })
        .catch(cancel => {
          this.$toastr.info('Solicitud cancelada', 'INFO')
        })
        .then(() => {
          this.getAlmacenarWs()
        })
    },
    descargarCircular: function(almacenar) {
      this.$axios
        .get('/api/almacenar_plain/get', {
          params: {
            circular: almacenar.alma_id
          },
          responseType: 'blob' // important
        })
        .then(response => {
          const url = window.URL.createObjectURL(new Blob([response.data]))

          // crea el elemento
          const link = document.createElement('a')
          link.href = url
          link.setAttribute(
            'download',
            'circular' + almacenar.circ_id + '_' + new Date().getTime() + '.pdf'
          )

          // añade el elemento al cuerpo
          document.body.appendChild(link)
          link.click()

          // elimina elemento creado
          link.parentNode.removeChild(link)
          this.$toastr.success('Descarga generada', 'OK')
        })
        .catch(err => {
          this.$toastr.error('Error en la descarga', 'Circular no encontrada')
        })
    },
    gestionarAlmacenar: function() {
      if (!this.validarCampos(this.almacenar)) {
        return
      }

      let form = new FormData()

      for (let name in this.almacenar.form) {
        form.append(name, this.almacenar.form[name])
      }

      return this.$axios
        .$post('/api/almacenar_multi/gestionar', form, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(resp => {
          this.$toastr[resp.variant](resp.msg, resp.title)
          if (resp.variant !== 'error') {
            this.crudSettings.showModal = !this.crudSettings.showModal
          }
        })
        .catch(error => {
          console.log(error.response.data)
        })
        .then(() => {
          this.getAlmacenarWs()
        })
    },
    getCircularWs: function() {
      return this.$axios
        .$get('/api/circular/list')
        .then(resp => {
          this.listaCircular = resp
          this.crudSettings.toogleFilter = false
        })
        .catch(error => {
          console.log(error.response.data)
        })
    }
  },
  beforeMount: function() {
    this.getCircularWs()
    this.getAlmacenarWs()
  }
}
</script>

<style scoped>
</style>
