<template>
  <div>
    <!-- User Info: Input Fields -->
    <b-form>
      <b-row>
        <!-- Field: Full Name -->
        <b-col
          cols="12"
          md="4"
        >
          <b-form-group
            label="Name"
            label-for="name"
          >
            <b-form-input
              id="name"
              v-model="organisationDataRef.name"
            />
          </b-form-group>
        </b-col>

        <!-- Field: Email -->
        <b-col
          cols="12"
          md="4"
        >
          <b-form-group
            label="Billing Email"
            label-for="email"
          >
            <b-form-input
              id="email"
              v-model="organisationDataRef.billing_email"
              type="email"
            />
          </b-form-group>
        </b-col>
      </b-row>
        <!-- Field: Status -->
        <b-row>
        <b-col
          cols="8"
          md="4"
        >
          <b-form-group
            label="Contact Phone"
            label-for="contact"
          >
            <b-form-input
              id="contact"
              v-model="organisationDataRef.contact_phone"
              type="text"
            />
          </b-form-group>
        </b-col>

        <!-- Field: Role -->
        <b-col
          cols="8"
          md="4"
        >
          <b-form-group
            label="Address"
            label-for="address"
          >
           <b-form-textarea
              id="address"
              v-model="organisationDataRef.address"
              rows="2"
              no-resize
              :state="organisationDataRef.address.length < 1 ? false:null"
            />
            <small class="text-muted">
            Address
          </small>
          </b-form-group>
        </b-col>
      </b-row>
    </b-form>
    <!-- Action Buttons -->
    <b-button
      variant="primary"
      type="button"
      @click="onSubmit"
      class="mb-1 mb-sm-0 mr-0 mr-sm-1"
      :block="$store.getters['app/currentBreakPoint'] === 'xs'"
    >
      Save Changes
    </b-button>
    <b-button
      :to="{ name: 'organisations-view', params: { id: organisationDataRef.id } }"
      variant="outline-danger"
      type="reset"
      :block="$store.getters['app/currentBreakPoint'] === 'xs'"
    >
      Cancel
    </b-button>
  </div>
</template>

<script>
import {
  BButton, BRow, BCol, BFormGroup, BFormInput, BForm, BFormTextarea,
} from 'bootstrap-vue'
import { useToast } from 'vue-toastification/composition'
import { toRefs, onUnmounted } from '@vue/composition-api'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import organisationsStoreModule from '../organisationsStoreModule'
import store from '@/store'
import router from '@/router'

export default {
  components: {
    BButton,
    BRow,
    BCol,
    BFormGroup,
    BFormInput,
    BForm,
    BFormTextarea,
  },
  props: {
    organisationData: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const ORGANISATION_STORE_MODULE_NAME = 'organisations'
    // Register module
    if (!store.hasModule(ORGANISATION_STORE_MODULE_NAME)) store.registerModule(ORGANISATION_STORE_MODULE_NAME, organisationsStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(ORGANISATION_STORE_MODULE_NAME)) store.unregisterModule(ORGANISATION_STORE_MODULE_NAME)
    })
    const toast = useToast()
    const organisationDataRef = toRefs(props).organisationData
    const onSubmit = () => {
      const organisationEditData = {
        id: organisationDataRef.value.id,
        contact_phone: organisationDataRef.value.contact_phone,
        contact_email: organisationDataRef.value.billing_email,
        name: organisationDataRef.value.name,
        address: organisationDataRef.value.address,
      }
      store.dispatch('organisations/editOrganisation', organisationEditData)
        .then(() => {
          toast({
            component: ToastificationContent,
            position: 'top-right',
            props: {
              title: 'Changes Saved',
              icon: 'CoffeeIcon',
              variant: 'success',
              text: 'Changes have been changed Successfully',
            },
          })
          router.push({ name: 'organisations-view', params: { id: props.organisationData.id } })
        })
    }
    return {
      onSubmit,
      organisationDataRef,
    }
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
