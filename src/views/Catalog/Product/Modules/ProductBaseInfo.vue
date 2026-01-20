<script setup lang="ts">
import type { InputInstance } from 'element-plus'
import { debounce } from 'lodash-es'
import Editor from '@/components/common/Editor.vue'
import CustomsTable from './CustomsTable.vue'

interface Props {
  productData?: ShowProduct
  productDetail?: ProductAdminLocalizedViewDo
  languageId: string
  productId: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  refreshData: []
  removeTag: [index: number]
  showInputTag: [index: number]
  inputTagConfirm: []
  cancelUpdateProductFile: []
  getRemoveFile: [index: number]
}>()

const { t: $t } = useLocale()

const loading = reactive({
  init: false,
})

const {
  loading: productSourceTypeLoading,
  listData: productSourceTypeListData,
  promise: productSourceTypePromise,
} = useProductSourceTypeList()

const { loading: ageGroupLoading, listData: ageGroupTypeListData, promise: ageGroupPromise } = useAgeGroupTypeList()

const { loading: genderLoading, listData: genderTypeListData, promise: genderPromise } = useGenderTypeList()

const { loading: conditionLoading, listData: conditionTypeListData, promise: conditionPromise } = useConditionTypeList()

const { loading: brandLoading, listData: brandListData, promise: brandPromise } = useBrandList()

const {
  loading: stockStatusLoading,
  listData: stockStatusListData,
  promise: stockStatusPromise,
} = useProductStockStatusList()

// 使用 watch 监听 props.languageId 的变化
watch(
  () => props.languageId,
  async newLanguageId => {
    if (!newLanguageId) {
      return
    }

    console.log('Language ID changed:', newLanguageId)
    // 设置初始化加载状态
    loading.init = true
    try {
      // 创建系统分类的 payload
      const listSystemCategoryPayload = reactive<SystemCategoryListParams>({
        languageId: newLanguageId,
        systemCategoryName: null,
      })

      // 创建系统分类列表的 hook
      const { promise } = useSystemCategoryList(listSystemCategoryPayload)

      // 并行等待所有数据加载完成
      await Promise.all([
        productSourceTypePromise,
        ageGroupPromise,
        genderPromise,
        conditionPromise,
        promise,
        brandPromise,
        stockStatusPromise,
      ])
    } catch (error) {
      console.error('加载数据失败:', error)
    } finally {
      loading.init = false
    }
  },
  { immediate: true }, // 立即执行一次，相当于 mounted 的效果
)

// 产品名称相关
const inputProductNameVisible = ref<boolean>(false)
const currentProductName = ref<string>('')
// 产品短名称相关
const inputProductShortNameVisible = ref<boolean>(false)
const currentProductShortName = ref<string>('')

// 品牌相关
const inputBrandVisible = ref<boolean>(false)
const currentBrandId = ref<string>('')

// 库存状态相关
const inputStockStatusVisible = ref<boolean>(false)
const currentStockStatus = ref<number>(1)

// 产品来源类型相关
const inputProductSourceTypeVisible = ref<boolean>(false)
const currentProductSourceType = ref<number>(0)

// 成人用品相关
const inputIsAdultVisible = ref<boolean>(false)
const currentIsAdult = ref<boolean>(false)

// 年龄组类型相关
const inputAgeGroupTypeVisible = ref<boolean>(false)
const currentAgeGroupType = ref<number>(0)

// 性别类型相关
const inputGenderTypeVisible = ref<boolean>(false)
const currentGenderType = ref<number>(0)

// 条件类型相关
const inputConditionTypeVisible = ref<boolean>(false)
const currentConditionType = ref<number>(0)

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
  await updateProductNameApi({
    productName: currentProductName.value,
    productDetailId,
  }).catch(error => {
    throw error
  })
  currentProductName.value = ''
  inputProductNameVisible.value = false
  ElMessage.success($t('success.edit'))
  emit('refreshData')
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
  await updateProductShortNameApi({
    productShortName: currentProductShortName.value,
    productDetailId,
  }).catch(error => {
    throw error
  })
  currentProductShortName.value = ''
  inputProductShortNameVisible.value = false
  ElMessage.success($t('success.edit'))
  emit('refreshData')
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
  await updateProductBrandApi({
    brandId: currentBrandId.value,
    productId: props.productId,
    languageId: props.languageId,
  }).catch(error => {
    throw error
  })
  inputBrandVisible.value = false
  ElMessage.success($t('success.edit'))
  emit('refreshData')
}

// 库存状态相关方法
const handleClickUpdateStockStatus = (stockStatus: number) => {
  currentStockStatus.value = stockStatus
  inputStockStatusVisible.value = true
}

const handleCancelUpdateStockStatus = () => {
  inputStockStatusVisible.value = false
}

const editStockStatus = async () => {
  if (currentStockStatus.value === undefined || currentStockStatus.value === null) {
    ElMessage.warning($t('product.error.stockStatus'))
    return
  }
  await updateProductStockStatusApi({
    stockStatus: currentStockStatus.value,
    productId: props.productId,
    languageId: props.languageId,
  }).catch(error => {
    throw error
  })
  inputStockStatusVisible.value = false
  ElMessage.success($t('success.edit'))
  emit('refreshData')
}

// 产品来源类型相关方法
const handleClickUpdateProductSourceType = (productSourceType: number) => {
  currentProductSourceType.value = productSourceType
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
  await updateProductSourceTypeApi({
    productSourceType: currentProductSourceType.value,
    productId: props.productId,
    languageId: props.languageId,
  }).catch(error => {
    throw error
  })
  inputProductSourceTypeVisible.value = false
  ElMessage.success($t('success.edit'))
  emit('refreshData')
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
  await updateProductIsAdultApi({
    isAdult: currentIsAdult.value,
    languageId: props.languageId,
    productId: props.productId,
  }).catch(error => {
    throw error
  })
  inputIsAdultVisible.value = false
  ElMessage.success($t('success.edit'))
  emit('refreshData')
}

