<script setup lang="ts">
import CustomsTable from './CustomsTable.vue'

const { currentItem, supplierId, languageId } = defineProps<{
  currentItem: SupplierAdminLocalizedViewDo
  supplierAdminLocalizedViewDos: SupplierAdminLocalizedViewDo[]
  supplierId: string
  languageId: string
}>()

const emit = defineEmits<{
  refreshData: SupplierShowData
}>()

const { t: $t } = useLocale()

const currentData = ref<SupplierAdminLocalizedViewDo>(currentItem)

const loading = reactive({
  init: false,
})

// 本地状态
const inputSupplierNameVisible = ref(false)
const currentSupplierName = ref('')
const inputSupplierShortNameVisible = ref(false)
const currentSupplierShortName = ref('')
const inputSupplierDescriptionVisible = ref(false)
const currentSupplierDescription = ref('<p></p>')
const inputSupplierShortDescriptionVisible = ref(false)
const currentSupplierShortDescription = ref('')
const editorRefs = ref()
const uploadSingleImageRefs = ref([])

// 更新名称
const handleClickUpdateSupplierName = (supplierName: string) => {
  currentSupplierName.value = supplierName
  inputSupplierNameVisible.value = true
}

const handleCancelUpdateSupplierName = () => {
  inputSupplierNameVisible.value = false
}

