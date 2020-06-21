export interface Method {
  title: string
  code: string,
  image: object,
  pricing?: object
  pspMethod: boolean,
  issuers?: object
}

interface Methods extends Array<Method> {}

export interface FetchMethodsParams {
  locale: string
  amount: object
}

export interface PaymentMethodData {
  paymentMethod: object 
  paymentMethodAdditionalData: string
}

export interface PaymentServiceState {
  payment_methods: Methods
  issuer: object
  paymentMethodData: PaymentMethodData
  paymentStatusFetched: boolean
}
