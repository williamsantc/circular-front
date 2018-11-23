<template>
  <b-card>

  </b-card>
</template>

<script>
export default {
  data: function() {
    return {
      initTinyMce: {
        plugins: [
          'textcolor link paste visualchars charmap table preview lists'
        ],
        relative_urls: false,
        remove_script_host: false,
        toolbar:
          'bold italic underline strikethrough |' +
          ' alignleft aligncenter alignright alignjustify | ' +
          ' bullist numlist | outdent indent | formatselect | ' +
          ' fontselect | fontsizeselect | paste pastetext | ' +
          ' undo redo | link unlink anchor | table | ' +
          ' hr removeformat visualchars | subscript superscript | charmap preview ',
        menubar: false
      }
    }
  }
}
</script>

<style scoped>
</style>
