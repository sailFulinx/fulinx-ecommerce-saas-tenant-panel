<script setup lang="ts">
import { supplierKey } from '../type/injectionKeys'

const { languageId } = defineProps<{
  languageId: string
}>()

const { loading, id: supplierId, form, resetFormData } = inject(supplierKey)!

const { t: $t } = useLocale()

// 本地状态
const inputSupplierSlugVisible = ref(false)
const currentSlug = ref('')

// 创建Slug
const handleClickCreateSupplierSlug = async () => {
  loading.init = true
  if (!currentSlug.value.startsWith('/')) {
    currentSlug.value = `/${currentSlug.value}`
  }

  if (currentSlug.value.endsWith('/')) {
    currentSlug.value = currentSlug.value.slice(0, -1)
  }

  const { data } = await createSupplierSlugApi({
    supplierId,
    languageId,
    slug: currentSlug.value,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  await resetFormData(data)
  ElMessage.success($t('success.create'))
}

// 更新Slug
const handleClickUpdateSupplierSlug = () => {
  currentSlug.value = form.slug
  inputSupplierSlugVisible.value = true
}

const handleCancelUpdateSupplierSlug = () => {
  inputSupplierSlugVisible.value = false
}

const editSupplierSlug = async () => {
  if (!currentSlug.value) {
    ElMessage.warning($t('supplier.error.slug'))
    return
  }
  loading.init = true
  if (!currentSlug.value.startsWith('/')) {
    currentSlug.value = `/${currentSlug.value}`
  }

  if (currentSlug.value.endsWith('/')) {
    currentSlug.value = currentSlug.value.slice(0, -1)
  }
  const { data } = await updateSupplierSlugApi({
    slugId: form.slugId,
    languageId,
    slug: currentSlug.value,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentSlug.value = ''
  await resetFormData(data)
  inputSupplierSlugVisible.value = false
  ElMessage.success($t('success.edit'))
}
</script>

<template>
  <ElCard shadow="never" class="mb-5">
    <div class="w-full mt-0 pt-0">
      <div v-if="!form.slug || !form.slugId" class="mb-5">
        <div class="w-full flex items-center mb-5">
          <ElAlert :title="$t('supplier.warning.noSlugData')" type="warning" show-icon />
        </div>
        <div class="w-full flex items-center mb-5">
          <ElInput v-model="currentSlug" :placeholder="$t('supplier.placeholder.slug')" />
        </div>
        <ElButton type="primary" class="ml-5" @click="handleClickCreateSupplierSlug">
          <Icon icon="ant-design:save-outlined" :size="5" class="mr-1" />
          {{ $t('common.save') }}
        </ElButton>
      </div>
      <div v-else class="mb-5">
        <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
          <div class="col-span-1 font-semibold text-gray-700">
            {{ $t('supplier.slug') }}:
          </div>
          <div class="col-span-11 w-full flex items-center">
            <div v-if="!inputSupplierSlugVisible" class="mr-2">
              {{ form.slug }}
            </div>
            <div v-else class="flex items-center justify-start">
              <ElInput v-model="currentSlug" :placeholder="$t('supplier.placeholder.slug')" class="mr-2" />
              <ElButton text @click="handleCancelUpdateSupplierSlug">
                <Icon icon="ep:close" :size="5" class="mr-1" />
              </ElButton>
              <ElButton type="primary" class="ml-5" @click="editSupplierSlug">
                <Icon icon="ant-design:save-outlined" :size="5" class="mr-1" />
                {{ $t('common.save') }}
              </ElButton>
            </div>
            <ElButton v-if="!inputSupplierSlugVisible" type="primary" text @click="handleClickUpdateSupplierSlug">
              <Icon icon="ep:edit" :size="5" class="mr-1" />
            </ElButton>
          </div>
        </div>
      </div>
    </div>
  </ElCard>
</template>
