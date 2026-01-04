<script setup name="ProductDetail" lang="ts">
import type { FormRules } from 'element-plus'

const emit = defineEmits(['getList'])
const { t: $t } = useLocale()

const preferenceStore = usePreferenceStore()
// 修复：使用 getPreferences() 方法确保 preference 被正确初始化
const preference = preferenceStore.getPreferences()
const preferenceLanguage = computed(() => preference?.language)

const dialogVisible = ref(false)

const loading = reactive({
  init: false,
  attributes: false,
})

const attributeValueContentString = ref('')

const form = reactive<CreateAttributeValueBatchParams>({
  languageId: '',
  attributeId: '',
  attributeValueContents: [],
})

const resetForm = () => {
  form.attributeId = ''
  form.languageId = ''
  form.languageId = preferenceLanguage.value?.id || ''
}

const openDialog = async (attributeId: string, languageId: string) => {
  form.languageId = languageId
  form.attributeId = attributeId
  resetForm()
  dialogVisible.value = true
}

const createAttributeValue = async () => {
  loading.init = true
  const payload = $clone(form)
  // delete payload.parentIds
  await createAttributeValueApi(payload).catch(error => {
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

    // 解析多行输入
    const attributeValueContents = attributeValueContentString.value.split('\n').filter(item => item.trim() !== '')

    // 批量创建
    form.attributeValueContents = attributeValueContents.map(item => {
      return item.trim()
    })
    await createAttributeValue()

    ElMessage.success($t('success.create'))
    loading.init = false
    emit('getList')
    dialogVisible.value = false
  })
}

const rules: FormRules = {
  attributeValueContents: [{ required: true, message: '请输入至少一个属性名称', trigger: 'blur' }],
}

defineExpose({
  openDialog,
})
</script>

<template>
  <ElDrawer v-model="dialogVisible" :title="$t('attribute.add')" size="50%">
    <ElForm ref="formRef" :model="form" :rules="rules" label-width="120px">
      <ElFormItem :label="$t('attribute.attributeValueContents')" prop="attributeValueContents">
        <ElInput
          v-model="attributeValueContentString"
          class="input-line"
          type="textarea"
          :rows="6"
          clearable
          :placeholder="`${$t('attribute.placeholder.attributeValueContents')}（每行一个属性名称）`"
        />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <div class="dialog-footer">
        <ElButton @click="dialogVisible = false">取消</ElButton>
        <ElButton type="primary" :loading="loading.init" @click="onSave">提交</ElButton>
      </div>
    </template>
  </ElDrawer>
</template>
