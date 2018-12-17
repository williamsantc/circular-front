<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <b-row class="justify-content-center">
        <b-col md="6" sm="8" v-if="msg === 'OK'">
          <b-card no-body class="mx-4">
            <b-card-body class="p-4">
              <b-form>
                <h1>Registro</h1>
                <p class="text-muted">Crea tu cuenta en la aplicación</p>
                <b-input-group class="mb-3">
                  <b-input-group-prepend>
                    <b-input-group-text>
                      <i class="icon-user"></i>
                    </b-input-group-text>
                  </b-input-group-prepend>
                  <b-form-input
                    type="text"
                    v-model="reg.user"
                    ref="user"
                    class="form-control"
                    placeholder="Usuario"
                    autocomplete="username"
                  />
                </b-input-group>

                <b-input-group class="mb-3">
                  <b-input-group-prepend>
                    <b-input-group-text>
                      <i class="icon-lock"></i>
                    </b-input-group-text>
                  </b-input-group-prepend>
                  <b-form-input
                    type="password"
                    class="form-control"
                    ref="pass"
                    v-model="reg.pass"
                    placeholder="Contraseña"
                    autocomplete="new-password"
                  />
                </b-input-group>

                <b-input-group class="mb-4">
                  <b-input-group-prepend>
                    <b-input-group-text>
                      <i class="icon-lock"></i>
                    </b-input-group-text>
                  </b-input-group-prepend>
                  <b-form-input
                    type="password"
                    class="form-control"
                    ref="conf"
                    v-model="reg.conf"
                    placeholder="Repetir contraseña"
                    autocomplete="new-password"
                  />
                </b-input-group>

                <b-button variant="success" @click="crearCuenta" block>Crer Cuenta</b-button>
              </b-form>
            </b-card-body>
          </b-card>
        </b-col>
        <b-col v-else md="6">
          <div class="clearfix">
            <h1 class="float-left display-3 mr-4">
              <i class="icon-check" aria-hidden="true"></i>
            </h1>
            <h4 class="pt-3">{{ msg }}.</h4>
            <p class="text-muted">Volver a la página principal.</p>
            <nuxt-link to="/">Página Principal</nuxt-link>
          </div>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import CryptoJS from 'crypto-js'
import validarForm from '@/mixins/validarForm'

const REG = {
  user: '',
  pass: '',
  conf: ''
}

export default {
  name: 'Register',
  mixins: [validarForm],
  props: {
    msg: {
      type: String,
      required: true,
      default: null
    },
    doc: {
      type: String,
      required: true,
      default: null
    }
  },
  data: function() {
    return {
      reg: JSON.parse(JSON.stringify(REG))
    }
  },
  methods: {
    cargarEnAplicacion: function() {
      if (!this.isEmpty(this.$store.getters.accessToken)) {
        this.$toastr.success('Bienvenido', 'Aplicación circular')
        this.$router.push('/circular')
      }
    },
    crearCuenta: function() {
      if (!this.validarCamposLogin()) {
        return
      }

      let usuario = {
        usua_documento: this.doc,
        usua_usuario: this.reg.user,
        usua_password: CryptoJS.SHA512(this.reg.pass.trim()).toString(
          CryptoJS.enc.Hex
        )
      }

      return this.$axios
        .post('/api/usuario_excluded/finalizar_registro', usuario)
        .then(resp => {
          this.$toastr.success(resp.data, 'OK')
          this.$router.push('/login')
        })
        .catch(err => {
          this.$toastr.error(err.response.data, 'ERROR')
        })
    },
    validarCamposLogin: function() {
      // Verifica el nombre de usuario

      this.reg.user.trim()
      this.reg.pass.trim()
      this.reg.conf.trim()

      if (this.reg.user.length <= 0) {
        this.$toastr.error(
          'Debe ingresar un nombre de usuario. Por favor, inténtelo de nuevo',
          'ERROR'
        )
        this.$refs.user.focus()
        return false
      }

      let re = null

      re = /^\w+$/
      if (!re.test(this.reg.user)) {
        this.$toastr.error(
          'El nombre de usuario deberá contener solo letras, números y guiones bajos. Por favor, inténtelo de nuevo',
          'ERROR'
        )
        this.$refs.user.focus()
        return false
      }

      // Verifica que la contraseña tenga la extensión correcta (mín. 6 caracteres)
      // La verificación se duplica a continuación, pero se incluye para que el
      // usuario tenga una guía más específica.
      if (this.reg.pass.length < 6) {
        this.$toastr.error(
          'La contraseña deberá tener al menos 6 caracteres. Por favor, inténtelo de nuevo',
          'ERROR'
        )
        this.$refs.pass.focus()
        return false
      }

      // Por lo menos un número, una letra minúscula y una mayúscula
      // Al menos 6 caracteres

      re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/
      if (!re.test(this.reg.pass)) {
        this.$toastr.error(
          'La contraseña deberá contener al menos un número, una letra minúscula y una mayúscula. Por favor, inténtelo de nuevo',
          'ERROR'
        )
        this.$refs.pass.focus()
        return false
      }

      // Verifica que la contraseña y la confirmación sean iguales
      if (this.reg.pass != this.reg.conf) {
        this.$toastr.error(
          'La contraseña y la confirmación no coinciden. Por favor, inténtelo de nuevo',
          'ERROR'
        )
        this.$refs.conf.focus()
        return false
      }

      return true
    }
  },
  created: function() {
    this.cargarEnAplicacion()
  }
}
</script>
