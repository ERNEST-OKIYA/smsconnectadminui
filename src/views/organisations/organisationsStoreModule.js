import axios from '@axios'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchOrganisationsList(ctx, queryParams) {
      return new Promise((resolve, reject) => {
        axios
          .get('/organisations/list', { params: queryParams })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    fetchOrganisation(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/organisations/${id}/details`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    createOrganisation(ctx, payload) {
      return new Promise((resolve, reject) => {
        axios
          .post('organisations/create', payload)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    editOrganisation(ctx, payload) {
      return new Promise((resolve, reject) => {
        axios
          .put('organisations/edit', payload)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    editBulkAccount(ctx, payload) {
      return new Promise((resolve, reject) => {
        axios
          .put('organisations/bulk-account-edit', payload)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    addSenders(ctx, payload) {
      return new Promise((resolve, reject) => {
        axios
          .post('organisations/add-senders', payload)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    topUpBulk(ctx, payload) {
      return new Promise((resolve, reject) => {
        axios
          .post('organisations/topup-bulk', payload)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
  },
}
