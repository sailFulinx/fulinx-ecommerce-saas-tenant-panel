import request from '@/utils/axios'

export function createCategoryApi(data: CategoryCreateRequestParams): Promise<IResponse<CategoryData & CommonField>> {
  return request.post({
    url: 'system/category',
    data,
    token: true,
  })
}

export function removeCategoryApi(data: RemoveCategoryParams): Promise<IResponse<boolean>> {
  return request.delete({
    url: 'system/category',
    data,
    token: true,
  })
}

export function editCategoryApi(
  id: string,
  data: CategoryRequestParams,
): Promise<IResponse<CategoryData & CommonField>> {
  return request.put({
    url: `system/category/${id}`,
    data,
    token: true,
  })
}

export function editCategoryLayoutApi(
  data: CategoryUpdateLayoutParams,
): Promise<IResponse<CategoryShowData & CommonField>> {
  return request.post({
    url: 'system/category/update/layout',
    data,
    token: true,
  })
}

export function editCategorySortApi(
  data: CategoryUpdateLayoutSort,
): Promise<IResponse<CategoryShowData & CommonField>> {
  return request.post({
    url: 'system/category/update/sort',
    data,
    token: true,
  })
}

export function editCategoryTypeApi(
  data: CategoryUpdateCategoryTypeParams,
): Promise<IResponse<CategoryShowData & CommonField>> {
  return request.post({
    url: 'system/category/update/category/type',
    data,
    token: true,
  })
}

export function editCategoryStatusApi(
  data: CategoryUpdateStatusParams,
): Promise<IResponse<CategoryShowData & CommonField>> {
  return request.post({
    url: 'system/category/update/status',
    data,
    token: true,
  })
}

export function editCategoryParentApi(
  data: CategoryUpdateParentParams,
): Promise<IResponse<CategoryShowData & CommonField>> {
  return request.post({
    url: 'system/category/update/parent',
    data,
    token: true,
  })
}

export function createCategoryNameApi(
  data: CategoryCreateCategoryNameParams,
): Promise<IResponse<CategoryShowData & CommonField>> {
  return request.post({
    url: 'system/category/create/categoryName',
    data,
    token: true,
  })
}

export function createCategorySeoApi(
  data: CategoryCreateCategorySeoParams,
): Promise<IResponse<CategoryShowData & CommonField>> {
  return request.post({
    url: 'system/category/create/categorySeo',
    data,
    token: true,
  })
}

export function createCategorySlugApi(
  data: CategoryCreateCategorySlugParams,
): Promise<IResponse<CategoryShowData & CommonField>> {
  return request.post({
    url: 'system/category/create/categorySlug',
    data,
    token: true,
  })
}

export function editCategoryNameApi(
  data: CategoryUpdateCategoryNameParams,
): Promise<IResponse<CategoryShowData & CommonField>> {
  return request.post({
    url: 'system/category/update/categoryName',
    data,
    token: true,
  })
}

export function editCategoryDescriptionApi(
  data: CategoryUpdateCategoryDescriptionParams,
): Promise<IResponse<CategoryShowData & CommonField>> {
  return request.post({
    url: 'system/category/update/categoryDescription',
    data,
    token: true,
  })
}

export function editCategoryFileApi(
  data: CategoryUpdateCategoryFileParams,
): Promise<IResponse<CategoryShowData & CommonField>> {
  return request.post({
    url: 'system/category/update/categoryFile',
    data,
    token: true,
  })
}

export function editCategoryCustomApi(
  data: CategoryUpdateCategoryCustomParams,
): Promise<IResponse<CategoryShowData & CommonField>> {
  return request.post({
    url: 'system/category/update/categoryCustom',
    data,
    token: true,
  })
}

export function editCategorySeoApi(
  data: CategoryUpdateCategorySeoParams,
): Promise<IResponse<CategoryShowData & CommonField>> {
  return request.post({
    url: 'system/category/update/categorySeo',
    data,
    token: true,
  })
}

export function editCategorySlugApi(
  data: CategoryUpdateCategorySlugParams,
): Promise<IResponse<CategoryShowData & CommonField>> {
  return request.post({
    url: 'system/category/update/categorySlug',
    data,
    token: true,
  })
}

export function showCategoryApi(data: ShowCategoryParams): Promise<IResponse<CategoryShowData & CommonField>> {
  return request.post({
    url: 'system/category/show',
    data,
    token: true,
  })
}

export function listCategoryApi(data?: CategoryListParams): Promise<IResponse<ListCategoryRes>> {
  return request.post({
    url: 'system/category/list',
    data,
    token: true,
  })
}

export function paginationCategoryApi(data: CategoryListParams & Pagination): Promise<IResponse<ListCategoryRes>> {
  return request.post({
    url: 'system/category/pagination',
    data,
    token: true,
  })
}