const editSupplierName = async (supplierDetailId: string) => {
  if (!currentSupplierName.value) {
    ElMessage.warning($t('supplier.error.supplierName'))
    return
  }
  loading.init = true
  const { data } = await updateSupplierDetailSupplierNameApi({
    supplierDetailId,
    supplierName: currentSupplierName.value,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentSupplierName.value = ''
  emit('refreshData', data)
  inputSupplierNameVisible.value = false
  ElMessage.success($t('success.edit'))
}

// 更新短名称
const handleClickUpdateSupplierShortName = (supplierShortName: string) => {
  currentSupplierShortName.value = supplierShortName
  inputSupplierShortNameVisible.value = true
}

const handleCancelUpdateSupplierShortName = () => {
  inputSupplierShortNameVisible.value = false
}

const editSupplierShortName = async (supplierDetailId: string) => {
  // 短名称可以为空
  loading.init = true
  await updateSupplierDetailSupplierShortNameApi({
    supplierDetailId,
    supplierShortName: currentSupplierShortName.value,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentSupplierShortName.value = ''
  emit('refreshData')
  inputSupplierShortNameVisible.value = false
  ElMessage.success($t('success.edit'))
}

// 更改文件
const handleClickUpdateSupplierFile = async ({ fileData }: { fileData: FileData }) => {
  if (currentData.value.supplierDetailListResultDo?.id) {
    let fileId
    if (fileData && fileData.id) {
      fileId = fileData.id
    }
    loading.init = true
    await updateSupplierDetailFileApi({
      supplierDetailId: currentData.value.supplierDetailListResultDo.id,
      supplierFileId: fileId,
    }).catch(error => {
      loading.init = false
      throw error
    })
    emit('refreshData')
    loading.init = false
    ElMessage.success($t('success.edit'))
  }
}

// 更新描述
const handleClickUpdateSupplierDescription = async (supplierDescription: string) => {
  currentSupplierDescription.value = supplierDescription || '<p></p>'
  inputSupplierDescriptionVisible.value = true
  await nextTick(async () => {
    const editorInstance = editorRefs.value
    await editorInstance?.setEditorContent(supplierDescription)
  })
}

const handleCancelUpdateSupplierDescription = () => {
  inputSupplierDescriptionVisible.value = false
}

const editSupplierDescription = async (supplierDetailId: string) => {
  if (!currentSupplierDescription.value) {
    ElMessage.warning($t('supplier.error.supplierDescription'))
    return
  }
  const editorInstance = editorRefs.value
  currentSupplierDescription.value = editorInstance?.getEditorContent()
  loading.init = true
  await updateSupplierDetailDescriptionApi({
    supplierDetailId,
    supplierDescription: currentSupplierDescription.value,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentSupplierDescription.value = ''
  emit('refreshData')
  inputSupplierDescriptionVisible.value = false
  ElMessage.success($t('success.edit'))
}

// 更新短描述
const handleClickUpdateSupplierShortDescription = (supplierShortDescription: string) => {
  currentSupplierShortDescription.value = supplierShortDescription || ''
  inputSupplierShortDescriptionVisible.value = true
}

const handleCancelUpdateSupplierShortDescription = () => {
  inputSupplierShortDescriptionVisible.value = false
}

const editSupplierShortDescription = async (supplierDetailId: string) => {
  // 短描述可以为空
  loading.init = true
  await updateSupplierDetailSupplierShortDescriptionApi({
    supplierDetailId,
    supplierShortDescription: currentSupplierShortDescription.value,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentSupplierShortDescription.value = ''
  emit('refreshData')
  inputSupplierShortDescriptionVisible.value = false
  ElMessage.success($t('success.edit'))
}

// 创建分类名称
const createSupplierName = async () => {
  if (!currentSupplierName.value) {
    ElMessage.warning($t('supplier.error.supplierName'))
    return
  }
  loading.init = true
  await createSupplierNameApi({
    supplierId,
    languageId,
    supplierName: currentSupplierName.value,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentSupplierName.value = ''
  emit('refreshData')
  ElMessage.success($t('success.create'))
}
</script>

<template>
  <div v-if="currentData">
    <ElCard v-if="currentData.supplierDetailListResultDo" shadow="never" class="mb-5">
      <div class="w-full mt-0 pt-0">
        <!-- 分类名称 -->
        <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
          <div class="col-span-1 font-semibold text-gray-700">
            {{ $t('supplier.supplierName') }}:
          </div>
          <div class="col-span-11 w-full flex items-center">
            <span v-if="!inputSupplierNameVisible" class="mr-2">
              {{ currentData.supplierDetailListResultDo.supplierName }}
            </span>
            <span v-else>
              <ElInput
                v-model="currentSupplierName"
                style="width: 300px"
                class="mr-2"
                @blur="editSupplierName(currentData.supplierDetailListResultDo!.id)"
              />
              <ElButton text @click="handleCancelUpdateSupplierName">
                <Icon icon="ep:close" :size="5" class="mr-1" />
              </ElButton>
            </span>
            <ElButton
              v-if="!inputSupplierNameVisible"
              type="primary"
              text
              @click="handleClickUpdateSupplierName(currentData.supplierDetailListResultDo.supplierName)"
            >
              <Icon icon="ep:edit" :size="5" class="mr-1" />
            </ElButton>
          </div>
        </div>
        <!-- 分类短名称 -->
        <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
          <div class="col-span-1 font-semibold text-gray-700">
            {{ $t('supplier.supplierShortName') }}:
          </div>
          <div class="col-span-11 w-full flex items-center">
            <span v-if="!inputSupplierShortNameVisible" class="mr-2">
              {{ currentData.supplierDetailListResultDo.supplierShortName }}
            </span>
            <span v-else>
              <ElInput
                v-model="currentSupplierShortName"
                style="width: 300px"
                class="mr-2"
                @blur="editSupplierShortName(currentData.supplierDetailListResultDo!.id)"
              />
              <ElButton text @click="handleCancelUpdateSupplierShortName">
                <Icon icon="ep:close" :size="5" class="mr-1" />
              </ElButton>
            </span>
            <ElButton
              v-if="!inputSupplierShortNameVisible"
              type="primary"
              text
              @click="handleClickUpdateSupplierShortName(currentData.supplierDetailListResultDo.supplierShortName)"
            >
              <Icon icon="ep:edit" :size="5" class="mr-1" />
            </ElButton>
          </div>
        </div>
        <!-- 图片 -->
        <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
          <div class="col-span-1 font-semibold text-gray-700">
            {{ $t('supplier.image') }}:
          </div>
          <div class="col-span-11">
            <div class="w-full flex">
              <UploadSingleImage
                ref="uploadSingleImageRefs"
                :image-data="currentData.supplierDetailListResultDo.supplierFileVo"
                class="mr-2"
                style="width: 200px"
                @get-data="handleClickUpdateSupplierFile"
              />
            </div>
          </div>
        </div>
        <!-- 描述 -->
        <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
          <div class="col-span-1 font-semibold text-gray-700">
            {{ $t('supplier.description') }}:
          </div>
          <div class="col-span-11">
            <div v-if="!inputSupplierDescriptionVisible" class="mr-2">
              <div class="grid grid-cols-12 gap-4">
                <div class="col-span-1 flex items-center">
                  <ElButton
                    v-if="!inputSupplierNameVisible"
                    type="primary"
                    text
                    @click="
                      handleClickUpdateSupplierDescription(currentData.supplierDetailListResultDo.supplierDescription)
                    "
                  >
                    <Icon icon="ep:edit" :size="5" class="mr-1" />
                    {{ $t('common.edit') }}
                  </ElButton>
                </div>
                <div class="col-span-12 border border-gray-200 p-4">
                  <div v-html="currentData.supplierDetailListResultDo.supplierDescription" />
                </div>
              </div>
            </div>
            <div v-else>
              <Editor ref="editorRefs" v-model="currentSupplierDescription" class="mb-5" />
              <div class="flex justify-center items-center">
                <ElButton @click="handleCancelUpdateSupplierDescription">
                  {{ $t('common.cancel') }}
                </ElButton>
                <ElButton type="primary" @click="editSupplierDescription(currentData.supplierDetailListResultDo!.id)">
                  {{ $t('common.save') }}
                </ElButton>
              </div>
            </div>
          </div>
        </div>
        <!-- 简短描述 -->
        <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
          <div class="col-span-1 font-semibold text-gray-700">
            {{ $t('supplier.shortDescription') }}:
          </div>
          <div class="col-span-11">
            <div v-if="!inputSupplierShortDescriptionVisible" class="mr-2">
              <div class="grid grid-cols-12 gap-4">
                <div class="col-span-1 flex items-center">
                  <ElButton
                    v-if="!inputSupplierShortNameVisible"
                    type="primary"
                    text
                    @click="
                      handleClickUpdateSupplierShortDescription(
                        currentData.supplierDetailListResultDo.supplierShortDescription,
                      )
                    "
                  >
                    <Icon icon="ep:edit" :size="5" class="mr-1" />
                    {{ $t('common.edit') }}
                  </ElButton>
                </div>
                <div class="col-span-12 p-4">
                  {{ currentData.supplierDetailListResultDo.supplierShortDescription }}
                </div>
              </div>
            </div>
            <div v-else>
              <ElInput
                v-model="currentSupplierShortDescription"
                type="textarea"
                :rows="4"
                class="mb-5"
                style="width: 100%"
              />
              <div class="flex justify-center items-center">
                <ElButton @click="handleCancelUpdateSupplierShortDescription">
                  {{ $t('common.cancel') }}
                </ElButton>
                <ElButton
                  type="primary"
                  @click="editSupplierShortDescription(currentData.supplierDetailListResultDo!.id)"
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
            {{ $t('supplier.customs') }}:
          </div>
          <div class="col-span-11">
            <CustomsTable
              :custom-list="currentData.supplierDetailListResultDo.customList"
              :supplier-detail-id="currentData.supplierDetailListResultDo.id"
            />
          </div>
        </div>
      </div>
    </ElCard>
    <ElCard v-else>
      <div class="flex-col justify-center items-center mb-5">
        <div class="w-full mb-5">
          <ElAlert :title="$t('supplier.warning.noDetailData')" type="warning" show-icon />
        </div>
      </div>
      <div class="pa-3 flex justify-center items-center mb-5">
        <ElInput v-model="currentSupplierName" :placeholder="$t('supplier.placeholder.supplierName')" />
        <ElButton type="primary" class="ml-5" @click="createSupplierName">
          <Icon icon="ant-design:save-outlined" :size="5" class="mr-1" />
          {{ $t('common.save') }}
        </ElButton>
      </div>
    </ElCard>
  </div>
</template>
