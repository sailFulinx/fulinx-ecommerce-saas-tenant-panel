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

const form = reactive<CreateAttributeParams>({
  languageId: preferenceLanguage.value?.id || '',
  attributeType: 1,
  attributeName: '',
})

const resetForm = () => {
  form.attributeName = ''
  form.languageId = preferenceLanguage.value?.id || ''
}

const openDialog = async (val?: AttributeListData) => {
  form.attributeName = val?.attributeName || ''
  resetForm()
  dialogVisible.value = true
}

const createAttribute = async (attributeName: string) => {
  loading.init = true
  const payload = $clone(form)
  payload.attributeName = attributeName
  // delete payload.parentIds
  await createAttributeApi(payload).catch(error => {
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
    const attributeNames = form.attributeName.split('\n').filter(name => name.trim() !== '')

    // 批量创建分类
    const promises = attributeNames.map(name => createAttribute(name.trim()))
    await Promise.all(promises)

    ElMessage.success($t('success.create'))
    loading.init = false
    emit('getList')
    dialogVisible.value = false
  })
}

const rules: FormRules = {
  attributeName: [{ required: true, message: '请输入至少一个属性名称', trigger: 'blur' }],
}

defineExpose({
  openDialog,
})
</script>

<template>
  <ElDrawer v-model="dialogVisible" :title="$t('attribute.add')" size="50%">
    <ElForm ref="formRef" :model="form" :rules="rules" label-width="120px">
      <ElFormItem :label="$t('attribute.attributeName')" prop="attributeName">
        <ElInput
          v-model="form.attributeName"
          class="input-line"
          type="textarea"
          :rows="6"
          clearable
          :placeholder="`${$t('attribute.placeholder.attributeName')}（每行一个属性名称）`"
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
