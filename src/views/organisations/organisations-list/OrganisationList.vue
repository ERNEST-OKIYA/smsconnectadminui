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
            @click="isAddNewOrganisationSidebarActive = true"
          >
            <span  class="text-nowrap">Add New Organisation</span>
          </b-button> -->
        </b-col>

        <!-- Search -->
        <b-col
          cols="12"
          md="6"
        >
          <div class="d-flex align-items-center justify-content-center">
            <b-form-input
              v-model="searchQuery"
              class="d-inline-block mr-1"
              placeholder="Search by Name or Billing Email"
            />
            <b-button
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              variant="primary"
              :to="{ name: 'organisations-add-new' }"
              class=""
            >
              <span class="text-nowrap">Add New Organisation</span>
          </b-button>
          </div>
        </b-col>
      </b-row>

    </div>

    <b-table
      id="organisation-list-table"
      ref="refOrganisationListTable"
      :items="fetchOrganisations"
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
    <template #cell(name)="data">
        <b-link
          :to="{ name: 'organisations-view', params: { id: data.item.id }}"
          class="font-weight-bold"
        >
          {{ data.value }}
        </b-link>
      </template>
      <!-- Column: Promotional Credits -->
      <template #cell(promotional_credits)="data">
        <span class="text-nowrap">
          <b-badge
          :id="`organisation-row-${data.item.id}-promotional-credits`"
          variant="success"
          >
          {{ data.item.bulk_account.promotional_credits.toLocaleString() }}
          </b-badge>
          <b-tooltip
            title="Sms Lemgth"
            class="cursor-pointer"
            :target="`organisation-row-${data.item.id}-promotional-credits`"
            placement="topright"
          >
          <p class="mb-0">
            SMS Units: {{ data.item.bulk_account.promotional_credits.toLocaleString() }}
          </p>
        </b-tooltip>
        </span>
      </template>
      <!-- Column: Promotional Credits -->
      <template #cell(transactional_credits)="data">
        <span class="text-nowrap">
          <b-badge
          :id="`organisation-row-${data.item.id}-transactional-credits`"
          variant="secondary"
          >
          {{ data.item.bulk_account.transactional_credits.toLocaleString() }}
          </b-badge>
          <b-tooltip
            title="Sms Lemgth"
            class="cursor-pointer"
            :target="`organisation-row-${data.item.id}-transactional-credits`"
            placement="topright"
          >
          <p class="mb-0">
            SMS Units: {{ data.item.bulk_account.transactional_credits.toLocaleString() }}
          </p>
        </b-tooltip>
        </span>
      </template>
      <!-- Column: Created Date -->
      <template #cell(created_at)="data">
        <span class="text-nowrap"
        :id="`organisation-row-${data.item.id}-created-at`"
        >
          {{ formatDateToMonthLong(data.value) }}
        <b-tooltip
            title="Sent At"
            class="cursor-pointer"
            :target="`organisation-row-${data.item.id}-created-at`"
            placement="topright"
          >
          <p class="mb-0">
            {{ data.item.created_at }}
          </p>
        </b-tooltip>
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
            <b-dropdown-item v-b-modal.topup-bulk-modal @click="updateSelectedOrg(data.item.id, data.item.name)">
              <feather-icon icon="PlusSquareIcon"
              class="text-success"
              />
              <span class="align-middle ml-50">Top Up Bulk</span>
            </b-dropdown-item>
            <b-dropdown-item v-b-modal.assign-sender-modal @click="updateSelectedOrg(data.item.id, data.item.name)">
              <feather-icon icon="HashIcon" />
              <span class="align-middle ml-50">Assign Sender ID</span>
            </b-dropdown-item>
            <b-dropdown-item :to="{ name: 'organisations-view', params: { id: data.item.id } }">
              <feather-icon icon="SettingsIcon" />
              <span class="align-middle ml-50">Manage</span>
            </b-dropdown-item>
            <b-dropdown-item :to="{ name: 'organisations-edit', params: { id: data.item.id } }">
              <feather-icon icon="EditIcon"
              class="text-dark"
              />
              <span class="align-middle ml-50">Edit</span>
            </b-dropdown-item>
          </b-dropdown>
        </div>
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
            :total-rows="totalOrganisations"
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
  <!-- topup bulk -->
    <b-modal
      id="topup-bulk-modal"
      title="Top Up"
      ok-title="Top Up"
      cancel-variant="outline-secondary"
      @ok="addBulkUnits"
    >
      <b-form>
        <b-form-group
          label="Organisation"
          label-for="organisation"
        >
          <b-form-input
            id="organisation"
            v-model="selectedOrg"
            disabled
          />
        </b-form-group>
        <b-form-group
          label="Choose Account"
          label-for="select-account"
        >
          <v-select
            id="select-account"
            v-model="organisationBulk.type"
            :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
            :options="BulkAccountsOptions"
            label="name"
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
            v-model="organisationBulk.units"
          />
        </b-form-group>
        <b-form-group
          label="Receipt Number"
          label-for="receipt-number"
        >
          <b-form-input
            id="receipt-number"
            type="text"
            v-model="organisationBulk.payment_ref"
            placeholder="Payment Reference"
          />
        </b-form-group>
      </b-form>
    </b-modal>
    <!-- assign Sender -->
    <b-modal
      id="assign-sender-modal"
      title="Assign Sender ID"
      ok-title="Assign"
      cancel-variant="outline-secondary"
      @ok="addSenders"
    >
      <b-form>
        <b-form-group
          label="Organisation"
          label-for="organisation"
        >
          <b-form-input
            id="organisation"
            v-model="selectedOrg"
            disabled
          />
        </b-form-group>
        <b-form-group
          label="Select Sender ID"
          label-for="select-sender"
        >
          <v-select
            id="select-sender"
            v-model="organisationSenders.sender_ids"
            :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
            :options="senders"
            label="name"
            @open="fetchSenders"
            :reduce="name => name.id"
            multiple
            placeholder="Select Sender ID"
          />
        </b-form-group>
      </b-form>
    </b-modal>
