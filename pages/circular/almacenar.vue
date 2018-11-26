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

export default {
  name: 'almacenar',
  data: function (){
    return {
      tituloFuncionlidad: 'Almacenar Circular',
      crudSettings: JSON.parse(JSON.stringify(CRUD_SETTIINGS))
    }
  }
}
</script>

<style scoped>

</style>
