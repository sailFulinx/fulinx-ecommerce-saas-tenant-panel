<script setup lang="ts">
import type { CascaderNodePathValue, CascaderNodeValue, InputInstance, Table } from 'element-plus'
import { debounce } from 'lodash-es'
import Editor from '@/components/common/Editor.vue'
import { convertCategoryToCascaderOptions, convertSystemCategoryToCascaderOptions, formatTime } from '@/utils'
import CustomsTable from './CustomsTable.vue'

interface Props {
  productData?: ShowProduct & CommonField
  productDetail?: ProductAdminLocalizedViewDo
  languageId: string
  productId: string
  systemCategoryNames: string[]
  systemCategoryListData: TableResponse<SystemCategoryData & CommonField>
  productSourceTypeListData: TableResponse<ProductSourceTypeData>
  ageGroupTypeListData: TableResponse<AgeGroupTypeData>
  genderTypeListData: TableResponse<GenderTypeData>
  conditionTypeListData: TableResponse<ConditionTypeData>
  brandListData: TableResponse<BrandListData & CommonField>
  stockStatusListData: TableResponse<ProductStockStatusData>
}

const props = defineProps<Props>()

const emit = defineEmits<{
  resetFormData: [ShowProduct & CommonField]
  removeTag: [index: number]
  showInputTag: [index: number]
  inputTagConfirm: []
  cancelUpdateProductFile: []
  getRemoveFile: [index: number]
}>()

const { t: $t } = useLocale()

const loading = reactive({
  init: false,
  button: false,
})

// 添加系统分类相关变量
const inputSystemCategoryVisible = ref<boolean>(false)
const systemCategoryProps = {
  value: 'id',
  label: 'systemCategoryName',
  multiple: false,
}
const selectedSystemCategoryValue = ref<string[] | any>(props.productData?.systemCategoryIds || [])
const deletedSystemCategoryValue = ref<string[] | any>([])

const handleRemoveSystemCategory = (val: CascaderNodeValue | CascaderNodePathValue) => {
  deletedSystemCategoryValue.value.push(val)
}

// 系统分类相关方法
const handleClickUpdateSystemCategory = () => {
  selectedSystemCategoryValue.value = props.productData?.systemCategoryIds || []
  inputSystemCategoryVisible.value = true
}

const handleCancelUpdateSystemCategory = () => {
  inputSystemCategoryVisible.value = false
}

const handleConfirmEditSystemCategory = async () => {
  if (!props.productId || !props.languageId) {
    return
  }

  loading.button = true
  inputSystemCategoryVisible.value = false

  // 计算需要删除的分类ID
  const originalIds = [...new Set((props.productData?.systemCategoryIds || []).flat() as string[])]
  const currentIds = [...new Set(selectedSystemCategoryValue.value.flat() as string[])]

  // 找出被删除的分类（原本有现在没有的）
  const deletedIds = originalIds.filter(id => !currentIds.includes(id))
  // 合并通过remove-tag删除的分类
  const directlyDeletedIds = [...new Set(deletedSystemCategoryValue.value.flat() as string[])]
  // 合并所有删除的分类
  const deletedSystemCategoryIds = [...new Set([...deletedIds, ...directlyDeletedIds])]
  loading.button = false
  const { data } = await updateProductSystemCategoryApi({
    productId: props.productId,
    languageId: props.languageId,
    systemCategoryIds: currentIds,
    deletedSystemCategoryIds,
  }).catch((error: any) => {
    loading.button = false
    throw error
  })
  selectedSystemCategoryValue.value = []
  deletedSystemCategoryValue.value = []
  loading.button = false
  ElMessage.success($t('success.edit'))
  emit('resetFormData', data)
}

// 产品名称相关
const inputProductNameVisible = ref<boolean>(false)
const currentProductName = ref<string>('')
// 产品短名称相关
const inputProductShortNameVisible = ref<boolean>(false)
const currentProductShortName = ref<string>('')

// 品牌相关
const inputBrandVisible = ref<boolean>(false)
const currentBrandId = ref<string>('')

// 产品来源类型相关
const inputProductSourceTypeVisible = ref<boolean>(false)
const currentProductSourceType = ref()

