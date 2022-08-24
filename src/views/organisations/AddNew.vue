<template>
  <div>
    <form-wizard
      color="#7367F0"
      :title="null"
      :subtitle="null"
      shape="square"
      finish-button-text="Save"
      back-button-text="Previous"
      class="mb-3"
      @on-complete="SubmitForm"
    >

      <!-- contact group and sender -->
      <tab-content
        title="Organisation Details"
        :before-change="validationFormOrgInfo"
      >
        <validation-observer
          ref="OrganisationInfoRules"
          tag="form"
        >
          <b-row>
            <b-col md="6">
                <b-form-group
                label="Name"
                label-for="name"
              >
              <validation-provider
                  #default="{ errors }"
                  name="Organisation Name"
                  rules="required"
                >
                  <b-form-input
                    id="name"
                    v-model="orgData.orgName"
                    placeholder="Name"
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-muted">
                  Organisation Name
                </small>
                  <b-form-invalid-feedback :state="errors.length > 0 ? false:null">
                    {{ errors[0] }}
                  </b-form-invalid-feedback>
                 </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
                <b-form-group
                label="Billing Email"
                label-for="billing-email"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Billing Email"
                  rules="required|email"
                >
                  <b-form-input
                    id="billing-email"
                    placeholder="johndoe@gmail.com"
                    v-model="orgData.billingEmail"
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-muted">
                  Billing Email
                </small>
                  <b-form-invalid-feedback :state="errors.length > 0 ? false:null">
                    {{ errors[0] }}
                  </b-form-invalid-feedback>
                </validation-provider>
              </b-form-group>
            </b-col>
          </b-row>

          <b-row>
            <b-col md="6">
                <b-form-group
                label="Contact Phone"
                label-for="contact-phone"
              >
              <validation-provider
                  #default="{ errors }"
                  name="Contact Phone"
                  rules="required"
                >
                  <b-form-input
                    id="contact-phone"
                    v-model="orgData.contactPhone"
                    placeholder="2547000000"
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-muted">
                  Contact Phone
                </small>
                  <b-form-invalid-feedback :state="errors.length > 0 ? false:null">
                    {{ errors[0] }}
                  </b-form-invalid-feedback>
                 </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
                <b-form-group
                label="Address"
                label-for="address"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Address"
                  rules="required"
                >
                  <b-form-textarea
                    id="address"
                    v-model="orgData.address"
                    placeholder="Maruti Heights, Langata Link Road, Nairobi, Kenya"
                    rows="2"
                    no-resize
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-muted">
                  Address
                </small>
                  <b-form-invalid-feedback :state="errors.length > 0 ? false:null">
                    {{ errors[0] }}
                  </b-form-invalid-feedback>
                </validation-provider>
              </b-form-group>
            </b-col>
          </b-row>
        </validation-observer>
      </tab-content>
    <tab-content
        title="Admin Details"
        :before-change="validationFormManagerInfo"
      >
        <validation-observer
          ref="OrganisationManagerRules"
          tag="form"
        >
          <b-row>
            <b-col md="6">
                <b-form-group
                label="First Name"
                label-for="first-name"
              >
              <validation-provider
                  #default="{ errors }"
                  name="First Name"
                  rules="required"
                >
                  <b-form-input
                    id="first-name"
                    v-model="orgData.managerFirstName"
                    placeholder="John"
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-muted">
                  First Name
                </small>
                  <b-form-invalid-feedback :state="errors.length > 0 ? false:null">
                    {{ errors[0] }}
                  </b-form-invalid-feedback>
                 </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
                <b-form-group
                label="Last Name"
                label-for="last-name"
              >
              <validation-provider
                  #default="{ errors }"
                  name="Last Name"
                  rules="required"
                >
                  <b-form-input
                    id="last-name"
                    v-model="orgData.managerLastName"
                    placeholder="Doe"
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-muted">
                  Last Name
                </small>
                  <b-form-invalid-feedback :state="errors.length > 0 ? false:null">
                    {{ errors[0] }}
                  </b-form-invalid-feedback>
                 </validation-provider>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="6">
                <b-form-group
                label="Admin Email"
                label-for="manager-email"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Admin Email"
                  rules="required|email"
                >
                  <b-form-input
                    id="manager-email"
                    placeholder="johndoe@gmail.com"
                    v-model="orgData.managerEmail"
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-muted">
                  Admin Email
                </small>
                  <b-form-invalid-feedback :state="errors.length > 0 ? false:null">
                    {{ errors[0] }}
                  </b-form-invalid-feedback>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
                <b-form-group
                label="Admin Phone"
                label-for="manager-phone"
              >
              <validation-provider
                  #default="{ errors }"
                  name="Admin Phone"
                  rules=""
                >
                  <b-form-input
                    id="manager-phone"
                    v-model="orgData.managerPhone"
                    placeholder="2547000000"
                    :state="errors.length > 0 ? false:null"
                  />
                  <small class="text-muted">
                  Admin Phone
                </small>
                  <b-form-invalid-feedback :state="errors.length > 0 ? false:null">
                    {{ errors[0] }}
                  </b-form-invalid-feedback>
                 </validation-provider>
              </b-form-group>
            </b-col>
          </b-row>
        </validation-observer>
      </tab-content>

      <!-- message and subject -->
      <tab-content
        title="Bulk Account"
        :before-change="validationFormBulkInfo"
      >
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
                    v-model="orgData.price"
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
                    v-model="orgData.isPriceFixed"
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
                    v-model="orgData.isPriceTaxable"
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
                  rules=""
                >
                  <b-form-input
                    type="number"
                    v-model="orgData.promotionalCredits"
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
                  rules=""
                >
                  <b-form-input
                    type="number"
                    v-model="orgData.minCredits"
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
                  rules=""
                >
                  <b-form-input
                    type="number"
                    v-model="orgData.transactionalCredits"
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
                  rules=""
                >
                  <b-form-input
                    type="number"
                    v-model="orgData.transMinCredits"
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
      </tab-content>
    </form-wizard>
  </div>
