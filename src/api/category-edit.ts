// 更新分类自定义信息
export function categoryCustomEditApi(data: CategoryCustomParams): Promise<IResponse<CategoryShowData & CommonField>> {
  return request.post({
    url: 'system/category/update/categoryCustom',
    data,
    token: true,
  })
}

// 更新分类描述
export function categoryDescriptionEditApi(data: CategoryDescriptionParams): Promise<IResponse<CategoryShowData>> {
  return request.post({
    url: 'system/category/update/categoryDescription',
    data,
    token: true,
  })
}

export function categoryShortDescriptionEditApi(data: CategoryShortDescriptionParams): Promise<IResponse<CategoryShowData>> {
  return request.post({
    url: 'system/category/update/categoryShortDescription',
    data,
    token: true,
  })
}

// 更新分类名称
export function categoryNameEditApi(data: CategoryNameParams): Promise<IResponse<CategoryShowData>> {
  return request.post({
    url: 'system/category/update/categoryName',
    data,
    token: true,
  })
}

export function categoryShortNameEditApi(data: CategoryShortNameParams): Promise<IResponse<CategoryShowData>> {
  return request.post({
    url: 'system/category/update/categoryShortName',
    data,
    token: true,
  })
}

// 更新分类文件
export function categoryFileEditApi(data: CategoryFileParams): Promise<IResponse<CategoryShowData>> {
  return request.post({
    url: 'system/category/update/categoryFile',
    data,
    token: true,
  })
}

// 更新分类SEO信息
export function categorySeoEditApi(data: CategorySeoParams): Promise<IResponse<CategoryShowData>> {
  return request.post({
    url: 'system/category/update/categorySeo',
    data,
    token: true,
  })
}

// 更新分类Slug信息
export function categorySlugEditApi(data: CategorySlugParams): Promise<IResponse<CategoryShowData>> {
  return request.post({
    url: 'system/category/update/categorySlug',
    data,
    token: true,
  })
}

// 更新分类布局
export function categoryLayoutEditApi(data: CategoryLayoutParams): Promise<IResponse<CategoryShowData>> {
  return request.post({
    url: 'system/category/update/layout',
    data,
    token: true,
  })
}

// 更新分类父级
export function categoryParentEditApi(data: CategoryParentParams): Promise<IResponse<CategoryShowData>> {
  return request.post({
    url: 'system/category/update/parent',
    data,
    token: true,
  })
}

// 更新分类状态
export function categoryStatusEditApi(data: CategoryStatusParams): Promise<IResponse<CategoryShowData>> {
  return request.post({
    url: 'system/category/update/status',
    data,
    token: true,
  })
}

export function categorySortEditApi(data: CategorySortParams): Promise<IResponse<CategoryShowData>> {
  return request.post({
    url: 'system/category/update/sort',
    data,
    token: true,
  })
}

export function categoryIsTopEditApi(data: CategoryIsTopParams): Promise<IResponse<CategoryShowData>> {
  return request.post({
    url: 'system/category/update/IsTop',
    data,
    token: true,
  })
}
