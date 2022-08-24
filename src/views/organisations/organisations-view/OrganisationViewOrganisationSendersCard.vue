<template>
  <b-card
    no-body
  >
    <b-card-body>
      <b-card-title>
        <div class="">
      <!-- Table Top -->
      <b-row>
        <b-col
          cols="12"
          md="6"
          offset="6"
        >
          <div class="d-flex align-items-end justify-content-end">
            <b-button
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              class="ml-2"
              v-b-modal.assign-sender-modal
              variant="primary"
              :block="$store.getters['app/currentBreakPoint'] === 'xs'"
                >
              <span class="text-nowrap">Assign New Sender</span>
          </b-button>
          </div>
        </b-col>
      </b-row>
    </div>
    </b-card-title>
      <b-card-sub-title>Assigned Senders</b-card-sub-title>
    </b-card-body>
    <b-table
      ref="sendersTable"
      :fields="tableColumns"
      :items="organisationSenders"
      responsive
      primary-key="id"
      show-empty
      :outlined="true"
      empty-text="No Sender ID Assigned"
      class="position-relative"
    >

      <template #cell(module)="data">
        {{ data.value }}
      </template>
      <template #cell(actions)="data">
        <div class="text-nowrap">
          <b-button
          v-if="data.item.status === 'Active'"
          @click="showDeactivateSenderModal(data.item.id, data.item.name, data.item.org_id)"
          variant="outline-danger"
          :block="$store.getters['app/currentBreakPoint'] === 'xs'"
          >
           Deactivate
          </b-button>
          <b-button
          v-if="data.item.status === 'Deactivated'"
          @click="showActivateSenderModal(data.item.id, data.item.name, data.item.org_id)"
          variant="outline-success"
          :block="$store.getters['app/currentBreakPoint'] === 'xs'"
          >
           Activate
          </b-button>
        </div>
      </template>
    </b-table>
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
            v-model="orgName"
            disabled
          />
        </b-form-group>
        <b-form-group
          label="Select Sender ID"
          label-for="select-sender"
        >
          <v-select
            id="sender-filter-select"
            v-model="addOrgSenderData.sender_ids"
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
  </b-card>
</template>

<script>
import Vue from 'vue'
import {
  BCard, BTable, BCardBody, BCardTitle, BCardSubTitle, BButton, BModal, BForm, BFormGroup, BFormInput, BRow, BCol,
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import Ripple from 'vue-ripple-directive'
import axios from '@axios'
import { onUnmounted, ref } from '@vue/composition-api'
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import organisationsStoreModule from '../organisationsStoreModule'
import store from '@/store'

export default {
  components: {
    BCard, BTable, BCardBody, BCardTitle, BCardSubTitle, BButton, vSelect, BModal, BForm, BFormGroup, BFormInput, BRow, BCol,
  },
  directives: {
    Ripple,
  },
  props: {
    organisationSenders: {
      type: Array,
      required: true,
    },
    orgId: {
      type: Number,
      required: true,
    },
    orgName: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    status: '',
    senderId: '',
    senders: [],
  }),
  setup(props, context) {
    const userData = ref(JSON.parse(JSON.stringify(Vue.$cookies.get('adminUserData'))))
    const ORGANISATION_STORE_MODULE_NAME = 'organisations'
    // Register module
    if (!store.hasModule(ORGANISATION_STORE_MODULE_NAME)) store.registerModule(ORGANISATION_STORE_MODULE_NAME, organisationsStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(ORGANISATION_STORE_MODULE_NAME)) store.unregisterModule(ORGANISATION_STORE_MODULE_NAME)
    })
    const blankAddOrgSenderData = {
      org_id: props.orgId,
      sender_ids: [],
    }
    const toast = useToast()
    const addOrgSenderData = ref(JSON.parse(JSON.stringify(blankAddOrgSenderData)))
    const resetAddOrgSendersData = () => {
      addOrgSenderData.value = JSON.parse(JSON.stringify(blankAddOrgSenderData))
    }
    const addSenders = () => {
      store
        .dispatch('organisations/addSenders', JSON.parse(JSON.stringify(addOrgSenderData)).value)
        .then(response => {
          toast({
            component: ToastificationContent,
            position: 'top-right',
            props: {
              title: 'Changes Saved',
              icon: 'CoffeeIcon',
              variant: 'success',
              text: 'Sender ID has been Assigned Successfully',
            },
          })
          const orgSenders = response.data
          context.emit('update:organisationSenders', orgSenders)
        })
        .catch(response => {
          console.log('error', response)
        })
    }
    const tableColumns = [
      // { key: 'campaign', sortable: true },
      { key: 'name', sortable: true },
      { key: 'code', label: 'Profile Code', sortable: true },
      { key: 'status', sortable: true },
      { key: 'type_name', label: 'Type', sortable: true },
      { key: 'created_at', label: 'Assigned On', sortable: true },
      { key: 'actions' },
    ]
    return {
      tableColumns,
      addSenders,
      resetAddOrgSendersData,
      addOrgSenderData,
      userData,
    }
  },
  methods: {
    showDeactivateSenderModal(senderId, senderName) {
      this.senderId = senderId
      this.$bvModal
        .msgBoxConfirm(`Please confirm that you want to deactivate Sender ID - ${senderName} for ${this.orgName}`, {
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
            axios.put('organisations/deactivate-sender', { status: this.status, sender_id: this.senderId, org_id: this.orgId })
              .then(response => {
                console.log('Res', response.data)
                this.senderId = ''
                this.status = ''
                const orgSenders = response.data
                this.$emit('update:organisationSenders', orgSenders)
              })
          }
        })
    },
    showActivateSenderModal(senderId, senderName) {
      this.senderId = senderId
      this.$bvModal
        .msgBoxConfirm(`Please confirm that you want to Activate  Sender ID - ${senderName} For ${this.orgName}`, {
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
            axios.put('organisations/activate-sender', { status: this.status, sender_id: this.senderId, org_id: this.orgId })
              .then(response => {
                console.log('Res', response.data)
                this.senderId = ''
                this.status = ''
                const orgSenders = response.data
                this.$emit('update:organisationSenders', orgSenders)
              })
          }
        })
    },
    fetchSenders() {
      axios
        .get('/senders')
        .then(response => {
          this.senders = response.data.results
        })
        .catch(response => {
          console.log(response)
        })
    },
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
