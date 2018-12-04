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
            <i class="fa fa-search" aria-hidden="true"></i> filtro de búsqueda
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
        <b-row>
          <b-col>
            <b-row>
              <b-col md="4">
                <b-form-group label="Buscar por documento">
                  <b-input v-model="filtro.documento"></b-input>
                </b-form-group>
              </b-col>
              <b-col md="8">
                <b-form-group label="Buscar por nombre y/o apellido">
                  <b-input v-model="filtro.nombre"></b-input>
                </b-form-group>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-collapse>
      <br>
      <b-alert show variant="info" v-if="listaUsuario.length <= 0">No hay registros</b-alert>
      <b-table
        v-else
        stacked="md"
        :items="listaUsuario"
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
          <b-btn
            variant="danger"
            size="sm"
            @click="eliminarUsuario(data.item.usua_id)"
            title="Eliminar"
          >
            <i class="fa fa-trash" aria-hidden="true"></i>
          </b-btn>
        </template>
      </b-table>
      <b-pagination
        v-if="listaUsuario.length > crudSettings.perPage"
        align="center"
        :total-rows="listaUsuario.length"
        :per-page="crudSettings.perPage"
        v-model="crudSettings.currentPage"
      />
      <b-modal v-model="crudSettings.showModal" :title="tituloFuncionlidad">
        <b-form-group label="Número de documento:">
          <b-input v-model="usuario.form.usua_documento" ref="usua_documento"></b-input>
        </b-form-group>
        <b-form-group label="Nombre(s):">
          <b-input v-model="usuario.form.usua_nombre" ref="usua_nombre"></b-input>
        </b-form-group>
        <b-form-group label="Apellido(s):">
          <b-input v-model="usuario.form.usua_apellido" ref="usua_apellido"></b-input>
        </b-form-group>
        <b-form-group label="Correo electrónico:">
          <b-input type="email" v-model="usuario.form.usua_correo" ref="usua_correo"></b-input>
        </b-form-group>
        <b-form-group label="Roles:">
          <b-form-checkbox-group v-model="usuario.form.rol" :options="listaRoles"></b-form-checkbox-group>
        </b-form-group>
        <div slot="modal-footer">
          <b-btn
            class="float-right"
            variant="primary"
            @click="gestionarUsuario"
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

const USUARIO = {
  form: {
    usua_id: '',
    usua_nombre: '',
    usua_apellido: '',
    usua_documento: '',
    usua_correo: '',
    rol: []
  },
  config: {
    usua_id: {
      type: 'String',
      required: false,
      msg: 'Error interno'
    },
    usua_documento: {
      type: 'String',
      required: true,
      msg: 'Documento'
    },
    usua_nombre: {
      type: 'String',
      required: true,
      msg: 'Nombre'
    },
    usua_apellido: {
      type: 'String',
      required: true,
      msg: 'Apellido'
    },
    usua_correo: {
      type: 'Email',
      required: true,
      msg: 'Correo electrónico'
    },
    rol: {
      type: 'Array',
      required: true,
      msg: 'Roles'
    }
  }
}

const FILTRO = {
  documento: '',
  nombre: ''
}

export default {
  mixins: [validarForm],
  data: function() {
    return {
      usuario: JSON.parse(JSON.stringify(USUARIO)),
      tituloFuncionlidad: 'Gestionar Usuario',
      crudSettings: JSON.parse(JSON.stringify(CRUD_SETTIINGS)),
      filtro: JSON.parse(JSON.stringify(FILTRO)),
      listaUsuario: [],
      listaRoles: [],
      fields: [
        { key: 'usua_documento', label: 'Nro. Documento', sortable: true },
        { key: 'usua_nombre', label: 'Nombre', sortable: true },
        { key: 'usua_apellido', label: 'Apellido', sortable: true },
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
        this.usuario = JSON.parse(JSON.stringify(USUARIO))
        this.crudSettings.msgBtn = 'Registrar'
      })
    }
  },
  methods: {
    eliminarUsuario: function(usua_id) {
      return this.$confirm({
        title: this.tituloFuncionlidad,
        content: '¿Está seguro que desea eliminar el usuario?'
      })
        .then(success => {
          return this.$axios
            .$post('/api/usuario/eliminar', { usua_id: usua_id })
            .then(resp => {
              this.$toastr[resp.variant](resp.msg, 'OK')
            })
            .catch(error => {
              this.$toastr.error(error.response.data.msg, 'ERROR')
            })
        })
        .catch(cancel => {
          this.$toastr.info('Solicitud cancelada', 'INFO')
        })
        .then(() => {
          this.getUsuariosWs()
        })
    },
    gestionarUsuario: function() {
      if (!this.validarCampos(this.usuario)) {
        return
      }

      this.$axios
        .$post('/api/usuario/gestionar', this.usuario.form)
        .then(resp => {
          this.$toastr.success(resp.msg, 'OK')
          this.crudSettings.showModal = !this.crudSettings.showModal
        })
        .catch(error => {
          console.log(error.response.data)
        })
        .then(() => {
          this.getUsuariosWs()
        })
    },
    getRolesWs: function() {
      return this.$axios
        .$get('/api/rol/list')
        .then(resp => {
          this.listaRoles = resp.map(rol => ({
            text: rol.rol_descripcion,
            value: rol.rol_id
          }))
        })
        .catch(error => {
          console.log(error.response.data)
        })
    },
    getUsuariosWs: function() {
      return this.$axios
        .$get('/api/usuario/list')
        .then(resp => {
          this.listaUsuario = resp
        })
        .catch(error => {
          console.log(error.response.data)
        })
    },
    sendModificar: function(usuario) {
      this.usuario.form = JSON.parse(JSON.stringify(usuario))
      this.usuario.form.rol = usuario.rol.map(rol => rol.rol_id)
      this.crudSettings.msgBtn = 'Guardar Cambios'
      this.crudSettings.showModal = !this.crudSettings.showModal
    }
  },
  beforeMount: function() {
    this.getRolesWs()
    this.getUsuariosWs()
  }
}
</script>

<style scoped>
</style>