// 成人用品相关
const inputIsAdultVisible = ref<boolean>(false)
const currentIsAdult = ref<boolean>(false)

// 年龄组类型相关
const inputAgeGroupTypeVisible = ref<boolean>(false)
const currentAgeGroupType = ref()

// 性别类型相关
const inputGenderTypeVisible = ref<boolean>(false)
const currentGenderType = ref()

// 条件类型相关
const inputConditionTypeVisible = ref<boolean>(false)
const currentConditionType = ref()

const handleClickUpdateProductName = (productName: string) => {
  currentProductName.value = productName
  inputProductNameVisible.value = true
}

const handleCancelUpdateProductName = () => {
  inputProductNameVisible.value = false
}

const editProductName = async (productDetailId: string) => {
  if (!currentProductName.value) {
    ElMessage.warning($t('product.error.productName'))
    return
  }
  const { data } = await updateProductNameApi({
    productName: currentProductName.value,
    productDetailId,
  }).catch(error => {
    throw error
  })
  currentProductName.value = ''
  inputProductNameVisible.value = false
  ElMessage.success($t('success.edit'))
  emit('resetFormData', data)
}

// 产品短名称相关方法
const handleClickUpdateProductShortName = (productShortName: string) => {
  currentProductShortName.value = productShortName
  inputProductShortNameVisible.value = true
}

const handleCancelUpdateProductShortName = () => {
  inputProductShortNameVisible.value = false
}

const editProductShortName = async (productDetailId: string) => {
  // 短名称可以为空
  const { data } = await updateProductShortNameApi({
    productShortName: currentProductShortName.value,
    productDetailId,
  }).catch(error => {
    throw error
  })
  currentProductShortName.value = ''
  inputProductShortNameVisible.value = false
  ElMessage.success($t('success.edit'))
  emit('resetFormData', data)
}

// 品牌相关方法
const handleClickUpdateBrand = (brandId: string) => {
  currentBrandId.value = brandId
  inputBrandVisible.value = true
}

const handleCancelUpdateBrand = () => {
  inputBrandVisible.value = false
}

const editBrand = async () => {
  if (!currentBrandId.value) {
    ElMessage.warning($t('product.error.brand'))
    return
  }
  const { data } = await updateProductBrandApi({
    brandId: currentBrandId.value,
    productId: props.productId,
    languageId: props.languageId,
  }).catch(error => {
    throw error
  })
  inputBrandVisible.value = false
  ElMessage.success($t('success.edit'))
  emit('resetFormData', data)
}

// 产品来源类型相关方法
const handleClickUpdateProductSourceType = () => {
  if (props.productData?.productSourceType) {
    currentProductSourceType.value = props.productData.productSourceType
  }
  inputProductSourceTypeVisible.value = true
}

const handleCancelUpdateProductSourceType = () => {
  inputProductSourceTypeVisible.value = false
}

const editProductSourceType = async () => {
  if (currentProductSourceType.value === undefined || currentProductSourceType.value === null) {
    ElMessage.warning($t('product.error.productSourceType'))
    return
  }
  const { data } = await updateProductSourceTypeApi({
    productSourceType: currentProductSourceType.value,
    productId: props.productId,
    languageId: props.languageId,
  }).catch(error => {
    throw error
  })
  inputProductSourceTypeVisible.value = false
  ElMessage.success($t('success.edit'))
  emit('resetFormData', data)
}

// 成人用品相关方法
const handleClickUpdateIsAdult = (isAdult: boolean) => {
  currentIsAdult.value = isAdult
  inputIsAdultVisible.value = true
}

const handleCancelUpdateIsAdult = () => {
  inputIsAdultVisible.value = false
}

const editIsAdult = async () => {
  const { data } = await updateProductIsAdultApi({
    isAdult: currentIsAdult.value,
    languageId: props.languageId,
    productId: props.productId,
  }).catch(error => {
    throw error
  })
  inputIsAdultVisible.value = false
  ElMessage.success($t('success.edit'))
  emit('resetFormData', data)
}

// 年龄组类型相关方法
const handleClickUpdateAgeGroupType = () => {
  if (props.productData?.ageGroupType) {
    currentAgeGroupType.value = props.productData?.ageGroupType
  }
  inputAgeGroupTypeVisible.value = true
}

