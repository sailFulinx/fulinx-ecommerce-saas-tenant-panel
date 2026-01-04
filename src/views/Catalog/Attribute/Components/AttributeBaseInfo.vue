<script setup lang="ts">
import { attributeKey } from '../type/injectionKeys'

const { currentItem, languageId } = defineProps<{
  currentItem: AttributeAdminLocalizedViewDo
  attributeAdminLocalizedViewDos: AttributeAdminLocalizedViewDo[]
  languageId: string
}>()

const { loading, id: attributeId, resetFormData } = inject(attributeKey)!

const { t: $t } = useLocale()

const currentData = ref<AttributeAdminLocalizedViewDo>(currentItem)

// 本地状态
const inputAttributeNameVisible = ref(false)
const currentAttributeName = ref('')

// 更新名称
const handleClickUpdateAttributeName = (attributeName: string) => {
  currentAttributeName.value = attributeName
  inputAttributeNameVisible.value = true
}

const handleCancelUpdateAttributeName = () => {
  inputAttributeNameVisible.value = false
}

const editAttributeName = async (attributeDetailId: string) => {
  if (!currentAttributeName.value) {
    ElMessage.warning($t('attribute.error.attributeName'))
    return
  }
  loading.init = true
  const { data } = await updateAttributeNameApi({
    attributeDetailId,
    attributeName: currentAttributeName.value,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentAttributeName.value = ''
  await resetFormData(data)
  inputAttributeNameVisible.value = false
  ElMessage.success($t('success.edit'))
}
// 创建属性名称
const createAttributeName = async () => {
  if (!currentAttributeName.value) {
    ElMessage.warning($t('attribute.error.attributeName'))
    return
  }
  loading.init = true
  const { data } = await createAttributeNameApi({
    attributeId,
    languageId,
    attributeName: currentAttributeName.value,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentAttributeName.value = ''
  await resetFormData(data)
  ElMessage.success($t('success.create'))
}
</script>

<template>
  <div v-if="currentData">
    <ElCard v-if="currentData.attributeDetailListResultDo" shadow="never" class="mb-5">
      <div class="w-full mt-0 pt-0">
        <!-- 属性名称 -->
        <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
          <div class="col-span-1 font-semibold text-gray-700">
            {{ $t('attribute.attributeName') }}:
          </div>
          <div class="col-span-11 w-full flex items-center">
            <span v-if="!inputAttributeNameVisible" class="mr-2">
              {{ currentData.attributeDetailListResultDo.attributeName }}
            </span>
            <span v-else>
              <ElInput
                v-model="currentAttributeName"
                style="width: 300px"
                class="mr-2"
                @blur="editAttributeName(currentData.attributeDetailListResultDo!.id)"
              />
              <ElButton text @click="handleCancelUpdateAttributeName">
                <Icon icon="ep:close" :size="5" class="mr-1" />
              </ElButton>
            </span>
            <ElButton
              v-if="!inputAttributeNameVisible"
              type="primary"
              text
              @click="handleClickUpdateAttributeName(currentData.attributeDetailListResultDo.attributeName)"
            >
              <Icon icon="ep:edit" :size="5" class="mr-1" />
            </ElButton>
          </div>
        </div>
      </div>
    </ElCard>
    <ElCard v-else>
      <div class="flex-col justify-center items-center mb-5">
        <div class="w-full mb-5">
          <ElAlert :title="$t('attribute.warning.noDetailData')" type="warning" show-icon />
        </div>
      </div>
      <div class="pa-3 flex justify-center items-center mb-5">
        <ElInput v-model="currentAttributeName" :placeholder="$t('attribute.placeholder.attributeName')" />
        <ElButton type="primary" class="ml-5" @click="createAttributeName">
          <Icon icon="ant-design:save-outlined" :size="5" class="mr-1" />
          {{ $t('common.save') }}
        </ElButton>
      </div>
    </ElCard>
  </div>
</template>
