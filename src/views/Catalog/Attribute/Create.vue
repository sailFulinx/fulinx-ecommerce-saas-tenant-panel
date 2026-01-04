<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { useLocale } from '@/hooks/useLocale'
import { usePreferenceStore } from '@/stores/preference'
import { useTagsViewStore } from '@/stores/tagsView'

const { t: $t } = useLocale()

const router = useRouter()

const uploadRef = ref()

const rules = reactive({
  languageId: [{ required: true, message: '语言必须选择', trigger: 'change' }],
  status: [{ required: true, message: '状态必填', trigger: 'change' }],
  attributeName: [{ required: true, message: '属性名称必须填写', trigger: 'blur' }],
  metaTitle: [{ required: true, message: 'Meta标题必须填写', trigger: 'blur' }],
  metaDescription: [{ required: true, message: 'Meta描述必须填写', trigger: 'blur' }],
})

const loading = reactive({
  init: false,
  button: false,
})

const pageTitle = $t('attribute.add')

const attributeFormRef = ref()

const editorRef = ref()

const createAttributeForm = (): CreateAttributeParams => {
  return {
    languageId: '',
    attributeName: '',
    attributeDescription: '',
    attributeFileId: '',
  }
}

const attributeForm = reactive<CreateAttributeParams>(createAttributeForm())

const closeViewTag = () => {}

const tagsViewStore = useTagsViewStore()

const deleteTagView = (refresh: boolean) => {
  if (refresh) {
    tagsViewStore.delCachedView()
  }
  tagsViewStore.delVisitedView(router.currentRoute.value)
  router.push({ name: 'AttributeList' })
}

const save = async () => {
  attributeForm.languageId = usePreferenceStore().preference.language.id
  attributeForm.attributeDescription = editorRef.value.getEditorContent()
  const file = uploadRef.value.getFileData()
  attributeForm.attributeFileId = file.fileData.id
  const valid = await attributeFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
  })
  if (!valid) {
    return false
  }

  await createAttributeApi(attributeForm).catch(err => {
    throw err
  })

  deleteTagView(true)
  ElMessage({
    message: '保存成功',
    type: 'success',
    duration: 2000,
  })
}
</script>

<template>
  <div v-loading="loading.init" class="view-page">
    <div class="view-header">
      <div class="flex justify-between items-center">
        <div>
          <h4>{{ pageTitle }}</h4>
        </div>
        <div>
          <EBtn size="small" :loading="loading.button" @click="closeViewTag()">
            <Icon icon="ant-design:close-outlined" class="mr-1" />
            {{ $t('common.cancel') }}
          </EBtn>
          <EBtn size="small" type="primary" :loading="loading.button" @click="save">
            <Icon icon="ant-design:save-outlined" class="mr-1" />
            {{ $t('common.save') }}
          </EBtn>
        </div>
      </div>
    </div>
    <div class="view-main theme-card">
      <ElForm ref="attributeFormRef" :model="attributeForm" :rules="rules" label-width="120px">
        <!-- 基础信息 -->
        <ElCard shadow="never" class="mb-5">
          <template #header>
            <div class="card-header">
              <span>{{ $t('attribute.base') }}</span>
            </div>
          </template>
        </ElCard>

        <ElCard shadow="never" class="mb-5 theme-card">
          <template #header>
            <div class="flex justify-between">
              <div>{{ $t('attribute.content') }}</div>
            </div>
          </template>
          <div>
            <div class="grid grid-cols-3 gap-5">
              <div class="col-span-2">
                <ElCard shadow="never" class="w-full mb-5">
                  <template #header>
                    <div class="card-header">
                      <span>{{ $t('attribute.base') }}</span>
                    </div>
                  </template>
                  <ElFormItem :label="$t('attribute.attributeName')" prop="attributeName">
                    <ElInput
                      v-model="attributeForm.attributeName"
                      minlength="1"
                      maxlength="120"
                      :placeholder="$t('attribute.placeholder.attributeName')"
                    />
                  </ElFormItem>
                  <ElFormItem :label="$t('attribute.attributeDescription')" prop="attributeDescription">
                    <Editor ref="editorRef" v-model="attributeForm.attributeDescription" :height="300" />
                  </ElFormItem>
                  <ElFormItem :label="$t('attribute.attributeLogo')">
                    <UploadSingleImage ref="uploadRef" />
                  </ElFormItem>
                </ElCard>
              </div>
            </div>
          </div>
        </ElCard>
      </ElForm>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
