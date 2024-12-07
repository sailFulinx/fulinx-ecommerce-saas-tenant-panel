<script setup lang="ts">
import { updateProductPriceApi } from '@/api/product'
import { useLocale } from '@/hooks/useLocale'
import { usePreferenceStore } from '@/stores/preference'
import { ElMessage, ElSwitch, ElTableColumn } from 'element-plus'

const { form } = defineProps<{ form: ShowProduct & CommonField }>()

const emit = defineEmits(['resetFormData'])

const id = useRoute().params.id as string

const formData = ref<ShowProduct & CommonField>(form)

const productPriceData = ref<UpdateProductPriceParams>({
  productId: id,
  productPriceUpdateRequestDos: [],
  deletedPriceIds: [],
  languageId: usePreferenceStore().preference?.language.id,
  currencyId: usePreferenceStore().preference?.currency.id,
})

watch(
  () => form,
  val => {
    if (val) {
      formData.value = JSON.parse(JSON.stringify(form))
      productPriceData.value.productPriceUpdateRequestDos = []
      if (formData.value.productPriceListResultDos && formData.value.productPriceListResultDos.length > 0) {
        formData.value.productPriceListResultDos.map(item => {
          const priceItemData = {
            productPriceId: item.id,
            orderQuantity: item.orderQuantity,
            price: item.price,
            isSettingSalePrice: item.isSettingSalePrice,
            salePrice: item.salePrice,
            salePriceStartedAt: item.salePriceStartedAt,
            isSettingSaleEndedTime: item.isSettingSaleEndedTime,
            salePriceEndedAt: item.salePriceEndedAt,
          }
          productPriceData.value.productPriceUpdateRequestDos.push(priceItemData)
        })
      }
    }
  },
  { deep: true, immediate: true },
)

const { t: $t } = useLocale()

const loading = reactive({
  init: false,
  list: false,
})
const handleAddPrice = () => {
  productPriceData.value.productPriceUpdateRequestDos.push({
    productPriceId: '',
    orderQuantity: 1,
    price: 1,
    isSettingSalePrice: false,
    salePrice: null,
    salePriceStartedAt: null,
    isSettingSaleEndedTime: false,
    salePriceEndedAt: null,
  })
}

const handleRemovePrice = (row: any) => {
  productPriceData.value.productPriceUpdateRequestDos = productPriceData.value.productPriceUpdateRequestDos.filter(
    item => item.productPriceId !== row.productPriceId,
  )
  if (row.productPriceId) {
    productPriceData.value.deletedPriceIds.push(row.productPriceId)
  }
}

const handleSave = async () => {
  loading.init = true
  const { data } = await updateProductPriceApi(productPriceData.value).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  emit('resetFormData', data)
  ElMessage.success($t('success.edit'))
}
</script>

<template>
  <ElCard shadow="never" class="mb-5">
    <template #header>
      <div class="flex items-center justify-between">
        <div class="text-base font-bold">
          {{ $t('product.price') }}
        </div>
        <div class="flex items-center justify-end">
          <EBtn type="primary" plain @click="handleAddPrice">
            <Icon icon="ep:plus" />
            {{ $t('product.addPrice') }}
          </EBtn>
          <EBtn type="primary" plain @click="handleSave">
            <Icon icon="ant-design:save-outlined" class="mr-1" />
            {{ $t('common.save') }}
          </EBtn>
        </div>
      </div>
    </template>
    <div class="w-full mt-5">
      <ElTable :data="productPriceData.productPriceUpdateRequestDos" style="width: 100%">
        <ElTableColumn prop="orderQuantity" :label="$t('product.orderQuantity')" width="200">
          <template #default="scope">
            <ElInputNumber
              v-model="scope.row.orderQuantity"
              :min="1"
              :max="999999999"
              :placeholder="$t('product.placeholder.orderQuantity')"
            />
          </template>
        </ElTableColumn>
        <ElTableColumn prop="price" :label="$t('product.unitPrice')" width="200">
          <template #default="scope">
            <ElInputNumber
              v-model="scope.row.price"
              :min="0.0001"
              :max="999999999.9999"
              :placeholder="$t('product.placeholder.productPrice')"
            />
          </template>
        </ElTableColumn>
        <ElTableColumn prop="salePrice" :label="$t('product.salePrice')" width="200">
          <template #default="scope">
            <ElInputNumber
              v-model="scope.row.salePrice"
              :min="0.0001"
              :max="999999999.9999"
              :placeholder="$t('product.placeholder.salePrice')"
            />
          </template>
        </ElTableColumn>
        <!-- <ElTableColumn prop="salePriceStartedAt" :label="$t('product.salePriceStartedAt')">
          <template #default="scope">
            <ElDatePicker
              v-model="scope.row.salePriceStartedAt"
              type="datetime"
              :placeholder="$t('product.placeholder.salePriceStartedAt')"
            />
          </template>
        </ElTableColumn>
        <ElTableColumn prop="salePriceEndedAt" :label="$t('product.salePriceEndedAt')">
          <template #default="scope">
            <ElDatePicker
              v-model="scope.row.salePriceEndedAt"
              type="datetime"
              :placeholder="$t('product.placeholder.salePriceEndedAt')"
            />
          </template>
        </ElTableColumn> -->
        <ElTableColumn :label="$t('common.operate')" align="right">
          <template #default="scope">
            <EBtn type="danger" text @click="handleRemovePrice(scope.row)">
              <Icon icon="ep:delete" />
            </EBtn>
          </template>
        </ElTableColumn>
      </ElTable>
    </div>
  </ElCard>
</template>
