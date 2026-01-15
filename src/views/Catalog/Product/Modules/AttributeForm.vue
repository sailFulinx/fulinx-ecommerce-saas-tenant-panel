<script setup lang="ts">
import { use } from 'echarts'
import { VueDraggable } from 'vue-draggable-plus'
import { cartesianProduct } from '@/utils/cartesianProduct'
import CreateAttributeDialog from '../../Attribute/Components/CreateAttributeDialog.vue'
import CreateAttributeValueDialog from './CreateAttributeValueDialog.vue'

const currencies = useCurrencyStore().currencies

interface ProductCreateProvider {
  productForm: CreateProductParams
}

const { productForm } = inject('ProductCreate') as ProductCreateProvider

console.log(productForm)

const { t: $t } = useLocale()

const loading = reactive({
  init: false,
  button: false,
  attribute: false,
})

const dragging = ref(false)

const attributePayload = reactive<AttributeListParams>({
  languageId: usePreferenceStore().preference.language.id,
  status: true,
})

const {
  loading: attributeLoading,
  listData: attributeListData,
  promise: attributePromise,
  getList,
} = useAttributeList(attributePayload)

const {
  loading: stockStatusLoading,
  listData: stockStatusListData,
  promise: stockStatusPromise,
} = useProductStockStatusList()

const { loading: warehouseLoading, listData: warehouseListData, promise: warehousePromise } = useWarehouseList()

const currentWarehouseId = ref('')

onMounted(async () => {
  // 设置初始化加载状态
  loading.init = true
  try {
    // 并行等待所有数据加载完成
    await Promise.all([attributePromise, stockStatusPromise, warehousePromise])
    currentWarehouseId.value = warehouseListData.value.list.find(item => item.isDefault)?.id || ''
  } catch (error) {
    console.error('加载数据失败:', error)
  } finally {
    loading.init = false
  }
})

const formRef = ref()
const multipleTable = ref() // 添加表格引用

// 用于存储选中的行
const multipleSelection = ref<ProductSkuItemRequestDo[]>([])

// 选中行变化处理函数
const handleSelectionChange = (val: ProductSkuItemRequestDo[]) => {
  multipleSelection.value = val
}

const productSkuRequestDo = ref<ProductSkuRequestDo>({
  stockStatus: 1,
  spu: '',
  currencyId: '',
  productAttributeRequestDo: {
    attributeSummaryDos: [],
    searchIndex: '',
  },
  productSkuItemRequestDos: [],
})

// 计算笛卡尔积
const cartes = computed(() => {
  const attributes = productSkuRequestDo.value.productAttributeRequestDo.attributeSummaryDos
  if (!attributes || attributes.length === 0) {
    return [[]]
  }

  // 提取每个属性的所有值
  const attributeValues = attributes.map(attr =>
    attr.attributeValueDos.map(av => ({
      attributeName: attr.attributeName,
      attributeValue: av.attributeValueContent,
      attributeImageFileVo: av.attributeImageFileVo,
      attributeId: attr.attributeId, // 添加 attributeId
      attributeValueId: av.id, // 添加 attributeValueId
    })),
  )

  // 计算笛卡尔积
  return cartesianProduct(attributeValues)
})

// 生成SKU函数
const generateSkus = () => {
  // 清空现有的SKU项
  productSkuRequestDo.value.productSkuItemRequestDos = []

  // 获取笛卡尔积结果
  const combinations = cartes.value

  // 为每个组合创建一个SKU项
  if (combinations.length > 0 && combinations[0].length > 0) {
    combinations.forEach(combination => {
      // 生成SKU编码，格式为 spu-组合值
      const skuValues = combination.map(item => item.attributeValue)
      const skuCode = `${productSkuRequestDo.value.spu}-${skuValues.join('-')}`

      // 创建SKU属性数组
      const productSkuAttributes = combination.map(item => {
        return {
          attributeValueContent: item.attributeValue,
          attributeName: item.attributeName,
          attributeImageFileVo: item.attributeImageFileVo || null,
          attributeId: item.attributeId,
          attributeValueId: item.attributeValueId,
        }
      })

      const productSkuInventoryRequestDos: ProductSkuInventoryRequestDo[] = []
      warehouseListData.value.list.forEach(warehouse => {
        // 创建SKU库存信息
        const skuInventory: ProductSkuInventoryRequestDo = {
          warehouseId: warehouse.id,
          quantity: 0,
          skuCode,
        }

        // 将库存信息添加到SKU项中
        productSkuInventoryRequestDos.push(skuInventory)
      })

      // 创建SKU项
      const skuItem: ProductSkuItemRequestDo = {
        productId: '', // 通常在保存产品时填充
        skuCode,
        currencyId: productSkuRequestDo.value.currencyId, // 默认货币，实际应用中可能需要从其他地方获取
        price: 0, // 默认价格，用户后续设置
        status: true,
        productSkuAttributeRequestDos: productSkuAttributes.map(attr => {
          return {
            attributeName: attr.attributeName,
            attributeValueContent: attr.attributeValueContent,
            attributeImageFileVo: attr.attributeImageFileVo,
            languageId: usePreferenceStore().preference.language.id,
            attributeId: attr.attributeId,
            attributeValueId: attr.attributeValueId,
          }
        }),
        productSkuInventoryRequestDos, // 库存信息，可能在后续步骤中填写
      }

      // 将SKU项添加到数组中
      productSkuRequestDo.value.productSkuItemRequestDos.push(skuItem)
    })
  } else {
    // 如果没有规格组合，添加一个默认的SKU项，以SPU作为SKU编码
    if (productSkuRequestDo.value.spu) {
      const productSkuInventoryRequestDos: ProductSkuInventoryRequestDo[] = []
      warehouseListData.value.list.forEach(warehouse => {
        // 创建SKU库存信息
        const skuInventory: ProductSkuInventoryRequestDo = {
          warehouseId: warehouse.id,
          quantity: 0,
          skuCode: productSkuRequestDo.value.spu,
        }

        // 将库存信息添加到SKU项中
        productSkuInventoryRequestDos.push(skuInventory)
      })
      const defaultSkuItem: ProductSkuItemRequestDo = {
        productId: '',
        skuCode: productSkuRequestDo.value.spu,
        currencyId: productSkuRequestDo.value.currencyId,
        price: 0,
        status: true,
        productSkuAttributeRequestDos: [],
        productSkuInventoryRequestDos,
      }
      productSkuRequestDo.value.productSkuItemRequestDos.push(defaultSkuItem)
    }
  }
}

