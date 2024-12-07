<!-- <script setup lang="ts">
import { updateProductSlugApi } from '@/api/product'
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
  { deep: true, immediate: true }
)

const { t: $t } = useLocale()

const loading = reactive({
  init: false,
  list: false
})

</script>

<template>
  <ElCard shadow="never" class="mb-5">
    <div class="w-full mt-0 pt-0">
      <div v-if="!form.slug || !form.slugId" class="mb-5">
        <div class="w-full flex items-center mb-5">
          <ElAlert :title="$t('product.warning.noSlugData')" type="warning" show-icon />
        </div>
        <div class="w-full flex items-center mb-5">
          <ElInput v-model="currentSlug" :placeholder="$t('product.placeholder.slug')" />
        </div>
        <EBtn type="primary" class="ml-5" @click="handleClickCreateProductSlug">
          <Icon icon="ant-design:save-outlined" :size="5" class="mr-1" />
          {{ $t('common.save') }}
        </EBtn>
      </div>
      <div v-else class="mb-5">
        <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
          <div class="col-span-1 font-semibold text-gray-700">{{ $t('product.slug') }}:</div>
          <div class="col-span-11 w-full flex items-center">
            <div v-if="!inputProductSlugVisible" class="mr-2">
              {{ form.slug }}
            </div>
            <div v-else class="flex items-center justify-start">
              <ElInput v-model="currentSlug" :placeholder="$t('product.placeholder.slug')" class="mr-2" />
              <EBtn text @click="handleCancelUpdateProductSlug">
                <Icon icon="ep:close" :size="5" class="mr-1" />
              </EBtn>
              <EBtn type="primary" class="ml-5" @click="editProductSlug">
                <Icon icon="ant-design:save-outlined" :size="5" class="mr-1" />
                {{ $t('common.save') }}
              </EBtn>
            </div>
            <EBtn v-if="!inputProductSlugVisible" type="primary" text @click="handleClickUpdateProductSlug">
              <Icon icon="ep:edit" :size="5" class="mr-1" />
            </EBtn>
          </div>
        </div>
      </div>
    </div>
  </ElCard>
</template> -->