const handleCancelUpdateAgeGroupType = () => {
  inputAgeGroupTypeVisible.value = false
}

const editAgeGroupType = async () => {
  if (currentAgeGroupType.value === undefined || currentAgeGroupType.value === null) {
    ElMessage.warning($t('product.error.ageGroupType'))
    return
  }
  const { data } = await updateProductAgeGroupTypeApi({
    ageGroupType: currentAgeGroupType.value,
    languageId: props.languageId,
    productId: props.productId,
  }).catch(error => {
    throw error
  })
  inputAgeGroupTypeVisible.value = false
  ElMessage.success($t('success.edit'))
  emit('resetFormData', data)
}

// 性别类型相关方法
const handleClickUpdateGenderType = () => {
  if (props.productData?.genderType) {
    currentGenderType.value = props.productData?.genderType
  }
  inputGenderTypeVisible.value = true
}

const handleCancelUpdateGenderType = () => {
  inputGenderTypeVisible.value = false
}

const editGenderType = async () => {
  if (currentGenderType.value === undefined || currentGenderType.value === null) {
    ElMessage.warning($t('product.error.genderType'))
    return
  }
  const { data } = await updateProductGenderTypeApi({
    genderType: currentGenderType.value,
    productId: props.productId,
    languageId: props.languageId,
  }).catch(error => {
    throw error
  })
  inputGenderTypeVisible.value = false
  ElMessage.success($t('success.edit'))
  emit('resetFormData', data)
}

// 条件类型相关方法
const handleClickUpdateConditionType = () => {
  if (props.productData?.conditionType) {
    currentConditionType.value = props.productData?.conditionType
  }
  inputConditionTypeVisible.value = true
}

const handleCancelUpdateConditionType = () => {
  inputConditionTypeVisible.value = false
}

const editConditionType = async () => {
  if (currentConditionType.value === undefined || currentConditionType.value === null) {
    ElMessage.warning($t('product.error.conditionType'))
    return
  }
  const { data } = await updateProductConditionTypeApi({
    conditionType: currentConditionType.value,
    languageId: props.languageId,
    productId: props.productId,
  }).catch(error => {
    throw error
  })
  inputConditionTypeVisible.value = false
  ElMessage.success($t('success.edit'))
  emit('resetFormData', data)
}

const createProductName = async () => {
  if (!currentProductName.value) {
    ElMessage.warning($t('product.error.productName'))
    return
  }
  const { data } = await createProductNameApi({
    productName: currentProductName.value,
    productId: props.productId,
    languageId: props.languageId,
  })
  currentProductName.value = ''
  ElMessage.success($t('success.create'))
  emit('resetFormData', data)
}

// 产品描述相关
const isExpanded = ref(false)
const inputProductDescriptionVisible = ref<boolean>(false)
const currentProductDescription = ref<string>('<p></p>')
// 产品短描述相关
const inputProductShortDescriptionVisible = ref<boolean>(false)
const currentProductShortDescription = ref<string>('')
const editorRefs = ref()

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

const handleClickUpdateProductDescription = async (productDescription: string) => {
  currentProductDescription.value = productDescription
  inputProductDescriptionVisible.value = true
  await nextTick(async () => {
    await editorRefs.value?.setEditorContent(productDescription)
  })
}

const handleCancelUpdateProductDescription = () => {
  inputProductDescriptionVisible.value = false
}

const editProductDescription = async (productDetailId: string) => {
  await nextTick()
  const editorInstance = editorRefs.value as any
  currentProductDescription.value = editorInstance?.getEditorContent()
  const { data } = await updateProductDescriptionApi({
    productDetailId,
    productDescription: currentProductDescription.value,
  }).catch(error => {
    throw error
  })
  currentProductDescription.value = ''
  inputProductDescriptionVisible.value = false
  ElMessage.success($t('success.edit'))
  emit('resetFormData', data)
}

// 产品短描述相关方法
const handleClickUpdateProductShortDescription = (productShortDescription: string) => {
  currentProductShortDescription.value = productShortDescription
  inputProductShortDescriptionVisible.value = true
}

const handleCancelUpdateProductShortDescription = () => {
  inputProductShortDescriptionVisible.value = false
}

