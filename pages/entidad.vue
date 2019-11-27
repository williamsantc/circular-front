<template>
  <b-card ref="gg">
    <b-card-header>
      <h4>{{ tituloFuncionlidad }}</h4>
    </b-card-header>

    <b-card-body>
      <b-row>
        <b-col 
          md="6" 
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
          md="6" 
          order="1" 
          order-sm="2" 
          align="right">
          <b-btn 
            variant="primary" 
            @click="crudSettings.showModal = !crudSettings.showModal">
            <i 
              class="fa fa-plus" 
              aria-hidden="true"/> Nueva entidad
          </b-btn>
        </b-col>
      </b-row>
      <b-collapse 
        id="collapseFilter" 
        v-model="crudSettings.toogleFilter" 
        class="mt-2">
        <b-row>
          <b-col>
            <b-form-group label="Nombre de la entidad a buscar">
              <b-input v-model="nombreSearch"/>
            </b-form-group>
          </b-col>
        </b-row>
      </b-collapse>
      <b-row>
        <b-col>
          <br>
          <b-alert 
            v-if="listaEntidad.length <= 0" 
            show 
            variant="info">No hay registros</b-alert>
          <b-table
            v-else
            :items="listaEntidad"
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
                @click="eliminarArea(data.item.enti_id)"
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
            v-if="listaEntidad.length > crudSettings.perPage"
            :total-rows="listaEntidad.length"
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
          <b-form-group label="Nombre de la entidad">
            <b-form-textarea
              ref="enti_nombre"
              :rows="6"
              v-model="entidad.form.enti_nombre"
              :max-rows="6"
              placeholder="Ingrese asunto de la entidad"
              no-resize
              @keydown.native="validarCantidadCaracteres($event, entidad.form.enti_nombre, 200)"
            />
          </b-form-group>
        </b-col>
      </b-row>
      <div slot="modal-footer">
        <b-btn
          class="float-right"
          variant="primary"
          @click="gestionarEntidad"
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
      msg: 'Nombre de la entidad',
      limite: 200
    }
  }
}

export default {
  name: 'FuncionalidadEntidad',
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
  created: function() {
    this.getEntidadesWs()
  },
  methods: {
    getEntidadesWs: function() {
      return this.$axios
        .get('/api/entidad/list', { params: { nombre: this.nombreSearch } })
        .then(resp => {
          this.listaEntidad = resp.data
        })
        .catch(error => {
          console.log(error.response.data)
        })
    },
    sendModificar: function(entidad) {
      this.entidad.form = JSON.parse(JSON.stringify(entidad))
      this.crudSettings.msgBtn = 'Guardar Cambios'
      this.crudSettings.showModal = !this.crudSettings.showModal
    },
    gestionarEntidad: function() {
      if (!this.validarCampos(this.entidad)) {
        return
      }
      return this.$axios
        .$post('/api/entidad/gestionar', this.entidad.form)
        .then(resp => {
          if (resp.processOk) {
            this.$toastr.success(resp.msg, 'OK')
          } else {
            this.$toastr.error(resp.msg, 'ERROR')
          }
          this.crudSettings.showModal = !this.crudSettings.showModal
        })
        .catch(error => {
          console(error.response.data)
          this.$toastr.error(error.response.data.msg, 'ERROR')
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
            .$post('/api/entidad/eliminar', { enti_id: enti_id })
            .then(resp => {
              this.$toastr.success(resp.msg, 'OK')
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
    }
  }
}
</script>

<style scoped>
</style>
