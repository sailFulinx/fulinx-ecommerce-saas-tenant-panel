interface CreateCouponParams {
  /* Coupon Name */
  couponName: string

  /* Coupon Type */
  couponType: number

  /* Coupon Value */
  couponValue?: number

  /* Coupon Rule Type */
  couponRuleType?: number

  /* Coupon Rule Value */
  couponRuleValue?: number

  /* Customer Retention Cycle */
  customerRetentionCycle?: number

  /* Issue Count */
  issueCount: number

  /* Started Time */
  startedTime?: string

  /* Ended Time */
  endedTime?: string

  couponDescription?: string
}

interface RemoveCouponParams {
  ids: string[]
}

interface UpdateCouponNameParams {
  /* Coupon Id */
  couponId: string

  /* Coupon Name */
  couponName: string
}

interface UpdateCouponEndedTimeParams {
  /* Coupon Id */
  couponId: string

  /* Ended Time */
  endedTime: string
}

interface UpdateCouponStartedTimeParams {
  /* Coupon Id */
  couponId: string

  /* Started Time */
  startedTime: string
}

interface UpdateCouponIssueCountParams {
  /* Coupon Id */
  couponId: string

  /* Issue Count */
  issueCount: number
}

interface UpdateCouponRuleTypeParams {
  /* Coupon Id */
  couponId: string

  /* Coupon Rule Type */
  couponRuleType: number
}

interface UpdateCouponRuleRetentionCycleParams {
  /* Coupon Id */
  couponId: string

  /* Customer Retention Cycle */
  customerRetentionCycle: number
}

interface UpdateCouponStatusParams {
  /* Coupon Id */
  couponId: string

  /* Status */
  status: boolean
}

interface UpdateCouponTypeParams {
  /* Coupon Id */
  couponId: string

  /* Coupon Type */
  couponType: number
}

interface UpdateCouponValueParams {
  /* Coupon Id */
  couponId: string

  /* Coupon Value */
  couponValue: number

  /* Coupon Rule Value */
  couponRuleValue: number
}

interface UpdateCouponDescriptionParams {
  /* Coupon Id */
  couponId: string

  /* Coupon Description */
  couponDescription: string
}

interface CouponListParams {
  /* Coupon ID */
  couponId?: string

  /* Coupon Name */
  couponName?: string

  /* Coupon Type, 1-percentage, 2-fixed, 3-free shipping */
  couponType?: number

  /* 删除标识 */
  isDelete?: number
}

interface CouponListData {
  /* Coupon Name */
  couponName: string

  /* Coupon Type, 1-percentage, 2-fixed, 3-free shipping */
  couponType: number

  /* Coupon Rules */
  couponRules: string

  /* Issue Count */
  issueCount: number

  /* Started Time */
  startedTime: Record<string, unknown>

  /* Ended Time */
  endedTime: Record<string, unknown>

  /* Status，0-disabled, 1- enabled */
  status: boolean
}

interface CouponRule {
  couponRuleType: number
  customerInactiveDays: number
}
