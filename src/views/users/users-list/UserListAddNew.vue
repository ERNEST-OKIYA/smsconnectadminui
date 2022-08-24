<template>
  <b-sidebar
    id="add-new-user-sidebar"
    :visible="isAddNewUserSidebarActive"
    bg-variant="white"
    sidebar-class="sidebar-lg"
    shadow
    backdrop
    no-header
    right
    @hidden="resetForm"
    @change="(val) => $emit('update:is-add-new-user-sidebar-active', val)"
  >
    <template #default="{ hide }">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
        <h5 class="mb-0">
          Add New Staff Account
        </h5>

        <feather-icon
          class="ml-1 cursor-pointer"
          icon="XIcon"
          size="16"
          @click="hide"
        />

      </div>

      <!-- BODY -->
      <validation-observer
        #default="{ handleSubmit }"
        ref="refFormObserver"
      >
        <!-- Form -->
        <b-form
          class="p-2"
          @submit.prevent="handleSubmit(onSubmit)"
          @reset.prevent="resetForm"
        >

          <!-- First Name -->
          <validation-provider
            #default="validationContext"
            name="First Name"
            rules="required"
          >
            <b-form-group
              label="First Name"
              label-for="first-name"
            >
              <b-form-input
                id="first-name"
                v-model="userData.first_name"
                autofocus
                :state="getValidationState(validationContext)"
                trim
              />

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <!-- Last Name -->
          <validation-provider
            #default="validationContext"
            name="Last Name"
            rules="required"
          >
            <b-form-group
              label="Last Name"
              label-for="last-name"
            >
              <b-form-input
                id="last-name"
                v-model="userData.last_name"
                autofocus
                :state="getValidationState(validationContext)"
                trim
              />

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>
          <!-- Email -->
          <validation-provider
            #default="validationContext"
            name="Email"
            rules="email|required"
          >
            <b-form-group
              label="Email"
              label-for="email"
            >
              <b-form-input
                id="email"
                v-model="userData.email"
                :state="getValidationState(validationContext)"
                trim
              />

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>
            <b-form-group
              label="Phone"
              label-for="phone"
            >
            <b-input-group>
            <b-input-group-prepend is-text>
            KE (+254)
          </b-input-group-prepend>
              <cleave
            id="phone"
            v-model="userData.msisdn"
            class="form-control"
            :raw="false"
            :options="options.msisdn"
            placeholder="254722 123 4500"
          />
            </b-input-group>
            </b-form-group>
                <b-form-group
                label="Will the new User be Admin ?"
                label-for="is-price-taxable"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Shall the new User be Admin"
                  rules="required"
                >
                  <b-form-checkbox
                    v-model="userData.is_tenant_manager"
                    id="is-user-admin"
                    :checked="userData.is_tenant_manager"
                    name="is-admin-check-button"
                    class="custom-control-success"
                    switch
                    disabled
                    :state="errors.length > 0 ? false:null"
                  >
                  <span class="switch-icon-left">
                    <feather-icon icon="CheckIcon" />
                  </span>
                  <span class="switch-icon-right">
                    <feather-icon icon="XIcon" />
                  </span>
                  </b-form-checkbox>
                  <small class="text-muted">
                    Admin Users will be able to Login to this Reseller Portal
                </small>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>
          <!-- Form Actions -->
          <div class="d-flex mt-2">
            <b-button
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="primary"
              class="mr-2"
              type="submit"
            >
              Add
            </b-button>
            <b-button
              v-ripple.400="'rgba(186, 191, 199, 0.15)'"
              type="button"
              variant="outline-secondary"
              @click="hide"
            >
              Cancel
            </b-button>
          </div>

        </b-form>
      </validation-observer>
    </template>
  </b-sidebar>
</template>

<script>
import {
  BSidebar, BForm, BFormGroup, BFormInput, BFormInvalidFeedback, BButton, BFormCheckbox, BInputGroupPrepend, BInputGroup,
} from 'bootstrap-vue'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { ref } from '@vue/composition-api'
import { required, alphaNum, email } from '@validations'
import formValidation from '@core/comp-functions/forms/form-validation'
import Ripple from 'vue-ripple-directive'
import Cleave from 'vue-cleave-component'
// eslint-disable-next-line import/no-extraneous-dependencies
import 'cleave.js/dist/addons/cleave-phone.ke'
// import vSelect from 'vue-select'
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import store from '@/store'

export default {
  components: {
    BSidebar,
    BForm,
    BFormGroup,
    BFormInput,
    BFormInvalidFeedback,
    BButton,
    BFormCheckbox,
    BInputGroupPrepend,
    Cleave,
    BInputGroup,
    // vSelect,

    // Form Validation
    ValidationProvider,
    ValidationObserver,
  },
  directives: {
    Ripple,
  },
  model: {
    prop: 'isAddNewUserSidebarActive',
    event: 'update:is-add-new-user-sidebar-active',
  },
  props: {
    isAddNewUserSidebarActive: {
      type: Boolean,
      required: true,
    },
    roleOptions: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      required,
      alphaNum,
      email,
      options: {
        msisdn: {
          phone: true,
          phoneRegionCode: 'KE',
        },
      },
    }
  },
  setup(props, { emit }) {
    const blankUserData = {
      first_name: '',
      last_name: '',
      email: '',
      msisdn: '',
      is_tenant_manager: true,
    }

    const userData = ref(JSON.parse(JSON.stringify(blankUserData)))
    const resetuserData = () => {
      userData.value = JSON.parse(JSON.stringify(blankUserData))
    }
    // Use toast
    const toast = useToast()

    const onSubmit = () => {
      store.dispatch('users/addUser', userData.value)
        .then(() => {
          emit('refetch-data')
          emit('update:is-add-new-user-sidebar-active', false)
          toast({
            component: ToastificationContent,
            position: 'top-right',
            props: {
              title: 'Staff Account Created',
              icon: 'CoffeeIcon',
              variant: 'success',
              text: 'Staff account has been created successfully',
            },
          })
        })
    }

    const {
      refFormObserver,
      getValidationState,
      resetForm,
    } = formValidation(resetuserData)

    return {
      userData,
      onSubmit,

      refFormObserver,
      getValidationState,
      resetForm,
    }
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';

#add-new-user-sidebar {
  .vs__dropdown-menu {
    max-height: 200px !important;
  }
}
</style>