// 监听spu变化，当spu改变时重新生成SKU
watch(
  () => productSkuRequestDo.value.spu,
  newSpu => {
    console.log('spu changed:', newSpu)
    generateSkus()
  },
  { deep: true },
)

// 监听属性值变化，重新生成SKU
watch(
  cartes,
  () => {
    generateSkus()
  },
  { deep: true },
)

const rules = reactive({
  stockStatus: [{ required: true, message: $t('product.placeholder.stockStatus'), trigger: 'change' }],
  productAttributeRequestDo: [
    { required: false, message: $t('product.placeholder.attributeSummaryDos'), trigger: 'change' },
  ],
  spu: [{ required: true, message: $t('product.placeholder.spu'), trigger: 'blur' }],
  currencyId: [{ required: true, message: $t('product.placeholder.currencyId'), trigger: 'change' }],
})

const dragEnd = () => {
  dragging.value = false
  productSkuRequestDo.value.productAttributeRequestDo.attributeSummaryDos.map((item, index) => (item.sort = index + 1))
}

const dragEndAttributeValue = (attributeSummaryDoIndex: number) => {
  dragging.value = false
  productSkuRequestDo.value.productAttributeRequestDo.attributeSummaryDos[
    attributeSummaryDoIndex
  ].attributeValueDos.map((item, index) => (item.sort = index + 1))
}

const currentAttribute = ref<AttributeSummaryDo>({
  languageId: usePreferenceStore().preference.language.id,
  attributeId: '',
  attributeName: '',
  sort: productSkuRequestDo.value.productAttributeRequestDo.attributeSummaryDos.length + 1,
  attributeValueDos: [],
  attributeValueListResultDos: [],
})

// 批量更新表单数据
const batchUpdateForm = reactive({
  field: '',
  operation: 'set',
  adjustmentValue: 0,
})

// 快速选择表单数据
const quickSelectForm = reactive({
  attributeId: '',
  attributeValueIds: [] as string[], // 使用正确的复数形式
})

// 获取当前产品中存在的属性及属性值选项
const getAttributeOptions = computed(() => {
  const options = [] as {
    attributeId: string
    attributeName: string
    values: { attributeValueId: string, attributeValueContent: string }[]
  }[]

  // 收集所有已添加的属性及其值
  productSkuRequestDo.value.productAttributeRequestDo.attributeSummaryDos.forEach(attr => {
    const attributeOption = {
      attributeId: attr.attributeId,
      attributeName: attr.attributeName,
      values: [] as { attributeValueId: string, attributeValueContent: string }[],
    }

    // 收集该属性下的所有值
    attr.attributeValueDos.forEach(value => {
      attributeOption.values.push({
        attributeValueId: value.id,
        attributeValueContent: value.attributeValueContent,
      })
    })

    options.push(attributeOption)
  })

  return options
})

