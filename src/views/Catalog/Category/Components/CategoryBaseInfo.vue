<script setup lang="ts">
// import { inject, nextTick, ref } from 'vue'
import { categoryKey } from '../type/injectionKeys'
import CustomsTable from './CustomsTable.vue'

const { currentItem } = defineProps<{
  currentItem: CategoryShowListItem
  categoryAdminLocalizedViewDos: CategoryShowListItem[]
}>()
const { form, loading, selectLanguage, id: categoryId, resetFormData, handleClickUpdateParentId } = inject(categoryKey)!

const { t: $t } = useLocale()

const currentData = ref<CategoryShowListItem>(currentItem)

// 本地状态
const inputCategoryNameVisible = ref(false)
const currentCategoryName = ref('')
const inputCategoryShortNameVisible = ref(false)
const currentCategoryShortName = ref('')
const inputCategoryDescriptionVisible = ref(false)
const currentCategoryDescription = ref('<p></p>')
const inputCategoryShortDescriptionVisible = ref(false)
const currentCategoryShortDescription = ref('')
const editorRefs = ref()
const uploadSingleImageRefs = ref([])

// 更新名称
const handleClickUpdateCategoryName = (categoryName: string) => {
  currentCategoryName.value = categoryName
  inputCategoryNameVisible.value = true
}

const handleCancelUpdateCategoryName = () => {
  inputCategoryNameVisible.value = false
}

