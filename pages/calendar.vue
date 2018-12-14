<template>
  <vue-scheduler :events="events"/>
</template>

<script>
export default {
  data: function() {
    return {
      events: [
        {
          date: '2018-12-04',
          startTime: '13:00',
          endTime: '15:00',
          color: '#1ddc1a'
        },
        {
          date: '2018-12-04',
          startTime: '13:00',
          endTime: '15:00',
          color: 'red'
        },
        {
          date: '2018-12-05',
          startTime: '13:00',
          endTime: '15:00',
          color: 'orange'
        },
        {
          date: '2018-12-06',
          startTime: '13:00',
          endTime: '15:00',
          color: 'blue'
        }
      ]
    }
  }
}
</script>

<style scoped>
</style>
