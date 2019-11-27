<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <b-row class="justify-content-center">
        <b-col md="8">
          <b-card-group>
            <b-card
              no-body
              class="p-4">
              <b-card-body>
                <b-form>
                  <h1>Iniciar sesión</h1>
                  <p class="text-muted">Ingrese con su usuario y contraseña</p>
                  <b-input-group class="mb-3">
                    <b-input-group-prepend>
                      <b-input-group-text>
                        <i class="icon-user"/>
                      </b-input-group-text>
                    </b-input-group-prepend>
                    <b-form-input
                      v-model="user"
                      type="text"
                      class="form-control"
                      placeholder="nombre de usuario"
                    />
                  </b-input-group>
                  <b-input-group class="mb-3">
                    <b-input-group-prepend>
                      <b-input-group-text>
                        <i class="icon-key"/>
                      </b-input-group-text>
                    </b-input-group-prepend>
                    <b-form-input
                      v-model="pass"
                      type="password"
                      class="form-control"
                      placeholder="contraseña"
                    />
                  </b-input-group>
                  <b-row>
                    <b-col cols="6"/>
                    <b-col
                      cols="6"
                      class="text-right">
                      <b-button
                        variant="primary"
                        class="px-4"
                        @click="ingresar">
                        <i
                          class="fa fa-sign-in"
                          aria-hidden="true"/> Ingresar
                      </b-button>
                    </b-col>
                  </b-row>
                </b-form>
              </b-card-body>
            </b-card>
            <b-card
              no-body
              class="text-white bg-primary py-5 d-md-down-none"
              style="width:44%">
              <b-card-body class="text-center">
                <div>
                  <h2>Circular</h2>
                  <p>Aplicación para el manejo de circulares de la secretaría de educación.</p>
                </div>
              </b-card-body>
            </b-card>
          </b-card-group>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import CryptoJS from 'crypto-js'
import validarForm from '@/mixins/validarForm'

export default {
  name: 'Login',
  mixins: [validarForm],
  data: function() {
    return {
      user: '',
      pass: ''
    }
  },
  computed: {},
  created: function() {
    this.cargarEnAplicacion()
  },
  methods: {
    ingresar: function() {
      if (this.isEmpty(this.user) || this.isEmpty(this.pass)) {
        console.log('vacio')
        this.$toastr.error('Campos incompletos', 'ERROR')
        return
      }

      let hashedPass = CryptoJS.SHA512(this.pass.trim()).toString(
        CryptoJS.enc.Hex
      )

      let paypload = {
        user: this.user,
        pass: hashedPass
      }

      this.$store.dispatch('login', paypload).then(() => {
        this.$store.dispatch('cargarFuncionalidades').then(() => {
          this.cargarEnAplicacion()
        })
      })
    },
    cargarEnAplicacion: function() {
      if (!this.isEmpty(this.$store.getters.accessToken)) {
        this.$toastr.success('Bienvenido', 'Aplicación circular')
        this.$router.push('/bienvenido')
      }
    }
  }
}
</script>
