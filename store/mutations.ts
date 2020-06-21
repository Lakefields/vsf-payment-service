import { MutationTree } from 'vuex'
import * as types from './mutation-types'

export const mutations: MutationTree<any> = {
  [types.ADD_PAYMENT_METHODS] (state, paymentMethods) {
    state.payment_methods = paymentMethods
  },
  [types.SET_ISSUER] (state, issuer_id) {
    console.log(issuer_id)
    state.issuer = issuer_id
  },
  [types.CLEAR_ISSUER] (state) {
    state.issuer = null
  },
  [types.SET_PAYMENT_METHOD_DATA] (state, payload) {
    console.log('state.paymentMethodData', payload)
    state.paymentMethodData = payload
  },
  [types.SET_PAYMENT_STATUS_FETCHED] (state, payload) {
    state.paymentStatusFetched = payload
  }
}
