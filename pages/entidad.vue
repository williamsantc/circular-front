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
            <i class="fa fa-plus" aria-hidden="true"></i> Nueva entidad
        </b-btn>
        </b-col>
      </b-row>
      <b-collapse class="mt-2" v-model="crudSettings.toogleFilter" id="collapseFilter">
        <b-row >
          <b-col>
            <b-form-group label="Nombre de la entidad a buscar">
              <b-input v-model="nombreSearch"></b-input>
            </b-form-group>
          </b-col>
        </b-row>
      </b-collapse>
      <b-row>
        <b-col>
          <br>
          <h4 v-if="listaEntidad.length <= 0">No hay registros</h4>
          <b-table v-else stacked="md"
                   :items="listaEntidad" 
                   :fields="fields"
                   striped
                   :per-page="crudSettings.perPage"
                   :current-page="crudSettings.currentPage"
                   hover>
            <template slot="acciones" slot-scope="data">
              <b-row>
                <b-col cols="1">
                  <b-btn variant="primary" size="sm" 
                          title="Modificar"
                         @click="sendModificar(data.item)">
                    <i class="fa fa-pencil" aria-hidden="true"></i>
                  </b-btn>
                </b-col>
                <b-col cols="1">
                  <b-btn variant="danger" size="sm"
                  @click="eliminarArea(data.item.enti_id)" 
                          title="Eliminar">
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
          <b-pagination v-if="listaEntidad.length > crudSettings.perPage"
                        align="center"
                        :total-rows="listaEntidad.length" 
                        :per-page="crudSettings.perPage" 
                        v-model="crudSettings.currentPage" />
        </b-col>
      </b-row>
    </b-card-body>

    <b-modal v-model="crudSettings.showModal"
             :title="tituloFuncionlidad">
      <b-row>
        <b-col>
          <b-form-group label="Nombre del entidad">
            <b-input v-model="entidad.form.enti_nombre" ref="enti_nombre"></b-input>
          </b-form-group>
        </b-col>
      </b-row>
      <div slot="modal-footer">
        <b-btn class="float-right" variant="primary" @click="gestionarEntidad">
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
    enti_id: '',
    enti_nombre: ''
  },
  config: {
    enti_id: {
      type: 'String',
      required: false,
      msg: 'Error interno'
    },
    enti_nombre: {
      type: 'String',
      required: true,
      msg: 'Nombre de la entidad'
    }
  }
}

export default {
  name: 'funcionalidad-entidad',
  mixins: [validarForm],
  data: function() {
    return {
      tituloFuncionlidad: 'Gestionar Entidades',
      crudSettings: JSON.parse(JSON.stringify(CRUD_SETTIINGS)),
      entidad: JSON.parse(JSON.stringify(ENTIDAD)),
      listaEntidad: [],
      fields: [
        { key: 'enti_nombre', label: 'Nombre de la Entidad', sortable: true },
        { key: 'acciones', label: 'Acciones' }
      ],
      nombreSearch: ''
    }
  },
  watch: {
    nombreSearch: _.debounce(function(newValue) {
      this.getEntidadesWs()
    }, 500),
    'crudSettings.showModal': function(newValue) {
      if (newValue) {
        return
      }

      Vue.nextTick(() => {
        this.entidad = JSON.parse(JSON.stringify(ENTIDAD))
        this.crudSettings.msgBtn = 'Registrar'
      })
    }
  },
  methods: {
    getEntidadesWs: function() {
      return this.$axios
        .$get('/entidad/list', { params: { nombre: this.nombreSearch } })
        .then(resp => {
          this.listaEntidad = resp
        })
        .catch(error => {
          console.log(error)
        })
    },
    sendModificar: function(entidad) {

      this.entidad.form = entidad
      this.crudSettings.msgBtn = 'Guardar Cambios'
      this.crudSettings.showModal = !this.crudSettings.showModal
    },
    gestionarEntidad: function() {
      if(!this.validarCampos(this.entidad)) { 
        return
      }
      return this.$axios
        .$post('/entidad/gestionar', this.entidad.form)
        .then(resp => {
          if(resp.processOk) {
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
          this.getEntidadesWs()
        })
    },
    eliminarArea: function(enti_id) {
      return this.$confirm({
        title: this.tituloFuncionlidad,
        content: '¿Está seguro que desea eliminar la entidad seleccionada?'
      })
        .then(success => {
          return this.$axios
            .$post('/entidad/eliminar', { enti_id: enti_id })
            .then(resp => {
              this.$toastr.success(resp.msg, 'OK')
            })
            .catch(error => {
              this.$toastr.error(error.msg, 'ERROR')
            })
            .then(() => {
              this.getEntidadesWs()
            })
        })
        .catch(cancel => {
          this.$toastr.info('Solicitud cancelada', 'INFO')
        })
    }
  },
  created: function() {
    this.getEntidadesWs()

  }
}
</script>

<style scoped>
</style>
