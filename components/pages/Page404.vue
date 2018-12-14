<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <b-row class="justify-content-center">
        <b-col md="6">
          <div class="clearfix">
            <h1 class="float-left display-3 mr-4">404</h1>
            <h4 class="pt-3">Oops! Algo salió mal.
              <i class="fa fa-frown-o" aria-hidden="true"></i>
            </h4>
            <p class="text-muted">La página que buscabas no fue encontrada.</p>
            <nuxt-link to="/">Página Principal</nuxt-link>
          </div>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Page404'
}
</script>
