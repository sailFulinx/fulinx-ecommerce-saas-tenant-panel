<script setup lang="ts">
import type { FormRules } from 'element-plus'
import { parameterTypes } from '@/data/parameter'

const emit = defineEmits(['getList'])
const { t: $t } = useLocale()

const preferenceStore = usePreferenceStore()
// 修复：使用 getPreferences() 方法确保 preference 被正确初始化
const preference = preferenceStore.getPreferences()
const preferenceLanguage = computed(() => preference?.language)

const dialogVisible = ref(false)

const loading = reactive({
  init: false,
  parameters: false,
})

const form = reactive<CreateParameterParams>({
  languageId: preferenceLanguage.value?.id || '',
  parameterType: 1,
  parameterName: '',
})

const resetForm = () => {
  form.parameterName = ''
  form.languageId = preferenceLanguage.value?.id || ''
}

const openDialog = async (val?: ParameterListData) => {
  form.parameterName = val?.parameterName || ''
  resetForm()
  dialogVisible.value = true
}

const createParameter = async (parameterName: string) => {
  loading.init = true
  const payload = $clone(form)
  payload.parameterName = parameterName
  // delete payload.parentIds
  await createParameterApi(payload).catch(error => {
    loading.init = false
    throw error
  })
}

const formRef = useTemplateRef('formRef')

const onSave = () => {
  $catch(async () => {
    const valid = await formRef.value!.validate()
    if (!valid) {
      return false
    }

    // 解析多行输入的分类名称
    const parameterNames = form.parameterName.split('\n').filter(name => name.trim() !== '')

    // 批量创建分类
    const promises = parameterNames.map(name => createParameter(name.trim()))
    await Promise.all(promises)

    ElMessage.success($t('success.create'))
    loading.init = false
    emit('getList')
    dialogVisible.value = false
  })
}

const rules: FormRules = {
  parameterName: [{ required: true, message: '请输入至少一个参数名称', trigger: 'blur' }],
  parameterType: [{ required: true, message: '请选择参数类型', trigger: 'change' }],
}

defineExpose({
  openDialog,
})
</script>

<template>
  <ElDrawer v-model="dialogVisible" :append-to-body="true" :title="$t('parameter.add')" size="50%">
    <ElForm ref="formRef" :model="form" :rules="rules" label-width="120px">
      <ElFormItem :label="$t('parameter.parameterType')" prop="parameterType">
        <ElSelect v-model="form.parameterType" placeholder="请选择参数类型" filterable clearable style="width: 300px">
          <ElOption v-for="type in parameterTypes" :key="type.id" :label="type.label" :value="type.id" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem :label="$t('parameter.parameterName')" prop="parameterName">
        <ElInput
          v-model="form.parameterName"
          class="input-line"
          type="textarea"
          :rows="6"
          clearable
          :placeholder="`${$t('parameter.placeholder.parameterName')}（每行一个参数名称）`"
        />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <div class="dialog-footer">
        <ElButton @click="dialogVisible = false">
          取消
        </ElButton>
        <ElButton type="primary" :loading="loading.init" @click="onSave">
          提交
        </ElButton>
      </div>
    </template>
  </ElDrawer>
</template>

<style lang="scss" scoped>

</style>
