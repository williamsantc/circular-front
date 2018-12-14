<template>
  <b-card>
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
            <i class="fa fa-search" aria-hidden="true"></i> Filtrar búsqueda
            <i
              :class="(crudSettings.toogleFilter ? 'fa fa-angle-up': 'fa fa-angle-down')"
              aria-hidden="true"
            ></i>
          </b-btn>
        </b-col>
        <b-col md="4" sm="4" order-sm="2" align="right">
          <b-btn variant="primary" @click="crudSettings.showModal = !crudSettings.showModal">
            <i class="fa fa-plus" aria-hidden="true"></i> Nuevo Usuario
          </b-btn>
        </b-col>
      </b-row>
      <b-collapse class="mt-2" v-model="crudSettings.toogleFilter" id="collapseFilter">
        <b-form-group label="Buscar por Descripción">
          <b-input v-model="filtro.descripcion"></b-input>
        </b-form-group>
      </b-collapse>
      <br>
      <b-alert show variant="info" v-if="listaRol.length <= 0">No hay registros</b-alert>
      <b-table
        v-else
        stacked="md"
        :items="listaRol"
        :fields="fields"
        striped
        :per-page="crudSettings.perPage"
        :current-page="crudSettings.currentPage"
        hover
      >
        <template slot="acciones" slot-scope="data">
          <b-btn
            variant="primary"
            class="mr-1"
            size="sm"
            title="Modificar"
            @click="sendModificar(data.item)"
          >
            <i class="fa fa-pencil" aria-hidden="true"></i>
          </b-btn>
          <b-btn variant="danger" size="sm" @click="eliminarRol(data.item.rol_id)" title="Eliminar">
            <i class="fa fa-trash" aria-hidden="true"></i>
          </b-btn>
        </template>
      </b-table>
      <b-pagination
        v-if="listaRol.length > crudSettings.perPage"
        align="center"
        :total-rows="listaRol.length"
        :per-page="crudSettings.perPage"
        v-model="crudSettings.currentPage"
      />
      <b-modal v-model="crudSettings.showModal" :title="tituloFuncionlidad">
        <b-form-group label="Descripción:">
          <b-input v-model="rol.form.rol_descripcion" ref="rol_descripcion"></b-input>
        </b-form-group>
        <b-form-group label="Roles:">
          <b-row>
            <b-col sm="6">
              <b-form-checkbox-group
                v-model="rol.form.funcionalidadTemp"
                stacked
                :options="listaFuncionalidad.slice(0, listaFuncionalidad.length / 2)"
              ></b-form-checkbox-group>
            </b-col>
            <b-col sm="6">
              <b-form-checkbox-group
                v-model="rol.form.funcionalidadTemp"
                stacked
                :options="listaFuncionalidad.slice(listaFuncionalidad.length / 2) "
              ></b-form-checkbox-group>
            </b-col>
          </b-row>
        </b-form-group>
        <div slot="modal-footer">
          <b-btn
            class="float-right"
            variant="primary"
            @click="gestionarRol"
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
import _ from 'lodash'
import validarForm from '@/mixins/validarForm'
import Vue from 'vue'

const CRUD_SETTIINGS = require('@/utils/crudSettings')

const ROL = {
  form: {
    rol_id: '',
    rol_descripcion: '',
    funcionalidad: [],
    funcionalidadTemp: []
  },
  config: {
    rol_descripcion: {
      type: 'String',
      required: true,
      msg: 'Descripción'
    },
    funcionalidadTemp: {
      type: 'Array',
      required: true,
      msg: 'Lista funcionalidad'
    }
  }
}

const FILTRO = {
  descripcion: ''
}

export default {
  mixins: [validarForm],
  data: function() {
    return {
      rol: JSON.parse(JSON.stringify(ROL)),
      tituloFuncionlidad: 'Gestionar Rol',
      crudSettings: JSON.parse(JSON.stringify(CRUD_SETTIINGS)),
      filtro: JSON.parse(JSON.stringify(FILTRO)),
      listaFuncionalidad: [],
      listaRol: [],
      fields: [
        { key: 'rol_descripcion', label: 'Descripción', sortable: true },
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
        this.rol = JSON.parse(JSON.stringify(ROL))
        this.crudSettings.msgBtn = 'Registrar'
      })
    }
  },
  methods: {
    gestionarRol: function() {
      if (!this.validarCampos(this.rol)) {
        return
      }

      let listaFuncReplace = []
      let listaPadres = []

      this.rol.form.funcionalidadTemp.forEach(func => {
        if (func.funcPadre_id) {
          if (!listaFuncReplace.includes(func.funcPadre_id)) {
            listaFuncReplace.push(func.funcPadre_id)
          }
          listaFuncReplace.push(func.funcHija_id)
        } else {
          listaFuncReplace.push(func)
        }
      })

      this.rol.form.funcionalidad = listaFuncReplace

      console.log(this.rol.form)

      return this.$axios
        .$post('/api/rol/gestionar', this.rol.form)
        .then(resp => {
          this.$toastr.success(resp.msg)
          this.crudSettings.showModal = !this.crudSettings.showModal
        })
        .catch(err => {
          console.log(err.response.data)
        })
        .then(() => {
          this.getRolesWs()
        })
    },
    sendModificar: function(object) {
      let temp = object.funcionalidad.filter(func => func.func_padre === null)

      this.rol.form = JSON.parse(JSON.stringify(object))

      this.rol.form.funcionalidadTemp = this.generarArrayGestion(temp).map(
        filt => filt.value
      )

      console.log(this.rol.form)
      this.crudSettings.msgBtn = 'Guardar Cambios'
      this.crudSettings.showModal = !this.crudSettings.showModal
    },
    eliminarRol: function(rol_id) {
      return this.$confirm({
        title: this.tituloFuncionlidad,
        content: '¿Está seguro que desea eliminar el rol seleccionado?'
      })
        .then(success => {
          return this.$axios
            .$post('/api/rol/eliminar', { rol_id: rol_id })
            .then(resp => {
              this.$toastr.success(resp.msg, 'OK')
            })
            .catch(error => {
              this.$toastr.error(error.response.data.msg, 'ERROR')
            })
            .then(() => {
              this.getResponsablesWs()
            })
        })
        .catch(cancel => {
          this.$toastr.info('Solicitud cancelada', 'INFO')
        })
    },
    getRolesWs: function() {
      return this.$axios
        .$get('/api/rol/list')
        .then(resp => {
          this.listaRol = resp
        })
        .catch(error => {
          console.log(error.response.data)
        })
    },
    getFuncionalidadesWs: function() {
      return this.$axios
        .$get('/api/funcionalidad/listar_func_hijas')
        .then(resp => {
          this.listaFuncionalidad = this.generarArrayGestion(resp)

          console.log(this.listaFuncionalidad)
        })
        .catch(error => {
          console.log(error.response.data)
        })
    },
    generarArrayGestion(listaFunc) {
      let funcionalidades = []
      listaFunc.forEach(func => {
        if (func.hijas.length > 0) {
          func.hijas.forEach(funcHija => {
            funcionalidades.push({
              text:
                funcHija.func_descripcion +
                ' (Padre: ' +
                func.func_descripcion +
                ')',
              value: {
                funcPadre_id: func.func_id,
                funcHija_id: funcHija.func_id
              }
            })
          })
        } else {
          funcionalidades.push({
            text: func.func_descripcion,
            value: func.func_id
          })
        }
      })

      return funcionalidades
    }
  },
  mounted: function() {
    this.getRolesWs()
    this.getFuncionalidadesWs()
  }
}
</script>

<style scoped>
</style>
