<script setup name="ProductDetail" lang="ts">
import { showProductApi } from '@/api/product'
import { useLocale } from '@/hooks/useLocale'
import { usePreferenceStore } from '@/stores/preference'
import { ElAlert, ElCard, ElForm, ElInput, ElMessage, ElSwitch, ElTabPane } from 'element-plus'

const { t: $t } = useLocale()

const id = useRoute().params.id as string

const selectLanguage = ref<LanguageData>(usePreferenceStore().preference?.language)

const activeName = ref<string>('base')

const loading = reactive({
  init: false,
  list: false,
})

const handleChangeTab = async (pane: string) => {
  if (pane === 'productValue') {
    await getProductValueList()
  }
}

// 创建product请求参数
const createFormData = (): ProductShow & CommonField => {
  return {
    id: '',
    productType: 0,
    productDetailListResultDo: {
      id: '',
      productId: '',
      languageId: '',
      productName: '',
      isDelete: 0,
      remark: '',
      recordVersion: 0,
      recordCreateName: '',
      recordUpdateName: '',
      recordCreateTime: '',
      recordUpdateTime: '',
    },
    isDelete: 0,
    remark: '',
    recordVersion: 0,
    recordCreateName: '',
    recordUpdateName: '',
    recordCreateTime: '',
    recordUpdateTime: '',
  }
}

// form初始化
const form = reactive<ProductShow>(createFormData())

const showProductPayload = reactive<ShowProductParams>({
  productId: id,
  languageId: selectLanguage.value.id,
})

// 获取数据
const getProductData = async () => {
  loading.init = true
  const { data } = await showProductApi(showProductPayload).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  return data
}

const resetFormData = async (val: ProductShow) => {
  await nextTick(() => {
    Object.assign(form, JSON.parse(JSON.stringify(val)))
  })
}

const initFormData = async () => {
  const res = await getProductData()
  resetFormData(res)
}

watch(
  () => usePreferenceStore().preference?.language,
  async val => {
    if (val) {
      selectLanguage.value = val
      showProductPayload.languageId = val.id
      await initFormData()
    }
  },
  { immediate: true },
)

// 更新名称
const inputProductNameVisible = ref<boolean>(false)
const currentProductName = ref<string>('')
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
  loading.init = true
  const { data } = await updateProductDetailProductNameApi({
    productName: currentProductName.value,
    productDetailId,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentProductName.value = ''
  await resetFormData(data)
  inputProductNameVisible.value = false
  ElMessage.success($t('success.edit'))
}

// 更新名称新增时
const createProductName = async () => {
  if (!currentProductName.value) {
    ElMessage.warning($t('product.error.productName'))
    return
  }
  loading.init = true
  const { data } = await createProductDetailApi({
    productName: currentProductName.value,
    productId: id,
    languageId: selectLanguage.value.id,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentProductName.value = ''
  await resetFormData(data)
  ElMessage.success($t('success.create'))
}
</script>

<template>
  <div v-loading="loading.init" class="view-page">
    <div class="view-header">
      <div class="flex justify-between items-center">
        <div>
          <span>{{ $t('product.show') }}</span>
        </div>
        <div />
      </div>
    </div>

    <div v-if="!loading.init" class="view-main theme-card">
      <ElTabs v-model="activeName" class="demo-tabs" @tab-change="handleChangeTab">
        <ElTabPane :label="$t('product.base')" name="base">
          <ElCard v-if="form.productDetailListResultDo" shadow="never" class="mb-5">
            <div class="w-full mt-0 pt-0">
              <div class="w-full grid grid-cols-12 gap-8 p-4">
                <div class="col-span-1 font-semibold fs-[14px] text-gray-700">
                  {{ $t('product.productName') }} :
                </div>
                <div class="col-span-11 w-full flex items-center">
                  <div v-if="!inputProductNameVisible" class="mr-2 flex">
                    <div class="mr-1">
                      {{ form.productDetailListResultDo.productName }}
                    </div>
                    <EBtn
                      type="primary"
                      text
                      @click="handleClickUpdateProductName(form.productDetailListResultDo.productName)"
                    >
                      <Icon icon="ep:edit" :size="4" class="mr-1" />
                    </EBtn>
                  </div>
                  <div v-else>
                    <ElInput
                      v-model="currentProductName"
                      style="width: 300px"
                      class="mr-2"
                      @blur="editProductName(form.productDetailListResultDo.id)"
                    />
                    <EBtn text @click="handleCancelUpdateProductName">
                      <Icon icon="ep:close" :size="5" class="mr-1" />
                    </EBtn>
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
              <ElInput v-model="currentProductName" :placeholder="$t('product.placeholder.productName')" />
              <EBtn type="primary" class="ml-5" @click="createProductName">
                <Icon icon="ant-design:save-outlined" :size="5" class="mr-1" />
                {{ $t('common.save') }}
              </EBtn>
            </div>
          </ElCard>
        </ElTabPane>
      </ElTabs>
    </div>
  </div>
</template>
