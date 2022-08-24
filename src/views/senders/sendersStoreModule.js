import axios from '@axios'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchSendersList(ctx, queryParams) {
      return new Promise((resolve, reject) => {
        axios
          .get('/senders', { params: queryParams })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    fetchSender(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/sender/${id}`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
  },
}
