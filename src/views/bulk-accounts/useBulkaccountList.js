import { ref } from '@vue/composition-api'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
// Store
import store from '@/store'

export default function useBulkAccountList() {
  // Use toast
  const toast = useToast()
  const refBulkAccountListTable = ref(null)
  // Table Handlers
  const tableColumns = [
    // { key: 'campaign', sortable: true },
    { key: 'name', sortable: true },
    { key: 'type_name', label: 'Account Type', sortable: true },
    { key: 'balance', label: 'Units Balance', sortable: true },
    { key: 'in_use', sortable: true },
    { key: 'description', sortable: true },
    { key: 'actions' },
  ]
  const totalUnits = ref(0)
  const unassignedUnits = ref(0)
  const fetchBulkaccounts = (ctx, callback) => {
    store
      .dispatch('bulkaccounts/fetchBulkaccountsList')
      .then(response => {
        const results = response.data
        totalUnits.value = results[0].total
        unassignedUnits.value = results[0].unassigned_credits
        callback(results)
      })
      .catch(() => {
        toast({
          component: ToastificationContent,
          props: {
            title: "Error fetching bulkaccounts' list",
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
      })
  }
  const refetchData = () => {
    refBulkAccountListTable.value.refresh()
  }

  // *===============================================---*
  // *--------- UI ---------------------------------------*
  // *===============================================---*
  return {
    fetchBulkaccounts,
    refBulkAccountListTable,
    tableColumns,
    totalUnits,
    unassignedUnits,
    refetchData,
  }
}
