<template>
  <b-card>
    <b-card-header>
      <h4>{{ tituloFuncionlidad }}</h4>
    </b-card-header>
    <b-card-body>
      <b-row>
        <b-col>
          <b-form-group label="Asunto:">
            <b-form-textarea
              ref="circ_asunto"
              :rows="3"
              v-model="circular.form.circ_asunto"
              :max-rows="6"
              placeholder="Ingrese asunto de la circular"
              no-resize
            />
          </b-form-group>
          <b-form-group label="Contenido Circular:">
            <tiny-mce
              ref="circ_contenido"
              v-model="circular.form.circ_contenido"
              :init="initTinyMce"
              :api-key="apiTiny"
            />
          </b-form-group>
          <b-row>
            <b-col md="6">
              <b-form-group label="Area:">
                <multiselect
                  ref="area_id"
                  v-model="area"
                  :options="listaArea"
                  placeholder="Seleccione una opción"
                  label="area_nombre"
                  track-by="area_nombre"
                />
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group label="Entidad:">
                <multiselect
                  ref="enti_id"
                  v-model="entidad"
                  :options="listaEntidad"
                  placeholder="Seleccione una opción"
                  label="enti_nombre"
                  track-by="enti_nombre"
                />
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="6">
              <b-form-group label="Responsable:">
                <multiselect
                  ref="resp_id"
                  v-model="responsable"
                  :options="listaResponsable"
                  placeholder="Seleccione una opción"
                  label="resp_nombre"
                  track-by="resp_nombre"
                />
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group label="Fecha emisión:">
                <b-input 
                  ref="circ_fecha" 
                  v-model="circular.form.circ_fecha" 
                  type="date"/>
              </b-form-group>
            </b-col>
          </b-row>
          <b-form-group label="Anexos:">
            <tiny-mce
              ref="circ_anexos"
              v-model="circular.form.circ_anexos"
              :init="initTinyMce"
              :api-key="apiTiny"
            />
          </b-form-group>
        </b-col>
      </b-row>
    </b-card-body>
    <b-card-footer>
      <b-row>
        <b-col>
          <b-btn 
            variant="default" 
            @click="$router.push('/circular')">Volver</b-btn>
        </b-col>
        <b-col align="right">
          <b-btn 
            variant="primary" 
            @click="gestionarCircular">{{ btnText }}</b-btn>
        </b-col>
      </b-row>
    </b-card-footer>
  </b-card>
</template>

<script>
import validarForm from '@/mixins/validarForm'

// Aqui estan los metodos que consumen los Ws
import circularMixin from '@/mixins/circularMixin'

const CIRCULAR = {
  form: {
    circ_id: '',
    circ_asunto: '',
    circ_contenido: '',
    area_id: '',
    resp_id: '',
    enti_id: '',
    circ_anexos: '',
    circ_fecha: ''
  },
  config: {
    circ_id: {
      type: 'String',
      required: false,
      msg: 'Error interno'
    },
    circ_asunto: {
      type: 'String',
      required: true,
      msg: 'Asunto'
    },
    circ_contenido: {
      type: 'Html',
      required: true,
      msg: 'Contenido'
    },
    area_id: {
      type: 'Select',
      required: true,
      msg: 'Area'
    },
    resp_id: {
      type: 'Select',
      required: true,
      msg: 'Responsable'
    },
    enti_id: {
      type: 'Select',
      required: true,
      msg: 'Entidad'
    },
    circ_anexos: {
      type: 'Html',
      required: false,
      msg: 'Anexos'
    },
    circ_fecha: {
      type: 'Date',
      required: true,
      soloHabiles: true,
      msg: 'Fecha'
    }
  }
}

export default {
  name: 'CircularGestionar',
  mixins: [validarForm, circularMixin],
  data: function() {
    return {
      apiTiny: 'gawdxg9y9xrk02tl5nlsgpqjjulh02zig2uo3sylmfplygul',
      initTinyMce: {
        plugins: [
          'textcolor link paste visualchars charmap table preview lists wordcount'
        ],
        relative_urls: false,
        remove_script_host: false,
        toolbar:
          'bold italic underline strikethrough |' +
          ' alignleft aligncenter alignright alignjustify | ' +
          ' bullist numlist | outdent indent | formatselect | ' +
          ' fontselect | fontsizeselect | paste pastetext | ' +
          ' undo redo | link unlink anchor | table | ' +
          ' hr removeformat visualchars | subscript superscript',
        menubar: false
      },
      tituloFuncionlidad: 'Gestionar Circular',
      circular: JSON.parse(JSON.stringify(CIRCULAR)),
      btnText: 'Registrar'
    }
  },
  watch: {
    area: function(newValue) {
      this.circular.form.area_id = newValue ? newValue.area_id : ''
    },
    entidad: function(newValue) {
      this.circular.form.enti_id = newValue ? newValue.enti_id : ''
    },
    responsable: function(newValue) {
      this.circular.form.resp_id = newValue ? newValue.resp_id : ''
    }
  },
  beforeMount: function() {
    this.cargarListasForaneas().then(() => {
      if (this.$route.params.circular) {
        this.circular.form = this.$route.params.circular
        this.entidad = this.$route.params.circular.entidad
        this.responsable = this.$route.params.circular.responsable
        this.area = this.$route.params.circular.area
        this.btnText = 'Guardar cambios'
      }
    })
  },
  methods: {
    gestionarCircular: function() {
      if (!this.validarCampos(this.circular)) {
        return
      }
      return this.$axios
        .$post('/api/circular/gestionar', this.circular.form)
        .then(resp => {
          this.$toastr.success(resp.msg, 'OK')
          this.$router.push('/circular')
        })
        .catch(error => {
          this.$toastr.error(error.response.data.msg, 'ERROR')
        })
    }
  }
}
</script>

<style scoped>
</style>
