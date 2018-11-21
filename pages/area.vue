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
            <i class="fa fa-plus" aria-hidden="true"></i> Nueva area
        </b-btn>
        </b-col>
      </b-row>
      <b-collapse class="mt-2" v-model="crudSettings.toogleFilter" id="collapseFilter">
        <b-row >
          <b-col>
            <b-form-group label="Nombre del area a buscar">
              <b-input></b-input>
            </b-form-group>
          </b-col>
        </b-row>
      </b-collapse>
      <b-row>
        <b-col>
          <br>
          <h4 v-if="listaArea.length <= 0">No hay registros</h4>
          <b-table v-else stacked="md"
                   :items="listaArea" 
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
                  @click="eliminarArea(data.item.area_id)" 
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
          <b-pagination v-if="listaArea.length > crudSettings.perPage"
                        align="center"
                        :total-rows="listaArea.length" 
                        :per-page="crudSettings.perPage" 
                        v-model="crudSettings.currentPage" />
        </b-col>
      </b-row>
    </b-card-body>

    <b-modal v-model="crudSettings.showModal"
             :title="tituloFuncionlidad">
      <b-row>
        <b-col>
          <b-form-group label="Nombre del area">
            <b-input v-model="area.form.area_nombre"></b-input>
          </b-form-group>
        </b-col>
      </b-row>
      <div slot="modal-footer">
        <b-btn class="float-right" variant="primary" @click="gestionarArea">
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
import MsgBox from '@/components/msg-box'

const CRUD_SETTIINGS = require('@/utils/crudSettings')

const AREA = {
  form: {
    area_id: '',
    area_nombre: ''
  },
  config: {
    area_id: {
      type: 'String',
      require: false,
      msg: 'Error interno'
    },
    area_nombre: {
      type: 'String',
      require: false,
      msg: 'Nombre del area'
    }
  }
}

export default {
  name: 'funcionalidad-area',
  components: { MsgBox },
  data: function() {
    return {
      tituloFuncionlidad: 'Gestionar Areas',
      crudSettings: JSON.parse(JSON.stringify(CRUD_SETTIINGS)),
      area: JSON.parse(JSON.stringify(AREA)),
      listaArea: [],
      fields: [
        { key: 'area_nombre', label: 'Nombre del Area', sortable: true },
        { key: 'acciones', label: 'Acciones' }
      ]
    }
  },
  watch: {
    'crudSettings.showModal': function(newValue) {
      if (newValue) {
        return
      }

      Vue.nextTick(() => {
        this.area = JSON.parse(JSON.stringify(AREA))
        this.crudSettings.msgBtn = 'Registrar'
      })
    }
  },
  methods: {
    getAreasWs: function() {
      return this.$axios
        .$get('/area/list')
        .then(resp => {
          this.listaArea = resp
        })
        .catch(error => {})
    },
    sendModificar: function(area) {
      delete area.createdAt
      delete area.updatedAt

      this.area.form = area
      this.crudSettings.msgBtn = 'Guardar Cambios'
      this.crudSettings.showModal = !this.crudSettings.showModal
    },
    gestionarArea: function() {
      // if(this.validarCampos) { }
      return this.$axios
        .$post('/area/gestionar', this.area.form)
        .then(resp => {
          this.$toastr.success(resp.msg, 'OK')
          this.crudSettings.showModal = !this.crudSettings.showModal
        })
        .catch(error => {
          this.$toastr.error(error.msg, 'ERROR')
        })
        .then(() => {
          this.getAreasWs()
        })
    },
    eliminarArea: function(area_id) {
      this.$confirm({
        title: this.tituloFuncionlidad,
        content: '¿Está seguro que desea eliminar el area seleccionada?'
      })
        .then(success => {
          return this.$axios
            .$post('/area/eliminar', { area_id: area_id })
            .then(resp => {
              this.$toastr.success(resp.msg, 'OK')
            })
            .catch(error => {
              this.$toastr.error(error.msg, 'ERROR')
            })
            .then(() => {
              this.getAreasWs()
            })
        })
        .catch(cancel => {
          this.$toastr.info('Solicitud cancelada', 'INFO')
        })
    }
  },
  created: function() {
    this.getAreasWs()
  }
}
</script>

<style scoped>
</style>
