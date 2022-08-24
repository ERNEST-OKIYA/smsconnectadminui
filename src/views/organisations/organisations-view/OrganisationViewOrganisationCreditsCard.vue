<template>
  <b-card
    no-body
    class="border-primary"
  >
    <b-card-header class="d-flex justify-content-between align-items-center pt-75 pb-25">
      <h5 class="mb-0">
        Current Plan
      </h5>
    </b-card-header>

    <b-card-body>
      <ul class="list-unstyled my-1">
        <li>
          <span class="align-middle">
            Price Per SMS Unit:
            <b-badge variant="dark" class="ml-2">
            {{ organisationBulkAccount.price }} KES
            </b-badge>
          </span>
        </li>
        <li class="my-25">
          <span class="align-middle">
            Is Price Fixed:
            <b-badge
            class="ml-5"
            :variant="organisationBulkAccount.price_fixed ===false ? 'light-warning':'light-success'">
            <span v-if="organisationBulkAccount.price_fixed ===false">
              No
            </span>
            <span v-if="organisationBulkAccount.price_fixed ===true">
              Yes
            </span>
            </b-badge>
            </span>
        </li>
        <li>
          <span class="align-middle">
            <span class="align-middle">
            Price Taxable:
            <b-badge
            class="ml-5"
            :variant="organisationBulkAccount.price_taxable ===false ? 'light-danger':'light-success'">
            <span v-if="organisationBulkAccount.price_taxable ===false">
              No
            </span>
            <span v-if="organisationBulkAccount.price_taxable ===true">
              Yes
            </span>
            </b-badge>
            </span>
          </span>
        </li>
      </ul>
      <b-button
      :to="{ name: 'organisations-edit', params: { id: organisationId } }"
        v-ripple.400="'rgba(255, 255, 255, 0.15)'"
        variant="primary"
        block
      >
        Edit
      </b-button>
    </b-card-body>
  </b-card>
</template>

<script>
import {
  BCard, BCardHeader, BCardBody, BBadge, BButton,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'

export default {
  directives: {
    Ripple,
  },
  components: {
    BCard,
    BCardHeader,
    BCardBody,
    BBadge,
    BButton,
  },
  props: {
    organisationBulkAccount: {
      type: Object,
      required: true,
    },
    organisationId: {
      type: Number,
      required: true,
    },
  },
}
</script>

<style>

</style>
