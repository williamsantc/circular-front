<template>
  <AppHeaderDropdown 
    right 
    no-caret>
    <template slot="header">
      <img
        :title="nombreCompleto"
        src="~/static/img/avatars/user.png"
        class="img-avatar"
        alt="Usuario"
      >
    </template>\
    <template slot="dropdown">
      <b-dropdown-header 
        tag="div" 
        class="text-center">
        <strong>Cuenta</strong>
      </b-dropdown-header>
      <b-dropdown-item>
        <i class="fa fa-user-circle-o"/>
        {{ nombreCompleto }}
      </b-dropdown-item>
      <b-dropdown-item @click="toggleRol">
        <i class="fa fa-address-card"/>
        Cambiar Rol
      </b-dropdown-item>
      <b-dropdown-item @click="cerrarSesion">
        <i class="fa fa-sign-out"/> Cerrar sesión
      </b-dropdown-item>
    </template>
  </AppHeaderDropdown>
</template>

<script>
import { HeaderDropdown as AppHeaderDropdown } from '@coreui/vue'
export default {
  name: 'DefaultHeaderDropdownAccnt',
  components: {
    AppHeaderDropdown
  },
  data: () => {
    return { toggleModal: false }
  },
  computed: {
    nombreCompleto: function() {
      return (
        this.$store.getters.dataUsuario.usua_nombre +
        ' ' +
        this.$store.getters.dataUsuario.usua_apellido
      )
    }
  },
  methods: {
    cerrarSesion: function() {
      this.$store.dispatch('cerrarSesion')
      this.$router.push('/login')
    },
    toggleRol: function() {
      this.$emit('change-rol-request')
    }
  }
}
</script>
