<template>
  <div>
    <!-- User Info: Input Fields -->
    <b-form>
      <!-- Field: Email -->
      <b-row>
        <b-col
          cols="12"
          md="4"
        >
          <b-form-group
            label="Email"
            label-for="email"
          >
            <b-form-input
              id="email"
              v-model="userData.email"
              type="email"
              disabled
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <!-- Field: Full Name -->
        <b-col
          cols="12"
          md="4"
        >
          <b-form-group
            label="First Name"
            label-for="first-name"
          >
            <b-form-input
              id="first-name"
              v-model="userData.first_name"
            />
          </b-form-group>
        </b-col>
        <b-col
          cols="12"
          md="4"
        >
          <b-form-group
            label="Last Name"
            label-for="last-name"
          >
            <b-form-input
              id="last-name"
              v-model="userData.last_name"
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
            label="Status"
            label-for="user-status"
          >
            <v-select
              v-model="userData.status"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              :options="statusOptions"
              :reduce="val => val.value"
              :clearable="false"
              input-id="user-status"
            />
          </b-form-group>
        </b-col>

        <!-- Field: Role -->
        <b-col
          cols="8"
          md="4"
        >
          <b-form-group
            label="User Role"
            label-for="user-role"
          >
            <v-select
              v-model="userData.type"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              :options="roleOptions"
              :reduce="val => val.value"
              :clearable="false"
              input-id="user-role"
            />
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
      variant="outline-secondary"
      type="reset"
      :block="$store.getters['app/currentBreakPoint'] === 'xs'"
    >
      Reset
    </b-button>
  </div>
</template>

<script>
import {
  BButton, BRow, BCol, BFormGroup, BFormInput, BForm,
} from 'bootstrap-vue'
import { avatarText } from '@core/utils/filter'
import vSelect from 'vue-select'
import { useToast } from 'vue-toastification/composition'
import { useInputImageRenderer } from '@core/comp-functions/forms/form-utils'
import { ref, toRefs } from '@vue/composition-api'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import useUsersList from '../users-list/useUsersList'
import store from '@/store'

export default {
  components: {
    BButton,
    BRow,
    BCol,
    BFormGroup,
    BFormInput,
    BForm,
    vSelect,
  },
  props: {
    userData: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { resolveUserRoleVariant } = useUsersList()

    const roleOptions = [
      { label: 'Staff', value: 1 },
      { label: 'Member', value: 2 },
    ]

    const statusOptions = [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
    ]

    const permissionsData = [
      {
        module: 'Payments',
        read: true,
        write: false,
        create: false,
        delete: false,
      },
      {
        module: 'Staff Accounts',
        read: true,
        write: false,
        create: false,
        delete: false,
      },
    ]

    // ? Demo Purpose => Update image on click of update
    const refInputEl = ref(null)
    const previewEl = ref(null)
    const approvalLimit = ref(0)
    const toast = useToast()
    const { inputImageRenderer } = useInputImageRenderer(refInputEl, base64 => {
      // eslint-disable-next-line no-param-reassign
      props.userData.avatar = base64
    })
    const userDataRef = toRefs(props).userData
    const onSubmit = () => {
      const userEditData = {
        id: userDataRef.value.id,
        limit: userDataRef.value.limit,
        status: userDataRef.value.status,
      }
      store.dispatch('app-user/editUser', userEditData)
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
        })
    }
    return {
      resolveUserRoleVariant,
      avatarText,
      roleOptions,
      statusOptions,
      permissionsData,
      onSubmit,
      userDataRef,
      //  ? Demo - Update Image on click of update button
      refInputEl,
      previewEl,
      approvalLimit,
      inputImageRenderer,
    }
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
