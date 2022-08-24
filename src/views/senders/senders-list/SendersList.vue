<template>
<div>
  <!-- Table Container Card -->
  <b-card
    no-body
  >
  <div class="m-2">
      <!-- Table Top -->
      <b-row>
        <!-- Per Page -->
        <b-col
          cols="12"
          md="6"
          class="d-flex align-items-center justify-content-start mb-1 mb-md-0"
        >
          <label>Entries</label>
          <v-select
            v-model="perPage"
            :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
            :options="perPageOptions"
            :clearable="false"
            class="per-page-selector d-inline-block ml-50 mr-1"
          />
          <!-- <b-button
            variant="primary"
            @click="isAddNewSenderSidebarActive = true"
          >
            <span  class="text-nowrap">Add New Sender</span>
          </b-button> -->
        </b-col>

        <!-- Search -->
        <b-col
          cols="12"
          md="6"
        >
          <div class="d-flex align-items-center justify-content-end">
            <b-form-input
              v-model="searchQuery"
              class="d-inline-block mr-1"
              placeholder="Search..."
            />
            <v-select
              v-model="senderTypeFilter"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              :options="senderTypeOptions"
              label="name"
              :reduce="name => name.value"
              class="sender-filter-select"
              placeholder="Select Type"
            >
            </v-select>
          </div>
        </b-col>
      </b-row>

    </div>

    <b-table
      id="sender-list-table"
      ref="refSenderListTable"
      :items="fetchSenders"
      :fields="tableColumns"
      responsive
      primary-key="id"
      :sort-by.sync="sortBy"
      show-empty
      bordered
      :outlined="true"
      empty-text="No matching records found"
      :sort-desc.sync="isSortDirDesc"
      class="position-relative"
    >
    <template #table-busy>
        <div class="text-center text-primary my-2">
          <b-spinner class="align-middle"></b-spinner>
          <strong class="p-2"> Loading...</strong>
        </div>
    </template>
      <!-- Column: Package -->
      <template #cell(package_name)="data">
        <span class="text-nowrap">
          {{data.item.package.name}}
        </span>
      </template>
      <!-- Column: Package ID -->
      <template #cell(package_id)="data">
        <span class="text-nowrap">
          <b-badge
          variant="dark"
          >
          {{data.item.package.package_id}}
          </b-badge>
        </span>
      </template>
    </b-table>
    <div class="mx-2 mb-2">
      <b-row>

        <b-col
          cols="12"
          sm="6"
          class="d-flex align-items-center justify-content-center justify-content-sm-start"
        >
          <span class="text-muted">Showing {{ dataMeta.from }} to {{ dataMeta.to }} of {{ dataMeta.of }} entries</span>
        </b-col>
        <!-- Pagination -->
        <b-col
          cols="12"
          sm="6"
          class="d-flex align-items-center justify-content-center justify-content-sm-end"
        >

          <b-pagination
            v-model="currentPage"
            :total-rows="totalSenders"
            :per-page="perPage"
            first-number
            last-number
            class="mb-0 mt-1 mt-sm-0"
            prev-class="prev-item"
            next-class="next-item"
          >
            <template #prev-text>
              <feather-icon
                icon="ChevronLeftIcon"
                size="18"
              />
            </template>
            <template #next-text>
              <feather-icon
                icon="ChevronRightIcon"
                size="18"
              />
            </template>
          </b-pagination>

        </b-col>

      </b-row>
    </div>
  </b-card>
</div>
</template>

<script>
import {
  BCard, BRow, BCol,
  BFormInput, BTable, BSpinner,
  BPagination,
  BBadge,
} from 'bootstrap-vue'
// import { avatarText } from '@core/utils/filter'
import vSelect from 'vue-select'
import Ripple from 'vue-ripple-directive'
import { onUnmounted } from '@vue/composition-api'
// import { title } from '@utils/filters'
import store from '@/store'
import useSendersList from './useSendersList'

import sendersStoreModule from '../sendersStoreModule'

export default {
  components: {
    BCard,
    BRow,
    BCol,
    BFormInput,
    BTable,
    BSpinner,
    BBadge,
    // BButton,
    // BMedia,
    // BAvatar,
    // BLink,
    // BBadge,
    // BDropdown,
    // BDropdownItem,
    BPagination,

    vSelect,
  },
  directives: {
    Ripple,
  },
  setup() {
    const SENDER_STORE_MODULE_NAME = 'senders'

    // Register module
    if (!store.hasModule(SENDER_STORE_MODULE_NAME)) store.registerModule(SENDER_STORE_MODULE_NAME, sendersStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(SENDER_STORE_MODULE_NAME)) store.unregisterModule(SENDER_STORE_MODULE_NAME)
    })

    // const isAddNewSenderSidebarActive = ref(false)
    const senderTypeOptions = [
      { name: 'Promotional', value: 1 },
      { name: 'Transactional', value: 2 },
    ]
    const {
      fetchSenders,
      perPage,
      tableColumns,
      currentPage,
      totalSenders,
      dataMeta,
      perPageOptions,
      searchQuery,
      senderTypeFilter,
      sortBy,
      isSortDirDesc,
      refSenderListTable,
      refetchData,
      isBusy,

      // resolveSenderStatusVariantAndIcon,
    } = useSendersList()

    return {
      fetchSenders,
      tableColumns,
      perPage,
      currentPage,
      totalSenders,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refSenderListTable,
      senderTypeOptions,
      senderTypeFilter,

      refetchData,
      isBusy,

      // avatarText,
      // resolveSenderStatusVariantAndIcon,
      // isAddNewSenderSidebarActive,
    }
  },
}
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}

.sender-filter-select {
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
