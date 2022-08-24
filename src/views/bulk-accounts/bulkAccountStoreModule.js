import axios from '@axios'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchBulkaccountsList(ctx, queryParams) {
      return new Promise((resolve, reject) => {
        axios
          .get('/bulk-accounts/', { params: queryParams })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    fetchBulkAccount(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/bulk-accounts/${id}`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    moveUnits(ctx, payload) {
      return new Promise((resolve, reject) => {
        axios
          .post('bulk-accounts/move-units', payload)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
  },
}
