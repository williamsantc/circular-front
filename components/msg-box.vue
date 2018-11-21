<template>
  <b-modal title="aaa Area"
            v-model="bootstrapMsgBox.showModal">

  </b-modal>
</template>

<script>
export default {
  name: 'boostrapMsgBox',
  data: function () {
    return {
      bootstrapMsgBox: {
        showModal: false
      }
    }
  },
  methods: {
    toogle: function () {
      this.bootstrapMsgBox.showModal = !this.bootstrapMsgBox.showModal
    }
  }
}
</script>

<style scoped>

</style>
