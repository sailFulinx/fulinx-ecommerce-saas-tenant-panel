<script setup lang="ts">
import { useLocale } from '@/hooks/useLocale'
import { usePreferenceStore } from '@/stores/preference'
import { useTagsViewStore } from '@/stores/tagsView'
import { convertCustomTypeValue } from '@/utils/general'

const { t: $t } = useLocale()

const router = useRouter()

const sourceUrl = useFileRootUrl()

const rules = reactive({
  languageId: [{ required: true, message: '语言必须选择', trigger: 'change' }],
  status: [{ required: true, message: '状态必填', trigger: 'change' }],
  pageName: [{ required: true, message: '内容名称必须填写', trigger: 'blur' }],
})

const loading = reactive({
  init: false,
  button: false,
})

const pageTitle = $t('page.add')

const pageFormRef = ref()

const customs = ref<any[]>([])

const customRef = ref()

const customVisible = ref(false)

const editorRef = ref()

const currentCustomData = ref({
  id: 0,
  customTitle: '',
  customContent: '',
})

const createPageForm = (): CreatePageParams => {
  return {
    languageId: '',
    status: true,
    pageName: '',
    metaTitle: '',
    metaDescription: '',
    pageDescription: '',
    customs: '',
  }
}

const pageForm = reactive<CreatePageParams>(createPageForm())

const initCustomData = () => {
  currentCustomData.value = {
    id: 0,
    customTitle: '',
    customContent: '',
  }
  customRef.value.setFormData(currentCustomData.value)
}

const handleAddCustom = () => {
  customVisible.value = true
}

const handleRemoveCustom = (index: number) => {
  customs.value.splice(index, 1)
}

const handleEditCustom = (index: number) => {
  customVisible.value = true
  currentCustomData.value = customs.value[index]
  customRef.value.setFormData(currentCustomData.value)
}

const cancelEditCustomData = () => {
  customVisible.value = false
  initCustomData()
}

const getCustomData = (val: CustomDataType) => {
  if (val.id === 0) {
    val.id = customs.value.length + 1
    customs.value.push(val)
  } else {
    customs.value.forEach((item, index) => {
      if (item.id === val.id) {
        customs.value[index] = val
      }
    })
  }
  initCustomData()
  customVisible.value = false
}

const closeViewTag = () => {}

const tagsViewStore = useTagsViewStore()

const deleteTagView = (refresh: boolean) => {
  if (refresh) {
    tagsViewStore.delCachedView()
  }
  tagsViewStore.delVisitedView(router.currentRoute.value)
  router.push({ name: 'PageList' })
}

const save = async () => {
  pageForm.languageId = usePreferenceStore().preference.language.id
  pageForm.pageDescription = editorRef.value.getEditorContent()
  pageForm.customs = JSON.stringify(customs.value)

  const valid = await pageFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
  })
  if (!valid) {
    return false
  }

  await CreatePageApi(pageForm).catch(err => {
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
      <ElForm ref="pageFormRef" :model="pageForm" :rules="rules" label-width="120px">
        <!-- 基础信息 -->
        <ElCard shadow="never" class="mb-5">
          <template #header>
            <div class="card-header">
              <span>{{ $t('page.base') }}</span>
            </div>
          </template>

          <div class="grid grid-cols-4">
            <!-- 去掉 flex-wrap -->
            <!-- 第一部分：ElSelect -->
            <!-- 第四部分：ElSwitch 状态 -->
            <div class="col-span-1 flex items-center">
              <!-- 控制宽度一致 -->
              <ElFormItem label="状态" prop="status" class="w-full">
                <ElSwitch v-model="pageForm.status" />
              </ElFormItem>
            </div>
          </div>
        </ElCard>

        <ElCard shadow="never" class="mb-5 theme-card">
          <template #header>
            <div class="flex justify-between">
              <div>{{ $t('page.content') }}</div>
            </div>
          </template>
          <div>
            <div class="grid grid-cols-3 gap-5">
              <div class="col-span-2">
                <ElCard shadow="never" class="w-full mb-5">
                  <template #header>
                    <div class="card-header">
                      <span>{{ $t('page.base') }}</span>
                    </div>
                  </template>
                  <ElFormItem label="标题" prop="pageName">
                    <ElInput
                      v-model="pageForm.pageName"
                      minlength="1"
                      maxlength="120"
                      placeholder="标题，少于120个字符"
                    />
                  </ElFormItem>
                  <ElFormItem label="内容" prop="pageDescription">
                    <Editor ref="editorRef" v-model="pageForm.pageDescription" :height="300" />
                  </ElFormItem>
                  <ElFormItem label="自定义信息" class="flex flex-wrap">
                    <div class="w-full mb-5">
                      <EBtn @click="handleAddCustom">
                        添加自定义信息
                      </EBtn>
                    </div>
                    <div v-if="customs.length > 0" class="w-full mb-5">
                      <ElTable :data="customs">
                        <ElTableColumn label="标题" prop="customTitle" />
                        <ElTableColumn label="类型">
                          <template #default="scope">
                            <span>{{ convertCustomTypeValue(scope.row.customType) }}</span>
                          </template>
                        </ElTableColumn>
                        <ElTableColumn label="内容" prop="customContent">
                          <template #default="scope">
                            <div v-if="scope.row.customType === 'text'">
                              {{ scope.row.customContent }}
                            </div>
                            <div v-if="scope.row.customType === 'editor'">
                              <div v-html="scope.row.customContent" />
                            </div>
                            <div v-if="scope.row.customType === 'image'">
                              <div v-for="item in scope.row.customContent" :key="item">
                                <div class="flex justify-start mb-5 space-x-0 sm:space-x-2 overflow-x-auto">
                                  <ElImage class="w-32 sm:w-40" :src="`${sourceUrl}${item.fileUrl}`" fit="contain" />
                                </div>
                              </div>
                            </div>
                            <div v-if="scope.row.customType === 'video'">
                              <div class="flex justify-start mb-5 space-x-0 sm:space-x-2 overflow-x-auto">
                                <video
                                  class="w-32 sm:w-40"
                                  :src="`${scope.row.customContent.fileUrl}`"
                                  fit="contain"
                                />
                              </div>
                            </div>
                          </template>
                        </ElTableColumn>
                        <ElTableColumn label="操作">
                          <template #default="scope">
                            <EBtn @click="handleEditCustom(scope.$index)">
                              修改
                            </EBtn>
                            <EBtn @click="handleRemoveCustom(scope.$index)">
                              删除
                            </EBtn>
                          </template>
                        </ElTableColumn>
                      </ElTable>
                    </div>
                    <div v-show="customVisible" class="w-full mb-5">
                      <Customs
                        ref="customRef"
                        @get-custom-data="getCustomData"
                        @cancel-edit-custom-data="cancelEditCustomData"
                      />
                    </div>
                  </ElFormItem>
                </ElCard>
              </div>
              <div class="col-span-1">
                <ElCard shadow="never" class="w-full">
                  <template #header>
                    <div class="card-header">
                      <span>{{ $t('page.seo') }}</span>
                    </div>
                  </template>
                  <ElFormItem label="元标题" prop="metaTitle">
                    <ElInput
                      v-model="pageForm.metaTitle"
                      class="input-line"
                      minlength="1"
                      maxlength="60"
                      placeholder="元标题，少于60个字符"
                    />
                  </ElFormItem>
                  <ElFormItem label="元描述" prop="metaDescription">
                    <ElInput
                      v-model="pageForm.metaDescription"
                      class="input-line"
                      type="textarea"
                      rows="4"
                      maxlength="160"
                      placeholder="描述，少于160个字符"
                    />
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
