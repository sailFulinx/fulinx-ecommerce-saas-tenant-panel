ProductLayoutInfo.vue
<script setup lang="ts">
interface Props {
  productData?: ShowProduct & CommonField
  productDetail: ProductAdminLocalizedViewDo
  productId: string
  languageId: string
  layoutTypeList: any[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  editProductLayout: []
  resetFormData: [ShowProduct & CommonField]
}>()

const { t: $t } = useLocale()

const currentLayoutType = ref(1)

const devComponentName = ref('')

const simplifiedComponentLayoutRef = ref()

// rows
const rows = ref<DeviceLayout>()

const isShowLayoutEdit = ref<boolean>(false)

// 全屏状态
const isFullScreen = ref(false)

// 切换全屏
const toggleFullScreen = () => {
  isFullScreen.value = !isFullScreen.value
}

const handleEditProductLayout = async () => {
  isShowLayoutEdit.value = true
  await nextTick()
  if (props && props.productDetail?.productDetailListResultDo.layoutContent && simplifiedComponentLayoutRef.value) {
    rows.value = JSON.parse(props.productDetail?.productDetailListResultDo.layoutContent)
    simplifiedComponentLayoutRef.value.setData(rows.value)
  }

  emit('editProductLayout')
}

watch(
  () => props.productDetail,
  () => {
    if (props.productDetail?.productDetailListResultDo?.layoutType) {
      currentLayoutType.value = props.productDetail?.productDetailListResultDo.layoutType
      isShowLayoutEdit.value = true
    }
    if (props.productDetail?.productDetailListResultDo?.devComponentName) {
      devComponentName.value = props.productDetail?.productDetailListResultDo.devComponentName
    }
    if (
      props.productDetail?.productDetailListResultDo?.layoutType === 3
      && props.productDetail?.productDetailListResultDo?.layoutContent
      && simplifiedComponentLayoutRef.value
    ) {
      rows.value = JSON.parse(props.productDetail?.productDetailListResultDo?.layoutContent)
      simplifiedComponentLayoutRef.value.setData(rows.value)
    }
  },
  { deep: true, immediate: true },
)

const handleSubmitProductLayout = async () => {
  if (!props.productDetail) {
    return
  }
  if (currentLayoutType.value === 3 && simplifiedComponentLayoutRef.value) {
    rows.value = simplifiedComponentLayoutRef.value.getData()
  }
  const payload = {
    productDetailId: props.productDetail?.productDetailListResultDo.id,
    languageId: props.languageId,
    layoutType: currentLayoutType.value,
    devComponentName: devComponentName.value,
    layoutContent: JSON.stringify(rows.value),
  }
  const { data } = await updateProductLayoutApi(payload).catch(error => {
    throw error
  })
  isShowLayoutEdit.value = false
  ElMessage.success($t('success.edit'))
  emit('resetFormData', data)
}

const handleCancel = () => {
  isShowLayoutEdit.value = false
  isFullScreen.value = false
  currentLayoutType.value = 1
}
</script>

<template>
  <div class="product-layout-info mb-4">
    <div class="sticky top-0 z-10 bg-white rounded-md">
      <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-300">
        <div class="col-span-1 font-semibold text-gray-700">
          {{ $t('common.layoutType') }}:
        </div>
        <div class="col-span-11">
          <div v-if="!isShowLayoutEdit">
            <div class="flex justify-start items-center">
              <span class="mr-2">
                {{ productDetail?.productDetailListResultDo?.layoutTypeLabel }}
              </span>
              <span>
                <EBtn type="primary" text @click="handleEditProductLayout">
                  <Icon icon="ep:edit" :size="5" />
                </EBtn>
              </span>
            </div>
          </div>
          <div v-else>
            <div class="w-full flex items-center justify-between mb-5">
              <div class="flex-col items-center">
                <ElSelect
                  v-model="currentLayoutType"
                  filterable
                  clearable
                  :placeholder="$t('common.placeholder.layoutType')"
                  style="width: 200px"
                >
                  <ElOption
                    v-for="item in layoutTypeList"
                    :key="item.id"
                    :value="item.id"
                    :label="item.layoutTypeName"
                  />
                </ElSelect>
              </div>
              <div>
                <div class="w-full flex">
                  <EBtn v-if="currentLayoutType === 3" @click="toggleFullScreen">
                    <Icon
                      :name="isFullScreen ? 'ant-design:fullscreen-exit-outlined' : 'ant-design:fullscreen-outlined'"
                      class="mr-2"
                    />
                    {{ isFullScreen ? $t('common.exitFullScreen') : $t('common.fullScreen') }}
                  </EBtn>
                  <EBtn type="primary" @click="handleCancel">
                    <Icon icon="ep:close" :size="3" class="mr-1" />
                    {{ $t('common.cancel') }}
                  </EBtn>
                  <EBtn type="danger" @click="handleSubmitProductLayout">
                    <Icon icon="ep:check" :size="3" class="mr-1" />
                    {{ $t('common.submit') }}
                  </EBtn>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="currentLayoutType === 2 && isShowLayoutEdit"
        class="mt-5 p-4 w-full bg-gray-50 border-gray-300 rounded-md grid grid-cols-12 gap-8"
      >
        <div class="col-span-1 font-semibold text-gray-700">
          {{ $t('common.devComponentName') }}:
        </div>
        <div class="col-span-11">
          <ElInput v-model="devComponentName" :placeholder="$t('common.placeholder.devComponentName')" />
        </div>
      </div>
    </div>

    <div v-if="currentLayoutType === 3" class="border border-gray-200" :class="{ 'full-screen-mode': isFullScreen }">
      <div
        class="bg-white flex justify-between border border-gray-200"
        :class="`${isFullScreen ? 'pa-4 sticky top-0 z-10' : ''}`"
      >
        <div v-if="isFullScreen">
          修改布局
        </div>
        <div v-if="isFullScreen" class="flex justify-end space-x-2">
          <EBtn @click="toggleFullScreen">
            <Icon
              :name="isFullScreen ? 'ant-design:fullscreen-exit-outlined' : 'ant-design:fullscreen-outlined'"
              class="mr-2"
            />
            {{ isFullScreen ? $t('common.exitFullScreen') : $t('common.fullScreen') }}
          </EBtn>
          <EBtn @click="handleCancel">
            <Icon name="ep:close" class="mr-2" />
            {{ $t('common.cancel') }}
          </EBtn>
          <EBtn type="primary" @click="handleSubmitProductLayout">
            <Icon name="ep:check" class="mr-2" />
            {{ $t('common.submit') }}
          </EBtn>
        </div>
      </div>
      <SimplifiedComponentLayout
        ref="simplifiedComponentLayoutRef"
        :is-full-screen="isFullScreen"
      />
    </div>
  </div>
</template>

<style scoped>
.full-screen-mode {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  background-color: white;
  padding: 0;
  margin: 0;
  overflow: auto;
  box-sizing: border-box;
}

.full-screen-mode :deep(.layout-area) {
  height: calc(100vh - 160px) !important;
  overflow-y: auto;
  padding-top: 10px;
}

.full-screen-mode :deep(.component-library) {
  height: calc(100vh - 160px) !important;
}
</style>
