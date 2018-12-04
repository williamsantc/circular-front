<template>
  <b-card ref="gg">
    <b-card-header>
      <h4>{{ tituloFuncionlidad }}</h4>
    </b-card-header>

    <b-card-body>
      <b-row align-h="between">
        <b-col md="4" sm="4" order="2" order-sm="1">
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
        <b-col md="4" sm="4" order-sm="2" align="right">
          <b-btn variant="primary" @click="crudSettings.showModal = !crudSettings.showModal">
            <i class="fa fa-plus" aria-hidden="true"></i> Nueva funcionalidad
          </b-btn>
        </b-col>
      </b-row>
      <b-collapse class="mt-2" v-model="crudSettings.toogleFilter" id="collapseFilter">
        <b-row>
          <b-col>
            <b-form-group label="Nombre de la funcionalidad a buscar">
              <b-input v-model="nombreSearch"></b-input>
            </b-form-group>
          </b-col>
        </b-row>
      </b-collapse>
      <b-row>
        <b-col>
          <br>
          <b-alert show variant="info" v-if="listaFuncionalidad.length <= 0">No hay registros</b-alert>
          <b-table
            v-else
            stacked="md"
            :items="listaFuncionalidad"
            :fields="fields"
            striped
            :per-page="crudSettings.perPage"
            :current-page="crudSettings.currentPage"
            hover
          >
            <template slot="acciones" slot-scope="data">
              <b-btn
                variant="primary"
                size="sm"
                class="mr-1"
                title="Modificar"
                @click="sendModificar(data.item)"
              >
                <i class="fa fa-pencil" aria-hidden="true"></i>
              </b-btn>
              <b-btn
                variant="danger"
                size="sm"
                @click="eliminar(data.item.func_id)"
                title="Eliminar"
              >
                <i class="fa fa-trash" aria-hidden="true"></i>
              </b-btn>
            </template>
          </b-table>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-pagination
            v-if="listaFuncionalidad.length > crudSettings.perPage"
            align="center"
            :total-rows="listaFuncionalidad.length"
            :per-page="crudSettings.perPage"
            v-model="crudSettings.currentPage"
          />
        </b-col>
      </b-row>
    </b-card-body>

    <b-modal v-model="crudSettings.showModal" :title="tituloFuncionlidad">
      <b-row>
        <b-col>
          <b-form-group label="Nombre de la funcionalidad">
            <b-input
              ref="func_descripcion"
              @keydown.native="validarCantidadCaracteres($event, funcionalidad.form.func_descripcion, 50)"
              v-model="funcionalidad.form.func_descripcion"
            ></b-input>
          </b-form-group>
          <b-form-group label="URL de la funcionalidad">
            <b-input
              v-model="funcionalidad.form.func_url"
              ref="func_url"
              @keydown.native="validarCantidadCaracteres($event, funcionalidad.form.func_url, 100)"
            ></b-input>
          </b-form-group>
          <b-form-group label="Tipo de funcionalidad">
            <b-select :options="listaTipo" ref="func_tipo" v-model="funcionalidad.form.func_tipo"></b-select>
          </b-form-group>
          <b-form-group label="Funcionalidad Padre">
            <multiselect
              v-model="funcionalidad.form.func_padre"
              :options="funcionalidadesPadre"
              placeholder="Seleccione una opción"
              label="func_descripcion"
              :show-labels="false"
              ref="func_padre"
              track-by="func_descripcion"
            ></multiselect>
          </b-form-group>
          <b-row>
            <b-col>
              <b-form-group label="Icono de la funcionalidad">
                <b-input-group>
                  <b-input-group-text slot="append">
                    <i :class="funcionalidad.form.func_icono" aria-hidden="true"></i>
                  </b-input-group-text>
                  <b-form-input
                    v-model="funcionalidad.form.func_icono"
                    ref="func_icono"
                    @keydown.native="validarCantidadCaracteres($event, funcionalidad.form.func_icono, 45)"
                  ></b-form-input>
                </b-input-group>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group label="Orden">
                <b-input
                  v-model="funcionalidad.form.func_orden"
                  ref="func_orden"
                  @keydown.native="validarCantidadCaracteres($event, funcionalidad.form.func_orden, 2)"
                  @keypress.native="validarKeyNumero"
                ></b-input>
              </b-form-group>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <div slot="modal-footer">
        <b-btn
          class="float-right"
          variant="primary"
          @click="gestionarFuncionalidad"
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

