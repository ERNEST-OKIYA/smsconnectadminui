<template>
<div>
  <!-- Table Container Card -->
  <b-card
    no-body
  >
  <div class="pt-2 pb-2 ml-2">
    <b-row>
      <b-col cols="3">
        TOTAL UNITS: <b-badge variant="success" class="ml-1">{{totalUnits.toLocaleString()}}</b-badge>
      </b-col>
      <b-col cols="3">
        UNASSIGNED: <b-badge variant="secondary" class="ml-1">{{unassignedUnits.toLocaleString()}}</b-badge>
      </b-col>
      <b-col cols="3" offset="3">
        <b-button
        v-if="unassignedUnits > 0"
        v-b-modal.assign-units-modal
        variant="primary"
        class="ml-4"
        >
          Assign Units
        </b-button>
      </b-col>
    </b-row>
  </div>
  <b-table
      id="bulkaccount-list-table"
      ref="refBulkAccountListTable"
      :items="fetchBulkaccounts"
      :fields="tableColumns"
      responsive
      primary-key="id"
      show-empty
      bordered
      :outlined="true"
      empty-text="No matching records found"
      class="position-relative"
    >
    <!-- Column: Promotional Credits -->
      <template #cell(balance)="data">
        <span class="text-nowrap">
          <b-badge
          :id="`bulkaccounts-type-${data.item.id}-balance`"
          variant="secondary"
          >
          {{ data.item.balance.toLocaleString() }}
          </b-badge>
        </span>
      </template>
      <!-- Column: Actions -->
      <template #cell(actions)="data">

        <div class="text-nowrap">
          <!-- Dropdown -->
          <b-dropdown
            variant="link"
            toggle-class="p-0"
            no-caret
            :right="$store.state.appConfig.isRTL"
          >

            <template #button-content>
              <feather-icon
                icon="MoreVerticalIcon"
                size="16"
                class="align-middle text-body"
              />
            </template>
            <b-dropdown-item v-b-modal.move-units-modal  @click="updateSelectedAccountType(data.item.type)">
              <feather-icon icon="ChevronsRightIcon"
              class="text-success"
              />
              <span class="align-middle ml-50">Move Units</span>
            </b-dropdown-item>
          </b-dropdown>
        </div>
      </template>
    </b-table>
    </b-card>
    <!-- add units -->
    <b-modal
      id="assign-units-modal"
      title="Assign Units"
      ok-title="Assign"
      cancel-variant="outline-secondary"
    >
      <b-form>
        <b-form-group
          label="Choose Account"
          label-for="select-account"
        >
          <v-select
          class="account-type-filter-select"
            id="select-account"
            v-model="bulkAccounts.type"
            :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
            :options="BulkAccountsOptions"
            label="name"
            :clearable="false"
            :reduce="name => name.value"
            placeholder="Select Account Type"
          />
        </b-form-group>
        <b-form-group
          label="Total Units"
          label-for="bulk-units"
        >
          <b-form-input
            id="total-units"
            type="number"
            placeholder="Bulk Units"
            v-model="bulkAccounts.units"
          />
        </b-form-group>
      </b-form>
    </b-modal>
    <!-- add units -->
    <b-modal
      id="move-units-modal"
      title="Move Units"
      ok-title="Move"
      cancel-variant="outline-secondary"
      @ok="moveUnits"
    >
      <b-form>
        <b-form-group
          label="Move From"
          label-for="select-account"
        >
          <v-select
          class="account-type-filter-select"
            id="select-account"
            v-model="bulkAccounts.type"
            :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
            :options="BulkAccountsOptions"
            label="name"
            :clearable="false"
            :reduce="name => name.value"
            placeholder="Select Account Type"
            disabled
          />
        </b-form-group>
        <b-form-group
          label="Total Units"
          label-for="bulk-units"
        >
          <b-form-input
            id="total-units"
            type="number"
            placeholder="Bulk Units"
            v-model="bulkAccounts.units"
          />
        </b-form-group>
      </b-form>
    </b-modal>
</div>
</template>

<script>
import {
  BCard, BTable, BBadge, BRow, BDropdown, BDropdownItem,
  BCol, BModal, BFormGroup, BFormInput, BButton, BForm,
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import { onUnmounted, ref } from '@vue/composition-api'
import bulkAccountStoreModule from './bulkAccountStoreModule'
import useBulkAccountList from './useBulkaccountList'
import store from '@/store'

export default {
  components: {
    BCard,
    BTable,
    BDropdown,
    BDropdownItem,
    BBadge,
    BRow,
    BCol,
    BModal,
    BFormGroup,
    BFormInput,
    BButton,
    BForm,
    vSelect,
  },
  setup() {
    const BULKACCOUNT_STORE_MODULE_NAME = 'bulkaccounts'

    // Register module
    if (!store.hasModule(BULKACCOUNT_STORE_MODULE_NAME)) store.registerModule(BULKACCOUNT_STORE_MODULE_NAME, bulkAccountStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(BULKACCOUNT_STORE_MODULE_NAME)) store.unregisterModule(BULKACCOUNT_STORE_MODULE_NAME)
    })
    const {
      fetchBulkaccounts,
      tableColumns,
      refBulkAccountListTable,
      totalUnits,
      unassignedUnits,
      refetchData,
      // resolveBulkAccountStatusVariantAndIcon,
    } = useBulkAccountList()
    const BulkAccountsOptions = [
      { name: 'Promotional', value: 1 },
      { name: 'Transactional', value: 2 },
    ]
    const blankBulkAccounts = {
      units: 0,
      type: 1,
    }
    const bulkAccounts = ref(JSON.parse(JSON.stringify(blankBulkAccounts)))
    const updateSelectedAccountType = accountType => {
      bulkAccounts.value.type = accountType
    }
    const resetBulkAccounts = () => {
      bulkAccounts.value = JSON.parse(JSON.stringify(blankBulkAccounts))
    }
    const moveUnits = () => {
      store
        .dispatch('bulkaccounts/moveUnits', JSON.parse(JSON.stringify(bulkAccounts)).value)
        .then(response => {
          refetchData()
          resetBulkAccounts()
          console.log('Created', response)
        })
        .catch(response => {
          console.log('error', response)
        })
    }
    return {
      fetchBulkaccounts,
      refetchData,
      tableColumns,
      refBulkAccountListTable,
      totalUnits,
      unassignedUnits,
      BulkAccountsOptions,
      bulkAccounts,
      updateSelectedAccountType,
      moveUnits,
      resetBulkAccounts,
    }
  },
}
</script>
<style lang="scss" scoped>
.account-type-filter-select {
  min-width: 190px;

  ::v-deep .vs__selected-options {
    flex-wrap: nowrap;
  }

  ::v-deep .vs__selected {
    width: 100px;
  }
}
</style>
<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
