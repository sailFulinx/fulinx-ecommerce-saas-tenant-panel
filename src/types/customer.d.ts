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
