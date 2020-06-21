<template>
  <div class="mb15 mt20" v-if="hasPaymentDetails">
    <div class="bg-cl-secondary px20 py20" style="text-align: center;">
      <p class="weight-700">{{ $t('All set to place your order') }}</p>
      <p>{{ $t('After placing the order you will be send to the payment gateway and you can pay by:') }}</p>
      <div class="payment-details-container">        
        <div class="payment-details">
          <img :src="paymentMethodIcon" class="icon" width="30">
          <span class="payment-method">{{ paymentMethodDetails.title }}</span>
        </div>
        <div class="payment-details" v-if="hasIssuers">
          <span class="mx5">with issuer</span>
          <img :src="issuerIcon" class="icon" width="30">
          <span class="issuer">{{ issuerDetails.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import isEmpty from 'lodash-es/isEmpty'
import { isOnline } from '@vue-storefront/core/lib/search'

export default {
  computed: {
    ...mapGetters({
      paymentMethodData: 'payment-service/getPaymentMethodData'
    }),
    paymentMethodDetails () {
      return this.paymentMethodData.paymentMethod
    },
    issuer () {
      return this.paymentMethodData.paymentMethodAdditionalData.issuer
    },
    issuerDetails () {
      return !isEmpty(this.issuer) && this.paymentMethodDetails.hasOwnProperty('issuers') ? this.paymentMethodDetails.issuers.find(issuer => issuer.id === this.issuer) : {}
    },
    hasIssuers () {
      return !isEmpty(this.issuerDetails)
    },
    hasPaymentDetails () {
      return !isEmpty(this.paymentMethodDetails)
    },
    paymentMethodIcon () {
      return isOnline() && this.hasPaymentDetails && this.paymentMethodData.hasOwnProperty('image') ? this.paymentMethodDetails.image.svg : '/assets/payment-methods/' + this.paymentMethodDetails.code + '.svg'
    }, 
    issuerIcon () {
      if (this.hasIssuers === false){
        return ''
      }
      return isOnline() ? this.issuerDetails.image.svg : '/assets/payment-methods/issuers/' + this.paymentMethodDetails.code + '/' + this.issuerDetails.id.substring(this.issuerDetails.id.lastIndexOf('_') + 1) + '.svg'
    }, 
  }
}
</script>

<style lang="scss" scoped>
.payment-details-container {
  display: flex;
  justify-content: center;
  align-items: center;
  .payment-details {
    padding: 0;
    display: flex;
    align-items: center;
    .icon {
      margin-right: 5px;
    }
  }
}
</style>