</div>
</template>

<script>
import {
  BCard, BRow, BCol,
  BFormInput, BTable, BSpinner,
  BPagination, BDropdown, BDropdownItem,
  BTooltip, BBadge, BButton,
  BModal, BForm, BFormGroup, BLink,
} from 'bootstrap-vue'
import axios from '@axios'
// import { avatarText } from '@core/utils/filter'
import Vue from 'vue'
import vSelect from 'vue-select'
import Ripple from 'vue-ripple-directive'
import { onUnmounted, ref } from '@vue/composition-api'
import { formatDateToMonthLong, title } from '@utils/filters'
import useOrganisationList from './useOrganisationList'
import organisationsStoreModule from '../organisationsStoreModule'
import store from '@/store'

export default {
  components: {
    BCard,
    BRow,
    BCol,
    BFormInput,
    BTable,
    BSpinner,
    BBadge,
    BButton,
    BModal,
    BForm,
    BFormGroup,
    BLink,
    // BMedia,
    // BAvatar,
    // BLink,
    // BBadge,
    BDropdown,
    BDropdownItem,
    BPagination,
    BTooltip,

    vSelect,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      selected: 'USA',
      option: ['USA', 'Canada', 'Maxico'],
      senders: [],
    }
  },
  setup() {
    const ORGANISATION_STORE_MODULE_NAME = 'organisations'
    const cookie = JSON.parse(JSON.stringify(Vue.$cookies.get('adminUserData')))
    const userData = (cookie === null) ? null : ref(cookie)

    // Register module
    if (!store.hasModule(ORGANISATION_STORE_MODULE_NAME)) store.registerModule(ORGANISATION_STORE_MODULE_NAME, organisationsStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(ORGANISATION_STORE_MODULE_NAME)) store.unregisterModule(ORGANISATION_STORE_MODULE_NAME)
    })
    const {
      fetchOrganisations,
      perPage,
      tableColumns,
      currentPage,
      totalOrganisations,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refOrganisationListTable,

      statusFilter,
      bulkAccountsFilter,

      refetchData,
      isBusy,

      // resolveOrganisationStatusVariantAndIcon,
    } = useOrganisationList()
    const blankOrganisationSenders = {
      org_id: '',
      sender_ids: [],
    }
    const blankOrganisationBulk = {
      org_id: '',
      units: '',
      type: 1,
      user_id: userData === null ? '' : userData.value.id,
      payment_ref: '',
    }
    const organisationSenders = ref(JSON.parse(JSON.stringify(blankOrganisationSenders)))
    const organisationBulk = ref(JSON.parse(JSON.stringify(blankOrganisationBulk)))
    const selectedOrg = ref('')
    const updateSelectedOrg = (orgId, orgName) => {
      selectedOrg.value = orgName
      organisationSenders.value.org_id = orgId
      organisationBulk.value.org_id = orgId
    }
    // const isAddNewOrganisationSidebarActive = ref(false)
    const statusOptions = [
      { name: 'Delivered', value: 3 },
      { name: 'Undelivered', value: 4 },
      { name: 'Queued', value: 1 },
      { name: 'Failed', value: 6 },
    ]
    const BulkAccountsOptions = [
      { name: 'Promotional', value: 1 },
      { name: 'Transactional', value: 2 },
    ]
    const resetOrgSendersData = () => {
      organisationSenders.value = JSON.parse(JSON.stringify(blankOrganisationSenders))
    }
    const resetOrgBulkData = () => {
      organisationBulk.value = JSON.parse(JSON.stringify(blankOrganisationBulk))
    }
    const addSenders = () => {
      store
        .dispatch('organisations/addSenders', JSON.parse(JSON.stringify(organisationSenders)).value)
        .then(() => {
          resetOrgSendersData()
          refetchData()
        })
        .catch(() => {
          // console.log('error', response)
        })
    }
    const addBulkUnits = () => {
      // console.log('Submit', JSON.parse(JSON.stringify(organisationBulk)).value)
      store
        .dispatch('organisations/topUpBulk', JSON.parse(JSON.stringify(organisationBulk)).value)
        .then(() => {
          // console.log('Created', response)
          resetOrgBulkData()
          refetchData()
        })
        .catch(() => {
          // console.log('error', response)
        })
    }

    return {
      fetchOrganisations,
      tableColumns,
      perPage,
      currentPage,
      totalOrganisations,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refOrganisationListTable,

      statusFilter,
      BulkAccountsOptions,
      organisationSenders,
      refetchData,

      statusOptions,
      bulkAccountsFilter,
      isBusy,
      formatDateToMonthLong,
      title,
      updateSelectedOrg,
      selectedOrg,
      addSenders,
      resetOrgSendersData,
      addBulkUnits,
      resetOrgBulkData,
      organisationBulk,
      userData,

      // avatarText,
      // resolveOrganisationStatusVariantAndIcon,
      // isAddNewOrganisationSidebarActive,
    }
  },
  methods: {
    fetchSenders() {
      axios
        .get('/senders')
        .then(response => {
          this.senders = response.data.results
        })
        .catch(() => {
          // console.log(response)
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}

.organisation-filter-select {
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
