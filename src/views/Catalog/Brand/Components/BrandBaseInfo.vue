<script setup lang="ts">
import { brandKey } from '../type/injectionKeys'
import CustomsTable from './CustomsTable.vue'

const { currentItem, languageId } = defineProps<{
  currentItem: BrandAdminLocalizedViewDo
  brandAdminLocalizedViewDos: BrandAdminLocalizedViewDo[]
  languageId: string
}>()

const { loading, id: brandId, resetFormData } = inject(brandKey)!

const { t: $t } = useLocale()

const currentData = ref<BrandAdminLocalizedViewDo>(currentItem)

// 本地状态
const inputBrandNameVisible = ref(false)
const currentBrandName = ref('')
const inputBrandShortNameVisible = ref(false)
const currentBrandShortName = ref('')
const inputBrandDescriptionVisible = ref(false)
const currentBrandDescription = ref('<p></p>')
const inputBrandShortDescriptionVisible = ref(false)
const currentBrandShortDescription = ref('')
const editorRefs = ref()
const uploadSingleImageRefs = ref([])

// 更新名称
const handleClickUpdateBrandName = (brandName: string) => {
  currentBrandName.value = brandName
  inputBrandNameVisible.value = true
}

const handleCancelUpdateBrandName = () => {
  inputBrandNameVisible.value = false
}

