import { ref, watch, computed } from '@vue/composition-api'
// import router from '@/router'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import store from '@/store'

export default function useOutboxList() {
  // Use toast
  const toast = useToast()

  const refOutboxListTable = ref(null)
  // Table Handlers
  const tableColumns = [
    // { key: 'campaign', sortable: true },
    { key: 'sender', sortable: true },
    { key: 'operator', sortable: true },
    { key: 'state', label: 'Status', sortable: true },
    { key: 'recipient', sortable: true },
    { key: 'message', sortable: true },
    { key: 'sms_count', label: 'Message Length', sortable: true },
    { key: 'created_at', label: 'Sent At', sortable: true },
    { key: 'show_details', label: 'Actions' },
    // { key: 'actions' },
  ]
  const perPage = ref(10)
  const totalOutbox = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [10, 25, 50, 100]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const isSortDirDesc = ref(true)
  const statusFilter = ref(null)
  const organisationFilter = ref(null)
  const organisationOptions = ref([])
  const isBusy = ref(false)

  const dataMeta = computed(() => {
    const localItemsCount = refOutboxListTable.value ? refOutboxListTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalOutbox.value,
    }
  })

  const refetchData = () => {
    refOutboxListTable.value.refresh()
  }

  watch([currentPage, perPage, searchQuery, statusFilter, organisationFilter], () => {
    refetchData()
  })

  const fetchOutbox = (ctx, callback) => {
    isBusy.value = true
    store
      .dispatch('outbox/fetchOutboxList', {
        q: searchQuery.value,
        per_page: perPage.value,
        page: currentPage.value,
        sortBy: sortBy.value,
        sortDesc: isSortDirDesc.value,
        state: statusFilter.value,
        org_id: organisationFilter.value,
        api: true,
      })
      .then(response => {
        const { results, count } = response.data
        isBusy.value = false

        callback(results)
        totalOutbox.value = count
      })
      .catch(() => {
        toast({
          component: ToastificationContent,
          props: {
            title: "Error fetching outboxs' list",
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
      })
  }
  const fetchOrganisations = () => {
    isBusy.value = true
    store
      .dispatch('outbox/fetchOrganisationsList')
      .then(response => {
        const results = response.data
        organisationOptions.value = results
      })
      .catch(() => {
        toast({
          component: ToastificationContent,
          props: {
            title: "Error fetching organisation list' list",
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
      })
  }

  // *===============================================---*
  // *--------- UI ---------------------------------------*
  // *===============================================---*

  const resolveOutboxStatusVariantAndIcon = state => {
    if (state === 'SENT') return { variant: 'info', icon: 'PhoneIcon' }
    if (state === 'DELIVERED') return { variant: 'warning', icon: 'MailIcon' }
    return { variant: 'success', icon: 'PhoneIcon' }
  }
  const resolveOutboxStatusVariant = state => {
    if (state === 'SENT') return { variant: 'info' }
    if (state === 'DELIVERED') return { variant: 'success' }
    if (state === 'ERRORED') return { variant: 'danger' }
    if (state === 'UNDELIVERED') return { variant: 'warning' }
    if (state === 'QUEUED') return { variant: 'secondary' }
    if (state === 'WAITING') return { variant: 'dark' }
    return { variant: 'primary' }
  }

  return {
    fetchOutbox,
    perPage,
    currentPage,
    totalOutbox,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refOutboxListTable,

    statusFilter,
    organisationFilter,
    tableColumns,

    resolveOutboxStatusVariantAndIcon,
    resolveOutboxStatusVariant,
    refetchData,
    isBusy,
    fetchOrganisations,
    organisationOptions,
  }
}