const editProductShortDescription = async (productDetailId: string) => {
  // 短描述可以为空
  const { data } = await updateProductShortDescriptionApi({
    productDetailId,
    productShortDescription: currentProductShortDescription.value,
  }).catch(error => {
    throw error
  })
  currentProductShortDescription.value = ''
  inputProductShortDescriptionVisible.value = false
  ElMessage.success($t('success.edit'))
  emit('resetFormData', data)
}

// 标签相关
const inputProductTagVisible = ref<boolean>(false)
const inputTagValue = ref('')
const InputTagRefs = ref<InputInstance[]>([])

const handleShowInputTag = () => {
  inputProductTagVisible.value = true
  nextTick(() => {
    if (InputTagRefs.value && InputTagRefs.value[0]) {
      const inputEl = InputTagRefs.value[0].$el.querySelector('input')
      if (inputEl) {
        inputEl.focus()
      }
    }
  })
}

const handleRemoveTag = async (index: number) => {
  if (!props.productDetail) {
    return
  }
  const { data } = await removeProductTagApi({
    productTagId: props.productDetail.productTagListResultDos[index].id,
    languageId: props.languageId,
  }).catch(error => {
    throw error
  })
  ElMessage.success($t('success.edit'))
  emit('resetFormData', data)
}

const handleInputTagConfirm = debounce(async () => {
  if (!inputTagValue.value) {
    return
  }
  if (inputTagValue.value.length > 20) {
    ElMessage.warning($t('product.error.tagLength'))
    return
  }
  if (props.productDetail?.productTagListResultDos && props.productDetail?.productTagListResultDos.length >= 9) {
    ElMessage.warning($t('product.error.tagLimit'))
    return
  }
  const { data } = await createProductTagApi({
    productId: props.productId,
    languageId: props.languageId,
    tagName: inputTagValue.value.trim(),
  }).catch(error => {
    throw error
  })
  inputProductTagVisible.value = false
  inputTagValue.value = ''
  ElMessage.success($t('success.edit'))
  emit('resetFormData', data)
}, 500)

// 复制功能相关
const productAdminLocalizedViewDos = defineModel<ProductAdminLocalizedViewDo[]>('productAdminLocalizedViewDos', {
  required: true,
})
const copyLanguageCode = ref('')
const fromLanguageId = ref('')

const handleCopyProduct = async () => {
  if (!copyLanguageCode.value) {
    ElMessage.warning($t('product.error.copyLanguageCode'))
    return
  }

  // 查找源语言ID
  if (productAdminLocalizedViewDos.value) {
    productAdminLocalizedViewDos.value.forEach(item => {
      if (item.languageCode === copyLanguageCode.value) {
        fromLanguageId.value = item.languageId
      }
    })
  }

  if (!fromLanguageId.value) {
    ElMessage.warning($t('product.error.copyLanguageCode'))
    return
  }

  ElMessage.success($t('success.copy'))
  copyLanguageCode.value = ''
  fromLanguageId.value = ''
  // emit('resetFormData', data)
}

const resetData = (val: ShowProduct & CommonField) => {
  emit('resetFormData', val)
}
</script>

