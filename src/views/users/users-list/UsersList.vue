<template>
<div>
  <user-list-add-new
      :is-add-new-user-sidebar-active.sync="isAddNewUserSidebarActive"
      :role-options="roleOptions"
      @refetch-data="refetchData"
    />

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
            <b-button
                variant="primary"
                @click="isAddNewUserSidebarActive = true"
              >
                <span class="text-nowrap">Add Staff Account</span>
              </b-button>
          </div>
        </b-col>
      </b-row>

    </div>

    <b-table
      ref="refUserListTable"
      :items="fetchUsers"
      responsive
      :fields="tableColumns"
      primary-key="id"
      :sort-by.sync="sortBy"
      show-empty
      :busy.sync="isBusy"
      empty-text="No matching records found"
      :sort-desc.sync="isSortDirDesc"
      class="position-relative"
    >
    <template #table-busy>
        <div class="text-center text-primary my-2">
          <b-spinner
          label="Loading..."
          class="align-middle">
          </b-spinner>
          <strong class=" ml-2">Fetching...</strong>
        </div>
      </template>
      <!-- Column: Id -->
      <template #cell(id)="data">
        <span class="text-nowrap">
          # {{ data.item.id }}
        </span>
      </template>
      <template #cell(msisdn)="data">
        <span class="text-nowrap">
          {{ data.item.msisdn }}
        </span>
      </template>

      <!-- Column: User -->
      <template #cell(full_name)="data">
        <b-media vertical-align="center">
          <template #aside>
            <b-avatar
              size="32"
              :src="data.item.avatar"
              :text="avatarText(data.item.full_name)"
              :variant="`light-${resolveUserAvatarVariant(data.item.status)}`"
            />
          </template>
          <span class="font-weight-bold d-block text-nowrap">
            {{ data.item.full_name }}
          </span>
          <small class="text-muted">{{ data.item.msisdn }}</small>
        </b-media>
      </template>
      <!-- Column: User Status -->
      <template #cell(status)="data">
        <b-avatar
          :id="`user-row-${data.item.id}`"
          size="32"
          :variant="`light-${resolveUserStatusVariantAndIcon(data.item.status).variant}`"
        >
          <feather-icon
            :icon="resolveUserStatusVariantAndIcon(data.item.status).icon"
          />
        </b-avatar>
        <b-tooltip
          :target="`user-row-${data.item.id}`"
          placement="top"
        >
          <p class="mb-0">
            Status: {{ data.item.status }}
          </p>
          <p class="mb-0">
            Created at: {{ data.item.created_at }}
          </p>
        </b-tooltip>
      </template>

      <!-- Column: Issued Date -->
      <template #cell(created_at)="data">
        <span class="text-nowrap">
          {{ data.item.created_at }}
        </span>
      </template>
      <!-- Column: Actions -->
        <template #cell(actions)="data">
          <b-dropdown
            variant="link"
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
            <!-- <b-dropdown-item :to="{ name: 'apps-users-view', params: { id: data.item.id } }">
              <feather-icon icon="FileTextIcon" />
              <span class="align-middle ml-50">Details</span>
            </b-dropdown-item> -->

            <b-dropdown-item :to="{ name: 'staff-accounts-edit', params: { id: data.item.id } }">
              <feather-icon icon="EditIcon" />
              <span class="align-middle ml-50">Edit</span>
            </b-dropdown-item>

            <!-- <b-dropdown-item>
              <feather-icon
              icon="PauseCircleIcon"
              class="text-danger"
              />
              <span class="align-middle ml-50">Hold</span>
            </b-dropdown-item> -->
          </b-dropdown>
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
            :total-rows="totalUsers"
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
  BCard, BRow, BCol, BFormInput, BTable, BMedia, BAvatar,
  BPagination, BTooltip, BDropdown, BDropdownItem, BButton, BSpinner,
} from 'bootstrap-vue'
import { avatarText } from '@core/utils/filter'
import vSelect from 'vue-select'
import { ref, onUnmounted } from '@vue/composition-api'
import store from '@/store'
import useUsersList from './useUsersList'

import userStoreModule from '../userStoreModule'
import UserListAddNew from './UserListAddNew.vue'

export default {
  components: {
    UserListAddNew,
    BCard,
    BRow,
    BCol,
    BFormInput,
    BTable,
    BMedia,
    BAvatar,
    BPagination,
    BTooltip,
    BDropdown,
    BDropdownItem,
    BButton,
    BSpinner,
    vSelect,
  },
  setup() {
    const USERS_APP_STORE_MODULE_NAME = 'users'

    // Register module
    if (!store.hasModule(USERS_APP_STORE_MODULE_NAME)) store.registerModule(USERS_APP_STORE_MODULE_NAME, userStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(USERS_APP_STORE_MODULE_NAME)) store.unregisterModule(USERS_APP_STORE_MODULE_NAME)
    })

    const isAddNewUserSidebarActive = ref(false)
    const roleOptions = [
      { label: 'Super Admin', value: 1 },
      { label: 'Organisation Manager', value: 2 },
    ]

    const {
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

      statusFilter,
      isBusy,

      refetchData,

      resolveUserStatusVariantAndIcon,
      resolveUserAvatarVariant,
    } = useUsersList()

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
      roleOptions,

      refetchData,
      isAddNewUserSidebarActive,
      avatarText,
      resolveUserStatusVariantAndIcon,
      resolveUserAvatarVariant,
    }
  },
}
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}

.user-filter-select {
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
