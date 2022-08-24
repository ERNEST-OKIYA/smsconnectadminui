<template>
  <div>

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
          :to="{ name: 'apps-organisations-list'}"
        >
          Organisation List
        </b-link>
        for other organisations.
      </div>
    </b-alert>

    <template v-if="organisationData">
      <!-- First Row -->
      <b-row>
        <b-col
          cols="12"
          xl="9"
          lg="8"
          md="5"
        >
          <organisation-view-organisation-info-card :organisation-data="organisationData" />
        </b-col>
        <b-col
          cols="12"
          md="5"
          xl="3"
          lg="4"
        >
          <organisation-view-organisation-credits-card
          :organisation-bulk-account="organisationData.bulk_account"
          :organisation-id="organisationData.id"
          />
        </b-col>
      </b-row>

      <b-row>
        <b-col
          cols="12"
          xl="9"
          lg="8"
          md="5"
        >
          <organisation-view-organisation-senders-card
          :organisation-senders.sync="organisationData.senders"
          :org-id="organisationData.id"
          :org-name="organisationData.name"
          />
        </b-col>
      </b-row>
    </template>

  </div>
</template>

<script>
import { ref, onUnmounted } from '@vue/composition-api'
import {
  BRow, BCol, BAlert, BLink,
} from 'bootstrap-vue'
import organisationsStoreModule from '../organisationsStoreModule'
import OrganisationViewOrganisationInfoCard from './OrganisationViewOrganisationInfoCard.vue'
import OrganisationViewOrganisationCreditsCard from './OrganisationViewOrganisationCreditsCard.vue'
import OrganisationViewOrganisationSendersCard from './OrganisationViewOrganisationSendersCard.vue'
import router from '@/router'
import store from '@/store'

export default {
  components: {
    BRow,
    BCol,
    BAlert,
    BLink,

    // Local Components
    OrganisationViewOrganisationInfoCard,
    OrganisationViewOrganisationCreditsCard,
    OrganisationViewOrganisationSendersCard,

  },
  setup() {
    const organisationData = ref(null)

    const ORGANISATION_APP_STORE_MODULE_NAME = 'organisations'

    // Register module
    if (!store.hasModule(ORGANISATION_APP_STORE_MODULE_NAME)) store.registerModule(ORGANISATION_APP_STORE_MODULE_NAME, organisationsStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(ORGANISATION_APP_STORE_MODULE_NAME)) store.unregisterModule(ORGANISATION_APP_STORE_MODULE_NAME)
    })

    store.dispatch('organisations/fetchOrganisation', { id: router.currentRoute.params.id })
      .then(response => { organisationData.value = response.data })
      .catch(error => {
        if (error.response.status === 404) {
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
