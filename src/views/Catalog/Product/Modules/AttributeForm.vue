<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'
import { formatTime } from '@/utils'
import { cartesianProduct } from '@/utils/cartesianProduct'
import CreateAttributeDialog from '../../Attribute/Components/CreateAttributeDialog.vue'
import CreateAttributeValueDialog from './CreateAttributeValueDialog.vue'

const {
  attributeListData,
  attributePayload,
  getAttributeDataList,
  warehouseListData,
  stockStatusListData,
  weightUnitListData,
  lengthUnitListData,
} = defineProps<{
  attributeListData: TableResponse<AttributeListData & CommonField>
  attributePayload: Partial<AttributeListParams>
  getAttributeDataList: (
    params?: Partial<AttributeListParams>,
  ) => Promise<TableResponse<AttributeListData & CommonField>>
  warehouseListData: TableResponse<WarehouseData & CommonField>
  stockStatusListData: TableResponse<ProductStockStatusData>
  weightUnitListData: TableResponse<CommonEnumData>
  lengthUnitListData: TableResponse<CommonEnumData>
}>()

const currencies = useCurrencyStore().currencies

interface ProductCreateProvider {
  productForm: CreateProductParams
}

const { productForm } = inject('ProductCreate') as ProductCreateProvider

const { t: $t } = useLocale()

const dragging = ref(false)

const currentWarehouseId = ref('')

watch(
  () => warehouseListData,
  () => {
    if (!currentWarehouseId.value) {
      currentWarehouseId.value = warehouseListData.list.find(item => item.isDefault)?.id || ''
    }
  },
)

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
      attributeValueId: av.attributeValueId, // 添加 attributeValueId
    })),
  )

  // 计算笛卡尔积
  return cartesianProduct(attributeValues)
})

// 用于判断是否有图片属性的属性ID
const hasImageAttributeId = ref('')

