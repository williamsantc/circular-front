<template>
  <div class="container">
    <error404 v-if="error.statusCode === 404"/>
    <error500 v-else-if="error.statusCode === 500"/>
  </div>
</template>

<script>
import error404 from '@/components/pages/Page404'
import error500 from '@/components/pages/Page500'

export default {
  components: {
    error404,
    error500
  },
  props: {
    error: {
      type: Object,
      default: () => {}
    }
  },
  layout: 'clean' // you can set a custom layout for the error page
}
</script>