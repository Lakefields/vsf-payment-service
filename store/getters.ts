import { PaymentServiceState } from '../types/PaymentServiceState'
import { GetterTree } from 'vuex'
import pickBy from 'lodash-es/pickBy'
import rootStore from '@vue-storefront/core/store'

export const getters: GetterTree<PaymentServiceState, any> = {
  getIssuers (state) {
    return state.issuers
  },
  getPaymentMethods (state) {
    return state.payment_methods
  },
  getIssuer (state) {
    return state.issuer
  },
  paymentMethodDetails (state) {
    return state.paymentMethod
  },
  getPaymentStatusFetched (state) {
    return state.paymentStatusFetched
  },
  getPspMethods (state) {
    return pickBy(rootStore.state.checkout.paymentMethods, (paymentMethod) => { return (paymentMethod.pspMethod) })
  }
}