// 生成SKU函数
const generateSkus = () => {
  hasImageAttributeId.value = ''
  // 保存现有的图片信息，使用 attributeId 和 attributeValueId 的组合作为标识符
  const existingSkuImages = new Map()
  productSkuRequestDo.value.productSkuItemRequestDos.forEach(sku => {
    if (sku.skuImageFileId && sku.skuImageFileVo) {
      // 为每个属性值对创建一个唯一标识符
      sku.productSkuAttributeRequestDos.forEach(attr => {
        const key = `${attr.attributeId}-${attr.attributeValueId}`
        existingSkuImages.set(key, {
          skuImageFileId: sku.skuImageFileId,
          skuImageFileVo: sku.skuImageFileVo,
        })
      })
    }
  })

  // 清空现有的SKU项
  productSkuRequestDo.value.productSkuItemRequestDos = []

  // 获取笛卡尔积结果
  const combinations = cartes.value

  // 如果有规格组合
  if (combinations.length > 0 && combinations[0].length > 0) {
    combinations.forEach(combination => {
      // 生成SKU编码，格式为 spu-组合值
      const skuValues = combination.map(item => item.attributeValue)
      const skuCode = `${productSkuRequestDo.value.spu}-${skuValues.join('-')}`

      // 创建SKU属性数组
      const productSkuAttributes = combination.map(item => {
        if (item.attributeImageFileVo != null && item.attributeImageFileVo.id) {
          hasImageAttributeId.value = item.attributeId
        }
        return {
          attributeValueContent: item.attributeValue,
          attributeName: item.attributeName,
          attributeImageFileVo: item.attributeImageFileVo || null,
          attributeId: item.attributeId,
          attributeValueId: item.attributeValueId,
        }
      })

      // 创建库存信息数组
      const productSkuInventoryRequestDos: ProductSkuInventoryRequestDo[] = []
      warehouseListData.list.forEach(warehouse => {
        // 创建SKU库存信息
        const skuInventory: ProductSkuInventoryRequestDo = {
          warehouseId: warehouse.id,
          quantity: 0,
          skuCode,
        }

        // 将库存信息添加到SKU项中
        productSkuInventoryRequestDos.push(skuInventory)
      })

      // 检查当前组合中是否有带图片的属性值
      let imageToApply = null
      // 使用 hasImageAttributeId 来确定哪个属性有图
      const imageAttributeId = hasImageAttributeId.value
      if (imageAttributeId) {
        // 查找当前组合中是否有该属性的值
        const imageAttributeValue = productSkuAttributes.find(attr => attr.attributeId === imageAttributeId)
        if (imageAttributeValue) {
          // 如果找到了，检查这个属性值是否在 existingSkuImages 中有对应的图片
          const key = `${imageAttributeId}-${imageAttributeValue.attributeValueId}`
          if (existingSkuImages.has(key)) {
            imageToApply = existingSkuImages.get(key)
          }
        }
      }

      // 创建SKU项
      const skuItem: ProductSkuItemRequestDo = {
        productId: '', // 通常在保存产品时填充
        skuCode,
        currencyId: productSkuRequestDo.value.currencyId, // 默认货币，实际应用中可能需要从其他地方获取
        price: 0, // 默认价格，用户后续设置
        status: true,
        // 保留原有的图片信息
        ...(imageToApply
          ? {
              skuImageFileId: imageToApply.skuImageFileId,
              skuImageFileVo: imageToApply.skuImageFileVo,
            }
          : {
              skuImageFileId: undefined,
              skuImageFileVo: null,
            }),
        costPrice: null,
        promotionPrice: null,
        promotionStartedTime: null,
        promotionEndedTime: null,
        isRequiredShipping: productForm.productType === 1,
        weight: null,
        weightUnit: undefined,
        length: null,
        width: null,
        height: null,
        lengthUnit: undefined,
        mpn: undefined,
        upc: undefined,
        ean: undefined,
        jan: undefined,
        isbn: undefined,
        issn: undefined,
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
    // 如果没有规格组合，添加一个默认的SKU项
    if (productSkuRequestDo.value.spu) {
      const productSkuInventoryRequestDos: ProductSkuInventoryRequestDo[] = []
      warehouseListData.list.forEach(warehouse => {
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
        skuImageFileId: undefined,
        skuImageFileVo: null,
        costPrice: null,
        promotionPrice: null,
        promotionStartedTime: null,
        promotionEndedTime: null,
        isRequiredShipping: productForm.productType === 1,
        weight: null,
        weightUnit: undefined,
        length: null,
        width: null,
        height: null,
        lengthUnit: undefined,
        mpn: undefined,
        upc: undefined,
        ean: undefined,
        jan: undefined,
        isbn: undefined,
        issn: undefined,
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

interface BatchUpdateForm {
  field: string
  operation: string
  adjustmentValue: any
}

// 批量更新表单数据
const batchUpdateForm = reactive<BatchUpdateForm>({
  field: '',
  operation: 'set',
  adjustmentValue: null,
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
  quickSelectForm.attributeValueIds = []
  quickSelectForm.attributeId = ''
  ElMessage.info('已清空选择')
}

// 判断字段是否为文本类型
const isTextField = (field: string) => {
  const numericFields = ['price', 'costPrice', 'promotionPrice', 'weight', 'length', 'width', 'height']
  const dateFields = ['promotionStartedTime', 'promotionEndedTime']
  const selectFields = ['weightUnit', 'lengthUnit'] // 选择字段不再视为文本字段
  // 不包括日期字段和quantity，但包括选择字段
  return (
    !numericFields.includes(field)
    && !dateFields.includes(field)
    && !selectFields.includes(field)
    && field !== 'quantity'
  )
}

// 判断字段是否为数字类型
const isNumericField = (field: string) => {
  const numericFields = ['price', 'costPrice', 'promotionPrice', 'weight', 'length', 'width', 'height', 'quantity']
  return numericFields.includes(field)
}

// 判断字段是否为整数类型（不允许小数）
const isIntegerField = (field: string) => {
  return field === 'quantity' // 可以扩展其他整数类型的字段
}

// 判断字段是否为日期类型
const isDateField = (field: string) => {
  const dateFields = ['promotionStartedTime', 'promotionEndedTime']
  return dateFields.includes(field)
}

// 判断字段是否为选择类型
const isSelectField = (field: string) => {
  const selectFields = ['weightUnit', 'lengthUnit']
  return selectFields.includes(field)
}

// 获取操作选项，根据字段类型决定是否禁用某些选项
const getOperationOptions = computed(() => {
  const isInteger = isIntegerField(batchUpdateForm.field)
  const isSelect = isSelectField(batchUpdateForm.field)

  const baseOptions = [
    { label: '设置为固定值', value: 'set', disabled: false },
    { label: '增加固定值', value: 'add', disabled: !isNumericField(batchUpdateForm.field) },
    { label: '减少固定值', value: 'subtract', disabled: !isNumericField(batchUpdateForm.field) },
    {
      label: '增加百分比',
      value: 'percent_add',
      disabled: !isNumericField(batchUpdateForm.field) || isInteger || isSelect,
    },
    {
      label: '减少百分比',
      value: 'percent_subtract',
      disabled: !isNumericField(batchUpdateForm.field) || isInteger || isSelect,
    },
  ]

  // 如果是日期字段，禁用数值操作
  if (isDateField(batchUpdateForm.field)) {
    baseOptions.forEach(option => {
      if (option.value !== 'set') {
        option.disabled = true
      }
    })
  } else if (isTextField(batchUpdateForm.field)) {
    // 如果是文本字段，也禁用数值操作
    baseOptions.forEach(option => {
      if (option.value !== 'set') {
        option.disabled = true
      }
    })
  }

  return baseOptions
})

// 获取占位符文本
const getPlaceholder = () => {
  if (isTextField(batchUpdateForm.field)) {
    return `请输入${batchUpdateForm.field}`
  }
  return '请输入数值'
}

const handleChangeField = () => {
  batchUpdateForm.operation = 'set'
  batchUpdateForm.adjustmentValue = null
}

const handleChangeOperation = () => {
  batchUpdateForm.adjustmentValue = null
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

  // 检查时间字段的特殊验证
  if (batchUpdateForm.field === 'promotionEndedTime') {
    // 验证促销结束时间不能早于今天
    const today = new Date()
    const inputDate = new Date(
      typeof batchUpdateForm.adjustmentValue === 'string'
        ? batchUpdateForm.adjustmentValue
        : String(batchUpdateForm.adjustmentValue),
    )

    if (inputDate < today) {
      ElMessage.warning('促销结束时间不能早于今天')
      return
    }
  }

  // 检查选择字段是否选择了值
  if (isSelectField(batchUpdateForm.field) && !batchUpdateForm.adjustmentValue) {
    ElMessage.warning('请选择要更新的值')
    return
  }

  // 获取调整值和操作类型
  const adjustmentValue = batchUpdateForm.adjustmentValue
  const operation = batchUpdateForm.operation
  const field = batchUpdateForm.field

  // 对选中的SKU项目应用批量更新
  for (const skuItem of multipleSelection.value) {
    let newValue: any = null

    // 根据字段类型和操作类型计算新值
    switch (operation) {
      case 'set':
        // 设置为固定值
        newValue = adjustmentValue
        break
      case 'add':
        // 增加固定值（仅对数值类型字段）
        if (!isTextField(field) && !isSelectField(field)) {
          // 数值字段处理
          if (!isNumericField(field)) {
            // 对于日期字段，不支持此操作
            ElMessage.warning(`${field} 字段不支持增加操作`)
            return
          }
          newValue = (skuItem as any)[field] !== undefined ? Number((skuItem as any)[field]) || 0 : 0
          newValue = newValue + Number(adjustmentValue)
        } else {
          // 文本字段或选择字段不支持此操作
          ElMessage.warning(`${field} 字段不支持增加操作`)
          return
        }
        break
      case 'subtract':
        // 减少固定值（仅对数值类型字段）
        if (!isTextField(field) && !isSelectField(field)) {
          // 数值字段处理
          if (!isNumericField(field)) {
            // 对于日期字段，不支持此操作
            ElMessage.warning(`${field} 字段不支持减少操作`)
            return
          }
          newValue = (skuItem as any)[field] !== undefined ? Number((skuItem as any)[field]) || 0 : 0
          newValue = newValue - Number(adjustmentValue)
        } else {
          // 文本字段或选择字段不支持此操作
          ElMessage.warning(`${field} 字段不支持减少操作`)
          return
        }
        break
      case 'percent_add':
        // 增加百分比（仅对数值类型字段）
        if (!isTextField(field) && !isSelectField(field)) {
          // 数值字段处理
          if (!isNumericField(field)) {
            // 对于日期字段，不支持此操作
            ElMessage.warning(`${field} 字段不支持百分比增加操作`)
            return
          }
          newValue = (skuItem as any)[field] !== undefined ? Number((skuItem as any)[field]) || 0 : 0
          newValue = newValue * (1 + Number(adjustmentValue) / 100)
        } else {
          // 文本字段或选择字段不支持此操作
          ElMessage.warning(`${field} 字段不支持百分比增加操作`)
          return
        }
        break
      case 'percent_subtract':
        // 减少百分比（仅对数值类型字段）
        if (!isTextField(field) && !isSelectField(field)) {
          // 数值字段处理
          if (!isNumericField(field)) {
            // 对于日期字段，不支持此操作
            ElMessage.warning(`${field} 字段不支持百分比减少操作`)
            return
          }
          newValue = (skuItem as any)[field] !== undefined ? Number((skuItem as any)[field]) || 0 : 0
          newValue = newValue * (1 - Number(adjustmentValue) / 100)
        } else {
          // 文本字段或选择字段不支持此操作
          ElMessage.warning(`${field} 字段不支持百分比减少操作`)
          return
        }
        break
      default:
        // 默认为设置为固定值
        newValue = adjustmentValue
    }

    // 对数值类型字段确保值不为负数
    if (isNumericField(field)) {
      newValue = Math.max(0, Number(newValue))

      // 保留适当的小数位数
      if (['price', 'costPrice', 'promotionPrice', 'weight', 'length', 'width', 'height'].includes(field)) {
        newValue = Number(newValue.toFixed(2))
      } else if (field !== 'quantity') {
        newValue = Math.round(newValue)
      }
    }

    // 如果更新的是库存，更新的是当前仓库的multipleSelection.value.productSkuInventoryRequestDos中的值
    if (batchUpdateForm.field === 'quantity') {
      if (skuItem.productSkuInventoryRequestDos.length === 0) {
        skuItem.productSkuInventoryRequestDos.push({
          skuCode: skuItem.skuCode,
          warehouseId: currentWarehouseId.value,
          quantity: newValue,
        })
      } else {
        skuItem.productSkuInventoryRequestDos.forEach(inventoryItem => {
          if (inventoryItem.warehouseId === currentWarehouseId.value) {
            inventoryItem.quantity = newValue
          }
        })
      }
    }

    // 对时间字段的额外验证
    if (field === 'promotionEndedTime' && newValue) {
      const startTime = skuItem.promotionStartedTime ? new Date(skuItem.promotionStartedTime) : null
      const endTime = new Date(newValue)

      if (startTime && endTime <= startTime) {
        ElMessage.warning('促销结束时间必须晚于促销开始时间')
        return
      }

      if (endTime < new Date()) {
        ElMessage.warning('促销结束时间不能早于今天')
        return
      }
    }

    if (field === 'promotionStartedTime' && newValue) {
      const endTime = skuItem.promotionEndedTime ? new Date(skuItem.promotionEndedTime) : null
      const startTime = new Date(newValue)

      if (endTime && startTime >= endTime) {
        ElMessage.warning('促销开始时间必须早于促销结束时间')
        return
      }
    }

    // 更新字段值
    ;(skuItem as any)[field] = newValue
  }

  // 显示操作成功消息
  const fieldNameMap: Record<string, string> = {
    quantity: '库存',
    price: '价格',
    costPrice: '成本价',
    promotionPrice: '促销价格',
    promotionStartedTime: '促销开始时间',
    promotionEndedTime: '促销结束时间',
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
  attributeListData.list.find(item => {
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
  currentAttribute.value.attributeValueDos.map(item => {
    item.attributeValueId = item.id
  })
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
  await getAttributeDataList(attributePayload)
  if (!attributeListData.list || attributeListData.list.length === 0) {
    return
  }
  currentAttribute.value.attributeValueListResultDos = attributeListData.list.find(
    item => item.id === currentAttribute.value.attributeId,
  )?.attributeValueListResultDos
}

// 设置属性图片
const setAttributeImage = ({
  attributeIndex,
  attributeValueIndex,
  fileData,
}: {
  attributeIndex: number
  attributeValueIndex: number
  fileData: FileData & CommonField
}) => {
  if (attributeIndex === undefined || attributeValueIndex === undefined || fileData === undefined) {
    return
  }

  // 检查其他属性中是否已有图片
  const hasImageInOtherAttributes = productSkuRequestDo.value.productAttributeRequestDo.attributeSummaryDos.some(
    (attr, idx) =>
      idx !== attributeIndex
      && attr.attributeValueDos.some(av => av.attributeImageFileVo !== null && av.attributeImageFileVo !== undefined),
  )

  // 如果其他属性已有图片，则不允许添加
  if (hasImageInOtherAttributes) {
    ElMessage.warning('已有其他属性设置了规格图，不能重复添加')
    return
  }

  // 清除其他所有属性的图片（包括当前属性的其他值）
  productSkuRequestDo.value.productAttributeRequestDo.attributeSummaryDos.forEach((attr, idx) => {
    if (idx !== attributeIndex) {
      attr.attributeValueDos.forEach(av => {
        av.attributeImageFileVo = null
        av.attributeImageFileId = undefined
      })
    }
  })

  // 设置当前属性值的图片
  const attributeValue
    = productSkuRequestDo.value.productAttributeRequestDo.attributeSummaryDos[attributeIndex].attributeValueDos[
      attributeValueIndex
    ]
  attributeValue.attributeImageFileVo = fileData
  attributeValue.attributeImageFileId = fileData.id

  // 更新SKU项中的图片信息
  productSkuRequestDo.value.productSkuItemRequestDos.forEach(item => {
    if (item.productSkuAttributeRequestDos.some(attr => attr.attributeValueId === attributeValue.attributeValueId)) {
      item.skuImageFileId = fileData.id
      item.skuImageFileVo = { ...fileData }
    }
  })
}

const handleChangeCurrency = (currencyId: string) => {
  productSkuRequestDo.value.currencyId = currencyId
  if (
    !productSkuRequestDo.value.productSkuItemRequestDos
    || productSkuRequestDo.value.productSkuItemRequestDos.length === 0
  ) {
    return
  }
  productSkuRequestDo.value.productSkuItemRequestDos.forEach(item => {
    item.currencyId = currencyId
  })
}

const setData = (data: ProductSkuRequestDo) => {
  productSkuRequestDo.value = data
}

const getData = () => {
  // 计算searchIndex
  const attributeSummaryDos = productSkuRequestDo.value.productAttributeRequestDo.attributeSummaryDos
  const searchIndexParts = []

  for (const attr of attributeSummaryDos) {
    const attributeName = attr.attributeName
    const attributeValues = attr.attributeValueDos.map(av => av.attributeValueContent).join(',')
    searchIndexParts.push(`${attributeName}:${attributeValues}`)
  }

  // 将计算好的searchIndex赋值回去
  productSkuRequestDo.value.productAttributeRequestDo.searchIndex = searchIndexParts.join(';')

  // 校验数据
  if (!productSkuRequestDo.value.spu) {
    ElMessage.error($t('product.error.spu'))
    return
  }
  // 校验skuCode是否有重复和校验skuCode是否为空
  const skuItems = productSkuRequestDo.value.productSkuItemRequestDos
  // 检查是否有空值（包括只有空白字符的情况）
  if (skuItems.some(item => !item.skuCode || item.skuCode.trim() === '')) {
    ElMessage.error($t('product.error.skuCode'))
    return
  }
  // 检查是否有重复的skuCode
  const skuCodes = skuItems.map(item => item.skuCode.trim())
  const uniqueSkuCodes = new Set(skuCodes)
  if (uniqueSkuCodes.size !== skuCodes.length) {
    ElMessage.error($t('product.error.duplicateSkuCode')) // 你需要添加对应的国际化词条
    return
  }

  // 校验库存及价格等信息
  for (const item of skuItems) {
    if (item.productSkuInventoryRequestDos.some(skuItem => skuItem.quantity != null && skuItem.quantity < 0)) {
      ElMessage.error($t('product.error.quantity'))
      return
    }

    if (!item.price || item.price === 0) {
      ElMessage.error($t('product.error.price'))
      return
    }

    // 成本价大于正常价格时报错
    if (item.costPrice && item.price < item.costPrice) {
      ElMessage.error($t('product.error.costPrice'))
      return
    }

    // 促销价格大于正常价格时报错
    if (item.promotionPrice && item.price <= item.promotionPrice) {
      ElMessage.error($t('product.error.promotionPrice'))
      return
    }

    // 如果输入了重量，则重量单位必须选择
    if (item.weight && !item.weightUnit) {
      ElMessage.error($t('product.error.weightUnitRequired'))
      return
    }

    if (!item.weight && item.weightUnit) {
      ElMessage.error($t('product.error.weight'))
      return
    }

    if ((item.length || item.height || item.width) && !item.lengthUnit) {
      // 当length, height, width中任意一个存在，但lengthUnit不存在时，执行这里的校验逻辑
      ElMessage.error($t('product.error.lengthUnitRequired'))
      return
    }

    if (item.lengthUnit) {
      // 精确检查每个字段是否有有效值（包括0）
      const hasLength = item.length !== null && item.length !== undefined
      const hasHeight = item.height !== null && item.height !== undefined
      const hasWidth = item.width !== null && item.width !== undefined

      // 如果三个字段都没有有效值，则校验失败
      if (!hasLength && !hasHeight && !hasWidth) {
        ElMessage.error($t('product.error.lengthWidthHeightRequired'))
        return
      }
    }

    // 对skuItems的几个时间字段进行处理
    if (item.promotionEndedTime) {
      item.promotionEndedTime = formatTime(item.promotionEndedTime)
    }
    if (item.promotionStartedTime) {
      item.promotionStartedTime = formatTime(item.promotionStartedTime)
    }
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
        <ElRadioGroup v-model="productSkuRequestDo.stockStatus">
          <ElRadio v-for="item in stockStatusListData.list" :key="item.id" :value="item.id">
            {{ item.productStockStatusName }}
          </ElRadio>
        </ElRadioGroup>
      </ElFormItem>
      <ElFormItem label="货币" prop="currencyId">
        <ElSelect v-model="productSkuRequestDo.currencyId" clearable filterable placeholder="请选择货币" @change="handleChangeCurrency">
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
                    <div
                      class="min-w-14 h-14 bg-white border border-gray-200 px-1 py-2 mr-2 flex items-center justify-center"
                    >
                      <!-- 控制上传组件是否显示 -->
                      <UploadSingleImageMini
                        v-if="item.attributeId === hasImageAttributeId || !hasImageAttributeId"
                        :attribute-index="index"
                        :attribute-value-index="avItemIndex"
                        class="mr-1"
                        @get-data="setAttributeImage"
                      />
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
          <div class="w-full flex justify-between items-center p-4">
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
                  <ElSelect
                    v-model="batchUpdateForm.field"
                    placeholder="选择字段"
                    class="flex-1"
                    @change="handleChangeField"
                  >
                    <ElOption label="库存" value="quantity" />
                    <ElOption label="价格" value="price" />
                    <ElOption label="成本价" value="costPrice" />
                    <ElOption label="促销价格" value="promotionPrice" />
                    <ElOption label="促销开始时间" value="promotionStartedTime" />
                    <ElOption label="促销结束时间" value="promotionEndedTime" />
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
                  <ElSelect v-model="batchUpdateForm.operation" class="flex-1" @change="handleChangeOperation">
                    <ElOption
                      v-for="option in getOperationOptions"
                      :key="option.value"
                      :label="option.label"
                      :value="option.value"
                      :disabled="option.disabled"
                    />
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
                    v-else-if="isNumericField(batchUpdateForm.field)"
                    v-model="batchUpdateForm.adjustmentValue"
                    :precision="
                      batchUpdateForm.field === 'quantity'
                        || batchUpdateForm.field.includes('price')
                        || batchUpdateForm.field === 'weight'
                        || batchUpdateForm.field === 'length'
                        || batchUpdateForm.field === 'width'
                        || batchUpdateForm.field === 'height'
                        ? batchUpdateForm.field === 'quantity'
                          ? 0
                          : 2
                        : 0
                    "
                    :step="1"
                    :min="batchUpdateForm.operation.includes('percent') ? -100 : -Infinity"
                    class="flex-1"
                    :placeholder="getPlaceholder()"
                  />
                  <ElDatePicker
                    v-else-if="isDateField(batchUpdateForm.field)"
                    v-model="batchUpdateForm.adjustmentValue"
                    type="datetime"
                    format="YYYY-MM-DD HH:mm:ss"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    :placeholder="getPlaceholder()"
                    class="flex-1"
                  />
                  <ElSelect
                    v-else-if="isSelectField(batchUpdateForm.field)"
                    v-model="batchUpdateForm.adjustmentValue"
                    :placeholder="getPlaceholder()"
                    class="flex-1"
                    clearable
                    filterable
                  >
                    <ElOption
                      v-for="item in batchUpdateForm.field === 'weightUnit'
                        ? weightUnitListData.list
                        : lengthUnitListData.list"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </ElSelect>
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
                <div>
                  <div class="flex flex-col">
                    <div>仓库库存</div>
                    <ElSelect v-model="currentWarehouseId" filterable placeholder="请选择仓库">
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
                    :picker-options="{
                      disabledDate: (time: Date) => {
                        // 确保开始时间不超过结束时间
                        if (scope.row.promotionEndedTime) {
                          return time.getTime() > new Date(scope.row.promotionEndedTime).getTime()
                        }
                        return false
                      },
                    }"
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
                    :picker-options="{
                      disabledDate: (time: Date) => {
                        // 确保结束时间不早于开始时间
                        if (scope.row.promotionStartedTime) {
                          return time.getTime() < new Date(scope.row.promotionStartedTime).getTime()
                        }
                        // 确保结束时间不早于今天
                        const today = new Date()
                        today.setHours(0, 0, 0, 0)
                        return time.getTime() < today.getTime()
                      },
                    }"
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
                  <ElSelect
                    v-model="scope.row.weightUnit"
                    :placeholder="$t('product.placeholder.weightUnit')"
                    clearable
                    filterable
                  >
                    <ElOption
                      v-for="item in weightUnitListData.list"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </ElSelect>
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
                  <ElSelect
                    v-model="scope.row.lengthUnit"
                    :placeholder="$t('product.placeholder.lengthUnit')"
                    clearable
                    filterable
                  >
                    <ElOption
                      v-for="item in lengthUnitListData.list"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </ElSelect>
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
            <ElTableColumn fixed="right" :label="$t('product.skuStatus')" min-width="90">
              <template #default="scope">
                <ElSwitch v-model="scope.row.status" />
              </template>
            </ElTableColumn>
          </ElTable>
          <ElEmpty v-else description="请输入SPU" />
        </div>
      </ElFormItem>
    </ElForm>
    <CreateAttributeDialog ref="createAttributeRef" @get-list="getAttributeDataList" />
    <CreateAttributeValueDialog ref="createAttributeValueRef" @get-list="getAttributeList" />
  </div>
</template>
