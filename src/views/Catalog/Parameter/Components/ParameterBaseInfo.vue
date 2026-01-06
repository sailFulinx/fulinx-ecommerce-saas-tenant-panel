<script setup lang="ts">
import { parameterKey } from '../type/injectionKeys'

const { currentItem, languageId } = defineProps<{
  currentItem: ParameterAdminLocalizedViewDo
  parameterAdminLocalizedViewDos: ParameterAdminLocalizedViewDo[]
  languageId: string
}>()

const { loading, id: parameterId, resetFormData } = inject(parameterKey)!

const { t: $t } = useLocale()

const currentData = ref<ParameterAdminLocalizedViewDo>(currentItem)

// 本地状态
const inputParameterNameVisible = ref(false)
const currentParameterName = ref('')

// 更新名称
const handleClickUpdateParameterName = (parameterName: string) => {
  currentParameterName.value = parameterName
  inputParameterNameVisible.value = true
}

const handleCancelUpdateParameterName = () => {
  inputParameterNameVisible.value = false
}

const editParameterName = async (parameterDetailId: string) => {
  if (!currentParameterName.value) {
    ElMessage.warning($t('parameter.error.parameterName'))
    return
  }
  loading.init = true
  const { data } = await updateParameterNameApi({
    parameterDetailId,
    parameterName: currentParameterName.value,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentParameterName.value = ''
  await resetFormData(data)
  inputParameterNameVisible.value = false
  ElMessage.success($t('success.edit'))
}
// 创建参数名称
const createParameterName = async () => {
  if (!currentParameterName.value) {
    ElMessage.warning($t('parameter.error.parameterName'))
    return
  }
  loading.init = true
  const { data } = await createParameterNameApi({
    parameterId,
    languageId,
    parameterName: currentParameterName.value,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentParameterName.value = ''
  await resetFormData(data)
  ElMessage.success($t('success.create'))
}
</script>

<template>
  <div v-if="currentData">
    <ElCard v-if="currentData.parameterDetailListResultDo" shadow="never" class="mb-5">
      <div class="w-full mt-0 pt-0">
        <!-- 参数名称 -->
        <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
          <div class="col-span-1 font-semibold text-gray-700">
            {{ $t('parameter.parameterName') }}:
          </div>
          <div class="col-span-11 w-full flex items-center">
            <span v-if="!inputParameterNameVisible" class="mr-2">
              {{ currentData.parameterDetailListResultDo.parameterName }}
            </span>
            <span v-else>
              <ElInput
                v-model="currentParameterName"
                style="width: 300px"
                class="mr-2"
                @blur="editParameterName(currentData.parameterDetailListResultDo!.id)"
              />
              <ElButton text @click="handleCancelUpdateParameterName">
                <Icon icon="ep:close" :size="5" class="mr-1" />
              </ElButton>
            </span>
            <ElButton
              v-if="!inputParameterNameVisible"
              type="primary"
              text
              @click="handleClickUpdateParameterName(currentData.parameterDetailListResultDo.parameterName)"
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
          <ElAlert :title="$t('parameter.warning.noDetailData')" type="warning" show-icon />
        </div>
      </div>
      <div class="pa-3 flex justify-center items-center mb-5">
        <ElInput v-model="currentParameterName" :placeholder="$t('parameter.placeholder.parameterName')" />
        <ElButton type="primary" class="ml-5" @click="createParameterName">
          <Icon icon="ant-design:save-outlined" :size="5" class="mr-1" />
          {{ $t('common.save') }}
        </ElButton>
      </div>
    </ElCard>
  </div>
</template>
