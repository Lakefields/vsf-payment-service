import { PaymentServiceState } from '../types/PaymentServiceState'

export const state: PaymentServiceState = {
  payment_methods: [],
  issuer: null,
  paymentMethodData: {
    paymentMethod: {},
    paymentMethodAdditionalData: ''
  },
  paymentStatusFetched: false
}