// 年龄组类型相关方法
const handleClickUpdateAgeGroupType = (ageGroupType: number) => {
  currentAgeGroupType.value = ageGroupType
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
  await updateProductAgeGroupTypeApi({
    ageGroupType: currentAgeGroupType.value,
    languageId: props.languageId,
    productId: props.productId,
  }).catch(error => {
    throw error
  })
  inputAgeGroupTypeVisible.value = false
  ElMessage.success($t('success.edit'))
  emit('refreshData')
}

// 性别类型相关方法
const handleClickUpdateGenderType = (genderType: number) => {
  currentGenderType.value = genderType
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
  await updateProductGenderTypeApi({
    genderType: currentGenderType.value,
    productId: props.productId,
    languageId: props.languageId,
  }).catch(error => {
    throw error
  })
  inputGenderTypeVisible.value = false
  ElMessage.success($t('success.edit'))
  emit('refreshData')
}

// 条件类型相关方法
const handleClickUpdateConditionType = (conditionType: number) => {
  currentConditionType.value = conditionType
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
  await updateProductConditionTypeApi({
    conditionType: currentConditionType.value,
    languageId: props.languageId,
    productId: props.productId,
  }).catch(error => {
    throw error
  })
  inputConditionTypeVisible.value = false
  ElMessage.success($t('success.edit'))
  emit('refreshData')
}

const createProductName = async () => {
  if (!currentProductName.value) {
    ElMessage.warning($t('product.error.productName'))
    return
  }
  await createProductNameApi({
    productName: currentProductName.value,
    productId: props.productId,
    languageId: props.languageId,
  })
  currentProductName.value = ''
  ElMessage.success($t('success.create'))
  emit('refreshData')
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
  await updateProductDescriptionApi({
    productDetailId,
    productDescription: currentProductDescription.value,
  }).catch(error => {
    throw error
  })
  currentProductDescription.value = ''
  inputProductDescriptionVisible.value = false
  ElMessage.success($t('success.edit'))
  emit('refreshData')
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
  await updateProductShortDescriptionApi({
    productDetailId,
    productShortDescription: currentProductShortDescription.value,
  }).catch(error => {
    throw error
  })
  currentProductShortDescription.value = ''
  inputProductShortDescriptionVisible.value = false
  ElMessage.success($t('success.edit'))
  emit('refreshData')
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
  await removeProductTagApi({
    productTagId: props.productDetail.productTagListResultDos[index].id,
    languageId: props.languageId,
  }).catch(error => {
    throw error
  })
  ElMessage.success($t('success.edit'))
  emit('refreshData')
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
  await createProductTagApi({
    productId: props.productId,
    languageId: props.languageId,
    tagName: inputTagValue.value.trim(),
  }).catch(error => {
    throw error
  })
  inputProductTagVisible.value = false
  inputTagValue.value = ''
  ElMessage.success($t('success.edit'))
  emit('refreshData')
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
  emit('refreshData')
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
          <span class="mr-2">
            {{ productData?.productTypeLabel }}
          </span>
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
              v-loading="brandLoading"
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
      <!-- 库存状态 -->
      <div class="w-full flex border-b border-gray-200 p-4">
        <div class="w-30 font-semibold text-gray-700 flex-shrink-0">
          {{ $t('product.stockStatus') }}:
        </div>
        <div class="flex-1 w-full flex items-center">
          <span v-if="!inputStockStatusVisible" class="mr-2">
            {{ productData?.stockStatusLabel }}
          </span>
          <span v-else class="flex items-center">
            <ElRadioGroup v-model="currentStockStatus" :loading="stockStatusLoading" class="mr-2">
              <ElRadio v-for="item in stockStatusListData.list" :key="item.id" :value="item.id">
                {{ item.productStockStatusName }}
              </ElRadio>
            </ElRadioGroup>
            <EBtn text @click="editStockStatus">
              <Icon icon="ep:check" :size="5" />
            </EBtn>
            <EBtn text @click="handleCancelUpdateStockStatus">
              <Icon icon="ep:close" :size="5" />
            </EBtn>
          </span>
          <EBtn
            v-if="!inputStockStatusVisible"
            type="primary"
            text
            @click="handleClickUpdateStockStatus(productData?.stockStatus || 1)"
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
              v-loading="productSourceTypeLoading"
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
          <EBtn
            v-if="!inputProductSourceTypeVisible"
            type="primary"
            text
            @click="handleClickUpdateProductSourceType(productData?.productSourceType || 0)"
          >
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
              v-loading="ageGroupLoading"
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
          <EBtn
            v-if="!inputAgeGroupTypeVisible"
            type="primary"
            text
            @click="handleClickUpdateAgeGroupType(productData?.ageGroupType || 0)"
          >
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
          <span v-else>
            <ElSelect
              v-model="currentGenderType"
              v-loading="genderLoading"
              clearable
              filterable
              :placeholder="`${$t('product.placeholder.genderType')}`"
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
          <EBtn
            v-if="!inputGenderTypeVisible"
            type="primary"
            text
            @click="handleClickUpdateGenderType(productData?.genderType || 0)"
          >
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
              v-loading="conditionLoading"
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
          <EBtn
            v-if="!inputConditionTypeVisible"
            type="primary"
            text
            @click="handleClickUpdateConditionType(productData?.conditionType || 0)"
          >
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
          <!-- <CustomsTable
            :custom-list="productDetail.productDetailListResultDo.customList"
            :product-detail-id="productDetail.productDetailListResultDo.id"
            @refresh-data="refreshFormData"
          /> -->
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
