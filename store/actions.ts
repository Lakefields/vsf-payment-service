import { PaymentServiceState, Method, FetchMethodsParams } from '../types/PaymentServiceState'
import { ActionTree } from 'vuex'
import * as types from './mutation-types'
import fetch from 'isomorphic-fetch'
import i18n from '@vue-storefront/i18n'
import config from 'config'
import { router } from '@vue-storefront/core/app';
import { localizedRoute} from '@vue-storefront/core/lib/multistore'
import { Logger } from '@vue-storefront/core/lib/logger'

const headers = {
  'Accept': 'application/json, text/plain, */*',
  'Content-Type': 'application/json'
}

export const actions: ActionTree<PaymentServiceState, any> = {
  async setPaymentMethods ({ dispatch, getters }, availablePaymentMethods) {
    try {
      const pspPaymentMethods = (getters['getPaymentMethods'].length === 0) ? await dispatch('fetchPaymentMethods') : getters['getPaymentMethods']
      const backendPaymentMethodPrefix = "mollie_methods_"
      
      const filteredPaymentMethods = pspPaymentMethods.filter((pspPaymentMethod) => {
        return availablePaymentMethods.some(availablePaymentMethod => availablePaymentMethod.code === backendPaymentMethodPrefix + pspPaymentMethod.code)
      })
      dispatch('payment/replaceMethods', filteredPaymentMethods, { root: true })

    } catch (err) {
      Logger.info('Can\'t fetch payment methods', 'Payment service', err)()
      return
    }
  },

  async fetchPaymentMethods ({ rootState, commit, rootGetters }) {
    Logger.info('Fetch payment methods', 'Payment service')()
    try {
      let fetchMethodsParams: FetchMethodsParams = {
        locale: rootState.config.i18n.defaultLocale.replace('-','_'),
        amount: {
          currency: rootState.config.i18n.currencyCode,
          value: rootGetters['cart/getTotals'].find(seg => seg.code === 'grand_total').value.toFixed(2)
        }
      }
      console.log(fetchMethodsParams)
      const fetchPaymentMethods = await fetch(rootState.config.paymentService.endpoint + '/methods', {
        method: 'POST',
        mode: 'cors',
        headers,
        body: JSON.stringify(fetchMethodsParams)        
      })
      const paymentMethodsJson = await fetchPaymentMethods.json()    
      
      if (paymentMethodsJson.count === 0) {
        throw new Error('No payment methods configured')
      }
      console.log(paymentMethodsJson.result)
      let paymentMethods = []
      paymentMethodsJson.result.forEach(method => {
        let paymentMethodConfig: Method = {
          title: method.description,
          code: method.id,
          image: method.image,
          pspMethod: true
        }
        if(method.hasOwnProperty('issuers')){
          paymentMethodConfig.issuers = method.issuers
        }
        paymentMethods.push(paymentMethodConfig)
      })
      commit(types.ADD_PAYMENT_METHODS, paymentMethods)
      return paymentMethods
    }
    catch (err) {
      Logger.info('Can\'t fetch payment methods', 'Payment service', err)()
      return
    }    
  },

  async createPayment ({ rootState, getters }, order_id ) {
    let fetchUrl = rootState.config.paymentService.endpoint + '/order'
    let params = {
      currency: rootState.config.i18n.currencyCode,
      locale: rootState.config.i18n.defaultLocale.replace('-','_'),
      order_id: order_id,
      method: rootState.checkout.paymentDetails.paymentMethod,
      additional_payment_data: {
        payment: {
          issuer: getters['getIssuer']
        }
      }
    }
    Logger.info('Collected payment data. ', 'Payment service', params)()

    return fetch(fetchUrl, {
      method: 'POST',
      mode: 'cors',
      headers,
      body: JSON.stringify(params)
    }).then(resp => {
      return resp.json()
    })
  },

  postOrderComment ({ rootState }, payload ) {
    let fetchUrl = rootState.config.paymentService.endpoint + '/order-comments'
    let params = {
      order_id: payload.order_id,
      order_comment: {
        "statusHistory": {
          "comment": payload.order_comment,
          "created_at": new Date(),
          "is_customer_notified": 0,
          "is_visible_on_front": 0,
          "parent_id": payload.order_id,
          "status": payload.status
        }
      }
    }

    return fetch(fetchUrl, {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    })
    .then(resp => {
      return resp.json()
    })
  },

  getPaymentStatus ({ rootState }, payload ) {
    let fetchUrl = rootState.config.paymentService.endpoint + '/status'
    let params = { "token": payload.token }

    return fetch(fetchUrl, {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    })
    .then(resp => {
      return resp.json()
    })
  },

  setError ({ dispatch }, error ) {
    const { message  } = error
    Logger.error(message, 'Payment service')()
    dispatch('notification/spawnNotification', {
      type: 'error',
      message: i18n.t('Payment is not created - ' + message),
      action1: { label: i18n.t('OK') },
      hasNoTimeout: true
    },
    {root: true})
    dispatch('checkout/setThankYouPage', false, {root: true})
    router.push(localizedRoute('/', config.paymentService.error_url))
  }
  
}
