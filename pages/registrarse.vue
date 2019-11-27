<template>
  <div>
    <register 
      v-if="send" 
      :msg="msg" 
      :doc="doc"/>
    <template v-else>
      <div class="app flex-row align-items-center">
        <div class="container">
          <b-row class="justify-content-center">
            <b-col 
              md="6" 
              sm="8">
              <b-card 
                no-body 
                class="mx-4">
                <b-card-body class="p-4">
                  <b-form>
                    <h1>Registro</h1>
                    <p class="text-muted">Crear credenciales</p>
                    <b-input-group class="mb-3">
                      <b-input-group-prepend>
                        <b-input-group-text>
                          <i class="icon-user"/>
                        </b-input-group-text>
                      </b-input-group-prepend>
                      <b-form-input
                        ref="user"
                        v-model="doc"
                        type="text"
                        class="form-control"
                        placeholder="Documento"
                      />
                    </b-input-group>

                    <b-button 
                      variant="success" 
                      block 
                      @click="validarDocumento">Continuar</b-button>
                  </b-form>
                </b-card-body>
              </b-card>
            </b-col>
          </b-row>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import Register from '@/components/pages/Register'

export default {
  asyncData: function({ query, $axios, error }) {},
  layout: 'clean',
  components: {
    Register
  },
  data: function() {
    return {
      doc: null,
      send: false,
      msg: ''
    }
  },
  methods: {
    validarDocumento: function() {
      if (!this.doc) {
        this.$toastr.error('Ingrese número de documento para continuar.')
        return
      }

      return this.$axios
        .get('/api/usuario_excluded/consultar_registrado', {
          params: {
            doc: this.doc
          }
        })
        .then(resp => {
          this.msg = resp.data
          this.send = true
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style scoped>
</style>
