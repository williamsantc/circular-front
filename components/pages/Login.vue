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
                  <p class="text-muted">Ingrese con su número de documento</p>
                  <b-input-group class="mb-3">
                    <b-input-group-prepend><b-input-group-text><i class="icon-user"></i></b-input-group-text></b-input-group-prepend>
                    <b-form-input type="number" class="form-control" placeholder="Numero de documento"/>
                  </b-input-group>
                  <b-row>
                    <b-col cols="6">
                      
                    </b-col>
                    <b-col cols="6" class="text-right">
                      <b-button variant="primary" class="px-4"><i class="fa fa-sign-in" aria-hidden="true"></i> Ingresar</b-button>
                    </b-col>
                  </b-row>
                </b-form>
              </b-card-body>
            </b-card>
            <b-card no-body class="text-white bg-primary py-5 d-md-down-none" style="width:44%">
              <b-card-body class="text-center">
                <div>
                  <h2>Asimilación pensum 2018</h2>
                  <p>Aplicación desarrollada para la simulación de la POSIBLE asimilación al nuevo plan de estudios.</p>
                  <p><b>Desarrollado por:</b> William de Jesús Santos Calú</p>
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

export default {
  name: 'Login',
  data: function () {
    return {
      listaRegistrados: []
    }
  },
  computed: {

  },
  methods: {

  },
  created: function () {

  }
    
}

</script>