const editBrandName = async (brandDetailId: string) => {
  if (!currentBrandName.value) {
    ElMessage.warning($t('brand.error.brandName'))
    return
  }
  loading.init = true
  const { data } = await updateBrandDetailBrandNameApi({
    brandDetailId,
    brandName: currentBrandName.value,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentBrandName.value = ''
  await resetFormData(data)
  inputBrandNameVisible.value = false
  ElMessage.success($t('success.edit'))
}

// 更新短名称
const handleClickUpdateBrandShortName = (brandShortName: string) => {
  currentBrandShortName.value = brandShortName
  inputBrandShortNameVisible.value = true
}

const handleCancelUpdateBrandShortName = () => {
  inputBrandShortNameVisible.value = false
}

const editBrandShortName = async (brandDetailId: string) => {
  // 短名称可以为空
  loading.init = true
  const { data } = await updateBrandDetailBrandShortNameApi({
    brandDetailId,
    brandShortName: currentBrandShortName.value,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentBrandShortName.value = ''
  await resetFormData(data)
  inputBrandShortNameVisible.value = false
  ElMessage.success($t('success.edit'))
}

// 更改文件
const handleClickUpdateBrandFile = async ({ fileData }: { fileData: FileData }) => {
  if (currentData.value.brandDetailListResultDo?.id) {
    let fileId
    if (fileData && fileData.id) {
      fileId = fileData.id
    }
    loading.init = true
    const { data } = await updateBrandDetailFileApi({
      brandDetailId: currentData.value.brandDetailListResultDo.id,
      brandFileId: fileId,
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
const handleClickUpdateBrandDescription = async (brandDescription: string) => {
  currentBrandDescription.value = brandDescription || '<p></p>'
  inputBrandDescriptionVisible.value = true
  await nextTick(async () => {
    const editorInstance = editorRefs.value
    await editorInstance?.setEditorContent(brandDescription)
  })
}

const handleCancelUpdateBrandDescription = () => {
  inputBrandDescriptionVisible.value = false
}

const editBrandDescription = async (brandDetailId: string) => {
  if (!currentBrandDescription.value) {
    ElMessage.warning($t('brand.error.brandDescription'))
    return
  }
  const editorInstance = editorRefs.value
  currentBrandDescription.value = editorInstance?.getEditorContent()
  loading.init = true
  const { data } = await updateBrandDetailDescriptionApi({
    brandDetailId,
    brandDescription: currentBrandDescription.value,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentBrandDescription.value = ''
  await resetFormData(data)
  inputBrandDescriptionVisible.value = false
  ElMessage.success($t('success.edit'))
}

// 更新短描述
const handleClickUpdateBrandShortDescription = (brandShortDescription: string) => {
  currentBrandShortDescription.value = brandShortDescription || ''
  inputBrandShortDescriptionVisible.value = true
}

const handleCancelUpdateBrandShortDescription = () => {
  inputBrandShortDescriptionVisible.value = false
}

const editBrandShortDescription = async (brandDetailId: string) => {
  // 短描述可以为空
  loading.init = true
  const { data } = await updateBrandDetailBrandShortDescriptionApi({
    brandDetailId,
    brandShortDescription: currentBrandShortDescription.value,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentBrandShortDescription.value = ''
  await resetFormData(data)
  inputBrandShortDescriptionVisible.value = false
  ElMessage.success($t('success.edit'))
}

// 创建品牌名称
const createBrandName = async () => {
  if (!currentBrandName.value) {
    ElMessage.warning($t('brand.error.brandName'))
    return
  }
  loading.init = true
  const { data } = await createBrandNameApi({
    brandId,
    languageId,
    brandName: currentBrandName.value,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentBrandName.value = ''
  await resetFormData(data)
  ElMessage.success($t('success.create'))
}
</script>

<template>
  <div v-if="currentData">
    <ElCard v-if="currentData.brandDetailListResultDo" shadow="never" class="mb-5">
      <div class="w-full mt-0 pt-0">
        <!-- 品牌名称 -->
        <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
          <div class="col-span-1 font-semibold text-gray-700">
            {{ $t('brand.brandName') }}:
          </div>
          <div class="col-span-11 w-full flex items-center">
            <span v-if="!inputBrandNameVisible" class="mr-2">
              {{ currentData.brandDetailListResultDo.brandName }}
            </span>
            <span v-else>
              <ElInput
                v-model="currentBrandName"
                style="width: 300px"
                class="mr-2"
                @blur="editBrandName(currentData.brandDetailListResultDo!.id)"
              />
              <ElButton text @click="handleCancelUpdateBrandName">
                <Icon icon="ep:close" :size="5" class="mr-1" />
              </ElButton>
            </span>
            <ElButton
              v-if="!inputBrandNameVisible"
              type="primary"
              text
              @click="handleClickUpdateBrandName(currentData.brandDetailListResultDo.brandName)"
            >
              <Icon icon="ep:edit" :size="5" class="mr-1" />
            </ElButton>
          </div>
        </div>
        <!-- 品牌短名称 -->
        <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
          <div class="col-span-1 font-semibold text-gray-700">
            {{ $t('brand.brandShortName') }}:
          </div>
          <div class="col-span-11 w-full flex items-center">
            <span v-if="!inputBrandShortNameVisible" class="mr-2">
              {{ currentData.brandDetailListResultDo.brandShortName }}
            </span>
            <span v-else>
              <ElInput
                v-model="currentBrandShortName"
                style="width: 300px"
                class="mr-2"
                @blur="editBrandShortName(currentData.brandDetailListResultDo!.id)"
              />
              <ElButton text @click="handleCancelUpdateBrandShortName">
                <Icon icon="ep:close" :size="5" class="mr-1" />
              </ElButton>
            </span>
            <ElButton
              v-if="!inputBrandShortNameVisible"
              type="primary"
              text
              @click="handleClickUpdateBrandShortName(currentData.brandDetailListResultDo.brandShortName)"
            >
              <Icon icon="ep:edit" :size="5" class="mr-1" />
            </ElButton>
          </div>
        </div>
        <!-- 图片 -->
        <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
          <div class="col-span-1 font-semibold text-gray-700">
            {{ $t('brand.image') }}:
          </div>
          <div class="col-span-11">
            <div class="w-full flex">
              <UploadSingleImage
                ref="uploadSingleImageRefs"
                :image-data="currentData.brandDetailListResultDo.brandFileVo"
                class="mr-2"
                style="width: 200px"
                @get-data="handleClickUpdateBrandFile"
              />
            </div>
          </div>
        </div>
        <!-- 描述 -->
        <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
          <div class="col-span-1 font-semibold text-gray-700">
            {{ $t('brand.description') }}:
          </div>
          <div class="col-span-11">
            <div v-if="!inputBrandDescriptionVisible" class="mr-2">
              <div class="grid grid-cols-12 gap-4">
                <div class="col-span-1 flex items-center">
                  <ElButton
                    v-if="!inputBrandNameVisible"
                    type="primary"
                    text
                    @click="
                      handleClickUpdateBrandDescription(currentData.brandDetailListResultDo.brandDescription)
                    "
                  >
                    <Icon icon="ep:edit" :size="5" class="mr-1" />
                    {{ $t('common.edit') }}
                  </ElButton>
                </div>
                <div class="col-span-12 border border-gray-200 p-4">
                  <div v-html="currentData.brandDetailListResultDo.brandDescription" />
                </div>
              </div>
            </div>
            <div v-else>
              <Editor ref="editorRefs" v-model="currentBrandDescription" class="mb-5" />
              <div class="flex justify-center items-center">
                <ElButton @click="handleCancelUpdateBrandDescription">
                  {{ $t('common.cancel') }}
                </ElButton>
                <ElButton type="primary" @click="editBrandDescription(currentData.brandDetailListResultDo!.id)">
                  {{ $t('common.save') }}
                </ElButton>
              </div>
            </div>
          </div>
        </div>
        <!-- 简短描述 -->
        <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
          <div class="col-span-1 font-semibold text-gray-700">
            {{ $t('brand.shortDescription') }}:
          </div>
          <div class="col-span-11">
            <div v-if="!inputBrandShortDescriptionVisible" class="mr-2">
              <div class="grid grid-cols-12 gap-4">
                <div class="col-span-1 flex items-center">
                  <ElButton
                    v-if="!inputBrandShortNameVisible"
                    type="primary"
                    text
                    @click="
                      handleClickUpdateBrandShortDescription(
                        currentData.brandDetailListResultDo.brandShortDescription,
                      )
                    "
                  >
                    <Icon icon="ep:edit" :size="5" class="mr-1" />
                    {{ $t('common.edit') }}
                  </ElButton>
                </div>
                <div class="col-span-12 p-4">
                  {{ currentData.brandDetailListResultDo.brandShortDescription }}
                </div>
              </div>
            </div>
            <div v-else>
              <ElInput
                v-model="currentBrandShortDescription"
                type="textarea"
                :rows="4"
                class="mb-5"
                style="width: 100%"
              />
              <div class="flex justify-center items-center">
                <ElButton @click="handleCancelUpdateBrandShortDescription">
                  {{ $t('common.cancel') }}
                </ElButton>
                <ElButton
                  type="primary"
                  @click="editBrandShortDescription(currentData.brandDetailListResultDo!.id)"
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
            {{ $t('brand.customs') }}:
          </div>
          <div class="col-span-11">
            <CustomsTable
              :custom-list="currentData.brandDetailListResultDo.customList"
              :brand-detail-id="currentData.brandDetailListResultDo.id"
            />
          </div>
        </div>
      </div>
    </ElCard>
    <ElCard v-else>
      <div class="flex-col justify-center items-center mb-5">
        <div class="w-full mb-5">
          <ElAlert :title="$t('brand.warning.noDetailData')" type="warning" show-icon />
        </div>
      </div>
      <div class="pa-3 flex justify-center items-center mb-5">
        <ElInput v-model="currentBrandName" :placeholder="$t('brand.placeholder.brandName')" />
        <ElButton type="primary" class="ml-5" @click="createBrandName">
          <Icon icon="ant-design:save-outlined" :size="5" class="mr-1" />
          {{ $t('common.save') }}
        </ElButton>
      </div>
    </ElCard>
  </div>
</template>