</template>

<script>
import { FormWizard, TabContent } from 'vue-form-wizard'
import { ref, onUnmounted } from '@vue/composition-api'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import {
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  // BButton,
  BFormInvalidFeedback,
  BFormTextarea,
  BFormCheckbox,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import { required, email } from '@validations'
import { codeIcon } from './code'
import store from '@/store'
import router from '@/router'
import organisationsStoreModule from './organisationsStoreModule'

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    // BButton,
    FormWizard,
    TabContent,
    BRow,
    BCol,
    BFormGroup,
    BFormInput,
    BFormInvalidFeedback,
    BFormTextarea,
    BFormCheckbox,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      codeIcon,
      required,
      email,
    }
  },
  setup() {
    const ORGANISATION_STORE_MODULE_NAME = 'organisations'

    // Register module
    if (!store.hasModule(ORGANISATION_STORE_MODULE_NAME)) store.registerModule(ORGANISATION_STORE_MODULE_NAME, organisationsStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(ORGANISATION_STORE_MODULE_NAME)) store.unregisterModule(ORGANISATION_STORE_MODULE_NAME)
    })
    const blankOrgData = {
      billingEmail: '',
      managerEmail: '',
      contactPhone: '',
      orgName: '',
      address: '',
      managerFirstName: '',
      managerLastName: '',
      managerPhone: '',
      transactionalCredits: 0,
      promotionalCredits: 0,
      minCredits: 0,
      transMinCredits: 0,
      price: 1,
      isPriceTaxable: true,
      isPriceFixed: false,

    }
    const orgData = ref(JSON.parse(JSON.stringify(blankOrgData)))
    const resetOrgData = () => {
      orgData.value = JSON.parse(JSON.stringify(blankOrgData))
    }
    const SubmitForm = () => {
      console.log('Org create Data', JSON.parse(JSON.stringify(orgData)).value)
      store.dispatch('organisations/createOrganisation', JSON.parse(JSON.stringify(orgData)).value)
        .then(res => {
          console.log(res.data)
          resetOrgData()
          router.push({ name: 'organisations-list' })
        })
        .catch(res => {
          console.log('ERROR OCCURED', res.data)
        })
    }
    return {
      orgData,
      resetOrgData,
      SubmitForm,
    }
  },
  methods: {
    validationFormOrgInfo() {
      return new Promise((resolve, reject) => {
        this.$refs.OrganisationInfoRules.validate().then(success => {
          if (success) {
            resolve(true)
          } else {
            reject()
          }
        })
      })
    },
    validationFormManagerInfo() {
      return new Promise((resolve, reject) => {
        this.$refs.OrganisationManagerRules.validate().then(success => {
          if (success) {
            resolve(true)
          } else {
            reject()
          }
        })
      })
    },
    validationFormBulkInfo() {
      return new Promise((resolve, reject) => {
        this.$refs.bulkAccountInfo.validate().then(success => {
          if (success) {
            resolve(true)
          } else {
            reject()
          }
        })
      })
    },
    validationFormSocial() {
      return new Promise((resolve, reject) => {
        this.$refs.socialRules.validate().then(success => {
          if (success) {
            resolve(true)
          } else {
            reject()
          }
        })
      })
    },
  },
}
</script>
<style lang="scss">
  @import '@core/scss/vue/libs/vue-wizard.scss';
  @import '@core/scss/vue/libs/vue-select.scss';
  @import '@core/scss/vue/libs/vue-flatpicker.scss';
</style>
