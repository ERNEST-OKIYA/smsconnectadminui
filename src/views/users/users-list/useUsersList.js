import { ref, watch, computed } from '@vue/composition-api'
import { title } from '@core/utils/filter'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import store from '@/store'

export default function useUsersList() {
  // Use toast
  const toast = useToast()

  const refUserListTable = ref(null)

  // Table Handlers
  const tableColumns = [
    { key: 'email' },
    { key: 'msisdn', label: 'Phone', sortable: true },
    { key: 'full_name', sortable: true, formatter: title },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'created_at', sortable: true },
    { key: 'role', label: 'Assigned Role', sortable: true },
    { key: 'last_login', sortable: true },
    { key: 'actions' },
  ]
  const perPage = ref(10)
  const totalUsers = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [10, 25, 50, 100]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const isSortDirDesc = ref(true)
  const statusFilter = ref(null)
  const isBusy = ref(false)

  const dataMeta = computed(() => {
    const localItemsCount = refUserListTable.value ? refUserListTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalUsers.value,
    }
  })

  const refetchData = () => {
    refUserListTable.value.refresh()
  }

  watch([currentPage, perPage, searchQuery, statusFilter], () => {
    refetchData()
  })

  const fetchUsers = (ctx, callback) => {
    isBusy.value = true
    store
      .dispatch('users/fetchUsers', {
        q: searchQuery.value,
        perPage: perPage.value,
        page: currentPage.value,
        sortBy: sortBy.value,
        sortDesc: isSortDirDesc.value,
        status: statusFilter.value,
      })
      .then(response => {
        const { results, count } = response.data

        callback(results)
        totalUsers.value = count
        isBusy.value = false
      })
      .catch(() => {
        toast({
          component: ToastificationContent,
          props: {
            title: "Error fetching users' list",
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
      })
  }

  // *===============================================---*
  // *--------- UI ---------------------------------------*
  // *===============================================---*

  const resolveUserStatusVariantAndIcon = status => {
    if (status === 'Pending') return { variant: 'warning', icon: 'PieChartIcon' }
    if (status === 'Active') return { variant: 'success', icon: 'CheckCircleIcon' }
    if (status === 'Inactive') return { variant: 'danger', icon: 'XIcon' }
    if (status === 'Draft') return { variant: 'primary', icon: 'SaveIcon' }
    if (status === 'Sent') return { variant: 'secondary', icon: 'SendIcon' }
    if (status === 'Past Due') return { variant: 'danger', icon: 'InfoIcon' }
    return { variant: 'secondary', icon: 'XIcon' }
  }
  const resolveUserAvatarVariant = status => {
    if (status === 'Active') return 'primary'
    if (status === 'Paid') return 'danger'
    if (status === 'Inactive') return 'secondary'
    if (status === 'Draft') return 'warning'
    if (status === 'Sent') return 'info'
    if (status === 'Past Due') return 'success'
    return 'primary'
  }

  return {
    fetchUsers,
    tableColumns,
    perPage,
    currentPage,
    totalUsers,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refUserListTable,
    isBusy,

    statusFilter,

    resolveUserStatusVariantAndIcon,
    resolveUserAvatarVariant,
    refetchData,
  }
}
