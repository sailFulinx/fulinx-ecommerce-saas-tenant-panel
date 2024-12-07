<script setup lang="ts">
import {
  createProductDetailApi,
  updateProductDescriptionApi,
  updateProductInStockQuantityApi,
  updateProductMpnApi,
  updateProductNameApi,
  updateProductOfflineTimeApi,
  updateProductOnlineTimeApi,
  updateProductProcessingDaysApi,
  updateProductProcessingQuantityApi,
  updateProductProductionCycleApi,
  updateProductSkuApi,
  updateProductSupplierApi,
} from '@/api/product'
import { supplierPaginationApi } from '@/api/supplier'
import { useLocale } from '@/hooks/useLocale'
import { usePreferenceStore } from '@/stores/preference'
import { formatTime } from '@/utils'
import { ElMessage, ElSwitch } from 'element-plus'

const { form } = defineProps<{ form: ShowProduct & CommonField }>()

const emit = defineEmits(['resetFormData'])

const formData = ref<ShowProduct & CommonField>(form)

watch(
  () => form,
  val => {
    if (val) {
      formData.value = JSON.parse(JSON.stringify(form))
    }
  },
  { deep: true, immediate: true },
)

const selectLanguage = ref<LanguageData>(usePreferenceStore().preference?.language)

const { t: $t } = useLocale()

const id = useRoute().params.id as string

const loading = reactive({
  init: false,
  list: false,
  supplier: false,
})

