import axios from '@axios'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchUsers(ctx, queryParams) {
      return new Promise((resolve, reject) => {
        axios
          .get('/users/staff', { params: queryParams })
          .then(response => {
            resolve(response)
          })
          .catch(error => reject(error))
      })
    },
    fetchUser(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/users/staff/${id}`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    addUser(ctx, userData) {
      return new Promise((resolve, reject) => {
        axios
          .post('/users/create-tenant-manager', userData)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    editUser(ctx, userData) {
      const { id } = userData
      return new Promise((resolve, reject) => {
        axios
          .patch(`/users/edit-user/${id}`, userData)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
  },
}