const editCategoryName = async (categoryDetailId: string) => {
  if (!currentCategoryName.value) {
    ElMessage.warning($t('category.error.categoryName'))
    return
  }
  loading.init = true
  const { data } = await categoryNameEditApi({
    categoryDetailId,
    categoryName: currentCategoryName.value,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentCategoryName.value = ''
  await resetFormData(data)
  inputCategoryNameVisible.value = false
  ElMessage.success($t('success.edit'))
}

// 更新短名称
const handleClickUpdateCategoryShortName = (categoryShortName: string) => {
  currentCategoryShortName.value = categoryShortName
  inputCategoryShortNameVisible.value = true
}

const handleCancelUpdateCategoryShortName = () => {
  inputCategoryShortNameVisible.value = false
}

const editCategoryShortName = async (categoryDetailId: string) => {
  // 短名称可以为空
  loading.init = true
  const { data } = await categoryShortNameEditApi({
    categoryDetailId,
    categoryShortName: currentCategoryShortName.value,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentCategoryShortName.value = ''
  await resetFormData(data)
  inputCategoryShortNameVisible.value = false
  ElMessage.success($t('success.edit'))
}

// 更改文件
const handleClickUpdateCategoryFile = async ({ fileData }: { fileData: FileData }) => {
  if (currentData.value.categoryDetailListResultDo?.id) {
    let fileId
    if (fileData && fileData.id) {
      fileId = fileData.id
    }
    loading.init = true
    const { data } = await categoryFileEditApi({
      categoryDetailId: currentData.value.categoryDetailListResultDo.id,
      categoryFileId: fileId,
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
const handleClickUpdateCategoryDescription = async (categoryDescription: string) => {
  currentCategoryDescription.value = categoryDescription || '<p></p>'
  inputCategoryDescriptionVisible.value = true
  await nextTick(async () => {
    const editorInstance = editorRefs.value
    await editorInstance?.setEditorContent(categoryDescription)
  })
}

const handleCancelUpdateCategoryDescription = () => {
  inputCategoryDescriptionVisible.value = false
}

const editCategoryDescription = async (categoryDetailId: string) => {
  if (!currentCategoryDescription.value) {
    ElMessage.warning($t('category.error.categoryDescription'))
    return
  }
  const editorInstance = editorRefs.value
  currentCategoryDescription.value = editorInstance?.getEditorContent()
  loading.init = true
  const { data } = await categoryDescriptionEditApi({
    categoryDetailId,
    categoryDescription: currentCategoryDescription.value,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentCategoryDescription.value = ''
  await resetFormData(data)
  inputCategoryDescriptionVisible.value = false
  ElMessage.success($t('success.edit'))
}

// 更新短描述
const handleClickUpdateCategoryShortDescription = (categoryShortDescription: string) => {
  currentCategoryShortDescription.value = categoryShortDescription || ''
  inputCategoryShortDescriptionVisible.value = true
}

const handleCancelUpdateCategoryShortDescription = () => {
  inputCategoryShortDescriptionVisible.value = false
}

const editCategoryShortDescription = async (categoryDetailId: string) => {
  // 短描述可以为空
  loading.init = true
  const { data } = await categoryShortDescriptionEditApi({
    categoryDetailId,
    categoryShortDescription: currentCategoryShortDescription.value,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentCategoryShortDescription.value = ''
  await resetFormData(data)
  inputCategoryShortDescriptionVisible.value = false
  ElMessage.success($t('success.edit'))
}

// 创建分类名称
const createCategoryName = async () => {
  if (!currentCategoryName.value) {
    ElMessage.warning($t('category.error.categoryName'))
    return
  }
  console.log(selectLanguage.value)
  return
  loading.init = true
  const { data } = await categoryNameCreateApi({
    categoryId,
    languageId: selectLanguage.value.id,
    categoryName: currentCategoryName.value,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentCategoryName.value = ''
  await resetFormData(data)
  ElMessage.success($t('success.create'))
}
</script>

<template>
  <div v-if="currentData">
    <ElCard v-if="currentData.categoryDetailListResultDo" shadow="never" class="mb-5">
      <div class="w-full mt-0 pt-0">
        <!-- 分类名称 -->
        <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
          <div class="col-span-1 font-semibold text-gray-700">
            {{ $t('category.categoryName') }}:
          </div>
          <div class="col-span-11 w-full flex items-center">
            <span v-if="!inputCategoryNameVisible" class="mr-2">
              {{ currentData.categoryDetailListResultDo.categoryName }}
            </span>
            <span v-else>
              <ElInput
                v-model="currentCategoryName"
                style="width: 300px"
                class="mr-2"
                @blur="editCategoryName(currentData.categoryDetailListResultDo!.id)"
              />
              <ElButton text @click="handleCancelUpdateCategoryName">
                <Icon icon="ep:close" :size="5" class="mr-1" />
              </ElButton>
            </span>
            <ElButton
              v-if="!inputCategoryNameVisible"
              type="primary"
              text
              @click="handleClickUpdateCategoryName(currentData.categoryDetailListResultDo.categoryName)"
            >
              <Icon icon="ep:edit" :size="5" class="mr-1" />
            </ElButton>
          </div>
        </div>
        <!-- 分类短名称 -->
        <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
          <div class="col-span-1 font-semibold text-gray-700">
            {{ $t('category.categoryShortName') }}:
          </div>
          <div class="col-span-11 w-full flex items-center">
            <span v-if="!inputCategoryShortNameVisible" class="mr-2">
              {{ currentData.categoryDetailListResultDo.categoryShortName }}
            </span>
            <span v-else>
              <ElInput
                v-model="currentCategoryShortName"
                style="width: 300px"
                class="mr-2"
                @blur="editCategoryShortName(currentData.categoryDetailListResultDo!.id)"
              />
              <ElButton text @click="handleCancelUpdateCategoryShortName">
                <Icon icon="ep:close" :size="5" class="mr-1" />
              </ElButton>
            </span>
            <ElButton
              v-if="!inputCategoryShortNameVisible"
              type="primary"
              text
              @click="handleClickUpdateCategoryShortName(currentData.categoryDetailListResultDo.categoryShortName)"
            >
              <Icon icon="ep:edit" :size="5" class="mr-1" />
            </ElButton>
          </div>
        </div>
        <!-- 父类 -->
        <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
          <div class="col-span-1 font-semibold text-gray-700">
            {{ $t('category.parentId') }}:
          </div>
          <div class="col-span-11">
            <span v-if="form.parentId === '0'" class="mr-2">{{ $t('category.topCategory') }}</span>
            <span v-else class="mr-2">
              {{ currentData.categoryDetailListResultDo.parentCategoryNames.join(' / ') }}
            </span>
            <span>
              <ElButton type="primary" text @click="handleClickUpdateParentId(form)">
                <Icon icon="ep:edit" :size="5" class="mr-1" />
              </ElButton>
            </span>
          </div>
        </div>
        <!-- 图片 -->
        <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
          <div class="col-span-1 font-semibold text-gray-700">
            {{ $t('category.image') }}:
          </div>
          <div class="col-span-11">
            <div class="w-full flex">
              <UploadSingleImage
                ref="uploadSingleImageRefs"
                :image-data="currentData.categoryDetailListResultDo.fileVo"
                class="mr-2"
                style="width: 200px"
                @get-data="handleClickUpdateCategoryFile"
              />
            </div>
          </div>
        </div>
        <!-- 描述 -->
        <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
          <div class="col-span-1 font-semibold text-gray-700">
            {{ $t('category.description') }}:
          </div>
          <div class="col-span-11">
            <div v-if="!inputCategoryDescriptionVisible" class="mr-2">
              <div class="grid grid-cols-12 gap-4">
                <div class="col-span-1 flex items-center">
                  <ElButton
                    v-if="!inputCategoryNameVisible"
                    type="primary"
                    text
                    @click="
                      handleClickUpdateCategoryDescription(currentData.categoryDetailListResultDo.categoryDescription)
                    "
                  >
                    <Icon icon="ep:edit" :size="5" class="mr-1" />
                    {{ $t('common.edit') }}
                  </ElButton>
                </div>
                <div class="col-span-12 border border-gray-200 p-4">
                  <div v-html="currentData.categoryDetailListResultDo.categoryDescription" />
                </div>
              </div>
            </div>
            <div v-else>
              <Editor ref="editorRefs" v-model="currentCategoryDescription" class="mb-5" />
              <div class="flex justify-center items-center">
                <ElButton @click="handleCancelUpdateCategoryDescription">
                  {{ $t('common.cancel') }}
                </ElButton>
                <ElButton type="primary" @click="editCategoryDescription(currentData.categoryDetailListResultDo!.id)">
                  {{ $t('common.save') }}
                </ElButton>
              </div>
            </div>
          </div>
        </div>
        <!-- 简短描述 -->
        <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
          <div class="col-span-1 font-semibold text-gray-700">
            {{ $t('category.shortDescription') }}:
          </div>
          <div class="col-span-11">
            <div v-if="!inputCategoryShortDescriptionVisible" class="mr-2">
              <div class="grid grid-cols-12 gap-4">
                <div class="col-span-1 flex items-center">
                  <ElButton
                    v-if="!inputCategoryShortNameVisible"
                    type="primary"
                    text
                    @click="
                      handleClickUpdateCategoryShortDescription(
                        currentData.categoryDetailListResultDo.categoryShortDescription,
                      )
                    "
                  >
                    <Icon icon="ep:edit" :size="5" class="mr-1" />
                    {{ $t('common.edit') }}
                  </ElButton>
                </div>
                <div class="col-span-12 p-4">
                  {{ currentData.categoryDetailListResultDo.categoryShortDescription }}
                </div>
              </div>
            </div>
            <div v-else>
              <ElInput
                v-model="currentCategoryShortDescription"
                type="textarea"
                :rows="4"
                class="mb-5"
                style="width: 100%"
              />
              <div class="flex justify-center items-center">
                <ElButton @click="handleCancelUpdateCategoryShortDescription">
                  {{ $t('common.cancel') }}
                </ElButton>
                <ElButton
                  type="primary"
                  @click="editCategoryShortDescription(currentData.categoryDetailListResultDo!.id)"
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
            {{ $t('category.customs') }}:
          </div>
          <div class="col-span-11">
            <CustomsTable
              :custom-list="currentData.categoryDetailListResultDo.customList"
              :category-detail-id="currentData.categoryDetailListResultDo.id"
            />
          </div>
        </div>
      </div>
    </ElCard>
    <ElCard v-else>
      <div class="flex-col justify-center items-center mb-5">
        <div class="w-full mb-5">
          <ElAlert :title="$t('category.warning.noDetailData')" type="warning" show-icon />
        </div>
      </div>
      <div class="pa-3 flex justify-center items-center mb-5">
        <ElInput v-model="currentCategoryName" :placeholder="$t('category.placeholder.categoryName')" />
        <ElButton type="primary" class="ml-5" @click="createCategoryName">
          <Icon icon="ant-design:save-outlined" :size="5" class="mr-1" />
          {{ $t('common.save') }}
        </ElButton>
      </div>
    </ElCard>
  </div>
</template>
