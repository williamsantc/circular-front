<template>
  <b-card ref="gg">
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
                 @click="crudSettings.showModal = !crudSettings.showModal">
            <i class="fa fa-plus" aria-hidden="true"></i> Nueva responsable
        </b-btn>
        </b-col>
      </b-row>
      <b-collapse class="mt-2" v-model="crudSettings.toogleFilter" id="collapseFilter">
        <b-row >
          <b-col>
            <b-form-group label="Nombre del responsable a buscar">
              <b-input v-model="nombreSearch"></b-input>
            </b-form-group>
          </b-col>
        </b-row>
      </b-collapse>
      <b-row>
        <b-col>
          <br>
          <h4 v-if="listaResponsable.length <= 0">No hay registros</h4>
          <b-table v-else stacked="md"
                   :items="listaResponsable" 
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
                         @click="sendModificar(data.item)">
                    <i class="fa fa-pencil" aria-hidden="true"></i>
                  </b-btn>
                </b-col>
                <b-col cols="1">
                  <b-btn variant="danger" size="sm"
                  @click="eliminarResponsable(data.item.resp_id)" 
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
          <b-pagination v-if="listaResponsable.length > crudSettings.perPage"
                        align="center"
                        :total-rows="listaResponsable.length" 
                        :per-page="crudSettings.perPage" 
                        v-model="crudSettings.currentPage" />
        </b-col>
      </b-row>
    </b-card-body>

    <b-modal v-model="crudSettings.showModal"
             :title="tituloFuncionlidad">
      <b-row>
        <b-col>
          <b-form-group label="Nombre del responsable">
            <b-input v-model="responsable.form.resp_nombre" ref="resp_nombre"></b-input>
          </b-form-group>
          <b-form-group label="Cargo del responsable">
            <b-input v-model="responsable.form.resp_cargo" ref="resp_cargo"></b-input>
          </b-form-group>
        </b-col>
      </b-row>
      <div slot="modal-footer">
        <b-btn class="float-right" variant="primary" @click="gestionarResponsable">
          {{ crudSettings.msgBtn }}
        </b-btn>
      </div>
    </b-modal>
    <b-card-footer>
      <br>
    </b-card-footer>
  </b-card>
</template>

<script>
import Vue from 'vue'
import _ from 'lodash'
import validarForm from '@/mixins/validarForm'

const CRUD_SETTIINGS = require('@/utils/crudSettings')

const ENTIDAD = {
  form: {
    resp_id: '',
    resp_nombre: '',
    resp_cargo: ''
  },
  config: {
    resp_id: {
      type: 'String',
      required: false,
      msg: 'Error interno'
    },
    resp_nombre: {
      type: 'String',
      required: true,
      msg: 'Nombre de la responsable'
    },
    resp_cargo: {
      type: 'String',
      required: true,
      msg: 'Cargo del responsable'
    }
  }
}

export default {
  name: 'funcionalidad-responsable',
  mixins: [validarForm],
  data: function() {
    return {
      content: '',
      tituloFuncionlidad: 'Gestionar Responsables',
      crudSettings: JSON.parse(JSON.stringify(CRUD_SETTIINGS)),
      responsable: JSON.parse(JSON.stringify(ENTIDAD)),
      listaResponsable: [],
      fields: [
        { key: 'resp_nombre', label: 'Nombre del Responsable', sortable: true },
        { key: 'resp_cargo', label: 'Cargo' },
        { key: 'acciones', label: 'Acciones' }
      ],
      nombreSearch: '',
      initTinyMce: {
        plugins: [
          'textcolor link paste visualchars charmap table preview lists'
        ],
        relative_urls: false,
        remove_script_hostF: false,
        toolbar:
          'bold italic underline strikethrough |' +
          ' alignleft aligncenter alignright alignjustify | ' +
          ' bullist numlist | outdent indent | formatselect | ' +
          ' fontselect | fontsizeselect | paste pastetext | ' +
          ' undo redo | link unlink anchor | table | ' +
          ' hr removeformat visualchars | subscript superscript | charmap preview ',
        menubar: false
      }
    }
  },
  watch: {
    nombreSearch: _.debounce(function(newValue) {
      this.getResponsablesWs()
    }, 500),
    'crudSettings.showModal': function(newValue) {
      if (newValue) {
        return
      }

      Vue.nextTick(() => {
        this.responsable = JSON.parse(JSON.stringify(ENTIDAD))
        this.crudSettings.msgBtn = 'Registrar'
      })
    }
  },
  methods: {
    prueba: function() {
      console.log(this.content)
    },
    getResponsablesWs: function() {
      return this.$axios
        .$get('/responsable/list', { params: { nombre: this.nombreSearch } })
        .then(resp => {
          this.listaResponsable = resp
        })
        .catch(error => {
          console.log(error)
        })
    },
    sendModificar: function(responsable) {

      this.responsable.form = responsable
      this.crudSettings.msgBtn = 'Guardar Cambios'
      this.crudSettings.showModal = !this.crudSettings.showModal
    },
    gestionarResponsable: function() {
      if (!this.validarCampos(this.responsable)) {
        return
      }
      return this.$axios
        .$post('/responsable/gestionar', this.responsable.form)
        .then(resp => {
          if (resp.processOk) {
            this.$toastr.success(resp.msg, 'OK')
          } else {
            this.$toastr.error(resp.msg, 'ERROR')
          }
          this.crudSettings.showModal = !this.crudSettings.showModal
        })
        .catch(error => {
          this.$toastr.error(error.msg, 'ERROR')
        })
        .then(() => {
          this.getResponsablesWs()
        })
    },
    eliminarResponsable: function(resp_id) {
      return this.$confirm({
        title: this.tituloFuncionlidad,
        content: '¿Está seguro que desea eliminar el responsable seleccionado?'
      })
        .then(success => {
          return this.$axios
            .$post('/responsable/eliminar', { resp_id: resp_id })
            .then(resp => {
              this.$toastr.success(resp.msg, 'OK')
            })
            .catch(error => {
              this.$toastr.error(error.msg, 'ERROR')
            })
            .then(() => {
              this.getResponsablesWs()
            })
        })
        .catch(cancel => {
          this.$toastr.info('Solicitud cancelada', 'INFO')
        })
    }
  },
  created: function() {
    this.getResponsablesWs()
  }
}
</script>

<style scoped>
</style>
