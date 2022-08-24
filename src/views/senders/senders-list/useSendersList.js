import { ref, watch, computed } from '@vue/composition-api'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
// Store
import store from '@/store'

export default function useSendersList() {
  // Use toast
  const toast = useToast()

  const refSenderListTable = ref(null)
  // Table Handlers
  const tableColumns = [
    // { key: 'campaign', sortable: true },
    { key: 'name', sortable: true },
    { key: 'type_name', label: 'Sender Type', sortable: true },
    { key: 'package_name', label: 'Attached Package Type', sortable: true },
    { key: 'package_id', label: 'Attached Package ID', sortable: true },
  ]
  const perPage = ref(10)
  const totalSenders = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [10, 25, 50, 100]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const isSortDirDesc = ref(true)
  const senderTypeFilter = ref(null)
  const isBusy = ref(false)

  const dataMeta = computed(() => {
    const localItemsCount = refSenderListTable.value ? refSenderListTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalSenders.value,
    }
  })

  const refetchData = () => {
    refSenderListTable.value.refresh()
  }

  watch([currentPage, perPage, searchQuery, senderTypeFilter], () => {
    refetchData()
  })

  const fetchSenders = (ctx, callback) => {
    isBusy.value = true
    store
      .dispatch('senders/fetchSendersList', {
        q: searchQuery.value,
        per_page: perPage.value,
        page: currentPage.value,
        sortBy: sortBy.value,
        sortDesc: isSortDirDesc.value,
        type: senderTypeFilter.value,
      })
      .then(response => {
        const { results, count } = response.data
        isBusy.value = false

        callback(results)
        totalSenders.value = count
      })
      .catch(() => {
        toast({
          component: ToastificationContent,
          props: {
            title: "Error fetching senders' list",
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
      })
  }

  // *===============================================---*
  // *--------- UI ---------------------------------------*
  // *===============================================---*

  const resolveSenderStatusVariantAndIcon = state => {
    if (state === 'SENT') return { variant: 'info', icon: 'PhoneIcon' }
    if (state === 'DELIVERED') return { variant: 'warning', icon: 'MailIcon' }
    return { variant: 'success', icon: 'PhoneIcon' }
  }
  const resolveSenderStatusVariant = state => {
    if (state === 'SENT') return { variant: 'info' }
    if (state === 'DELIVERED') return { variant: 'success' }
    if (state === 'ERRORED') return { variant: 'danger' }
    if (state === 'UNDELIVERED') return { variant: 'warning' }
    if (state === 'QUEUED') return { variant: 'secondary' }
    if (state === 'WAITING') return { variant: 'dark' }
    return { variant: 'primary' }
  }

  return {
    fetchSenders,
    perPage,
    currentPage,
    totalSenders,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refSenderListTable,
    tableColumns,
    senderTypeFilter,

    resolveSenderStatusVariantAndIcon,
    resolveSenderStatusVariant,
    refetchData,
    isBusy,
  }
}