const FUNCIONALIDAD = {
  form: {
    func_id: '',
    func_descripcion: '',
    func_url: '',
    func_tipo: '',
    func_icono: '',
    func_padre: null,
    func_orden: ''
  },
  config: {
    func_id: {
      type: 'String',
      required: false,
      msg: 'Error interno'
    },
    func_descripcion: {
      type: 'String',
      required: true,
      limite: 50,
      msg: 'Nombre de la funcionalidad'
    },
    func_url: {
      type: 'String',
      required: true,
      limite: 100,
      msg: 'URL de la funcionalidad'
    },
    func_tipo: {
      type: 'Select',
      lista: [],
      required: true,
      msg: 'Tipo de funcionalidad'
    },
    func_icono: {
      type: 'String',
      required: true,
      limite: 45,
      msg: 'Icono'
    },
    func_padre: {
      type: 'Select',
      required: false,
      msg: 'Funcionalidad Padre'
    },
    func_orden: {
      type: 'Number',
      required: true,
      msg: 'Orden'
    }
  }
}

export default {
  name: 'gestionar-funcionalidad',
  mixins: [validarForm],
  data: function() {
    return {
      tituloFuncionlidad: 'Gestionar Funcionalidad',
      crudSettings: JSON.parse(JSON.stringify(CRUD_SETTIINGS)),
      funcionalidad: JSON.parse(JSON.stringify(FUNCIONALIDAD)),
      listaFuncionalidad: [],
      fields: [
        {
          key: 'func_descripcion',
          label: 'Nombre de la funcionalidad',
          sortable: true
        },
        { key: 'func_url', label: 'URL' },
        { key: 'func_tipo', label: 'Tipo' },
        { key: 'padre.func_descripcion', label: 'Funcionalidad Padre' },
        { key: 'func_orden', label: 'Orden', sortable: true },
        { key: 'acciones', label: 'Acciones' }
      ],
      listaTipo: ['ICONO', 'FUNCIONALIDAD'],
      nombreSearch: ''
    }
  },
  computed: {
    funcionalidadesPadre: function() {
      return this.listaFuncionalidad.filter(
        funcionalidad => funcionalidad.func_tipo === 'ICONO'
      )
    }
  },
  watch: {
    nombreSearch: _.debounce(function(newValue) {
      this.getFuncionalidadWs()
    }, 500),
    'crudSettings.showModal': function(newValue) {
      if (newValue) {
        return
      }

      Vue.nextTick(() => {
        this.funcionalidad = JSON.parse(JSON.stringify(FUNCIONALIDAD))
        this.funcionalidad.config.func_tipo.lista = this.listaTipo
        this.crudSettings.msgBtn = 'Registrar'
      })
    }
  },
  methods: {
    getFuncionalidadWs: function() {
      return this.$axios
        .get('/api/funcionalidad/list', {
          params: { nombre: this.nombreSearch }
        })
        .then(resp => {
          this.listaFuncionalidad = resp.data
        })
        .catch(error => {
          console.log('error')
        })
    },
    sendModificar: function(funcionalidad) {
      this.funcionalidad.form = JSON.parse(JSON.stringify(funcionalidad))
      this.funcionalidad.form.func_padre = this.funcionalidad.form.padre
      this.crudSettings.msgBtn = 'Guardar Cambios'
      this.crudSettings.showModal = !this.crudSettings.showModal
    },
    gestionarFuncionalidad: function() {
      if (!this.validarCampos(this.funcionalidad)) {
        return
      }

      if (!this.isEmpty(this.funcionalidad.form.func_padre)) {
        this.funcionalidad.form.func_padre = this.funcionalidad.form.func_padre.func_id
      }

      return this.$axios
        .$post('/api/funcionalidad/gestionar', this.funcionalidad.form)
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
          this.getFuncionalidadWs()
        })
    },
    eliminar: function(func_id) {
      return this.$confirm({
        title: this.tituloFuncionlidad,
        content:
          '¿Está seguro que desea eliminar la funcionalidad seleccionada?'
      })
        .then(success => {
          return this.$axios
            .$post('/api/funcionalidad/eliminar', { func_id: func_id })
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
  },
  created: function() {
    this.funcionalidad.config.func_tipo.lista = this.listaTipo
    this.getFuncionalidadWs()
  }
}
</script>

<style scoped>
</style>
