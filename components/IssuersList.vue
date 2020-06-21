<template>
  <div v-if="hasIssuers" class="row mb40">
    <div class="col-xs-12">
      <h4>{{ $t('Choose your preferred issuer') }}</h4>
    </div>
    <div v-for="(issuer, index) in issuers" :key="index" class="col-md-6">
      <label class="radioStyled">
        <span class="issuer-icon">
          <img :src="issuerIcon(issuer)" :alt="issuer.name" width="30">
        </span>
        <span class="issuer">
          {{ issuer.name }}
        </span>
        <input
          type="radio"
          :value="issuer.id"
          name="issuer"
          v-model="issuer_id"
          @change="setIssuer();"
        >
        <span class="checkmark"/>
      </label>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { isOnline } from '@vue-storefront/core/lib/search'

export default {
  props: {
    paymentmethod: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      issuer_id: ''
    }
  },
  mounted () {
    this.issuer_id = this.chosenIssuer
  },
  watch: {
    'issuer': function () {
      this.setIssuer()
    }
  },
  computed: {
    ...mapGetters({
      paymentMethods: 'payment/paymentMethods',
      chosenIssuer: 'payment-service/getIssuer'
    }),
    issuers () {
      console.log(this.paymentmethod)
      return this.selectedPaymentMethod.issuers
    },
    hasIssuers () {
      return this.issuers.length !== 0
    },
    selectedPaymentMethod () {
      return this.paymentMethods.find(paymentMethod => paymentMethod.code === this.paymentmethod)
    },
  },
  methods: {
    setIssuer () {
      this.$bus.$emit('checkout-payment-issuer-changed', this.issuers.find(issuer => issuer.id === this.issuer_id))
    },
    issuerIcon (issuer) {
      return isOnline() ? issuer.image.svg : '/assets/payment-methods/issuers/' + this.selectedPaymentMethod.code + '/' + issuer.id.substring(issuer.id.lastIndexOf('_') + 1) + '.svg'
    }
  }
}
</script>

<style lang="scss" scoped>
  .issuer {
    position: relative;
    top: -6px;
    margin-left: 5px;
  }
</style>