// 根据属性和属性值快速选择对应的SKU行
const applyQuickSelect = () => {
  // 移除了参数定义
  if (
    !quickSelectForm.attributeId
    || !quickSelectForm.attributeValueIds
    || quickSelectForm.attributeValueIds.length === 0
  ) {
    // 如果没有选择属性或属性值，清空当前选择
    multipleTable.value.clearSelection()
    multipleSelection.value = []
    return
  }

  // 清空当前选择
  multipleTable.value.clearSelection()

  // 查找符合条件的SKU行并选中
  productSkuRequestDo.value.productSkuItemRequestDos.forEach(skuItem => {
    const hasMatchingAttribute = skuItem.productSkuAttributeRequestDos.some(
      attr =>
        attr.attributeId === quickSelectForm.attributeId
        && quickSelectForm.attributeValueIds.includes(attr.attributeValueId),
    )

    if (hasMatchingAttribute) {
      multipleTable.value.toggleRowSelection(skuItem, true)
    }
  })

  // 更新multipleSelection
  handleSelectionChange(multipleTable.value.getSelectionRows())

  const selectedCount = multipleSelection.value.length
  const selectedAttributeName
    = getAttributeOptions.value.find(attr => attr.attributeId === quickSelectForm.attributeId)?.attributeName
      || '未知属性'
  const selectedValueNames
    = quickSelectForm.attributeValueIds
      .map(
        id =>
          getAttributeOptions.value
            .find(attr => attr.attributeId === quickSelectForm.attributeId)
            ?.values
            .find(val => val.attributeValueId === id)
            ?.attributeValueContent,
      )
      .filter(Boolean)
      .join(', ') || '未知值'

  ElMessage.success(`已选中 ${selectedCount} 个${selectedAttributeName}为"${selectedValueNames}"的SKU！`)
}

// 清空当前选择
const clearSelection = () => {
  multipleTable.value.clearSelection()
  multipleSelection.value = []
  ElMessage.info('已清空选择')
}

// 判断字段是否为文本类型
const isTextField = (field: string) => {
  const numericFields = ['price', 'costPrice', 'promotionPrice', 'weight', 'length', 'width', 'height']
  return !numericFields.includes(field)
}

// 获取占位符文本
const getPlaceholder = () => {
  if (isTextField(batchUpdateForm.field)) {
    return `请输入${batchUpdateForm.field}`
  }
  return '请输入数值'
}

// 批量更新方法
const applyBatchUpdate = () => {
  if (!batchUpdateForm.field) {
    ElMessage.warning('请先选择要更新的字段')
    return
  }

  if (multipleSelection.value.length === 0) {
    ElMessage.warning('请先选择要更新的行')
    return
  }

  // 获取调整值和操作类型
  const adjustmentValue = batchUpdateForm.adjustmentValue
  const operation = batchUpdateForm.operation
  const field = batchUpdateForm.field as keyof ProductSkuItemRequestDo

  // 对选中的SKU项目应用批量更新
  multipleSelection.value.forEach(skuItem => {
    let newValue: any = null

    // 根据字段类型和操作类型计算新值
    switch (operation) {
      case 'set':
        // 设置为固定值
        newValue = adjustmentValue
        break
      case 'add':
        // 增加固定值（仅对数值类型字段）
        if (!isTextField(field)) {
          newValue = ((skuItem[field] as number) || 0) + Number(adjustmentValue)
        } else {
          // 文本字段不支持此操作
          ElMessage.warning(`${field} 字段不支持增加操作`)
          return
        }
        break
      case 'subtract':
        // 减少固定值（仅对数值类型字段）
        if (!isTextField(field)) {
          newValue = ((skuItem[field] as number) || 0) - Number(adjustmentValue)
        } else {
          // 文本字段不支持此操作
          ElMessage.warning(`${field} 字段不支持减少操作`)
          return
        }
        break
      case 'percent_add':
        // 增加百分比（仅对数值类型字段）
        if (!isTextField(field)) {
          newValue = ((skuItem[field] as number) || 0) * (1 + Number(adjustmentValue) / 100)
        } else {
          // 文本字段不支持此操作
          ElMessage.warning(`${field} 字段不支持百分比增加操作`)
          return
        }
        break
      case 'percent_subtract':
        // 减少百分比（仅对数值类型字段）
        if (!isTextField(field)) {
          newValue = ((skuItem[field] as number) || 0) * (1 - Number(adjustmentValue) / 100)
        } else {
          // 文本字段不支持此操作
          ElMessage.warning(`${field} 字段不支持百分比减少操作`)
          return
        }
        break
      default:
        // 默认为设置为固定值
        newValue = adjustmentValue
    }

    // 对数值类型字段确保值不为负数
    if (!isTextField(field)) {
      newValue = Math.max(0, Number(newValue))

      // 保留适当的小数位数
      if (['price', 'costPrice', 'promotionPrice', 'weight', 'length', 'width', 'height'].includes(field)) {
        newValue = Number(newValue.toFixed(2))
      } else {
        newValue = Math.round(newValue)
      }
    }

    // 更新字段值
    ;(skuItem as any)[field] = newValue
  })

  // 显示操作成功消息
  const fieldNameMap: Record<string, string> = {
    quantity: '库存',
    price: '价格',
    costPrice: '成本价',
    promotionPrice: '促销价格',
    currencyId: '货币ID',
    weight: '重量',
    weightUnit: '重量单位',
    length: '长度',
    width: '宽度',
    height: '高度',
    lengthUnit: '长度单位',
    mpn: 'MPN',
    upc: 'UPC',
    ean: 'EAN',
    jan: 'JAN',
    isbn: 'ISBN',
    issn: 'ISSN',
  }

  ElMessage.success(`已批量更新 ${multipleSelection.value.length} 个SKU的${fieldNameMap[field] || field}！`)
}

