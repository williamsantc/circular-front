<template>
  <b-card>
    <b-card-header>
      <h4>Almacenar circular</h4>
    </b-card-header>
    <b-card-body>
      <b-row>
        <b-col md="6" order="2" order-sm="1">
          <b-btn variant="outline-primary"
                 @click="crudSettings.toogleFilter = !crudSettings.toogleFilter"
                 aria-controls="collapseFilter">
            <i class="fa fa-search" aria-hidden="true"></i> filtro de búsqueda 
            <i :class="(crudSettings.toogleFilter ? 'fa fa-angle-up': 'fa fa-angle-down')" aria-hidden="true"></i>
          </b-btn>
        </b-col>
        <b-col md="6" order="1" order-sm="2" align="right">
          <b-btn variant="primary"
                 @click="crudSettings.showModal = !crudSettings.showModal">
            <i class="fa fa-plus" aria-hidden="true"></i> Almacenar
        </b-btn>
        </b-col>
      </b-row>

      <b-modal v-model="crudSettings.showModal"
             :title="tituloFuncionlidad">
      <b-row>
        <b-col>
          <b-form-group label="Circular a almacenar">
            <multiselect v-model="circular" 
                           :options="listaCircularSelect" 
                           placeholder="Seleccione una opción" 
                           label="trackBy"
                           :show-labels="false"
                           ref="circ_id"
                           track-by="trackBy">
              </multiselect>
          </b-form-group>
          <b-form-group label="Descripción para almacenar">
            <b-form-textarea placeholder="Ingrese descripcion"
                           :rows="6"
                           no-resize
                           @keydown.native="validarCantidadCaracteres($event, almacenar.form.alma_descripcion, 200)"
                           ref="alma_descripcion"
                           v-model="almacenar.form.alma_descripcion"
                           :max-rows="6">

          </b-form-textarea>
          </b-form-group>
          <b-form-group label="Cargar Circular">
            <b-form-file v-model="almacenar.form.alma_file" 
                         :state="Boolean(almacenar.form.alma_file)" 
                         ref="alma_file"
                         placeholder="Seleccione la circular a almacenar"
                         accept="application/pdf"></b-form-file>
          </b-form-group>
        </b-col>
      </b-row>
      <div slot="modal-footer">
        <b-btn class="float-right" variant="primary" @click="gestionarAlmacenar">
          {{ crudSettings.msgBtn }}
        </b-btn>
      </div>
    </b-modal>
    </b-card-body>
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

const ALMACENAR = {
  form: {
    circ_id: '',
    alma_id: '',
    alma_file: null,
    alma_descripcion: ''
  },
  config: {
    alma_id: {
      type: 'String',
      required: false,
      msg: 'Error interno'
    },
    circ_id: {
      type: 'Select',
      required: true,
      msg: 'Circular'
    },
    alma_descripcion: {
      type: 'String',
      required: true,
      msg: 'Descripción',
      limite: 200
    },
    alma_file: {
      type: 'File',
      required: true,
      msg: 'Archivo PDF',
      accept: ['application/pdf'],
      maxSize: 5242880
    }
  }
}

export default {
  name: 'almacenar',
  mixins: [validarForm],
  data: function() {
    return {
      tituloFuncionlidad: 'Almacenar Circular',
      crudSettings: JSON.parse(JSON.stringify(CRUD_SETTIINGS)),
      almacenar: JSON.parse(JSON.stringify(ALMACENAR)),
      listaCircular: [],
      circular: null
    }
  },
  computed: {
    listaCircularSelect: function() {
      return this.listaCircular.map(circular => ({
        ...circular,
        trackBy: circular.circ_id + ' - ' + circular.circ_asunto
      }))
    }
  },
  watch: {
    circular: function(newValue) {
      this.almacenar.form.circ_id = newValue ? newValue.circ_id : ''
    }
  },
  methods: {
    pru: function() {
      location.href = '/api/almacenar/get'
    },
    gestionarAlmacenar: function() {
      if (!this.validarCampos(this.almacenar)) {
        return
      }

      let form = new FormData()

      for (let name in this.almacenar.form) {
        form.append(name, this.almacenar.form[name])
      }

      return this.$axios
        .$post('/api/almacenar/save', form, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(resp => {})
    },
    getCircularWs: function() {
      return this.$axios
        .$get('/api/circular/list')
        .then(resp => {
          this.listaCircular = resp
          this.crudSettings.toogleFilter = false
        })
        .catch(error => {
          console.log(error)
        })
    }
  },
  beforeMount: function() {
    this.getCircularWs()
    this.pru()
  }
}
</script>

<style scoped>
</style>
