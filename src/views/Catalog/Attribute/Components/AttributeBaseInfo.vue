<script setup lang="ts">
import { attributeKey } from '../type/injectionKeys'
import CustomsTable from './CustomsTable.vue'

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
const inputAttributeShortNameVisible = ref(false)
const currentAttributeShortName = ref('')
const inputAttributeDescriptionVisible = ref(false)
const currentAttributeDescription = ref('<p></p>')
const inputAttributeShortDescriptionVisible = ref(false)
const currentAttributeShortDescription = ref('')
const editorRefs = ref()
const uploadSingleImageRefs = ref([])

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
  const { data } = await updateAttributeDetailAttributeNameApi({
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

// 更新短名称
const handleClickUpdateAttributeShortName = (attributeShortName: string) => {
  currentAttributeShortName.value = attributeShortName
  inputAttributeShortNameVisible.value = true
}

const handleCancelUpdateAttributeShortName = () => {
  inputAttributeShortNameVisible.value = false
}

const editAttributeShortName = async (attributeDetailId: string) => {
  // 短名称可以为空
  loading.init = true
  const { data } = await updateAttributeDetailAttributeShortNameApi({
    attributeDetailId,
    attributeShortName: currentAttributeShortName.value,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentAttributeShortName.value = ''
  await resetFormData(data)
  inputAttributeShortNameVisible.value = false
  ElMessage.success($t('success.edit'))
}

// 更改文件
const handleClickUpdateAttributeFile = async ({ fileData }: { fileData: FileData }) => {
  if (currentData.value.attributeDetailListResultDo?.id) {
    let fileId
    if (fileData && fileData.id) {
      fileId = fileData.id
    }
    loading.init = true
    const { data } = await updateAttributeDetailFileApi({
      attributeDetailId: currentData.value.attributeDetailListResultDo.id,
      attributeFileId: fileId,
    }).catch(error => {
      loading.init = false
      throw error
    })
    await resetFormData(data)
    loading.init = false
    ElMessage.success($t('success.edit'))
  }
}

// 更新描述
const handleClickUpdateAttributeDescription = async (attributeDescription: string) => {
  currentAttributeDescription.value = attributeDescription || '<p></p>'
  inputAttributeDescriptionVisible.value = true
  await nextTick(async () => {
    const editorInstance = editorRefs.value
    await editorInstance?.setEditorContent(attributeDescription)
  })
}

const handleCancelUpdateAttributeDescription = () => {
  inputAttributeDescriptionVisible.value = false
}

const editAttributeDescription = async (attributeDetailId: string) => {
  if (!currentAttributeDescription.value) {
    ElMessage.warning($t('attribute.error.attributeDescription'))
    return
  }
  const editorInstance = editorRefs.value
  currentAttributeDescription.value = editorInstance?.getEditorContent()
  loading.init = true
  const { data } = await updateAttributeDetailDescriptionApi({
    attributeDetailId,
    attributeDescription: currentAttributeDescription.value,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentAttributeDescription.value = ''
  await resetFormData(data)
  inputAttributeDescriptionVisible.value = false
  ElMessage.success($t('success.edit'))
}

// 更新短描述
const handleClickUpdateAttributeShortDescription = (attributeShortDescription: string) => {
  currentAttributeShortDescription.value = attributeShortDescription || ''
  inputAttributeShortDescriptionVisible.value = true
}

const handleCancelUpdateAttributeShortDescription = () => {
  inputAttributeShortDescriptionVisible.value = false
}

const editAttributeShortDescription = async (attributeDetailId: string) => {
  // 短描述可以为空
  loading.init = true
  const { data } = await updateAttributeDetailAttributeShortDescriptionApi({
    attributeDetailId,
    attributeShortDescription: currentAttributeShortDescription.value,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentAttributeShortDescription.value = ''
  await resetFormData(data)
  inputAttributeShortDescriptionVisible.value = false
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
        <!-- 属性短名称 -->
        <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
          <div class="col-span-1 font-semibold text-gray-700">
            {{ $t('attribute.attributeShortName') }}:
          </div>
          <div class="col-span-11 w-full flex items-center">
            <span v-if="!inputAttributeShortNameVisible" class="mr-2">
              {{ currentData.attributeDetailListResultDo.attributeShortName }}
            </span>
            <span v-else>
              <ElInput
                v-model="currentAttributeShortName"
                style="width: 300px"
                class="mr-2"
                @blur="editAttributeShortName(currentData.attributeDetailListResultDo!.id)"
              />
              <ElButton text @click="handleCancelUpdateAttributeShortName">
                <Icon icon="ep:close" :size="5" class="mr-1" />
              </ElButton>
            </span>
            <ElButton
              v-if="!inputAttributeShortNameVisible"
              type="primary"
              text
              @click="handleClickUpdateAttributeShortName(currentData.attributeDetailListResultDo.attributeShortName)"
            >
              <Icon icon="ep:edit" :size="5" class="mr-1" />
            </ElButton>
          </div>
        </div>
        <!-- 图片 -->
        <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
          <div class="col-span-1 font-semibold text-gray-700">
            {{ $t('attribute.image') }}:
          </div>
          <div class="col-span-11">
            <div class="w-full flex">
              <UploadSingleImage
                ref="uploadSingleImageRefs"
                :image-data="currentData.attributeDetailListResultDo.attributeFileVo"
                class="mr-2"
                style="width: 200px"
                @get-data="handleClickUpdateAttributeFile"
              />
            </div>
          </div>
        </div>
        <!-- 描述 -->
        <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
          <div class="col-span-1 font-semibold text-gray-700">
            {{ $t('attribute.description') }}:
          </div>
          <div class="col-span-11">
            <div v-if="!inputAttributeDescriptionVisible" class="mr-2">
              <div class="grid grid-cols-12 gap-4">
                <div class="col-span-1 flex items-center">
                  <ElButton
                    v-if="!inputAttributeNameVisible"
                    type="primary"
                    text
                    @click="
                      handleClickUpdateAttributeDescription(currentData.attributeDetailListResultDo.attributeDescription)
                    "
                  >
                    <Icon icon="ep:edit" :size="5" class="mr-1" />
                    {{ $t('common.edit') }}
                  </ElButton>
                </div>
                <div class="col-span-12 border border-gray-200 p-4">
                  <div v-html="currentData.attributeDetailListResultDo.attributeDescription" />
                </div>
              </div>
            </div>
            <div v-else>
              <Editor ref="editorRefs" v-model="currentAttributeDescription" class="mb-5" />
              <div class="flex justify-center items-center">
                <ElButton @click="handleCancelUpdateAttributeDescription">
                  {{ $t('common.cancel') }}
                </ElButton>
                <ElButton type="primary" @click="editAttributeDescription(currentData.attributeDetailListResultDo!.id)">
                  {{ $t('common.save') }}
                </ElButton>
              </div>
            </div>
          </div>
        </div>
        <!-- 简短描述 -->
        <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
          <div class="col-span-1 font-semibold text-gray-700">
            {{ $t('attribute.shortDescription') }}:
          </div>
          <div class="col-span-11">
            <div v-if="!inputAttributeShortDescriptionVisible" class="mr-2">
              <div class="grid grid-cols-12 gap-4">
                <div class="col-span-1 flex items-center">
                  <ElButton
                    v-if="!inputAttributeShortNameVisible"
                    type="primary"
                    text
                    @click="
                      handleClickUpdateAttributeShortDescription(
                        currentData.attributeDetailListResultDo.attributeShortDescription,
                      )
                    "
                  >
                    <Icon icon="ep:edit" :size="5" class="mr-1" />
                    {{ $t('common.edit') }}
                  </ElButton>
                </div>
                <div class="col-span-12 p-4">
                  {{ currentData.attributeDetailListResultDo.attributeShortDescription }}
                </div>
              </div>
            </div>
            <div v-else>
              <ElInput
                v-model="currentAttributeShortDescription"
                type="textarea"
                :rows="4"
                class="mb-5"
                style="width: 100%"
              />
              <div class="flex justify-center items-center">
                <ElButton @click="handleCancelUpdateAttributeShortDescription">
                  {{ $t('common.cancel') }}
                </ElButton>
                <ElButton
                  type="primary"
                  @click="editAttributeShortDescription(currentData.attributeDetailListResultDo!.id)"
                >
                  {{ $t('common.save') }}
                </ElButton>
              </div>
            </div>
          </div>
        </div>
        <!-- 自定义信息 -->
        <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
          <div class="col-span-1 font-semibold text-gray-700">
            {{ $t('attribute.customs') }}:
          </div>
          <div class="col-span-11">
            <CustomsTable
              :custom-list="currentData.attributeDetailListResultDo.customList"
              :attribute-detail-id="currentData.attributeDetailListResultDo.id"
            />
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
