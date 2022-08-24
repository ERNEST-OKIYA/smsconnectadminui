<template>
  <component :is="organisationData === undefined ? 'div' : 'b-card'">

    <!-- Alert: No item found -->
    <b-alert
      variant="danger"
      :show="organisationData === undefined"
    >
      <h4 class="alert-heading">
        Error fetching organisation data
      </h4>
      <div class="alert-body">
        No organisation found with this organisation id. Check
        <b-link
          class="alert-link"
          :to="{ name: 'organisations-list'}"
        >
          User List
        </b-link>
        for other organisations.
      </div>
    </b-alert>

    <b-tabs
      v-if="organisationData"
      pills
    >

      <!-- Tab: General Info -->
      <b-tab active>
        <template #title>
          <feather-icon
            icon="UserIcon"
            size="16"
            class="mr-0 mr-sm-50"
          />
          <span class="d-none d-sm-inline">General Info</span>
        </template>
        <organisation-edit-tab-info
          :organisation-data="organisationData"
          class="mt-2 pt-75"
        />
      </b-tab>
      <!-- Tab: Bulk Account -->
      <b-tab>
        <template #title>
          <feather-icon
            icon="MessageSquareIcon"
            size="16"
            class="mr-0 mr-sm-50"
          />
          <span class="d-none d-sm-inline">Bulk Account</span>
        </template>
        <organisation-edit-tab-bulk-accounts
          :bulk-account-data="organisationData.bulk_account"
          :organisation-id="organisationData.id"
          class="mt-2 pt-75"
        />
      </b-tab>
    </b-tabs>
  </component>
</template>

<script>
import {
  BTab, BTabs, BCard, BAlert, BLink,
} from 'bootstrap-vue'
import { ref, onUnmounted } from '@vue/composition-api'
import router from '@/router'
import store from '@/store'
import organisationsStoreModule from '../organisationsStoreModule'
import OrganisationEditTabInfo from './OrganisationEditTabInfo.vue'
import OrganisationEditTabBulkAccounts from './OrganisationEditTabBulkAccounts.vue'

export default {
  components: {
    BTab,
    BTabs,
    BCard,
    BAlert,
    BLink,

    OrganisationEditTabInfo,
    OrganisationEditTabBulkAccounts,
  },
  setup() {
    const organisationData = ref(null)

    const ORGANISATION_STORE_MODULE_NAME = 'organisations'

    // Register module
    if (!store.hasModule(ORGANISATION_STORE_MODULE_NAME)) store.registerModule(ORGANISATION_STORE_MODULE_NAME, organisationsStoreModule)
    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(ORGANISATION_STORE_MODULE_NAME)) store.unregisterModule(ORGANISATION_STORE_MODULE_NAME)
    })

    store.dispatch('organisations/fetchOrganisation', { id: router.currentRoute.params.id })
      .then(response => { organisationData.value = response.data })
      .catch(error => {
        if (error.response.data.status === 404) {
          organisationData.value = undefined
        }
      })

    return {
      organisationData,
    }
  },
}
</script>

<style>

</style>