const attributeFormVisible = ref(true)

const handleChangeAttribute = async (id: string) => {
  attributeListData.value.list.find(item => {
    if (item.id === id) {
      currentAttribute.value.attributeValueListResultDos = item.attributeValueListResultDos
      currentAttribute.value.attributeName = item.attributeName
    }
  })
}

const handleDeleteAttribute = (index: number) => {
  productSkuRequestDo.value.productAttributeRequestDo.attributeSummaryDos.splice(index, 1)

  // 清空快速选择表单
  quickSelectForm.attributeId = ''
  quickSelectForm.attributeValueIds = []
}

const handelAddAttribute = () => {
  if (!productSkuRequestDo.value.spu) {
    ElMessage.error($t('product.placeholder.spu'))
    return
  }
  attributeFormVisible.value = true
}

const handleEditAttribute = (index: number) => {
  currentAttribute.value = productSkuRequestDo.value.productAttributeRequestDo.attributeSummaryDos[index]
  attributeFormVisible.value = true
}

const handleAddAttributeCancel = () => {
  attributeFormVisible.value = false
}

const handleAddAttributeSave = () => {
  if (!productSkuRequestDo.value.spu) {
    ElMessage.error($t('product.placeholder.spu'))
    return
  }
  // 如果当前属性已存在，则修改，否则新增
  if (!currentAttribute.value.attributeId) {
    ElMessage.warning($t('product.placeholder.attributeId'))
    return
  }
  if (!currentAttribute.value.attributeValueDos || currentAttribute.value.attributeValueDos.length === 0) {
    ElMessage.warning($t('product.placeholder.attributeValueDos'))
    return
  }
  const index = productSkuRequestDo.value.productAttributeRequestDo.attributeSummaryDos.findIndex(
    item => item.attributeId === currentAttribute.value.attributeId,
  )
  if (index !== -1) {
    productSkuRequestDo.value.productAttributeRequestDo.attributeSummaryDos[index] = currentAttribute.value
  } else {
    productSkuRequestDo.value.productAttributeRequestDo.attributeSummaryDos.push(currentAttribute.value)
  }
  currentAttribute.value = {
    languageId: usePreferenceStore().preference.language.id,
    attributeId: '',
    attributeName: '',
    sort: productSkuRequestDo.value.productAttributeRequestDo.attributeSummaryDos.length + 1,
    attributeValueDos: [],
    attributeValueListResultDos: [],
  }
  attributeFormVisible.value = false

  // 清空快速选择表单
  quickSelectForm.attributeId = ''
  quickSelectForm.attributeValueIds = []
}

const createAttributeRef = ref()

const createAttributeValueRef = ref()

const handleCreateAttribute = () => {
  createAttributeRef.value.openDialog()
}

const handleCreateAttributeValue = () => {
  createAttributeValueRef.value.openDialog(currentAttribute.value.attributeId, currentAttribute.value.languageId)
}

const getAttributeList = async () => {
  await getList()
  if (!attributeListData.value.list || attributeListData.value.list.length === 0) {
    return
  }
  currentAttribute.value.attributeValueListResultDos = attributeListData.value.list.find(
    item => item.id === currentAttribute.value.attributeId,
  )?.attributeValueListResultDos
}

const setData = (data: ProductSkuRequestDo) => {
  productSkuRequestDo.value = data
}

const getData = () => {
  // 校验数据
  if (!productSkuRequestDo.value.spu) {
    ElMessage.error($t('product.placeholder.spu'))
    return
  }
  // 校验skuCode是否有重复和校验skuCode是否为空
  const skuItems = productSkuRequestDo.value.productSkuItemRequestDos
  // 检查是否有空值（包括只有空白字符的情况）
  if (skuItems.some(item => !item.skuCode || item.skuCode.trim() === '')) {
    ElMessage.error($t('product.placeholder.skuCode'))
    return
  }
  // 检查是否有重复的skuCode
  const skuCodes = skuItems.map(item => item.skuCode.trim())
  const uniqueSkuCodes = new Set(skuCodes)
  if (uniqueSkuCodes.size !== skuCodes.length) {
    ElMessage.error($t('product.error.duplicateSkuCode')) // 你需要添加对应的国际化词条
    return
  }
  // 校验库存是否小于等于0
  skuItems.forEach(item => {
    if (item.productSkuInventoryRequestDos.some(skuItem => skuItem.quantity != null && skuItem.quantity <= 0)) {
      ElMessage.error($t('product.placeholder.quantity'))
    }
  })

  // 校验所有的价格是否小于等于0
  if (skuItems.some(item => item.price != null && item.price <= 0)) {
    ElMessage.error($t('product.placeholder.price'))
    return
  }
  return productSkuRequestDo.value
}

defineExpose({
  setData,
  getData,
})
</script>

