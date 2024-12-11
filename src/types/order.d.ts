interface OrderHistoryListResultDo {
  /* Order ID */
  orderId: string

  /* Order Status */
  orderStatus: number

  /* Order Comment */
  orderComment: string
}

interface OrderAddressListResultDo {
  /* Order ID */
  orderId: string

  /* Customer ID */
  customerId: string

  /* Customer Address ID */
  customerAddressId: string

  /* Full Name */
  fullName: string

  /* Telephone */
  telephone: string

  /* Administrative Province ID */
  administrativeProvinceId: string

  /* Administrative Province Short Name */
  administrativeProvinceShortName: string

  /* Administrative Province Full Name */
  administrativeProvinceFullName: string

  /* Administrative City ID */
  administrativeCityId: string

  /* Administrative CIty Short Name */
  administrativeCityShortName: string

  /* Administrative CIty Full Name */
  administrativeCityFullName: string

  /* Administrative District ID */
  administrativeDistrictId: string

  /* Administrative District Short Name */
  administrativeDistrictShortName: string

  /* Administrative District Full Name */
  administrativeDistrictFullName: string

  /* Address 1 */
  address1: string

  /* Address 2 */
  address2: string

  /* Postcode */
  postcode: string
}

interface OrderProductListResultDo {
  /* Order ID */
  orderId: string

  /* Customer ID */
  customerId: string

  /* Order Price */
  orderPrice: number

  /* Order Quantity */
  orderQuantity: number

  /* Subtotal Amount */
  subtotalAmount: number

  /* Product ID */
  productId: string

  /* SKU */
  sku: string

  /* MPN */
  mpn: string

  /* Product Type, 1: Simple 2: Configurable 3: Virtual */
  productType: number

  /* Is Required Shipping */
  isRequiredShipping: boolean

  /* Is Setting Online Time */
  isSettingOnlineTime: boolean

  /* Online Time */
  onlineTime: string

  /* Is Setting Offline Time */
  isSettingOfflineTime: boolean

  /* Offline Time */
  offlineTime: string

  /* In Stock Quantity */
  inStockQuantity: number

  /* Processing Quantity */
  processingQuantity: number

  /* Processing Days */
  processingDays: number

  /* Production Cycle */
  productionCycle: number

  /* Brand ID */
  brandId: string

  /* Brand Name */
  brandName: string

  /* Supplier ID */
  supplierId: string

  /* Supplier Name */
  supplierName: string

  /* Parameter Group ID */
  parameterGroupId: string

  /* Is Custom Layout */
  isCustomLayout: boolean

  /* Layout ID */
  layoutId: string

  /* Sort */
  sort: number

  /* Status, 0 - Disabled , 1 - Enabled */
  status: boolean

  /* Product Category */
  productCategory: string

  /* Product Detail */
  productDetail: string

  /* Product Measure */
  productMeasure: string

  /* Product File */
  productFile: string

  /* Product Other */
  productOther: string

  /* Product Price */
  productPrice: string

  /* Product Seo */
  productSeo: string

  /* Product Parameter */
  productParameter: string

  /* Product Tag */
  productTag: string
}

interface OrderData {
  /* Site ID */
  siteId: string

  /* Customer ID */
  customerId: string

  /* Cart Ids */
  cartIds: string

  /* Currency ID */
  currencyId: string

  /* Currency Code */
  currencyCode: string

  currencyVo: CurrencyData & CommonField

  /* Customer Email */
  customerEmail: string

  /* Shipping Method Code */
  shippingMethodCode: string

  /* Payment Method Code */
  paymentMethodCode: string

  /* Order Total Quantity */
  orderTotalQuantity: number

  /* Order Total Amount */
  orderTotalAmount: number

  /* Order Status */
  orderStatus: number

  orderStatusText: string

  /* IP Address */
  ipAddress: string

  /* User Agent */
  userAgent: string

  /* Approval Status, 0-notYetApproved, 1-approved, 2-rejected */
  approvalStatus: number

  approvalStatusText: string

  /* Reject Reason */
  rejectReason: string

  /* Order Product List Result Dos */
  orderProductListResultDos: (OrderProductListResultDo & CommonField)[]

  /* Order Address List Result Dos */
  orderAddressListResultDos: (OrderAddressListResultDo & CommonField)[]

  /* Order Status History List Result Dos */
  orderHistoryListResultDos: (OrderHistoryListResultDo & CommonField)[]

  products: any[]
}

interface OrderListParams {
  /* Customer Order ID */
  orderId?: string | null

  /* Site ID */
  siteId?: string

  /* Order Amount */
  orderAmount?: number

  /* Currency ID */
  currencyId?: string

  /* Order Status */
  orderStatus?: number | null

  /* Soft Delete Flag */
  isDelete?: number
}
