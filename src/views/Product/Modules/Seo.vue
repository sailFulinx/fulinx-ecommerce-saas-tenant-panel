<script setup lang="ts">
import { createProductSeoApi, updateProductMetaDescriptionApi, updateProductMetaTitleApi } from '@/api/product'
import { useLocale } from '@/hooks/useLocale'
import { usePreferenceStore } from '@/stores/preference'
import { ElMessage, ElSwitch, ElTableColumn } from 'element-plus'

const { form } = defineProps<{ form: ShowProduct & CommonField }>()

const emit = defineEmits(['resetFormData'])

const id = useRoute().params.id as string

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

const { t: $t } = useLocale()

const loading = reactive({
  init: false,
  list: false,
})

const inputProductMetaTitleVisible = ref(false)

const editProductMetaTitle = async () => {
  const { data } = await updateProductMetaTitleApi({
    productSeoId: formData.value.productSeoListResultDo.id,
    metaTitle: formData.value.productSeoListResultDo.metaTitle,
  }).catch(error => {
    inputProductMetaTitleVisible.value = false
    loading.init = false
    throw error
  })
  ElMessage.success($t('success.edit'))
  emit('resetFormData', data)
  inputProductMetaTitleVisible.value = false
}

const handleCancelUpdateProductMetaTitle = () => {
  inputProductMetaTitleVisible.value = false
}

const handleClickUpdateProductMetaTitle = () => {
  inputProductMetaTitleVisible.value = true
}

const inputProductMetaDescriptionVisible = ref(false)

const editProductMetaDescription = async () => {
  const { data } = await updateProductMetaDescriptionApi({
    productSeoId: formData.value.productSeoListResultDo.id,
    metaDescription: formData.value.productSeoListResultDo.metaDescription,
  }).catch(error => {
    inputProductMetaDescriptionVisible.value = false
    loading.init = false
    throw error
  })
  ElMessage.success($t('success.edit'))
  emit('resetFormData', data)
  inputProductMetaDescriptionVisible.value = false
}

const handleCancelUpdateProductMetaDescription = () => {
  inputProductMetaDescriptionVisible.value = false
}

const handleClickUpdateProductMetaDescription = () => {
  inputProductMetaDescriptionVisible.value = true
}

// 新增

const createProductMetaTitle = async () => {
  loading.init = true
  const { data } = await createProductSeoApi({
    productId: id,
    languageId: usePreferenceStore().preference?.language.id,
    metaTitle: formData.value.productSeoListResultDo.metaTitle,
  }).catch(error => {
    loading.init = false
    throw error
  })
  ElMessage.success($t('success.create'))
  emit('resetFormData', data)
  loading.init = false
}
</script>

<template>
  <ElCard v-if="form.productSeoListResultDo" shadow="never" class="mb-5">
    <div class="w-full mt-0 pt-0">
      <!-- 文章元标题 -->
      <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
        <div class="col-span-1 font-semibold text-gray-700">
          {{ $t('product.metaTitle') }}:
        </div>
        <div class="col-span-11 w-full flex items-center">
          <span v-if="!inputProductMetaTitleVisible" class="mr-2">
            {{ form.productSeoListResultDo.metaTitle }}
          </span>
          <span v-else>
            <ElInput
              v-model="formData.productSeoListResultDo.metaTitle"
              style="width: 300px"
              class="mr-2"
              @blur="editProductMetaTitle"
            />
            <EBtn text @click="handleCancelUpdateProductMetaTitle">
              <Icon icon="ep:close" :size="5" class="mr-1" />
            </EBtn>
          </span>
          <EBtn v-if="!inputProductMetaTitleVisible" type="primary" text @click="handleClickUpdateProductMetaTitle">
            <Icon icon="ep:edit" :size="5" class="mr-1" />
          </EBtn>
        </div>
      </div>
      <!-- 文章元描述 -->
      <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
        <div class="col-span-1 font-semibold text-gray-700">
          {{ $t('product.metaDescription') }}:
        </div>
        <div class="col-span-11 w-full flex items-center">
          <span v-if="!inputProductMetaDescriptionVisible" class="mr-2">
            {{ form.productSeoListResultDo.metaDescription }}
          </span>
          <span v-else>
            <ElInput
              v-model="formData.productSeoListResultDo.metaDescription"
              style="width: 300px"
              class="mr-2"
              @blur="editProductMetaDescription"
            />
            <EBtn text @click="handleCancelUpdateProductMetaDescription">
              <Icon icon="ep:close" :size="5" class="mr-1" />
            </EBtn>
          </span>
          <EBtn
            v-if="!inputProductMetaDescriptionVisible"
            type="primary"
            text
            @click="handleClickUpdateProductMetaDescription"
          >
            <Icon icon="ep:edit" :size="5" class="mr-1" />
          </EBtn>
        </div>
      </div>
    </div>
  </ElCard>
  <ElCard v-else>
    <div class="flex justify-center items-center mb-5">
      <ElAlert :title="$t('product.warning.noSeoData')" type="warning" show-icon />
    </div>
    <div class="flex justify-center items-center mb-5">
      <ElInput v-model="formData.productSeoListResultDo.metaTitle" :placeholder="$t('product.placeholder.metaTitle')" />
      <EBtn type="primary" class="ml-5" @click="createProductMetaTitle">
        <Icon icon="ant-design:save-outlined" :size="5" class="mr-1" />
        {{ $t('common.save') }}
      </EBtn>
    </div>
  </ElCard>
</template>
