import Vue from 'vue'
import VueToastr2 from 'vue-toastr-2'
import vbMsgBox from 'bootstrap-vue-msgbox'
import 'vue-toastr-2/dist/vue-toastr-2.min.css'
import Editor from '@tinymce/tinymce-vue'
import Multiselect from 'vue-multiselect'

// Import VueScheduler
import VueScheduler from 'v-calendar-scheduler'

// Import styles
import 'v-calendar-scheduler/lib/main.css'

Vue.use(VueScheduler)

window.toastr = require('toastr')

Vue.use(VueToastr2, {
  preventDuplicates: true
})
Vue.use(vbMsgBox)

Vue.component('tiny-mce', Editor)
// register globally
Vue.component('multiselect', Multiselect)
