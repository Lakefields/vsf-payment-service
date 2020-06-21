import { RouteConfig } from 'vue-router'
import OrderStatus from '../pages/OrderStatus.vue'
// import OfflineOrders from '../pages/OfflineOrders.vue'

let routes: RouteConfig[] = []
routes = routes.concat([
  { name: 'order-status', path: '/order-status/:order_token', component: OrderStatus }
  // { name: 'offline-orders', path: '/offline-orders', component: OfflineOrders }
])
export default routes