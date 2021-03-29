<template>
  <div class="m-ideal-issuers">
    <h4>{{ $t('Choose your bank') }}</h4>
    <SfSelect
      v-model="iDealIssuer"
      class="form__element form__element--half form__element--half-even form__select sf-select--underlined"
      name="iDealIssuer"
      :label="$t('Choose your bank')"
      :required="true"
      :error-message="$t('Field is required')"
      @change="setIdealIssuer"
    >
      <SfSelectOption
        v-for="iDealIssuer in idealIssuers"
        :key="iDealIssuer.value"
        :value="iDealIssuer.value"
      >
        {{ iDealIssuer.label }}
      </SfSelectOption>
    </SfSelect>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { SfSelect } from '@storefront-ui/vue';

export default {
  components: {
    SfSelect
  },
  data () {
    return {
      iDealIssuer: ''
    }
  },
  watch: {
    'iDealIssuer': function () {
      this.setIdealIssuer()
    }
  },
  computed: {
    ...mapGetters({
      paymentMethods: 'payment-service/getPspMethods',
      getIssuers: 'payment-service/getIssuers'
    }),
    payment () {
      return this.$store.state.checkout.paymentDetails
    },
    idealIssuers () {
      return this.getIssuers.map((item) => {
        return {
          value: item.id,
          label: item.name
        }
      })
    },
    isIdeal () {
      return (this.payment.paymentMethod === 'ideal')
    }
  },
  methods: {
    setIdealIssuer () {
      this.$bus.$emit('checkout-payment-method-changed', { issuer: this.iDealIssuer })
    }
  }
}
</script>

<style lang="scss" scoped>
.m-ideal-issuers {
  width: 100%;
}
</style>
