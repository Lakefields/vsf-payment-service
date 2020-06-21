import * as types from './../store/mutation-types'
import i18n from '@vue-storefront/i18n'
import EventBus from '@vue-storefront/core/compatibility/plugins/event-bus'
import { Logger } from '@vue-storefront/core/lib/logger'
import { isOnline } from '@vue-storefront/core/lib/search'

export function afterRegistration ({ Vue, store, isServer }) {

  const onAfterPlaceOrder = async (payload) => {
    if(isOnline()){
      try {
        EventBus.$emit('notification-progress-start',[i18n.t('Redirecting to payment gateway'),'...'].join(''))
        const order_id = payload.confirmation.backendOrderId
        const createpayment = await store.dispatch('payment-service/createPayment', order_id)
        if (createpayment.code !== 200) {
          throw new Error(createpayment.result)
        }
        Logger.info('onAfterPlaceOrder', 'Payment service', createpayment.result)()
        window.location.href = createpayment.result
      } catch (error) {
        EventBus.$emit('notification-progress-stop')
        store.dispatch('payment-service/setError', error)
      }
    }
  }

  let correctPaymentMethod = false
  let paymentMethodCode = ''
  let paymentMethodAdditionalData = {}

  const placeOrder = () => {
    if (correctPaymentMethod) {
      EventBus.$emit('checkout-do-placeOrder', paymentMethodAdditionalData)
    }
  }

  if (!isServer) {

    EventBus.$on('offline-order-after-placed', onAfterPlaceOrder)

    // Set psp methods which are enabled in backend system
    EventBus.$on('set-unique-payment-methods', methods => {
      Logger.info('set-unique-payment-methods, setPaymentMethods', 'Payment service')()
      store.dispatch('payment-service/setPaymentMethods', methods)
    })

    EventBus.$on('checkout-payment-issuer-changed', issuer => {
      paymentMethodAdditionalData = { 'issuer': issuer.id }
      store.commit('payment-service/' + types.SET_ISSUER, issuer.id)
      store.commit('payment-service/' + types.SET_PAYMENT_METHOD_DATA, {
        paymentMethod: store.getters['payment-service/getPaymentMethods'].find( issuer => issuer.code === paymentMethodCode),
        paymentMethodAdditionalData: paymentMethodAdditionalData
      })
    })

    EventBus.$on('checkout-payment-method-changed', chosenPaymentMethod => {
      console.log(chosenPaymentMethod)
      paymentMethodCode = chosenPaymentMethod
      EventBus.$off('order-after-placed', onAfterPlaceOrder)
      EventBus.$off('checkout-before-placeOrder', placeOrder)
      if (store.getters['payment-service/getPaymentMethods'].some( issuer => issuer.code === paymentMethodCode)) {
        correctPaymentMethod = true
        //reset issuer if payment method has issuers
        paymentMethodAdditionalData = {}
        store.commit('payment-service/' + types.CLEAR_ISSUER)
        EventBus.$on('order-after-placed', onAfterPlaceOrder)
        EventBus.$on('checkout-before-placeOrder', placeOrder)
        store.dispatch('checkout/setThankYouPage', false)
        store.commit('payment-service/' + types.SET_PAYMENT_METHOD_DATA, {
          paymentMethod: store.getters['payment-service/getPaymentMethods'].find( issuer => issuer.code === paymentMethodCode),
          paymentMethodAdditionalData: paymentMethodAdditionalData
        })
        Logger.info('checkout-before-placeOrder', 'Payment service')()

      } else {
        correctPaymentMethod = false
      }
    })
  }


}
