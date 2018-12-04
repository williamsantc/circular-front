<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <b-row class="justify-content-center">
        <b-col md="8">
          <b-card-group>
            <b-card no-body class="p-4">
              <b-card-body>
                <b-form>
                  <h1>Iniciar sesión</h1>
                  <p class="text-muted">Ingrese con su usuario y contraseña</p>
                  <b-input-group class="mb-3">
                    <b-input-group-prepend>
                      <b-input-group-text>
                        <i class="icon-user"></i>
                      </b-input-group-text>
                    </b-input-group-prepend>
                    <b-form-input
                      type="text"
                      v-model="user"
                      class="form-control"
                      placeholder="nombre de usuario"
                    />
                  </b-input-group>
                  <b-input-group class="mb-3">
                    <b-input-group-prepend>
                      <b-input-group-text>
                        <i class="icon-key"></i>
                      </b-input-group-text>
                    </b-input-group-prepend>
                    <b-form-input
                      type="password"
                      v-model="pass"
                      class="form-control"
                      placeholder="contraseña"
                    />
                  </b-input-group>
                  <b-row>
                    <b-col cols="6"></b-col>
                    <b-col cols="6" class="text-right">
                      <b-button variant="primary" @click="ingresar" class="px-4">
                        <i class="fa fa-sign-in" aria-hidden="true"></i> Ingresar
                      </b-button>
                    </b-col>
                  </b-row>
                </b-form>
              </b-card-body>
            </b-card>
            <b-card no-body class="text-white bg-primary py-5 d-md-down-none" style="width:44%">
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
  data: function () {
    return {
      user: '',
      pass: ''
    }
  },
  computed: {

  },
  methods: {
    ingresar: function () {
      if(this.isEmpty(this.user) || this.isEmpty(this.pass)) {
        console.log('vacio')
        this.$toastr.error('Campos incompletos', 'ERROR')
        return
      }

      let hashedPass = CryptoJS.SHA512(this.pass.trim()).toString(CryptoJS.enc.Hex)

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
    cargarEnAplicacion: function () {
      if(!this.isEmpty(this.$store.getters.accessToken)) {
          this.$toastr.success('Bienvenido, ' + this.$store.getters.dataUsuario.nombreCompleto, 'Aplicación circular')
          this.$router.push('/circular')
        }
    }
  },
  created: function () {
    this.cargarEnAplicacion()
  }
    
}

</script>