// 更新名称
const inputProductNameVisible = ref<boolean>(false)
const handleClickUpdateProductName = () => {
  inputProductNameVisible.value = true
}
const handleCancelUpdateProductName = () => {
  inputProductNameVisible.value = false
}
const editProductName = async (productDetailId: string) => {
  if (!formData.value.productDetailListResultDo.productName) {
    ElMessage.warning($t('product.error.productName'))
    return
  }
  loading.init = true
  const { data } = await updateProductNameApi({
    productName: formData.value.productDetailListResultDo.productName,
    productDetailId,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  emit('resetFormData', data)
  inputProductNameVisible.value = false
  ElMessage.success($t('success.edit'))
}

// Sku
const inputProductSkuVisible = ref<boolean>(false)
const handleClickUpdateProductSku = () => {
  inputProductSkuVisible.value = true
}
const handleCancelUpdateProductSku = () => {
  inputProductSkuVisible.value = false
}
const editProductSku = async () => {
  if (!formData.value.sku) {
    ElMessage.warning($t('product.error.productSku'))
    return
  }
  loading.init = true
  const { data } = await updateProductSkuApi({
    sku: formData.value.sku,
    productId: id,
    languageId: selectLanguage.value.id,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  emit('resetFormData', data)
  inputProductSkuVisible.value = false
  ElMessage.success($t('success.edit'))
}

// Mpn
const inputProductMpnVisible = ref<boolean>(false)
const handleClickUpdateProductMpn = () => {
  inputProductMpnVisible.value = true
}
const handleCancelUpdateProductMpn = () => {
  inputProductMpnVisible.value = false
}
const editProductMpn = async () => {
  if (!formData.value.mpn) {
    ElMessage.warning($t('product.error.productMpn'))
    return
  }
  loading.init = true
  const { data } = await updateProductMpnApi({
    mpn: formData.value.mpn,
    productId: id,
    languageId: selectLanguage.value.id,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  emit('resetFormData', data)
  inputProductMpnVisible.value = false
  ElMessage.success($t('success.edit'))
}

// 是否设置上线时间
const editProductIsSettingOnlineTimeVisible = ref<boolean>(false)

const handleClickUpdateProductIsSettingOnlineTime = () => {
  editProductIsSettingOnlineTimeVisible.value = true
}

const handleCancelUpdateProductIsSettingOnlineTime = () => {
  editProductIsSettingOnlineTimeVisible.value = false
}

const handleUpdateOnlineTime = async () => {
  if (!formData.value.isSettingOnlineTime) {
    formData.value.onlineTime = null
  } else if (formData.value.isSettingOnlineTime && !formData.value.onlineTime) {
    ElMessage.warning($t('product.placeholder.onlineTime'))
    return
  }
  await updateProductOnlineTimeApi({
    isSettingOnlineTime: formData.value.isSettingOnlineTime,
    onlineTime: formData.value.onlineTime,
    productId: id,
    languageId: selectLanguage.value.id,
  }).catch(error => {
    editProductIsSettingOnlineTimeVisible.value = false
    loading.init = false
    throw error
  })
  editProductIsSettingOnlineTimeVisible.value = false
}

// 是否设置下线时间
const editProductIsSettingOfflineTimeVisible = ref<boolean>(false)

const handleClickUpdateProductIsSettingOfflineTime = () => {
  editProductIsSettingOfflineTimeVisible.value = true
}

const handleCancelUpdateProductIsSettingOfflineTime = () => {
  editProductIsSettingOfflineTimeVisible.value = false
}

const handleUpdateOfflineTime = async () => {
  if (!formData.value.isSettingOfflineTime) {
    formData.value.offlineTime = null
  } else if (formData.value.isSettingOfflineTime && !formData.value.onlineTime) {
    ElMessage.warning($t('product.placeholder.onlineTime'))
    return
  }
  await updateProductOfflineTimeApi({
    isSettingOfflineTime: formData.value.isSettingOfflineTime,
    offlineTime: formData.value.offlineTime,
    productId: id,
    languageId: selectLanguage.value.id,
  }).catch(error => {
    editProductIsSettingOfflineTimeVisible.value = false
    loading.init = false
    throw error
  })
  editProductIsSettingOfflineTimeVisible.value = false
}

// 库存
const editProductInStockQuantityVisible = ref<boolean>(false)

const editProductInStockQuantity = async () => {
  loading.init = true
  const { data } = await updateProductInStockQuantityApi({
    inStockQuantity: formData.value.inStockQuantity,
    productId: id,
    languageId: selectLanguage.value.id,
  })
  loading.init = false
  emit('resetFormData', data)
  ElMessage.success($t('success.edit'))
  editProductInStockQuantityVisible.value = false
}

// 在途库存

const editProductProcessingQuantityVisible = ref<boolean>(false)

const editProductProcessingQuantity = async () => {
  loading.init = true
  const { data } = await updateProductProcessingQuantityApi({
    processingQuantity: formData.value.processingQuantity,
    productId: id,
    languageId: selectLanguage.value.id,
  })
  loading.init = false
  emit('resetFormData', data)
  ElMessage.success($t('success.edit'))
  editProductProcessingQuantityVisible.value = false
}

// 在途库存

const editProductProcessingDaysVisible = ref<boolean>(false)

const editProductProcessingDays = async () => {
  loading.init = true
  const { data } = await updateProductProcessingDaysApi({
    processingDays: formData.value.processingQuantity,
    productId: id,
    languageId: selectLanguage.value.id,
  })
  loading.init = false
  emit('resetFormData', data)
  ElMessage.success($t('success.edit'))
  editProductProcessingQuantityVisible.value = false
}

// 生产周期

const editProductProductionCycleVisible = ref<boolean>(false)

const editProductProductionCycle = async () => {
  loading.init = true
  const { data } = await updateProductProductionCycleApi({
    productionCycle: formData.value.productionCycle,
    productId: id,
    languageId: selectLanguage.value.id,
  })
  loading.init = false
  emit('resetFormData', data)
  ElMessage.success($t('success.edit'))
  editProductProductionCycleVisible.value = false
}

/**
 * 供应商
 */

const editProductSupplierVisible = ref<boolean>(false)
const listSupplierQuery = reactive<SupplierListParams & Pagination>({
  languageId: usePreferenceStore().preference?.language.id,
  supplierName: '',
  pageSize: 20,
  pageNumber: 1,
})

const listSupplierResult = ref<TableResponse<SupplierListData & CommonField>>({
  list: [],
  total: 0,
})

const getSupplierList = async () => {
  loading.supplier = true
  if (listSupplierQuery.supplierName === '') {
    listSupplierQuery.supplierName = null
  }
  const { data } = await supplierPaginationApi(listSupplierQuery).catch(err => {
    loading.supplier = false
    throw err
  })
  listSupplierResult.value = data
  loading.supplier = false
}

const remoteQuerySupplier = async (query: string) => {
  if (query.length < 3) {
    return
  }
  listSupplierQuery.supplierName = query
  await getSupplierList()
}

const handleClickUpdateProductSupplier = async () => {
  editProductSupplierVisible.value = true
  await getSupplierList()
}

const editProductSupplier = async () => {
  loading.init = true
  const { data } = await updateProductSupplierApi({
    supplierId: formData.value.supplierId,
    productId: id,
    languageId: selectLanguage.value.id,
  })
  loading.init = false
  emit('resetFormData', data)
  ElMessage.success($t('success.edit'))
  editProductSupplierVisible.value = false
}

// 更新描述
// 定义一个 ref 来控制内容是否展开
const isExpanded = ref(false)

// 切换显示状态的函数
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}
const editorRef = ref()
const inputProductDescriptionVisible = ref<boolean>(false)
const handleClickUpdateProductDescription = async () => {
  inputProductDescriptionVisible.value = true
  await nextTick(async () => {
    await editorRef.value?.setEditorContent(formData.value.productDetailListResultDo.productDescription)
  })
}
const handleCancelUpdateProductDescription = () => {
  inputProductDescriptionVisible.value = false
}
const editProductDescription = async (productDetailId: string) => {
  loading.init = true
  const { data } = await updateProductDescriptionApi({
    productDetailId,
    productDescription: editorRef.value?.getEditorContent(),
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  emit('resetFormData', data)
  inputProductDescriptionVisible.value = false
  ElMessage.success($t('success.edit'))
}

// 更新名称新增时
const createProductName = async () => {
  if (!formData.value.productDetailListResultDo.productName) {
    ElMessage.warning($t('product.error.productName'))
    return
  }
  loading.init = true
  const { data } = await createProductDetailApi({
    productName: formData.value.productDetailListResultDo.productName,
    productId: id,
    languageId: selectLanguage.value.id,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  emit('resetFormData', data)
  ElMessage.success($t('success.create'))
}
</script>

<template>
  <ElCard v-if="form.productDetailListResultDo" shadow="never" class="mb-5">
    <div class="w-full mt-0 pt-0">
      <div class="w-full grid grid-cols-12 gap-8 p-4">
        <div class="col-span-1 font-semibold fs-[14px] text-gray-700">
          {{ $t('product.productName') }} :
        </div>
        <div class="col-span-11 w-full flex items-center">
          <div v-if="!inputProductNameVisible" class="mr-2 flex">
            <div class="mr-1">
              {{ formData.productDetailListResultDo.productName }}
            </div>
            <EBtn type="primary" text @click="handleClickUpdateProductName">
              <Icon icon="ep:edit" :size="4" class="mr-1" />
            </EBtn>
          </div>
          <div v-else>
            <ElInput
              v-model="formData.productDetailListResultDo.productName"
              style="width: 300px"
              class="mr-2"
              @blur="editProductName(formData.productDetailListResultDo.id)"
            />
            <EBtn text @click="handleCancelUpdateProductName">
              <Icon icon="ep:close" :size="5" class="mr-1" />
            </EBtn>
          </div>
        </div>
      </div>
      <!-- SKU -->
      <div class="w-full grid grid-cols-12 gap-8 p-4">
        <div class="col-span-1 font-semibold fs-[14px] text-gray-700">
          {{ $t('product.sku') }} :
        </div>
        <div class="col-span-11 w-full flex items-center">
          <div v-if="!inputProductSkuVisible" class="mr-2 flex">
            <div class="mr-1">
              {{ formData.sku }}
            </div>
            <EBtn type="primary" text @click="handleClickUpdateProductSku">
              <Icon icon="ep:edit" :size="4" class="mr-1" />
            </EBtn>
          </div>
          <div v-else>
            <ElInput v-model="formData.sku" style="width: 300px" class="mr-2" @blur="editProductSku" />
            <EBtn text @click="handleCancelUpdateProductSku">
              <Icon icon="ep:close" :size="5" class="mr-1" />
            </EBtn>
          </div>
        </div>
      </div>
      <!-- Mpn -->
      <div class="w-full grid grid-cols-12 gap-8 p-4">
        <div class="col-span-1 font-semibold fs-[14px] text-gray-700">
          {{ $t('product.mpn') }} :
        </div>
        <div class="col-span-11 w-full flex items-center">
          <div v-if="!inputProductMpnVisible" class="mr-2 flex">
            <div class="mr-1">
              {{ formData.mpn }}
            </div>
            <EBtn type="primary" text @click="handleClickUpdateProductMpn">
              <Icon icon="ep:edit" :size="4" class="mr-1" />
            </EBtn>
          </div>
          <div v-else>
            <ElInput v-model="formData.mpn" style="width: 300px" class="mr-2" @blur="editProductMpn" />
            <EBtn text @click="handleCancelUpdateProductMpn">
              <Icon icon="ep:close" :size="5" class="mr-1" />
            </EBtn>
          </div>
        </div>
      </div>
      <!-- 上线时间 -->
      <div class="w-full grid grid-cols-12 gap-8 p-4">
        <div class="col-span-1 font-semibold fs-[14px] text-gray-700">
          {{ $t('product.isSettingOnlineTime') }} :
        </div>
        <div class="col-span-11 w-full flex items-center">
          <div v-if="!editProductIsSettingOnlineTimeVisible" class="mr-2 flex">
            <div class="mr-1">
              <span class="mr-2">{{ formData.isSettingOnlineTime ? $t('common.yes') : $t('common.no') }},</span>
              <span v-if="formData.onlineTime">{{ formatTime(formData.onlineTime) }}</span>
            </div>
            <EBtn type="primary" text @click="handleClickUpdateProductIsSettingOnlineTime">
              <Icon icon="ep:edit" :size="4" class="mr-1" />
            </EBtn>
          </div>
          <div v-else>
            <ElSwitch v-model="formData.isSettingOnlineTime" class="mr-5" />
            <ElDatePicker
              v-if="formData.isSettingOnlineTime"
              v-model="formData.onlineTime"
              type="datetime"
              :placeholder="$t('product.placeholder.onlineTime')"
            />
            <EBtn text @click="handleCancelUpdateProductIsSettingOnlineTime">
              <Icon icon="ep:close" :size="5" class="mr-1" />
            </EBtn>
            <EBtn text @click="handleUpdateOnlineTime">
              <Icon icon="ep:check" :size="5" class="mr-1" />
            </EBtn>
          </div>
        </div>
      </div>
      <!-- 下线时间 -->
      <div class="w-full grid grid-cols-12 gap-8 p-4">
        <div class="col-span-1 font-semibold fs-[14px] text-gray-700">
          {{ $t('product.isSettingOfflineTime') }} :
        </div>
        <div class="col-span-11 w-full flex items-center">
          <div v-if="!editProductIsSettingOfflineTimeVisible" class="mr-2 flex">
            <div class="mr-1">
              <span class="mr-2">{{ formData.isSettingOfflineTime ? $t('common.yes') : $t('common.no') }},</span>
              <span v-if="formData.onlineTime">{{ formatTime(formData.onlineTime) }}</span>
            </div>
            <EBtn type="primary" text @click="handleClickUpdateProductIsSettingOfflineTime">
              <Icon icon="ep:edit" :size="4" class="mr-1" />
            </EBtn>
          </div>
          <div v-else>
            <ElSwitch v-model="formData.isSettingOfflineTime" class="mr-5" />
            <ElDatePicker
              v-if="formData.isSettingOfflineTime"
              v-model="formData.onlineTime"
              type="datetime"
              :placeholder="$t('product.placeholder.onlineTime')"
            />
            <EBtn text @click="handleCancelUpdateProductIsSettingOfflineTime">
              <Icon icon="ep:close" :size="5" class="mr-1" />
            </EBtn>
            <EBtn text @click="handleUpdateOfflineTime">
              <Icon icon="ep:check" :size="5" class="mr-1" />
            </EBtn>
          </div>
        </div>
      </div>
      <!-- 库存 -->
      <div class="w-full grid grid-cols-12 gap-8 p-4">
        <div class="col-span-1 font-semibold fs-[14px] text-gray-700">
          {{ $t('product.inStockQuantity') }} :
        </div>
        <div class="col-span-11 w-full flex items-center">
          <div v-if="!editProductInStockQuantityVisible" class="mr-2 flex">
            <div class="mr-1">
              {{ formData.inStockQuantity }}
            </div>
            <EBtn type="primary" text @click="() => (editProductInStockQuantityVisible = true)">
              <Icon icon="ep:edit" :size="4" class="mr-1" />
            </EBtn>
          </div>
          <div v-else>
            <ElInputNumber
              v-model="formData.inStockQuantity"
              :min="0"
              :max="9999999999"
              class="w-[200px] mr-3"
              :placeholder="$t('product.placeholder.inStockQuantity')"
            />
            <EBtn text @click="() => (editProductInStockQuantityVisible = false)">
              <Icon icon="ep:close" :size="5" class="mr-2" />
            </EBtn>
            <EBtn text @click="editProductInStockQuantity">
              <Icon icon="ep:check" :size="5" />
            </EBtn>
          </div>
        </div>
      </div>
      <!-- 在途库存 -->
      <div class="w-full grid grid-cols-12 gap-8 p-4">
        <div class="col-span-1 font-semibold fs-[14px] text-gray-700">
          {{ $t('product.processingQuantity') }} :
        </div>
        <div class="col-span-11 w-full flex items-center">
          <div v-if="!editProductProcessingQuantityVisible" class="mr-2 flex">
            <div class="mr-1">
              {{ formData.processingQuantity }}
            </div>
            <EBtn type="primary" text @click="() => (editProductProcessingQuantityVisible = true)">
              <Icon icon="ep:edit" :size="4" class="mr-1" />
            </EBtn>
          </div>
          <div v-else>
            <ElInputNumber
              v-model="formData.processingQuantity"
              :min="0"
              :max="9999999999"
              class="w-[200px] mr-3"
              :placeholder="$t('product.placeholder.processingQuantity')"
            />
            <EBtn text @click="() => (editProductProcessingQuantityVisible = false)">
              <Icon icon="ep:close" :size="5" class="mr-2" />
            </EBtn>
            <EBtn text @click="editProductProcessingQuantity">
              <Icon icon="ep:check" :size="5" />
            </EBtn>
          </div>
        </div>
      </div>
      <!-- 在途发货天数 -->
      <div class="w-full grid grid-cols-12 gap-8 p-4">
        <div class="col-span-1 font-semibold fs-[14px] text-gray-700">
          {{ $t('product.processingDays') }} :
        </div>
        <div class="col-span-11 w-full flex items-center">
          <div v-if="!editProductProcessingQuantityVisible" class="mr-2 flex">
            <div class="mr-1">
              {{ formData.processingDays }}
            </div>
            <EBtn type="primary" text @click="() => (editProductProcessingDaysVisible = true)">
              <Icon icon="ep:edit" :size="4" class="mr-1" />
            </EBtn>
          </div>
          <div v-else>
            <ElInputNumber
              v-model="formData.processingDays"
              :min="0"
              :max="9999999999"
              class="w-[200px] mr-3"
              :placeholder="$t('product.placeholder.processingDays')"
            />
            <EBtn text @click="() => (editProductProcessingDaysVisible = false)">
              <Icon icon="ep:close" :size="5" class="mr-2" />
            </EBtn>
            <EBtn text @click="editProductProcessingDays">
              <Icon icon="ep:check" :size="5" />
            </EBtn>
          </div>
        </div>
      </div>
      <!-- 生产周期 -->
      <div class="w-full grid grid-cols-12 gap-8 p-4">
        <div class="col-span-1 font-semibold fs-[14px] text-gray-700">
          {{ $t('product.productionCycle') }} :
        </div>
        <div class="col-span-11 w-full flex items-center">
          <div v-if="!editProductProductionCycleVisible" class="mr-2 flex">
            <div class="mr-1">
              {{ formData.productionCycle }}(周)
            </div>
            <EBtn type="primary" text @click="() => (editProductProductionCycleVisible = true)">
              <Icon icon="ep:edit" :size="4" class="mr-1" />
            </EBtn>
          </div>
          <div v-else>
            <ElInputNumber
              v-model="formData.productionCycle"
              :min="0"
              :max="9999999999"
              class="w-[200px] mr-3"
              :placeholder="$t('product.placeholder.processingDays')"
            />
            <EBtn text @click="() => (editProductProductionCycleVisible = false)">
              <Icon icon="ep:close" :size="5" class="mr-2" />
            </EBtn>
            <EBtn text @click="editProductProductionCycle">
              <Icon icon="ep:check" :size="5" />
            </EBtn>
          </div>
        </div>
      </div>
      <!-- 供应商 -->
      <div class="w-full grid grid-cols-12 gap-8 p-4">
        <div class="col-span-1 font-semibold fs-[14px] text-gray-700">
          {{ $t('product.supplier') }} :
        </div>
        <div class="col-span-11 w-full flex items-center">
          <div v-if="!editProductSupplierVisible" class="mr-2 flex">
            <div class="mr-1">
              {{ formData.supplierShowResultDo.supplierDetailListResultDo.supplierName }}
            </div>
            <EBtn type="primary" text @click="handleClickUpdateProductSupplier">
              <Icon icon="ep:edit" :size="4" class="mr-1" />
            </EBtn>
          </div>
          <div v-else class="flex items-center">
            <ElSelect
              v-model="formData.supplierId"
              filterable
              clearable
              remote
              reserve-keyword
              :remote-method="remoteQuerySupplier"
              :placeholder="$t('product.placeholder.supplier')"
              style="width: 200px"
            >
              <ElOption
                v-for="item in listSupplierResult.list"
                :key="item.id"
                :value="item.id"
                :label="item.supplierName"
              />
            </ElSelect>
            <EBtn text @click="() => (editProductSupplierVisible = false)">
              <Icon icon="ep:close" :size="5" class="mr-2" />
            </EBtn>
            <EBtn text @click="editProductSupplier">
              <Icon icon="ep:check" :size="5" />
            </EBtn>
          </div>
        </div>
      </div>
      <!-- 描述 -->
      <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
        <div class="col-span-1 font-semibold text-gray-700">
          {{ $t('product.productDescription') }}:
        </div>
        <div class="col-span-11">
          <div v-if="!inputProductDescriptionVisible" class="mr-2">
            <div class="flex items-center mb-5">
              <div class="mr-2">
                <EBtn v-if="!inputProductNameVisible" type="primary" plain @click="handleClickUpdateProductDescription">
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
                  v-html="formData.productDetailListResultDo.productDescription"
                />
              </div>
            </div>
          </div>
          <div v-else>
            <Editor ref="editorRef" v-model="formData.productDetailListResultDo.productDescription" class="mb-5" />
            <div class="flex justify-center items-center">
              <EBtn @click="handleCancelUpdateProductDescription">
                {{ $t('common.cancel') }}
              </EBtn>
              <EBtn type="primary" @click="editProductDescription(formData.productDetailListResultDo.id)">
                {{ $t('common.save') }}
              </EBtn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ElCard>
  <ElCard v-else>
    <div class="flex justify-center items-center mb-5">
      <ElAlert :title="$t('product.warning.noDetailData')" type="warning" show-icon />
    </div>
    <div class="flex justify-center items-center mb-5">
      <ElInput
        v-model="formData.productDetailListResultDo.productName"
        :placeholder="$t('product.placeholder.productName')"
      />
      <EBtn type="primary" class="ml-5" @click="createProductName">
        <Icon icon="ant-design:save-outlined" :size="5" class="mr-1" />
        {{ $t('common.save') }}
      </EBtn>
    </div>
  </ElCard>
</template>
