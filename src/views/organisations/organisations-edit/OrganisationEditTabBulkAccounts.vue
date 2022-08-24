<template>
  <div>
    <b-row>
      <validation-observer
          ref="bulkAccountInfo"
          tag="form"
        >
          <b-row>
            <b-col md="3">
                <b-form-group
                label="Bulk Type"
                label-for="bulk-type"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Bulk Type"
                  rules=""
                >
                  <b-form-input
                    id="bulk-type"
                    placeholder="SMS"
                    :state="errors.length > 0 ? false:null"
                    disabled
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="3">
                <b-form-group
                label="Price"
                label-for="price"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Price"
                  rules="required"
                >
                  <b-form-input
                    type="number"
                    v-model="organisationBulkAccountRef.price"
                    id="price"
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-muted">
                 Cost for One Bulk Unit
                </small>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="3">
                <b-form-group
                label="Is Price Fixed?"
                label-for="is-price-fixed"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Is Price Fixed"
                  rules="required"
                >
                  <b-form-checkbox
                    v-model="organisationBulkAccountRef.price_fixed"
                    id="is-price-fixed"
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-muted">
                    Will this price be fixed?
                </small>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="3">
                <b-form-group
                label="Is Price Taxable?"
                label-for="is-price-taxable"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Is Price Taxable"
                  rules="required"
                >
                  <b-form-checkbox
                    v-model="organisationBulkAccountRef.price_taxable"
                    id="is-price-taxable"
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-muted">
                    Will this price be Taxable?
                </small>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
          </b-row>
          <!-- Spacer -->
          <hr class="invoice-spacing">
            <b-row>
               <b-col
              cols="12"
              class="mb-2"
            >
              <h5 class="mb-0 mt-1">
               Promotional ( Campaigns ) credits
              </h5>
              <hr class="invoice-spacing">
            </b-col>
            <b-col md="3">
                <b-form-group
                label="Credits"
                label-for="promotional-credits"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Promotional Credits"
                  rules="required"
                >
                  <b-form-input
                    type="number"
                    v-model="organisationBulkAccountRef.promotional_credits"
                    id="promotional-credits"
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-muted">
                  Used for Bulk Campaigns
                </small>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="3">
                <b-form-group
                label="Promotional Overdraft Credits"
                label-for="promotional-min-credits"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Promotional Overdraft Credits"
                  rules="required"
                >
                  <b-form-input
                    type="number"
                    v-model="organisationBulkAccountRef.min_credits"
                    id="promotional-min-credits"
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-muted">
                  Limit allowed below 0 credits
                </small>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            </b-row>
            <!-- Spacer -->
            <h5 class="mb-0 mt-1">
               Transactional ( API ) Credits
              </h5>
          <hr class="invoice-spacing">
            <b-row>
            <b-col md="3">
                <b-form-group
                label="Credits"
                label-for="transactional-credits"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Transactional Credits"
                  rules="required"
                >
                  <b-form-input
                    type="number"
                    v-model="organisationBulkAccountRef.transactional_credits"
                    id="transactional-credits"
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-muted">
                  Used For API Messages
                </small>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="3">
                <b-form-group
                label="Transactional Overdraft Credits"
                label-for="trans-min-credits"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Transactional Overdraft Credits"
                  rules="required"
                >
                  <b-form-input
                    type="number"
                    v-model="organisationBulkAccountRef.transactional_min_credits"
                    id="trans-min-credits"
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-muted">
                  Limit allowed below 0 credits
                </small>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
            </b-col>
          </b-row>
        </validation-observer>
    </b-row>
      <b-row class="mt-2">
        <b-col>
          <b-button
            variant="primary"
            class="mb-1 mb-sm-0 mr-0 mr-sm-1"
            type="button"
            @click="onSubmit"
            :block="$store.getters['app/currentBreakPoint'] === 'xs'"
          >
            Save Changes
          </b-button>
          <b-button
          :to="{ name: 'organisations-view', params: { id: organisationId } }"
            variant="outline-danger"
            :block="$store.getters['app/currentBreakPoint'] === 'xs'"
          >
            Cancel
          </b-button>
        </b-col>
      </b-row>
  </div>
</template>

<script>
import {
  BRow, BCol, BFormGroup, BFormInput,
  BButton, BFormCheckbox,
} from 'bootstrap-vue'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { required } from '@validations'
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import { toRefs, onUnmounted } from '@vue/composition-api'
import organisationsStoreModule from '../organisationsStoreModule'
import router from '@/router'
import store from '@/store'

export default {
  components: {
    BRow,
    BCol,
    BFormGroup,
    BFormInput,
    BButton,
    ValidationProvider,
    ValidationObserver,
    BFormCheckbox,
  },
  props: {
    bulkAccountData: {
      type: Object,
      required: true,
    },
    organisationId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      required,
    }
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
    const organisationBulkAccountRef = toRefs(props).bulkAccountData
    const onSubmit = () => {
      console.log('DATA', JSON.parse(JSON.stringify(organisationBulkAccountRef.value)))
      store.dispatch('organisations/editBulkAccount', JSON.parse(JSON.stringify(organisationBulkAccountRef.value)))
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
          router.push({ name: 'organisations-view', params: { id: props.organisationId } })
        })
    }
    return {
      onSubmit,
      organisationBulkAccountRef,
    }
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-flatpicker.scss';
</style>
