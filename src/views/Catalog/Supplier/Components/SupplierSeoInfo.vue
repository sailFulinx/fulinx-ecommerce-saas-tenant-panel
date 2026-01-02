<script setup lang="ts">
const { currentItem, supplierId, languageId } = defineProps<{
  currentItem: SupplierAdminLocalizedViewDo
  supplierAdminLocalizedViewDos: SupplierAdminLocalizedViewDo[]
  supplierId: string
  languageId: string
}>()

const emit = defineEmits<{
  refreshData: []
}>()

const { t: $t } = useLocale()

const loading = reactive({
  init: false,
})

// 本地状态
const inputSupplierMetaTitleVisible = ref(false)
const currentSupplierMetaTitle = ref('')

// 更新元标题
const handleClickUpdateSupplierMetaTitle = (supplierMetaTitle: string) => {
  currentSupplierMetaTitle.value = supplierMetaTitle
  inputSupplierMetaTitleVisible.value = true
}

const handleCancelUpdateSupplierMetaTitle = () => {
  inputSupplierMetaTitleVisible.value = false
}

const editSupplierMetaTitle = async (supplierSeoId: string) => {
  if (!currentSupplierMetaTitle.value) {
    ElMessage.warning($t('supplier.error.supplierMetaTitle'))
    return
  }
  loading.init = true
  await updateSupplierSeoApi({
    supplierSeoId,
    metaTitle: currentSupplierMetaTitle.value,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentSupplierMetaTitle.value = ''
  emit('refreshData')
  inputSupplierMetaTitleVisible.value = false
  ElMessage.success($t('success.edit'))
}

// 更新元描述
const inputSupplierMetaDescriptionVisible = ref(false)
const currentSupplierMetaDescription = ref('')

const handleClickUpdateSupplierMetaDescription = (supplierMetaDescription: string) => {
  currentSupplierMetaDescription.value = supplierMetaDescription
  inputSupplierMetaDescriptionVisible.value = true
}

const handleCancelUpdateSupplierMetaDescription = () => {
  inputSupplierMetaDescriptionVisible.value = false
}

const editSupplierMetaDescription = async (supplierSeoId: string) => {
  if (!currentSupplierMetaDescription.value) {
    ElMessage.warning($t('supplier.error.supplierMetaDescription'))
    return
  }
  loading.init = true
  await updateSupplierSeoApi({
    supplierSeoId,
    metaTitle: currentSupplierMetaTitle.value,
    metaDescription: currentSupplierMetaDescription.value,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentSupplierMetaDescription.value = ''
  emit('refreshData')
  inputSupplierMetaDescriptionVisible.value = false
  ElMessage.success($t('success.edit'))
}

// 创建分类SEO
const createSupplierSeo = async () => {
  if (!currentSupplierMetaTitle.value) {
    ElMessage.warning($t('supplier.error.supplierMetaTitle'))
    return
  }
  loading.init = true
  await createSupplierSeoApi({
    supplierId,
    languageId,
    metaTitle: currentSupplierMetaTitle.value,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentSupplierMetaTitle.value = ''
  emit('refreshData')
  ElMessage.success($t('success.create'))
}
</script>

<template>
  <ElCard v-if="currentItem.supplierSeoListResultDo" shadow="never" class="mb-5">
    <div class="w-full mt-0 pt-0">
      <!-- 分类元标题 -->
      <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
        <div class="col-span-1 font-semibold text-gray-700">
          {{ $t('supplier.metaTitle') }}:
        </div>
        <div class="col-span-11 w-full flex items-center">
          <span v-if="!inputSupplierMetaTitleVisible" class="mr-2">
            {{ currentItem.supplierSeoListResultDo.metaTitle }}
          </span>
          <span v-else>
            <ElInput
              v-model="currentSupplierMetaTitle"
              style="width: 300px"
              class="mr-2"
              @blur="editSupplierMetaTitle(currentItem.supplierSeoListResultDo.id)"
            />
            <ElButton text @click="handleCancelUpdateSupplierMetaTitle">
              <Icon icon="ep:close" :size="5" class="mr-1" />
            </ElButton>
          </span>
          <ElButton
            v-if="!inputSupplierMetaTitleVisible"
            type="primary"
            text
            @click="handleClickUpdateSupplierMetaTitle(currentItem.supplierSeoListResultDo.metaTitle)"
          >
            <Icon icon="ep:edit" :size="5" class="mr-1" />
          </ElButton>
        </div>
      </div>
      <!-- 分类元描述 -->
      <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
        <div class="col-span-1 font-semibold text-gray-700">
          {{ $t('supplier.metaDescription') }}:
        </div>
        <div class="col-span-11 w-full flex items-center">
          <span v-if="!inputSupplierMetaDescriptionVisible" class="mr-2">
            {{ currentItem.supplierSeoListResultDo.metaDescription }}
          </span>
          <span v-else>
            <ElInput
              v-model="currentSupplierMetaDescription"
              style="width: 300px"
              class="mr-2"
              @blur="editSupplierMetaDescription(currentItem.supplierSeoListResultDo.id)"
            />
            <ElButton text @click="handleCancelUpdateSupplierMetaDescription">
              <Icon icon="ep:close" :size="5" class="mr-1" />
            </ElButton>
          </span>
          <ElButton
            v-if="!inputSupplierMetaDescriptionVisible"
            type="primary"
            text
            @click="
              handleClickUpdateSupplierMetaDescription(currentItem.supplierSeoListResultDo.metaDescription)
            "
          >
            <Icon icon="ep:edit" :size="5" class="mr-1" />
          </ElButton>
        </div>
      </div>
    </div>
  </ElCard>
  <ElCard v-else shadow="never" class="mb-5">
    <div class="flex justify-center items-center mb-5">
      <ElAlert :title="$t('supplier.warning.noSeoData')" type="warning" show-icon />
    </div>
    <div class="flex justify-center items-center mb-5">
      <ElInput v-model="currentSupplierMetaTitle" :placeholder="$t('supplier.placeholder.metaTItle')" />
      <ElButton type="primary" class="ml-5" @click="createSupplierSeo">
        <Icon icon="ant-design:save-outlined" :size="5" class="mr-1" />
        {{ $t('common.save') }}
      </ElButton>
    </div>
  </ElCard>
</template>
