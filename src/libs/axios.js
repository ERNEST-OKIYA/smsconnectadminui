import Vue from 'vue'

// axios
import axios from 'axios'

const axiosIns = axios.create({
  // You can add your headers here
  // ================================
  // baseURL: '/api/',
  baseURL: 'https://app.smsconnect.co.ke:2777/api/',
  // baseURL: 'https://bulkdev.swifttdial.com:2778/api/',
  // baseURL: 'http://dev.mtrack.localhost:8000/api/',
  timeout: 5000,
  // headers: {'X-Custom-Header': 'foobar'}
})

Vue.prototype.$http = axiosIns

export default axiosIns
