import { PaymentServiceState } from '../types/PaymentServiceState'
import { GetterTree } from 'vuex'

export const getters: GetterTree<PaymentServiceState, any> = {
  getPaymentMethods (state) {
    return state.payment_methods
  },
  getIssuer (state) {
    return state.issuer
  },  
  getPaymentMethodData (state) {
    return state.paymentMethodData
  },
  getPaymentStatusFetched (state) {
    return state.paymentStatusFetched
  }
}
