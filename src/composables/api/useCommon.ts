// 文章类型列表
export const useArticleTypeList = (payload?: Partial<ArticleTypeListParams>, options: UseCommonOptions = {}) => {
  return useList<ArticleTypeData, ArticleTypeListParams>(fetchArticleTypeListApi, payload, options)
}

// 产品类型列表
export const useProductTypeList = (payload?: Partial<ProductTypeListParams>, options: UseCommonOptions = {}) => {
  return useList<ProductTypeData, ProductTypeListParams>(fetchProductTypeListApi, payload, options)
}

// 产品来源类型列表
export const useProductSourceTypeList = (
  payload?: Partial<ProductSourceTypeListParams>,
  options: UseCommonOptions = {},
) => {
  return useList<ProductSourceTypeData, ProductSourceTypeListParams>(fetchProductSourceTypeListApi, payload, options)
}

// 年龄组类型列表
export const useAgeGroupTypeList = (payload?: Partial<AgeGroupTypeListParams>, options: UseCommonOptions = {}) => {
  return useList<AgeGroupTypeData, AgeGroupTypeListParams>(fetchAgeGroupTypeListApi, payload, options)
}

// 条件类型列表
export const useConditionTypeList = (payload?: Partial<ConditionTypeListParams>, options: UseCommonOptions = {}) => {
  return useList<ConditionTypeData, ConditionTypeListParams>(fetchConditionTypeListApi, payload, options)
}

// 性别类型列表
export const useGenderTypeList = (payload?: Partial<GenderTypeListParams>, options: UseCommonOptions = {}) => {
  return useList<GenderTypeData, GenderTypeListParams>(fetchGenderTypeListApi, payload, options)
}

// 仓库类型列表
export const useWarehouseTypeList = (payload?: Partial<WarehouseTypeListParams>, options: UseCommonOptions = {}) => {
  return useList<WarehouseTypeData, WarehouseTypeListParams>(fetchWarehouseTypeListApi, payload, options)
}

// 库存状态列表
export const useProductStockStatusList = (
  payload?: Partial<ProductStockStatusListParams>,
  options: UseCommonOptions = {},
) => {
  return useList<ProductStockStatusData, ProductStockStatusListParams>(fetchProductStockStatusListApi, payload, options)
}

// 重量单位列表
export const useWeightUnitList = (payload?: Partial<CommonEnumListParams>, options: UseCommonOptions = {}) => {
  return useList<CommonEnumData, CommonEnumListParams>(fetchWeightUnitListApi, payload, options)
}

// 长度单位列表
export const useLengthUnitList = (payload?: Partial<CommonEnumListParams>, options: UseCommonOptions = {}) => {
  return useList<CommonEnumData, CommonEnumListParams>(fetchLengthUnitListApi, payload, options)
}
