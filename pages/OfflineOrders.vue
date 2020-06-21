<template>
  <div v-if="hasOfflineOrders">    
    <div class="container">
      <div class="row">
        <div class="col-xs-12">
          <p>{{ ordersData.length }} orderkes</p>
          <p>{{ $t('Please confirm order you placed when you was offline') }}</p>
          <div class="mb40" v-for="(order, key) in ordersData" :key="key">
            <!-- <h3>{{ $t('Order #{id}', { id: order.order_id}) }}</h3>
            <h4>{{ $t('Items ordered') }}</h4>
            {{ order }}
            <table class="brdr-1 brdr-cl-bg-secondary">
              <thead>
                <tr>
                  <th class="serif lh20">
                    {{ $t('Product Name') }}
                  </th>
                  <th class="serif lh20">
                    {{ $t('Price') }}
                  </th>
                  <th class="serif lh20">
                    {{ $t('Qty') }}
                  </th>
                  <th class="serif lh20">
                    {{ $t('Subtotal') }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr class="brdr-top-1 brdr-cl-bg-secondary" v-for="(product, productKey) in order.products" :key="productKey">
                  <td class="fs-medium lh25" :data-th="$t('Product Name')">
                    {{ product.name }}
                    <span class="block mt5 lh16 fs-medium-small" v-for="(option, optionKey) in product.options" :key="optionKey">
                      <strong>{{ option.label }}: </strong> {{ option.value }}
                    </span>
                  </td>
                  <td class="fs-medium lh25" :data-th="$t('Price')">
                    {{ product.price_incl_tax | price(storeView) }}
                  </td>
                  <td class="fs-medium lh25 align-right" :data-th="$t('Qty')">
                    {{ product.qty }}
                  </td>
                  <td class="fs-medium lh25" :data-th="$t('Subtotal')">
                    {{ product.price_incl_tax * product.qty | price(storeView) }}
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="row between-xs middle-xs mt40">
              <div class="col-xs-12 col-sm-6 cancel-order">
                <a href="#" @click.prevent="cancelOrder(order.order_id)">{{ $t('Cancel') }}</a>
              </div>
              <div class="col-xs-12 col-sm-6">
                <button-full @click.native="confirmOrder(order.order_id)">
                  {{ $t('Confirm your order') }}
                </button-full>
              </div>
            </div> -->
            <div class="row fs16 mb35">
              <div class="col-xs-12 h4">
                <h4>{{ $t('Items ordered') }}</h4>
                <table class="brdr-1 brdr-cl-bg-secondary">
                  <thead>
                    <tr>
                      <th class="serif lh20">
                        {{ $t('Product Name') }}
                      </th>
                      <th class="serif lh20">
                        {{ $t('SKU') }}
                      </th>
                      <th class="serif lh20">
                        {{ $t('Price') }}
                      </th>
                      <th class="serif lh20">
                        {{ $t('Qty') }}
                      </th>
                      <th class="serif lh20">
                        {{ $t('Subtotal') }}
                      </th>
                      <th class="serif lh20">
                        {{ $t('Thumbnail') }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="brdr-top-1 brdr-cl-bg-secondary" v-for="item in order.products" :key="item.item_id">
                      <td class="fs-medium lh25" :data-th="$t('Product Name')">
                        {{ item.name }}
                      </td>
                      <td class="fs-medium lh25" :data-th="$t('SKU')">
                        {{ item.sku }}
                      </td>
                      <td class="fs-medium lh25" :data-th="$t('Price')">
                        {{ item.price_incl_tax | price(storeView) }}
                      </td>
                      <td class="fs-medium lh25 align-right" :data-th="$t('Qty')">
                        {{ item.qty_ordered }}
                      </td>
                      <td class="fs-medium lh25" :data-th="$t('Subtotal')">
                        {{ item.row_total_incl_tax | price(storeView) }}
                      </td>
                      <td class="fs-medium lh25">
                        <product-image :image="{src: itemThumbnail[item.sku]}" />
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr class="brdr-top-1 brdr-cl-bg-secondary">
                      <td colspan="5" class="align-right">
                        {{ $t('Subtotal') }}
                      </td>
                      <td>{{ order.subtotal | price(storeView) }}</td>
                    </tr>
                    <tr>
                      <td colspan="5" class="align-right">
                        {{ $t('Shipping') }}
                      </td>
                      <td>{{ order.shipping_amount | price(storeView) }}</td>
                    </tr>
                    <tr>
                      <td colspan="5" class="align-right">
                        {{ $t('Tax') }}
                      </td>
                      <td>{{ order.tax_amount + order.discount_tax_compensation_amount | price(storeView) }}</td>
                    </tr>
                    <tr v-if="order.discount_amount">
                      <td colspan="5" class="align-right">
                        {{ $t('Discount') }}
                      </td>
                      <td>{{ order.discount_amount | price(storeView) }}</td>
                    </tr>
                    <tr>
                      <td colspan="5" class="align-right">
                        {{ $t('Grand total') }}
                      </td>
                      <td>{{ order.grand_total | price(storeView) }}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import config from 'config'
import { CancelOrders } from '@vue-storefront/core/modules/offline-order/components/CancelOrders'
import ButtonFull from 'theme/components/theme/ButtonFull.vue'
import ProductImage from 'theme/components/core/ProductImage'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import { StorageManager } from '@vue-storefront/core/lib/storage-manager'
import { registerModule } from '@vue-storefront/core/lib/modules'
import { OrderModule } from '@vue-storefront/core/modules/order'

export default {
  beforeCreate () {
    registerModule(OrderModule)
  },
  data () {
    return {
      ordersCollection: null,
      ordersData: []
    }
  },
  async beforeMount () {
    let ordersToConfirm = []
    this.ordersCollection = await StorageManager.get('orders')
    console.log(this.ordersCollection)
    this.ordersCollection.iterate((order, id, iterationNumber) => {
      if (order.transmited !== true) {
        ordersToConfirm.push(order)
      }
    })
    this.ordersData = ordersToConfirm
  },
  computed: {
    storeView () {
      return currentStoreView()
    },
    offlineOrders () {
      return this.ordersData.length
    },
    hasOfflineOrders () {
      return this.offlineOrders > 0
    }
  },
  methods: {
    confirmOrder (order_id) {
      console.log({ config: config, order_id: order_id })
      this.$bus.$emit('order/PROCESS_QUEUE', { config: config, order_id: order_id })
      // this.$bus.$emit('sync/PROCESS_QUEUE', { config: config })
      this.$store.dispatch('cart/load')
      // ConfirmOrders.methods.confirmOrders.call(this)
    },
    async cancelOrder (order_id) {
      // this.ordersCollection.iterate((order, id, iterationNumber) => {
      //   if (order.order_id === order_id) {
      //     console.log(order.order_id, order_id)
      //     this.ordersCollection.removeItem(id)
      //   }
      // })

      // let ordersToConfirm = []
      // this.ordersCollection.iterate((order, id, iterationNumber) => {
      //   if (order.transmited !== true) {
      //     ordersToConfirm.push(order)
      //   }
      // })
      console.log(ordersToConfirm)
      // this.ordersData = ordersToConfirm
      this.ordersData = []

    }
  },
  components: {
    ButtonFull,
    ProductImage
  },
  mixins: [ CancelOrders ]
}
</script>

<style lang="scss" scoped>
@import '~theme/css/variables/colors';
@import '~theme/css/helpers/functions/color';
$color-tertiary: color(tertiary);
$color-white-smoke: color(white-smoke);

.modal {
  font-size: 18px;
}

table {
  border-collapse: collapse;
  width: 100%;

  @media (max-width: 767px) {
    border-top: none;
  }

  th, td {
    text-align: left;
    padding: 20px;

    &.align-right {
      text-align: right;

      @media (max-width: 767px) {
        text-align: left;
      }

    }

    @media (max-width: 1199px) {
      padding: 10px;
    }

  }

  thead {
    @media (max-width: 767px) {
      display: none;
    }
  }

  tbody {

    tr {
      @media (max-width: 767px) {
        display: block
      }

      &:nth-child(even) {
        td {
          background-color: $color-white-smoke;
        }
      }

    }

    td {
      vertical-align: top;

      @media (max-width: 767px) {
        display: block;
        text-align: left;
        padding: 10px 20px;
        &:before {
          content: attr(data-th) ': ';
          font-weight: 700;
        }
      }

      &:first-child {
        @media (max-width: 767px) {
          padding: 20px 20px 10px 20px;
        }
      }

      &:last-child {
        @media (max-width: 767px) {
          padding: 10px 20px 20px 20px;
        }
      }
    }

  }

  tfoot {

    tr {
      @media (max-width: 767px) {
        display: block
      }

      &:last-child {
        td:last-child {
         padding-bottom: 20px
        }
      }

    }

    td {
      @media (max-width: 767px) {
        display: block
      }

      &:first-child {
        @media (max-width: 767px) {
          font-weight: 700;
          padding: 20px 20px 5px 20px;
        }
      }

      &:last-child {
        @media (max-width: 767px) {
          padding: 5px 20px 0 20px;
        }
      }

    }

  }

  i {
    vertical-align: middle;
  }

}

.cancel-order {
  text-align: center;
  margin-bottom: 30px;

  @media only screen and (min-width: 576px) {
    text-align: left;
    margin-bottom: 0;
  }
}
</style>
