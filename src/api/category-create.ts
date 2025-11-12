// 新增分类
export function categoryCreateApi(data: CategoryCreateParams): Promise<IResponse<CategoryCreateRes>> {
  return request.post({
    url: 'system/category',
    data,
    token: true,
  })
}

// 新增分类名称
export function categoryNameCreateApi(data: CategoryNameCreateParams): Promise<IResponse<CategoryShowData>> {
  return request.post({
    url: 'system/category/create/categoryName',
    data,
    token: true,
  })
}

// 新增分类SEO信息
export function categorySeoCreateApi(data: CategorySeoCreateParams): Promise<IResponse<CategoryShowData>> {
  return request.post({
    url: 'system/category/create/categorySeo',
    data,
    token: true,
  })
}

// 新增分类Slug信息
export function categorySlugCreateApi(data: CategorySlugCreateParams): Promise<IResponse<CategoryShowData>> {
  return request.post({
    url: 'system/category/create/categorySlug',
    data,
    token: true,
  })
}