<template>
  <ElCard v-if="productDetail?.productDetailListResultDo" shadow="never" class="mb-5">
    <div class="w-full mt-0 pt-0">
      <!-- 系统分类 -->
      <div class="w-full flex border-b border-gray-200 p-4">
        <div class="w-30 font-semibold text-gray-700 flex-shrink-0">
          {{ $t('product.systemCategory') }}:
        </div>
        <div class="flex-1 w-full flex items-center">
          <span v-if="!inputSystemCategoryVisible" class="mr-2">
            <ElTag
              v-for="(systemCategoryName, index) in systemCategoryNames"
              :key="index"
              type="info"
              class="mr-2 mb-1"
            >
              {{ systemCategoryName }}
            </ElTag>
          </span>
          <span v-else>
            <ElCascader
              v-model="selectedSystemCategoryValue"
              clearable
              filterable
              :placeholder="`${$t('product.placeholder.systemCategory')}`"
              :props="systemCategoryProps"
              :options="convertSystemCategoryToCascaderOptions(systemCategoryListData.list)"
              class="mr-2 min-w-[300px]"
              @remove-tag="handleRemoveSystemCategory"
            />
            <EBtn text @click="handleCancelUpdateSystemCategory">
              <Icon icon="ep:close" :size="5" class="mr-1" />
            </EBtn>
            <EBtn type="primary" :loading="loading.button" @click="handleConfirmEditSystemCategory">
              {{ $t('common.save') }}
            </EBtn>
          </span>
          <EBtn v-if="!inputSystemCategoryVisible" type="primary" text @click="handleClickUpdateSystemCategory">
            <Icon icon="ep:edit" :size="5" class="mr-1" />
          </EBtn>
        </div>
      </div>
      <!-- 产品类型 -->
      <div class="w-full flex border-b border-gray-200 p-4">
        <div class="w-30 font-semibold text-gray-700 flex-shrink-0">
          {{ $t('product.productType') }}:
        </div>
        <div class="flex-1 w-full flex items-center">
          <span class="mr-2">
            {{ productData?.productTypeLabel }}
          </span>
        </div>
      </div>
      <!-- 产品名称 -->
      <div class="w-full flex border-b border-gray-200 p-4">
        <div class="w-30 font-semibold text-gray-700 flex-shrink-0">
          {{ $t('product.productName') }}:
        </div>
        <div class="flex-1 w-full flex items-center">
          <span v-if="!inputProductNameVisible" class="mr-2">
            {{ productDetail.productDetailListResultDo.productName }}
          </span>
          <span v-else>
            <ElInput
              v-model="currentProductName"
              clearable
              minlength="1"
              maxlength="250"
              style="width: 300px"
              class="mr-2"
              @blur="editProductName(productDetail.productDetailListResultDo.id)"
            />
            <EBtn text @click="handleCancelUpdateProductName">
              <Icon icon="ep:close" :size="5" class="mr-1" />
            </EBtn>
          </span>
          <EBtn
            v-if="!inputProductNameVisible"
            type="primary"
            text
            @click="handleClickUpdateProductName(productDetail.productDetailListResultDo.productName)"
          >
            <Icon icon="ep:edit" :size="5" class="mr-1" />
          </EBtn>
        </div>
      </div>
      <!-- 产品短名称 -->
      <div class="w-full flex border-b border-gray-200 p-4">
        <div class="w-30 font-semibold text-gray-700 flex-shrink-0">
          {{ $t('product.productShortName') }}:
        </div>
        <div class="flex-1 w-full flex items-center">
          <span v-if="!inputProductShortNameVisible" class="mr-2">
            {{ productDetail.productDetailListResultDo.productShortName }}
          </span>
          <span v-else>
            <ElInput
              v-model="currentProductShortName"
              clearable
              minlength="1"
              maxlength="250"
              style="width: 300px"
              class="mr-2"
              @blur="editProductShortName(productDetail.productDetailListResultDo.id)"
            />
            <EBtn text @click="handleCancelUpdateProductShortName">
              <Icon icon="ep:close" :size="5" class="mr-1" />
            </EBtn>
          </span>
          <EBtn
            v-if="!inputProductShortNameVisible"
            type="primary"
            text
            @click="handleClickUpdateProductShortName(productDetail.productDetailListResultDo.productShortName)"
          >
            <Icon icon="ep:edit" :size="5" class="mr-1" />
          </EBtn>
        </div>
      </div>
      <!-- 品牌 -->
      <div class="w-full flex border-b border-gray-200 p-4">
        <div class="w-30 font-semibold text-gray-700 flex-shrink-0">
          {{ $t('product.brand') }}:
        </div>
        <div class="flex-1 w-full flex items-center">
          <span v-if="!inputBrandVisible" class="mr-2">
            {{ productData?.brandListResultDo?.brandName }}
          </span>
          <span v-else>
            <ElSelect
              v-model="currentBrandId"
              clearable
              filterable
              placeholder="请选择品牌"
              style="width: 300px"
              class="mr-2"
              @blur="editBrand"
            >
              <ElOption
                v-for="brand in brandListData.list"
                :key="brand.id"
                :label="brand.brandName"
                :value="brand.id"
              />
            </ElSelect>
            <EBtn text @click="handleCancelUpdateBrand">
              <Icon icon="ep:close" :size="5" class="mr-1" />
            </EBtn>
          </span>
          <EBtn
            v-if="!inputBrandVisible"
            type="primary"
            text
            @click="handleClickUpdateBrand(productData?.brandListResultDo?.id || '')"
          >
            <Icon icon="ep:edit" :size="5" class="mr-1" />
          </EBtn>
        </div>
      </div>
      <!-- 产品来源类型 -->
      <div class="w-full flex border-b border-gray-200 p-4">
        <div class="w-30 font-semibold text-gray-700 flex-shrink-0">
          {{ $t('product.productSourceType') }}:
        </div>
        <div class="flex-1 w-full flex items-center">
          <span v-if="!inputProductSourceTypeVisible" class="mr-2">
            {{ productData?.productSourceTypeLabel }}
          </span>
          <span v-else class="flex items-center">
            <ElSelect
              v-model="currentProductSourceType"
              clearable
              filterable
              placeholder="请选择"
              style="width: 200px"
              @blur="editProductSourceType"
            >
              <ElOption
                v-for="item in productSourceTypeListData?.list || []"
                :key="item.id"
                :value="item.id"
                :label="item.productSourceTypeName"
              />
            </ElSelect>
            <EBtn text @click="handleCancelUpdateProductSourceType">
              <Icon icon="ep:close" :size="5" class="mr-1" />
            </EBtn>
          </span>
          <EBtn v-if="!inputProductSourceTypeVisible" type="primary" text @click="handleClickUpdateProductSourceType">
            <Icon icon="ep:edit" :size="5" class="mr-1" />
          </EBtn>
        </div>
      </div>
      <!-- 是否成人用品 -->
      <div class="w-full flex border-b border-gray-200 p-4">
        <div class="w-30 font-semibold text-gray-700 flex-shrink-0">
          {{ $t('product.isAdult') }}:
        </div>
        <div class="flex-1 w-full flex items-center">
          <span v-if="!inputIsAdultVisible" class="mr-2">
            {{ productData?.isAdult ? $t('common.yes') : $t('common.no') }}
          </span>
          <span v-else class="flex items-center">
            <ElSwitch v-model="currentIsAdult" class="mr-2" />
            <EBtn text @click="editIsAdult">
              <Icon icon="ep:check" :size="5" class="mr-1" />
            </EBtn>
            <EBtn text @click="handleCancelUpdateIsAdult">
              <Icon icon="ep:close" :size="5" class="mr-1" />
            </EBtn>
          </span>
          <EBtn
            v-if="!inputIsAdultVisible"
            type="primary"
            text
            @click="handleClickUpdateIsAdult(!!productData?.isAdult)"
          >
            <Icon icon="ep:edit" :size="5" class="mr-1" />
          </EBtn>
        </div>
      </div>
      <!-- 年龄组类型 -->
      <div class="w-full flex border-b border-gray-200 p-4">
        <div class="w-30 font-semibold text-gray-700 flex-shrink-0">
          {{ $t('product.ageGroupType') }}:
        </div>
        <div class="flex-1 w-full flex items-center">
          <span v-if="!inputAgeGroupTypeVisible" class="mr-2">
            {{ productData?.ageGroupTypeLabel }}
          </span>
          <span v-else class="flex items-center">
            <ElSelect
              v-model="currentAgeGroupType"
              clearable
              filterable
              placeholder="请选择"
              style="width: 200px"
              @blur="editAgeGroupType"
            >
              <ElOption
                v-for="item in ageGroupTypeListData?.list || []"
                :key="item.id"
                :value="item.id"
                :label="item.ageGroupTypeName"
              />
            </ElSelect>
            <EBtn text @click="handleCancelUpdateAgeGroupType">
              <Icon icon="ep:close" :size="5" class="mr-1" />
            </EBtn>
          </span>
          <EBtn v-if="!inputAgeGroupTypeVisible" type="primary" text @click="handleClickUpdateAgeGroupType">
            <Icon icon="ep:edit" :size="5" class="mr-1" />
          </EBtn>
        </div>
      </div>
      <!-- 性别类型 -->
      <div class="w-full flex border-b border-gray-200 p-4">
        <div class="w-30 font-semibold text-gray-700 flex-shrink-0">
          {{ $t('product.genderType') }}:
        </div>
        <div class="flex-1 w-full flex items-center">
          <span v-if="!inputGenderTypeVisible" class="mr-2">
            {{ productData?.genderTypeLabel }}
          </span>
          <span v-else class="flex items-center">
            <ElSelect
              v-model="currentGenderType"
              clearable
              filterable
              :placeholder="`${$t('product.placeholder.genderType')}`"
              class="mr-2 min-w-[200px]"
              @blur="editGenderType"
            >
              <ElOption
                v-for="item in genderTypeListData?.list || []"
                :key="item.id"
                :value="item.id"
                :label="item.genderTypeName"
              />
            </ElSelect>

            <EBtn text @click="handleCancelUpdateGenderType">
              <Icon icon="ep:close" :size="5" class="mr-1" />
            </EBtn>
          </span>
          <EBtn v-if="!inputGenderTypeVisible" type="primary" text @click="handleClickUpdateGenderType">
            <Icon icon="ep:edit" :size="5" class="mr-1" />
          </EBtn>
        </div>
      </div>
      <!-- 条件类型 -->
      <div class="w-full flex border-b border-gray-200 p-4">
        <div class="w-30 font-semibold text-gray-700 flex-shrink-0">
          {{ $t('product.conditionType') }}:
        </div>
        <div class="flex-1 w-full flex items-center">
          <span v-if="!inputConditionTypeVisible" class="mr-2">
            {{ productData?.conditionTypeLabel }}
          </span>
          <span v-else class="flex items-center">
            <ElSelect
              v-model="currentConditionType"
              clearable
              filterable
              placeholder="请选择"
              style="width: 200px"
              @blur="editConditionType"
            >
              <ElOption
                v-for="item in conditionTypeListData?.list || []"
                :key="item.id"
                :value="item.id"
                :label="item.conditionTypeName"
              />
            </ElSelect>
            <EBtn text @click="handleCancelUpdateConditionType">
              <Icon icon="ep:close" :size="5" class="mr-1" />
            </EBtn>
          </span>
          <EBtn v-if="!inputConditionTypeVisible" type="primary" text @click="handleClickUpdateConditionType">
            <Icon icon="ep:edit" :size="5" class="mr-1" />
          </EBtn>
        </div>
      </div>
      <!-- 描述 -->
      <div class="w-full flex border-b border-gray-200 p-4">
        <div class="w-30 font-semibold text-gray-700 flex-shrink-0">
          {{ $t('product.productDescription') }}:
        </div>
        <div class="flex-1 w-full flex items-center">
          <div v-if="!inputProductDescriptionVisible" class="mr-2">
            <div class="flex items-center mb-5">
              <div class="mr-2">
                <EBtn
                  type="primary"
                  plain
                  @click="
                    handleClickUpdateProductDescription(productDetail.productDetailListResultDo.productDescription)
                  "
                >
                  <Icon icon="ep:edit" :size="5" class="mr-1" />
                  {{ $t('common.edit') }}
                </EBtn>
              </div>

              <!-- 切换显示全部和隐藏的按钮 -->
              <div class="text-right">
                <EBtn @click="toggleExpand">
                  {{ isExpanded ? '隐藏' : '显示全部' }}
                </EBtn>
              </div>
            </div>
            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-12 border border-gray-200 p-4">
                <!-- 根据 isExpanded 的状态切换 max-height -->
                <div
                  :class="{ 'max-h-[200px]': !isExpanded, 'overflow-hidden': !isExpanded }"
                  class="transition-all ease-in-out duration-300"
                  v-html="productDetail.productDetailListResultDo.productDescription"
                />
              </div>
            </div>
          </div>
          <div v-else>
            <Editor ref="editorRefs" v-model="currentProductDescription" class="mb-5" />
            <div class="flex justify-center items-center">
              <EBtn @click="handleCancelUpdateProductDescription">
                {{ $t('common.cancel') }}
              </EBtn>
              <EBtn type="primary" @click="editProductDescription(productDetail.productDetailListResultDo.id)">
                {{ $t('common.save') }}
              </EBtn>
            </div>
          </div>
        </div>
      </div>
      <!-- 短描述 -->
      <div class="w-full flex border-b border-gray-200 p-4">
        <div class="w-30 font-semibold text-gray-700 flex-shrink-0">
          {{ $t('product.productShortDescription') }}:
        </div>
        <div class="flex-1 w-full flex items-center">
          <div v-if="!inputProductShortDescriptionVisible" class="w-full mr-2">
            <div class="flex items-center mb-5">
              <div class="mr-2">
                <EBtn
                  type="primary"
                  plain
                  @click="
                    handleClickUpdateProductShortDescription(
                      productDetail.productDetailListResultDo.productShortDescription,
                    )
                  "
                >
                  <Icon icon="ep:edit" :size="5" class="mr-1" />
                  {{ $t('common.edit') }}
                </EBtn>
              </div>
            </div>
            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-12 p-4">
                {{ productDetail.productDetailListResultDo.productShortDescription }}
              </div>
            </div>
          </div>
          <div v-else class="w-full">
            <ElInput
              v-model="currentProductShortDescription"
              type="textarea"
              :rows="4"
              class="w-full mb-5"
              style="width: 100%"
            />
            <div class="flex justify-center items-center">
              <EBtn @click="handleCancelUpdateProductShortDescription">
                {{ $t('common.cancel') }}
              </EBtn>
              <EBtn type="primary" @click="editProductShortDescription(productDetail.productDetailListResultDo.id)">
                {{ $t('common.save') }}
              </EBtn>
            </div>
          </div>
        </div>
      </div>
      <!-- 标签 -->
      <div class="w-full flex border-b border-gray-200 p-4">
        <div class="w-30 font-semibold text-gray-700 flex-shrink-0">
          {{ $t('product.tag') }}:
        </div>
        <div class="flex-1 w-full flex items-center">
          <ElTag
            v-for="(tag, index) in productDetail.productTagListResultDos"
            :key="tag.id"
            class="mr-2"
            closable
            :disable-transitions="false"
            @close="handleRemoveTag(index)"
          >
            {{ tag.tagName }}
          </ElTag>
          <ElInput
            v-if="inputProductTagVisible"
            ref="InputTagRefs"
            v-model="inputTagValue"
            style="width: 150px"
            size="small"
            @keyup.enter="handleInputTagConfirm"
            @blur="handleInputTagConfirm"
          />
          <ElButton v-else size="small" @click="handleShowInputTag">
            + 新标签
          </ElButton>
        </div>
      </div>
      <!-- 自定义信息 -->
      <div class="w-full flex border-b border-gray-200 p-4">
        <div class="w-30 font-semibold text-gray-700 flex-shrink-0">
          {{ $t('product.customs') }}:
        </div>
        <div class="flex-1 w-full flex items-center">
          <CustomsTable
            :custom-list="productDetail.productDetailListResultDo.customList"
            :product-detail-id="productDetail.productDetailListResultDo.id"
            @reset-form-data="resetData"
          />
        </div>
      </div>
    </div>
  </ElCard>
  <ElCard v-else>
    <div class="flex-col justify-center items-center mb-5">
      <div class="w-full mb-5">
        <ElAlert :title="$t('product.warning.noDetailData')" type="warning" show-icon />
      </div>
      <div class="bg-red-50 pa-3 flex justify-between items-center">
        <ElSelect v-model="copyLanguageCode" placeholder="请选择" style="width: 200px">
          <ElOption
            v-for="item in (productAdminLocalizedViewDos || []).filter(
              i => i.languageCode !== productDetail?.languageCode,
            )"
            :key="item.languageCode"
            :label="item.languageName"
            :value="item.languageCode"
          />
        </ElSelect>
        <EBtn type="primary" @click="handleCopyProduct">
          <Icon icon="ant-design:save-outlined" :size="5" class="mr-1" />
          复制
        </EBtn>
      </div>
    </div>
    <div class="pa-3 flex justify-center items-center mb-5">
      <ElInput v-model="currentProductName" :placeholder="$t('product.placeholder.productName')" />
      <EBtn type="primary" class="ml-5" @click="createProductName">
        <Icon icon="ant-design:save-outlined" :size="5" class="mr-1" />
        {{ $t('common.save') }}
      </EBtn>
    </div>
  </ElCard>
</template>
