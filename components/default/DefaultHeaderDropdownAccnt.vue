<template>
  <AppHeaderDropdown right no-caret>
    <template slot="header">
      <img
        src="~/static/img/avatars/user.png"
        class="img-avatar"
        :title="$store.getters.dataUsuario.nombreCompleto"
        alt="Usuario" />
    </template>\
    <template slot="dropdown">
      <b-dropdown-header tag="div" class="text-center"><strong>Cuenta</strong></b-dropdown-header>
      <b-dropdown-item><i class="fa fa-user-circle-o" /> {{ $store.getters.dataUsuario.nombreCompleto }}
      </b-dropdown-item>
      <b-dropdown-item @click="cerrarSesion"><i class="fa fa-sign-out" /> Cerrar sesión
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
    return { itemsCount: 42 }
  },
  methods: {
    cerrarSesion: function () {
      this.$store.dispatch('cerrarSesion')
      this.$router.push('/login')
    }
  }
}
</script>
