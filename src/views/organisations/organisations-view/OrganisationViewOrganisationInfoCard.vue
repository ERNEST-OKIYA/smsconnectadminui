<template>
  <b-card>

    <b-row>

      <!-- Organisation Info: Left col -->
      <b-col
        cols="21"
        xl="6"
        class="d-flex justify-content-between flex-column"
      >
        <!-- Organisation Avatar & Action Buttons -->
        <div class="d-flex justify-content-start">
          <div class="d-flex flex-column ml-1">
            <div class="mb-1">
              <h4 class="mb-1">
                {{ organisationData.name }}
              </h4>
              Billing Email: <span class="card-text">{{ organisationData.billing_email }}</span>
            </div>
            <div class="d-flex flex-wrap">
              <b-button
                :to="{ name: 'organisations-edit', params: { id: organisationData.id } }"
                variant="primary"
              >
                Edit
              </b-button>
              <b-button
                v-if="organisationData.status==='Active'"
                variant="outline-danger"
                class="ml-1"
                @click="showHoldOrgModal(organisationData.id, organisationData.name)"
              >
                Put on Hold
              </b-button>
              <b-button
                v-if="organisationData.status==='On Hold'"
                variant="outline-success"
                class="ml-1"
                @click="showActivateOrgModal(organisationData.id, organisationData.name)"
              >
                Activate
              </b-button>
            </div>
          </div>
        </div>

        <!-- Organisation Stats -->
        <div class="d-flex align-items-center mt-2">
          <div class="d-flex align-items-center mr-2">
            <b-avatar
              variant="light-primary"
              rounded
            >
              <feather-icon
                icon="CircleIcon"
                class="text-success"
                size="15"
              />
            </b-avatar>
            <div class="ml-1">
              <h5 class="mb-0">
                {{ organisationData.bulk_account.promotional_credits.toLocaleString() }}
              </h5>
              <small>Promotional Credits</small>
            </div>
          </div>

          <div class="d-flex align-items-center">
            <b-avatar
              variant="light-success"
              rounded
            >
              <feather-icon
                icon="CircleIcon"
                class="text-warning"
                size="15"
              />
            </b-avatar>
            <div class="ml-1">
              <h5 class="mb-0">
                 {{ organisationData.bulk_account.transactional_credits.toLocaleString() }}
              </h5>
              <small>Transactional Credits</small>
            </div>
          </div>
        </div>
      </b-col>

      <!-- Right Col: Table -->
      <b-col
        cols="12"
        xl="6"
      >
        <table class="mt-2 mt-xl-0 w-100">
          <tr>
            <th class="pb-50">
              <feather-icon
                icon="OrganisationIcon"
                class="mr-75"
              />
              <span class="font-weight-bold">Organisation Name</span>
            </th>
            <td class="pb-50">
              {{ organisationData.name }}
            </td>
          </tr>
          <tr>
            <th class="pb-50">
              <feather-icon
                icon="CheckIcon"
                class="mr-75"
              />
              <span class="font-weight-bold">Status</span>
            </th>
            <td class="pb-50 text-capitalize">
              <b-badge
              :variant="resolveOrganisationStatusVariant(organisationData.status).variant"
              >
              {{ organisationData.status }}
              </b-badge>
            </td>
          </tr>
          <tr>
            <th class="pb-50">
              <feather-icon
                icon="UserIcon"
                class="mr-75"
              />
              <span class="font-weight-bold">Admin</span>
            </th>
            <td class="pb-50 text-capitalize">
              {{ organisationData.manager }}
            </td>
          </tr>
          <tr>
            <th class="pb-50">
              <feather-icon
                icon="FlagIcon"
                class="mr-75"
              />
              <span class="font-weight-bold">Address</span>
            </th>
            <td class="pb-50">
              {{ organisationData.address }}
            </td>
          </tr>
          <tr>
            <th>
              <feather-icon
                icon="PhoneIcon"
                class="mr-75"
              />
              <span class="font-weight-bold">Contact Phone</span>
            </th>
            <td>
              {{ organisationData.contact_phone }}
            </td>
          </tr>
        </table>
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
import {
  BCard, BButton, BRow, BCol, BBadge, BAvatar,
} from 'bootstrap-vue'
import axios from '@axios'
import useOrganisationList from '../organisations-list/useOrganisationList'

export default {
  components: {
    BCard, BButton, BRow, BCol, BBadge, BAvatar,
  },
  props: {
    organisationData: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    orgId: '',
    status: '',
  }),
  setup() {
    const { resolveOrganisationStatusVariant } = useOrganisationList()
    return {
      resolveOrganisationStatusVariant,
    }
  },
  methods: {
    showHoldOrgModal(orgId, orgName) {
      this.orgId = orgId
      this.$bvModal
        .msgBoxConfirm(`Please confirm that you want to put ${orgName} on Hold.`, {
          title: 'Please Confirm',
          size: 'sm',
          okVariant: 'primary',
          okTitle: 'Yes',
          cancelTitle: 'No',
          cancelVariant: 'outline-secondary',
          hideHeaderClose: false,
        })
        .then(value => {
          this.status = !value
          if (this.status === false) {
            axios.put('organisations/hold', { status: this.status, org_id: this.orgId })
              .then(response => {
                this.orgId = ''
                this.status = ''
                this.organisationData.status = response.data.status
              })
          }
        })
    },
    showActivateOrgModal(orgId, orgName) {
      this.orgId = orgId
      this.$bvModal
        .msgBoxConfirm(`Please confirm that you want to Activate ${orgName}`, {
          title: 'Please Confirm',
          size: 'sm',
          okVariant: 'primary',
          okTitle: 'Yes',
          cancelTitle: 'No',
          cancelVariant: 'outline-secondary',
          hideHeaderClose: false,
        })
        .then(value => {
          this.status = value
          if (this.status === true) {
            axios.put('organisations/activate', { status: this.status, org_id: this.orgId })
              .then(response => {
                this.orgId = ''
                this.status = ''
                this.organisationData.status = response.data.status
              })
          }
        })
    },
  },
}
</script>

<style>

</style>
