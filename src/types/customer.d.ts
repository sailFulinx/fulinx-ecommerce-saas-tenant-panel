interface CustomerListParams {
  /* Customer Id */
  customerId?: string

  /* Email */
  email?: string | null

  /* Status, 0: Disabled 1: Enabled */
  status?: boolean
}

interface CustomerListData {
  /* Site ID */
  siteId: string

  /* Email */
  email: string

  /* User Name */
  userName: string

  /* Telephone */
  telephone: string

  /* Password */
  password: string

  /* Salt */
  salt: string

  /* Email Verification Status: 0 - Unverified, 1 - Verified */
  isEmailVerify: number

  /* Status: 0-Disabled,1-Enabled */
  status: number
}

interface CustomerAddressListResultDo {
  /* Full Name */
  fullName: string

  /* Telephone */
  telephone: string

  /* Customer ID */
  customerId: string

  /* Administrative Province ID */
  administrativeProvinceId: string

  /* Administrative Province Short Name */
  administrativeProvinceShortName: string

  /* Administrative Province Full Name */
  administrativeProvinceFullName: string

  /* Administrative City ID */
  administrativeCityId: string

  /* Administrative Province Short Name */
  administrativeCityShortName: string

  /* Administrative Province Full Name */
  administrativeCityFullName: string

  /* Administrative District ID */
  administrativeDistrictId: string

  /* Administrative Province Short Name */
  administrativeDistrictShortName: string

  /* Administrative Province Full Name */
  administrativeDistrictFullName: string

  /* Address 1 */
  address1: string

  /* Address 2 */
  address2: string

  /* Postcode */
  postcode: string

  /* Is Default, 0 - No, 1 - Yes */
  isDefault: boolean
}

interface CustomerProfileVo {
  /* Customer ID */
  customerId: string

  /* Avatar File ID */
  avatarFileId: string

  /* Nick Name */
  nickName: string

  /* First Name */
  realName: string

  /* Birthday */
  birthday: string

  /* Telephone */
  telephone: string

  /* Gender, 1 - Male, 2 - Female */
  gender: number

  /* Company */
  companyName: string

  /* Company Address Province ID */
  companyAddressProvinceId: string

  /* Company Address Province Short Name */
  companyAddressProvinceShortName: string

  /* Company Address City ID */
  companyAddressCityId: string

  /* Company Address City Short Name */
  companyAddressCityShortName: string

  /* Company Address District ID */
  companyAddressDistrictId: string

  /* Company Address District Short Name */
  companyAddressDistrictShortName: string

  /* Post */
  companyAddress: string

  /* Company Phone Number */
  companyPhoneNumber: string

  /* Bank Name */
  bankName: string

  /* Bank Number */
  bankNumber: string

  /* Tax Number */
  taxNumber: string
}

interface CustomerShowData {
  /* Site ID */
  siteId: string

  /* Email */
  email: string

  /* User Name */
  userName: string

  /* Telephone */
  telephone: string

  /* Password */
  password: string

  /* Salt */
  salt: string

  /* Email Verification Status: 0 - Unverified, 1 - Verified */
  isEmailVerify: number

  /* Status: 0-Disabled,1-Enabled */
  status: number

  /* */
  customerProfileVo: CustomerProfileVo & CommonField

  /* Customer Address List Result Dos */
  customerAddressListResultDos: (CustomerAddressListResultDo & CommonField)[]
}

interface CustomerInvoiceListParams {
  email?: string | null
  /* Customer Invoice ID */
  customerInvoiceId?: string

  /* Customer ID */
  customerId?: string

  /* Invoice Number */
  invoiceNumber?: string

  /* Status, 0: unreviewed, 1-reviewed, 2-review rejected, 3-Issued */
  status?: number

  /* 删除标识 */
  isDelete?: number
}

interface CustomerInvoiceListData {
  /* Customer ID */
  customerId: string

  /* */
  email: string

  /* Invoice Type, 1-Normal, 2-Special */
  invoiceType: number

  /* Invoice Number */
  invoiceNumber: string

  /* Invoice Amount */
  invoiceAmount: number

  /* Company */
  companyName: string

  /* Company Address Province ID */
  companyAddressProvinceId: string

