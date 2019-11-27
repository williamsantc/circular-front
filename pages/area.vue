<template>
  <b-card ref="gg">
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
          order-sm="2" 
          align="right">
          <b-btn 
            variant="primary" 
            @click="crudSettings.showModal = !crudSettings.showModal">
            <i 
              class="fa fa-plus" 
              aria-hidden="true"/> Nueva area
          </b-btn>
        </b-col>
      </b-row>
      <b-collapse 
        id="collapseFilter" 
        v-model="crudSettings.toogleFilter" 
        class="mt-2">
        <b-row>
          <b-col>
            <b-form-group label="Nombre del area a buscar">
              <b-input v-model="nombreSearch"/>
            </b-form-group>
          </b-col>
        </b-row>
      </b-collapse>
      <b-row>
        <b-col>
          <br>
          <b-alert 
            v-if="listaArea.length <= 0" 
            show 
            variant="info">No hay registros</b-alert>
          <b-table
            v-else
            :items="listaArea"
            :fields="fields"
            :per-page="crudSettings.perPage"
            :current-page="crudSettings.currentPage"
            stacked="md"
            striped
            hover
          >
            <template 
              slot="acciones" 
              slot-scope="data">
              <b-btn
                variant="primary"
                size="sm"
                class="mr-1"
                title="Modificar"
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
                @click="eliminarArea(data.item.area_id)"
              >
                <i 
                  class="fa fa-trash" 
                  aria-hidden="true"/>
              </b-btn>
            </template>
          </b-table>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-pagination
            v-if="listaArea.length > crudSettings.perPage"
            :total-rows="listaArea.length"
            :per-page="crudSettings.perPage"
            v-model="crudSettings.currentPage"
            align="center"
          />
        </b-col>
      </b-row>
    </b-card-body>

    <b-modal 
      v-model="crudSettings.showModal" 
      :title="tituloFuncionlidad">
      <b-row>
        <b-col>
          <b-form-group label="Nombre del area">
            <b-form-textarea
              ref="area_nombre"
              :rows="6"
              v-model="area.form.area_nombre"
              :max-rows="6"
              placeholder="Ingrese Nombre del area"
              no-resize
              @keydown.native="validarCantidadCaracteres($event, area.form.area_nombre, 200)"
            />
          </b-form-group>
        </b-col>
      </b-row>
      <div slot="modal-footer">
        <b-btn
          class="float-right"
          variant="primary"
          @click="gestionarArea"
        >{{ crudSettings.msgBtn }}</b-btn>
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

const AREA = {
  form: {
    area_id: '',
    area_nombre: ''
  },
  config: {
    area_id: {
      type: 'String',
      required: false,
      msg: 'Error interno'
    },
    area_nombre: {
      type: 'String',
      required: true,
      msg: 'Nombre del area',
      limite: 200
    }
  }
}

export default {
  name: 'FuncionalidadArea',
  mixins: [validarForm],
  data: function() {
    return {
      tituloFuncionlidad: 'Gestionar Areas',
      crudSettings: JSON.parse(JSON.stringify(CRUD_SETTIINGS)),
      area: JSON.parse(JSON.stringify(AREA)),
      listaArea: [],
      fields: [
        { key: 'area_nombre', label: 'Nombre del Area', sortable: true },
        { key: 'acciones', label: 'Acciones' }
      ],
      nombreSearch: ''
    }
  },
  watch: {
    nombreSearch: _.debounce(function(newValue) {
      this.getAreasWs()
    }, 500),
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
  created: function() {
    this.getAreasWs()
  },
  methods: {
    getAreasWs: function() {
      return this.$axios
        .get('/api/area/list', { params: { nombre: this.nombreSearch } })
        .then(resp => {
          this.listaArea = resp.data
        })
        .catch(error => {
          console.log('error')
        })
    },
    sendModificar: function(area) {
      this.area.form = JSON.parse(JSON.stringify(area))
      this.crudSettings.msgBtn = 'Guardar Cambios'
      this.crudSettings.showModal = !this.crudSettings.showModal
    },
    gestionarArea: function() {
      if (!this.validarCampos(this.area)) {
        return
      }
      return this.$axios
        .$post('/api/area/gestionar', this.area.form)
        .then(resp => {
          if (resp.processOk) {
            this.$toastr.success(resp.msg, 'OK')
          } else {
            this.$toastr.error(resp.msg, 'ERROR')
          }
          this.crudSettings.showModal = !this.crudSettings.showModal
        })
        .catch(error => {
          this.$toastr.error(error.response.data.msg, 'ERROR')
        })
        .then(() => {
          this.getAreasWs()
        })
    },
    eliminarArea: function(area_id) {
      return this.$confirm({
        title: this.tituloFuncionlidad,
        content: '¿Está seguro que desea eliminar el area seleccionada?'
      })
        .then(success => {
          return this.$axios
            .$post('/api/area/eliminar', { area_id: area_id })
            .then(resp => {
              this.$toastr.success(resp.msg, 'OK')
            })
            .catch(error => {
              this.$toastr.error(error.response.data.msg, 'ERROR')
            })
            .then(() => {
              this.getAreasWs()
            })
        })
        .catch(cancel => {
          this.$toastr.info('Solicitud cancelada', 'INFO')
        })
    }
  }
}
</script>

<style scoped>
</style>
