import Vue from 'vue'
import VueToastr2 from 'vue-toastr-2'
import vbMsgBox from 'bootstrap-vue-msgbox'
import 'vue-toastr-2/dist/vue-toastr-2.min.css'
import Editor from '@tinymce/tinymce-vue'

window.toastr = require('toastr')
 
Vue.use(VueToastr2)
Vue.use(vbMsgBox)

Vue.component('tiny-mce', Editor)