  /* Company Address Province Full Name */
  companyAddressProvinceFullName: string

  /* Company Address Province Short Name */
  companyAddressProvinceShortName: string

  /* Company Address City ID */
  companyAddressCityId: string

  /* Company Address City Full Name */
  companyAddressCityFullName: string

  /* Company Address City Short Name */
  companyAddressCityShortName: string

  /* Company Address District ID */
  companyAddressDistrictId: string

  /* Company Address District Full Name */
  companyAddressDistrictFullName: string

  /* Company Address District Short Name */
  companyAddressDistrictShortName: string

  /* Post */
  companyAddress: string

  /* Company Phone Number */
  companyPhoneNumber: string

  /* Bank Name */
  bankName: string

  /* Bank Number */
  bankNumber: string

  /* Tax Number */
  taxNumber: string

  /* Status, 0: unreviewed, 1-reviewed, 2-review rejected, 3-Issued */
  status: number

  /* Status, 0: unreviewed, 1-reviewed, 2-review rejected, 3-Issued */
  statusText: string

  /* Invoice File ID */
  invoiceFileId: string

  /* */
  invoiceFileVo: FileData & CommonField

  /* Rejected Reason */
  rejectedReason: string

  /* Review Operator Name */
  reviewOperatorName: string
}

interface CustomerInvoiceShowData {
  /* Customer ID */
  customerId: string

  email: string

  /* Invoice Type, 1-Normal, 2-Special */
  invoiceType: number

  /* Invoice Number */
  invoiceNumber: string

  /* Invoice Amount */
  invoiceAmount: number

  /* Company */
  companyName: string

  /* Company Address Province ID */
  companyAddressProvinceId: string

  /* Company Address Province Full Name */
  companyAddressProvinceFullName: string

  /* Company Address Province Short Name */
  companyAddressProvinceShortName: string

  /* Company Address City ID */
  companyAddressCityId: string

  /* Company Address City Full Name */
  companyAddressCityFullName: string

  /* Company Address City Short Name */
  companyAddressCityShortName: string

  /* Company Address District ID */
  companyAddressDistrictId: string

  /* Company Address District Full Name */
  companyAddressDistrictFullName: string

  /* Company Address District Short Name */
  companyAddressDistrictShortName: string

  /* Post */
  companyAddress: string

  /* Company Phone Number */
  companyPhoneNumber: string

  /* Bank Name */
  bankName: string

  /* Bank Number */
  bankNumber: string

  /* Tax Number */
  taxNumber: string

  /* Status, 0: unreviewed, 1-reviewed, 2-review rejected, 3-Issued */
  status: number

  /* Status, 0: unreviewed, 1-reviewed, 2-review rejected, 3-Issued */
  statusText: string

  /* Invoice File ID */
  invoiceFileId: string

  /* */
  invoiceFileVo: FileData & CommonField

  /* Rejected Reason */
  rejectedReason: string

  /* Review Operator Name */
  reviewOperatorName: string

  /* Customer Invoice Order Relation List Result Dos */
  customerInvoiceOrderRelationListResultDos: {
    /* Customer Invoice Order Relation ID */
    id: string

    /* Customer Invoice ID */
    customerInvoiceId: string

    /* Order ID */
    orderId: string

    /* Order Total Amount */
    orderTotalAmount: number

    /* Soft Delete Flag */
    isDelete: number

    /* Remark */
    remark: string

    /* Record Version */
    recordVersion: number

    /* Record Create Name */
    recordCreateName: string

    /* Record Update Name */
    recordUpdateName: string

    /* Record Create Time */
    recordCreateTime: string

    /* Record Update Time */
    recordUpdateTime: string
  }[]
}

interface ApprovalCustomerInvoiceParams {
  /* Customer Invoice ID */
  customerInvoiceId: string

  /* Status, 0: unreviewed, 1-reviewed, 2-review rejected, 3-Issued */
  status: number

  /* Rejected Reason */
  rejectedReason?: string
}

interface ApprovalCustomerInvoiceUploadParams {
  /* Customer Invoice ID */
  customerInvoiceId: string

  /* Invoice Number */
  invoiceNumber: string

  /* Invoice File ID */
  invoiceFileId: string
}