<template>
  <div class="w-full">
    <ElForm ref="formRef" :model="productSkuRequestDo" :rules="rules" class="w-full" label-width="100px">
      <ElFormItem label="库存状态" prop="stockStatus">
        <ElRadioGroup v-model="productSkuRequestDo.stockStatus" :loading="stockStatusLoading">
          <ElRadio v-for="item in stockStatusListData.list" :key="item.id" :value="item.id">
            {{ item.productStockStatusName }}
          </ElRadio>
        </ElRadioGroup>
      </ElFormItem>
      <ElFormItem label="货币" prop="currencyId">
        <ElSelect v-model="productSkuRequestDo.currencyId" clearable filterable placeholder="请选择货币">
          <ElOption
            v-for="item in currencies"
            :key="item.id"
            :value="item.id"
            :label="`${item.symbolLeft}${item.currencyCode} - ${item.currencyName}`"
          >
            {{ item.symbolLeft }} {{ item.currencyCode }} - {{ item.currencyName }}
          </ElOption>
        </ElSelect>
      </ElFormItem>
      <ElFormItem :label="$t('product.spu')" prop="spu">
        <ElInput
          v-model="productSkuRequestDo.spu"
          clearable
          minlength="1"
          maxlength="120"
          :placeholder="$t('product.placeholder.spu')"
        />
      </ElFormItem>
      <ElFormItem label="商品规格" prop="productAttributeRequestDo">
        <!-- 规格头部 -->
        <div class="w-full flex justify-between items-center">
          <div class="flex-1 text-gray-400 text-sm">
            发布规格图，优化商品展示效率
          </div>
          <div>
            <EBtn type="primary" plain @click="handelAddAttribute">
              <Icon name="mynaui:plus" class="mr-1" />
              添加商品规格
            </EBtn>
          </div>
        </div>
        <!-- 规格 -->
        <div
          v-if="productSkuRequestDo.productAttributeRequestDo.attributeSummaryDos.length > 0"
          class="w-full flex-col items-center mt-4"
        >
          <VueDraggable
            v-model="productSkuRequestDo.productAttributeRequestDo.attributeSummaryDos"
            item-key="parameterId"
            :animation="200"
            :fallback-on-body="true"
            :swap-threshold="0.65"
            ghost-class="opacity-50"
            class="w-full"
            @start="dragging = true"
            @end="dragEnd"
          >
            <div
              v-for="(item, index) in productSkuRequestDo.productAttributeRequestDo.attributeSummaryDos"
              :key="index"
              class="w-full bg-[#F6F7Fd] border border-gray-200 p-2 mb-4"
            >
              <div class="w-full flex justify-between items-center border-b border-gray-200 pb-2 mb-2">
                <div class="flex items-center">
                  <div class="mr-1">
                    <Icon icon="ant-design:holder-outlined" />
                  </div>
                  <div class="param-item truncate">
                    {{ item.attributeName }}
                  </div>
                </div>
                <div class="flex items-center">
                  <EBtn type="primary" plain text @click="handleEditAttribute(index)">
                    <Icon name="mynaui:edit" :size="4" />
                  </EBtn>
                  <EBtn type="danger" plain text @click="handleDeleteAttribute(index)">
                    <Icon name="ep:delete" :size="4" />
                  </EBtn>
                </div>
              </div>
              <div class="w-full flex items-center">
                <VueDraggable
                  v-model="item.attributeValueDos"
                  item-key="attributeValueId"
                  :animation="200"
                  :fallback-on-body="true"
                  :swap-threshold="0.65"
                  ghost-class="opacity-50"
                  class="w-full flex items-center"
                  @start="dragging = true"
                  @end="dragEndAttributeValue(index)"
                >
                  <div v-for="(avItem, avItemIndex) in item.attributeValueDos" :key="avItemIndex">
                    <div class="h-12 bg-white border border-gray-200 p-1 mr-2 flex items-center">
                      <Icon
                        v-if="!avItem.attributeImageFileVo || !avItem.attributeImageFileVo.fileUrl"
                        name="ri:image-line"
                        :size="6"
                        class="mr-1"
                        color="gray"
                      />
                      <img
                        v-if="avItem.attributeImageFileVo && avItem.attributeImageFileVo.fileUrl"
                        :src="avItem.attributeImageFileVo.fileUrl"
                        class="w-6 h-6 mr-1"
                      >
                      <span class="fs-12px">{{ avItem.attributeValueContent }}</span>
                    </div>
                  </div>
                </VueDraggable>
              </div>
            </div>
          </VueDraggable>
        </div>
        <!-- 属性编辑区域 -->
        <div v-if="attributeFormVisible" class="w-full bg-[#F6F7FD] mt-4 border border-gray-200">
          <div class="w-full flex justify-between items-center border-b border-gray-200 p-2">
            <div>选择属性</div>
            <div class="flex items-center cursor-pointer" @click="handleCreateAttribute">
              <Icon name="mynaui:plus" class="mr-1" />
              添加属性
            </div>
          </div>
          <div v-loading="attributeLoading" class="w-full flex justify-between items-center p-4">
            <div class="flex-1 flex items-center justify-between mr-2">
              <div class="w-1/4 mr-2">
                <ElSelect
                  v-model="currentAttribute.attributeId"
                  placeholder="请选择商品规格"
                  filterable
                  clearable
                  class="mr-2"
                  @change="handleChangeAttribute"
                >
                  <ElOption
                    v-for="item in attributeListData.list"
                    :key="item.id"
                    :label="item.attributeName"
                    :value="item.id"
                  >
                    {{ item.attributeName }}
                  </ElOption>
                </ElSelect>
              </div>
              <div class="flex-1">
                <ElSelect
                  v-model="currentAttribute.attributeValueDos"
                  multiple
                  value-key="id"
                  filterable
                  clearable
                  placeholder="请选择属性值"
                >
                  <ElOption
                    v-for="item in currentAttribute.attributeValueListResultDos"
                    :key="item.id"
                    :label="item.attributeValueContent"
                    :value="item"
                  >
                    {{ item.attributeValueContent }}
                  </ElOption>
                </ElSelect>
              </div>
            </div>
            <div class="flex items-center justify-end cursor-pointer" @click="handleCreateAttributeValue">
              <Icon name="mynaui:plus" class="mr-1" />
              添加属性值
            </div>
          </div>
          <div class="w-full p-4">
            <EBtn type="default" @click="handleAddAttributeCancel">
              {{ $t('common.cancel') }}
            </EBtn>
            <EBtn type="primary" plain @click="handleAddAttributeSave">
              {{ $t('common.save') }}
            </EBtn>
          </div>
        </div>
      </ElFormItem>
      <ElFormItem label="价格库存" required>
        <!-- 规格头部 -->
        <div class="w-full flex justify-between items-center" style="margin-top: 6px">
          <div class="flex-1 text-gray-400 text-sm">
            填写商品价格库存信息
          </div>
        </div>
        <!-- 变体属性 -->
        <div class="w-full mt-4 bg-[#F6F7FD] p-4 border border-gray-200">
          <!-- 批量更新功能 -->
          <div
            v-if="productSkuRequestDo.productSkuItemRequestDos.length > 1"
            class="p-4 bg-white mb-4 border border-gray-200"
          >
            <div class="w-full mb-4">
              <div class="grid grid-cols-3 gap-4">
                <!-- 新增快速选择功能 -->
                <div class="flex items-center space-x-2">
                  <ElSelect
                    v-model="quickSelectForm.attributeId"
                    placeholder="选择属性"
                    class="flex-1"
                    clearable
                    @change="
                      () => {
                        quickSelectForm.attributeValueIds = []
                        applyQuickSelect()
                      }
                    "
                  >
                    <ElOption
                      v-for="attr in getAttributeOptions"
                      :key="attr.attributeId"
                      :label="attr.attributeName"
                      :value="attr.attributeId"
                    />
                  </ElSelect>
                </div>

                <div class="flex items-center space-x-2">
                  <ElSelect
                    v-model="quickSelectForm.attributeValueIds"
                    placeholder="选择属性值"
                    class="flex-1"
                    clearable
                    multiple
                    :multiple-limit="0"
                    @change="applyQuickSelect"
                  >
                    <ElOption
                      v-for="value in getAttributeOptions.find(attr => attr.attributeId === quickSelectForm.attributeId)
                        ?.values || []"
                      :key="value.attributeValueId"
                      :label="value.attributeValueContent"
                      :value="value.attributeValueId"
                    />
                  </ElSelect>
                </div>

                <div class="flex items-center justify-end space-x-2">
                  <EBtn type="primary" @click="applyQuickSelect()">
                    快速选择
                  </EBtn>
                  <EBtn type="info" @click="clearSelection()">
                    清空选择
                  </EBtn>
                </div>
              </div>
            </div>
            <div class="w-full">
              <div class="grid grid-cols-4 gap-4">
                <!-- 原有的批量更新字段选择 -->
                <div class="flex items-center space-x-2">
                  <ElSelect v-model="batchUpdateForm.field" placeholder="选择字段" class="flex-1">
                    <ElOption label="库存" value="quantity" />
                    <ElOption label="价格" value="price" />
                    <ElOption label="成本价" value="costPrice" />
                    <ElOption label="促销价格" value="promotionPrice" />
                    <ElOption label="重量" value="weight" />
                    <ElOption label="重量单位" value="weightUnit" />
                    <ElOption label="长度" value="length" />
                    <ElOption label="宽度" value="width" />
                    <ElOption label="高度" value="height" />
                    <ElOption label="长度单位" value="lengthUnit" />
                    <ElOption label="MPN" value="mpn" />
                    <ElOption label="UPC" value="upc" />
                    <ElOption label="EAN" value="ean" />
                    <ElOption label="JAN" value="jan" />
                    <ElOption label="ISBN" value="isbn" />
                    <ElOption label="ISSN" value="issn" />
                  </ElSelect>
                </div>
                <div class="flex items-center space-x-2">
                  <ElSelect v-model="batchUpdateForm.operation" class="flex-1">
                    <ElOption label="设置为固定值" value="set" />
                    <ElOption label="增加固定值" value="add" />
                    <ElOption label="减少固定值" value="subtract" />
                    <ElOption label="增加百分比" value="percent_add" />
                    <ElOption label="减少百分比" value="percent_subtract" />
                  </ElSelect>
                </div>
                <div class="flex items-center space-x-2">
                  <label class="text-sm text-gray-600 w-12">调整值:</label>
                  <ElInput
                    v-if="isTextField(batchUpdateForm.field)"
                    v-model="batchUpdateForm.adjustmentValue"
                    class="flex-1"
                    :placeholder="getPlaceholder()"
                  />
                  <ElInputNumber
                    v-else
                    v-model="batchUpdateForm.adjustmentValue"
                    :precision="
                      batchUpdateForm.field.includes('price')
                        || batchUpdateForm.field === 'quantity'
                        || batchUpdateForm.field === 'weight'
                        || batchUpdateForm.field === 'length'
                        || batchUpdateForm.field === 'width'
                        || batchUpdateForm.field === 'height'
                        ? 2
                        : 0
                    "
                    :step="1"
                    :min="batchUpdateForm.operation.includes('percent') ? -100 : -Infinity"
                    class="flex-1"
                    :placeholder="getPlaceholder()"
                  />
                </div>
                <div class="flex items-center justify-end">
                  <EBtn type="primary" @click="applyBatchUpdate()">
                    批量更新
                  </EBtn>
                </div>
              </div>
            </div>
          </div>
          <ElTable
            v-if="productSkuRequestDo.productSkuItemRequestDos.length > 0"
            ref="multipleTable"
            :data="productSkuRequestDo.productSkuItemRequestDos"
            style="width: 100%"
            border
            max-height="500"
            row-key="skuCode"
            :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
            @selection-change="handleSelectionChange"
          >
            <ElTableColumn type="selection" width="55" />
            <ElTableColumn label="SKU编码" width="150">
              <template #default="scope">
                <div class="w-full flex items-center">
                  <ElInput v-model="scope.row.skuCode" clearable :placeholder="$t('product.placeholder.skuCode')" />
                </div>
              </template>
            </ElTableColumn>

            <ElTableColumn label="SKU图片" width="90">
              <template #default="scope">
                <div class="w-full flex items-center">
                  <Icon
                    v-if="!scope.row.skuImageFileVo || !scope.row.skuImageFileVo.fileUrl"
                    name="ri:image-line"
                    :size="6"
                    color="gray"
                  />
                  <img
                    v-if="scope.row.skuImageFileVo && scope.row.skuImageFileVo.fileUrl"
                    :src="scope.row.skuImageFileVo.fileUrl"
                    class="w-6 h-6"
                  >
                </div>
              </template>
            </ElTableColumn>

            <ElTableColumn label="库存" width="120" align="center">
              <template #header>
                <div v-loading="warehouseLoading">
                  <div class="flex flex-col">
                    <div>仓库库存</div>
                    <ElSelect v-model="currentWarehouseId" clearable filterable placeholder="请选择仓库">
                      <ElOption
                        v-for="warehouse in warehouseListData.list"
                        :key="warehouse.id"
                        :label="warehouse.warehouseName"
                        :value="warehouse.id"
                      />
                    </ElSelect>
                  </div>
                </div>
              </template>
              <template #default="scope">
                <div
                  v-for="(item, index) in scope.row.productSkuInventoryRequestDos"
                  :key="item.warehouseId"
                  class="w-full flex items-center"
                >
                  <div v-if="item.warehouseId === currentWarehouseId && item.skuCode === scope.row.skuCode">
                    <ElInput
                      v-model.number="scope.row.productSkuInventoryRequestDos[index].quantity"
                      type="number"
                      :min="0"
                      clearable
                      :placeholder="$t('product.placeholder.quantity')"
                    />
                  </div>
                </div>
              </template>
            </ElTableColumn>

            <ElTableColumn label="价格" width="120">
              <template #default="scope">
                <div class="w-full flex items-center">
                  <ElInput
                    v-model.number="scope.row.price"
                    type="number"
                    :min="0"
                    clearable
                    :placeholder="$t('product.placeholder.price')"
                  />
                </div>
              </template>
            </ElTableColumn>

            <ElTableColumn label="成本价" width="120">
              <template #default="scope">
                <div class="w-full flex items-center">
                  <ElInput
                    v-model.number="scope.row.costPrice"
                    type="number"
                    :min="0"
                    clearable
                    :placeholder="$t('product.placeholder.costPrice')"
                  />
                </div>
              </template>
            </ElTableColumn>

            <ElTableColumn label="促销价格" width="120">
              <template #default="scope">
                <div class="w-full flex items-center">
                  <ElInput
                    v-model.number="scope.row.promotionPrice"
                    type="number"
                    :min="0"
                    clearable
                    :placeholder="$t('product.placeholder.promotionPrice')"
                  />
                </div>
              </template>
            </ElTableColumn>

            <ElTableColumn label="促销开始时间" width="160">
              <template #default="scope">
                <div class="w-full flex items-center">
                  <ElDatePicker
                    v-model="scope.row.promotionStartedTime"
                    type="datetime"
                    format="YYYY-MM-DD HH:mm:ss"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    :placeholder="$t('product.placeholder.promotionStartedTime')"
                    clearable
                  />
                </div>
              </template>
            </ElTableColumn>

            <ElTableColumn label="促销结束时间" width="160">
              <template #default="scope">
                <div class="w-full flex items-center">
                  <ElDatePicker
                    v-model="scope.row.promotionEndedTime"
                    type="datetime"
                    format="YYYY-MM-DD HH:mm:ss"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    :placeholder="$t('product.placeholder.promotionEndedTime')"
                    clearable
                  />
                </div>
              </template>
            </ElTableColumn>

            <ElTableColumn label="是否需要运输" width="120">
              <template #default="scope">
                <div class="w-full flex items-center justify-center">
                  <ElSwitch v-model="scope.row.isRequiredShipping" :active-value="true" :inactive-value="false" />
                </div>
              </template>
            </ElTableColumn>

            <ElTableColumn label="重量" width="120">
              <template #default="scope">
                <div class="w-full flex items-center">
                  <ElInput
                    v-model.number="scope.row.weight"
                    type="number"
                    :min="0"
                    clearable
                    :placeholder="$t('product.placeholder.weight')"
                  />
                </div>
              </template>
            </ElTableColumn>

            <ElTableColumn label="重量单位" width="120">
              <template #default="scope">
                <div class="w-full flex items-center">
                  <ElInput
                    v-model="scope.row.weightUnit"
                    clearable
                    :placeholder="$t('product.placeholder.weightUnit')"
                  />
                </div>
              </template>
            </ElTableColumn>

            <ElTableColumn label="长度" width="120">
              <template #default="scope">
                <div class="w-full flex items-center">
                  <ElInput
                    v-model.number="scope.row.length"
                    type="number"
                    :min="0"
                    clearable
                    :placeholder="$t('product.placeholder.length')"
                  />
                </div>
              </template>
            </ElTableColumn>

            <ElTableColumn label="宽度" width="120">
              <template #default="scope">
                <div class="w-full flex items-center">
                  <ElInput
                    v-model.number="scope.row.width"
                    type="number"
                    :min="0"
                    clearable
                    :placeholder="$t('product.placeholder.width')"
                  />
                </div>
              </template>
            </ElTableColumn>

            <ElTableColumn label="高度" width="120">
              <template #default="scope">
                <div class="w-full flex items-center">
                  <ElInput
                    v-model.number="scope.row.height"
                    type="number"
                    :min="0"
                    clearable
                    :placeholder="$t('product.placeholder.height')"
                  />
                </div>
              </template>
            </ElTableColumn>

            <ElTableColumn label="长度单位" width="120">
              <template #default="scope">
                <div class="w-full flex items-center">
                  <ElInput
                    v-model="scope.row.lengthUnit"
                    clearable
                    :placeholder="$t('product.placeholder.lengthUnit')"
                  />
                </div>
              </template>
            </ElTableColumn>

            <ElTableColumn label="MPN" width="150">
              <template #default="scope">
                <div class="w-full flex items-center">
                  <ElInput v-model="scope.row.mpn" clearable :placeholder="$t('product.placeholder.mpn')" />
                </div>
              </template>
            </ElTableColumn>

            <ElTableColumn label="UPC" width="150">
              <template #default="scope">
                <div class="w-full flex items-center">
                  <ElInput v-model="scope.row.upc" clearable :placeholder="$t('product.placeholder.upc')" />
                </div>
              </template>
            </ElTableColumn>

            <ElTableColumn label="EAN" width="150">
              <template #default="scope">
                <div class="w-full flex items-center">
                  <ElInput v-model="scope.row.ean" clearable :placeholder="$t('product.placeholder.ean')" />
                </div>
              </template>
            </ElTableColumn>

            <ElTableColumn label="JAN" width="150">
              <template #default="scope">
                <div class="w-full flex items-center">
                  <ElInput v-model="scope.row.jan" clearable :placeholder="$t('product.placeholder.jan')" />
                </div>
              </template>
            </ElTableColumn>

            <ElTableColumn label="ISBN" width="150">
              <template #default="scope">
                <div class="w-full flex items-center">
                  <ElInput v-model="scope.row.isbn" clearable :placeholder="$t('product.placeholder.isbn')" />
                </div>
              </template>
            </ElTableColumn>

            <ElTableColumn label="ISSN" width="150">
              <template #default="scope">
                <div class="w-full flex items-center">
                  <ElInput v-model="scope.row.issn" clearable :placeholder="$t('product.placeholder.issn')" />
                </div>
              </template>
            </ElTableColumn>
          </ElTable>
          <ElEmpty v-else description="请输入SPU" />
        </div>
      </ElFormItem>
    </ElForm>
    <CreateAttributeDialog ref="createAttributeRef" @get-list="getList" />
    <CreateAttributeValueDialog ref="createAttributeValueRef" @get-list="getAttributeList" />
  </div>
</template>
