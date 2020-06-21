import { createModule } from '@vue-storefront/core/lib/module'
import { afterRegistration } from './hooks/afterRegistration'
import { state } from './store/state'
import { mutations } from './store/mutations'
import { getters } from './store/getters'
import { actions } from './store/actions'
import routes from './router'

const PaymentServiceStore = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}

const KEY = 'payment-service'
export const PaymentService = createModule({
  key: KEY,
  store: { modules: [{ key: KEY, module: PaymentServiceStore }] },
  afterRegistration,
  router: { routes }
})

