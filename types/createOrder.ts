interface Amount {
  value: number,
  currency: string
}

interface BillingAddress {
  organizationName: string,
  streetAndNumber: string,
  city: string,
  region: string,
  postalCode: string,
  country: string,
  title: string,
  givenName: string,
  familyName: string,
  email: string,
  phone: string
}

interface ShippingAddress {
  organizationName: string,
  streetAndNumber: string,
  streetAdditional?: string,
  city: string,
  region: string,
  postalCode: string,
  country: string,
  title: string,
  givenName: string,
  familyName: string,
  email: string
}

interface MetaData {
  order_id: number,
  increment_id: string
}

interface Line {
    type: string,
    sku: string,
    name: string,
    productUrl: string,
    imageUrl: string,
    quantity: number,
    vatRate: number,
    unitPrice: {
      currency: string,
      value: number
    },
    totalAmount: {
      currency: string,
      value: number
    },
    discountAmount?: {
      currency: string,
      value: number
    },
    vatAmount?: {
      currency: string,
      value: number
    }
}

interface Lines extends Array<Line> {}

export interface createOrder {
  amount: Amount,
  billingAddress: BillingAddress,
  shippingAddress: ShippingAddress,
  metadata: MetaData,
  consumerDateOfBirth: string,
  locale: string,
  orderNumber: number,
  redirectUrl: string,
  webhookUrl: string,
  method: string,
  lines: Lines
}
