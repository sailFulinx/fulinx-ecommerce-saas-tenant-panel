<script setup name="UserDetail" lang="ts">
import { ElInput, ElMessage } from 'element-plus'
import { debounce } from 'lodash'
import { createCompApi, editCompApi } from '@/api/comp'
import { useLocale } from '@/hooks/useLocale'

const emit = defineEmits(['getList', 'handleChangeVisible'])

const { t: $t } = useLocale()

// 页面标题
const pageTitle = ref('')

const simplifiedComponentLayoutRef = ref()

// 组件表单
const form = reactive<CompData>({
  id: '',
  componentName: '',
  componentContent: '',
  isUsed: true,
})

const loading = reactive({
  init: true,
  save: false,
})

// 当前页面ID
const id = ref('')

// 操作类型
const actionType = ref('none')

// rows
const rows = ref<ComponentRowData[]>([])

// 全屏状态
const isFullScreen = ref(false)

// 切换全屏
const fullScreen = () => {
  isFullScreen.value = !isFullScreen.value
}

/**
 * 保存数据
 */
const createComponent = async () => {
  loading.save = true
  await createCompApi({ componentName: form.componentName, componentContent: form.componentContent }).catch(error => {
    loading.save = false
    throw error
  })
  loading.save = false
  ElMessage.success($t('success.create'))
}

const editComponent = async () => {
  loading.save = true
  await editCompApi(id.value, { componentName: form.componentName, componentContent: form.componentContent }).catch(
    error => {
      loading.save = false
      throw error
    },
  )
  loading.save = false
  ElMessage.success($t('success.edit'))
}

const handleSubmit = async () => {
  if (form.componentName === '') {
    ElMessage.warning($t('comps.warning.componentName'))
    return
  }
  loading.save = true
  if (simplifiedComponentLayoutRef.value) {
    rows.value = simplifiedComponentLayoutRef.value.getData()
    if (rows.value.length === 0) {
      ElMessage.warning($t('comps.warning.emptyRow'))
      return
    }
    form.componentContent = JSON.stringify(rows.value)
    if (actionType.value === 'add' || id.value === '' || id.value === null) {
      await createComponent()
    } else {
      await editComponent()
    }
    loading.save = false
    emit('getList')
    emit('handleChangeVisible')
  }
}

// 保存
const save = debounce(async () => {
  await handleSubmit()
}, 100)

function handleCancel() {
  emit('handleChangeVisible')
}

function init(actionTypeData: string, compData?: CompData) {
  loading.init = true
  actionType.value = actionTypeData
  if (actionTypeData === 'add') {
    pageTitle.value = $t('common.create') + $t('comps.name')
    rows.value = []
    Object.assign(form, {
      componentName: '',
      componentContent: '',
      id: 0,
    })
  } else {
    id.value = compData?.id ?? ''
    if (compData?.componentContent) {
      rows.value = JSON.parse(compData.componentContent)
      simplifiedComponentLayoutRef.value.setData(rows.value)
    }
    Object.assign(form, compData)
    pageTitle.value = $t('common.edit') + $t('comps.name')
  }
  loading.init = false
}

defineExpose({
  init,
})
</script>

<template>
  <div :class="{ 'full-screen-mode': isFullScreen }" class="w-full">
    <div :class="{ 'full-screen-header': isFullScreen }" class="sticky top-0 z-10 bg-white flex items-center justify-between pa-5 border-b border-gray-200">
      <!-- 组件名称 -->
      <div class="flex items-center">
        <h4 class="w-30 mr-3">
          {{ pageTitle }}
        </h4>
        <div class="flex items-center w-full">
          <div class="flex items-center">
            <span class="w-30 mr-2">{{ $t('comps.componentName') }}：</span>
            <ElInput v-model="form.componentName" :placeholder="$t('comps.placeholder.componentName')" />
          </div>
        </div>
      </div>
      <!-- 组件操作按钮 -->
      <div>
        <EBtn @click="fullScreen">
          <Icon name="icon-park-outline:full-screen-one" class="mr-2" />
          {{ isFullScreen ? '退出全屏' : '全屏' }}
        </EBtn>

        <EBtn class="filter-item" size="small" type="default" :loading="loading.save" @click="handleCancel">
          <Icon icon="ant-design:close-outlined" class="mr-1" />
          {{ $t('common.cancel') }}
        </EBtn>
        <EBtn class="filter-item" size="small" type="primary" :loading="loading.save" @click="save">
          <Icon icon="ant-design:save-outlined" class="mr-1" />
          {{ $t('common.save') }}
        </EBtn>
      </div>
    </div>
    <div :class="{ 'full-screen-content': isFullScreen }">
      <SimplifiedComponentLayout ref="simplifiedComponentLayoutRef" />
    </div>
  </div>
</template>

<style scoped>
.full-screen-mode {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  background-color: white;
  padding: 0;
  margin: 0;
  overflow: auto;
  box-sizing: border-box;
}

.full-screen-header {
  position: fixed !important;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.full-screen-content {
  margin-top: 70px; /* 为固定头部留出空间 */
}
</style>
