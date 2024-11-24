<script setup lang="ts">
import { editThemeConfig, showTheme } from '@/api/theme'
import { themeSettings } from '@/data/theme'
import { ElMessage, ElMessageBox, ElPopconfirm } from 'element-plus'

const id = Number(useRoute().params.id)

const loading = reactive({
  init: false,
  theme: false,
  ref: false,
})

const themeConfigList = ref<ThemeSettingDataType[]>([])

const getThemeData = async () => {
  loading.init = true
  const { data } = await showTheme(id).catch(err => {
    loading.init = false
    throw err
  })
  // 如果data.themeConfig不是array，直接返回
  if (!Array.isArray(JSON.parse(data.themeConfig))) {
    themeConfigList.value = themeSettings
    return
  }
  themeConfigList.value = JSON.parse(data.themeConfig)
  // 如果themeContentData中没有themeContents中的数组元素，则把themeContents中的数组元素添加到themeContentData中
  if (!themeConfigList.value || themeConfigList.value.length === 0) {
    themeConfigList.value = themeSettings
  } else {
    // 查看themeContentData中是否包含themeContents中的数组元素
    themeSettings.forEach((itemSetting: ThemeSettingDataType) => {
      const index = themeConfigList.value.findIndex(
        (item: any) => item.themeSettingCode === itemSetting.themeSettingCode,
      )
      if (index === -1) {
        themeConfigList.value.push(itemSetting)
      }
    })
  }
  loading.init = false
}
getThemeData()

// 当前主题内容
const currentThemeSettingData = ref<ThemeSettingDataType>({
  id: 0,
  themeSettingCode: '',
  themeSettingName: '',
  content: {},
})

// 动态导入所有组件
const currentComponentRef = ref()
const componentModules = import.meta.glob('@/components/Theme/Setting/*.vue')
const getThemeComponent = (themeSettingCode: string) => {
  const componentPath = `/src/components/Theme/Setting/${themeSettingCode}.vue`
  if (componentModules[componentPath]) {
    return defineAsyncComponent(componentModules[componentPath] as () => Promise<any>)
  } else {
    console.error(`Component not found: ${themeSettingCode}`)
    return null
  }
}

const handleChangeThemeSetting = async (themeSetting: ThemeSettingDataType) => {
  currentThemeSettingData.value = themeSetting
  // 添加一个等待循环，确保 currentComponentRef 有值
  loading.ref = true
  await useWaitRef(currentComponentRef)
  await nextTick()
  loading.ref = false
}

const saveCurrentThemeSettingData = async () => {
  if (currentComponentRef.value && typeof currentComponentRef.value.getFormData === 'function') {
    const formData = await currentComponentRef.value.getFormData()
    if (!formData) {
      return
    }
    currentThemeSettingData.value.content = formData
  } else {
    console.error('Component does not have getFormData method')
  }
  currentComponentRef.value = null
}

const save = async () => {
  loading.init = true
  await saveCurrentThemeSettingData()
  if (themeConfigList.value && themeConfigList.value.length > 0) {
    // 查看themeConfigList中是否包含currentThemeSettingData中的themeSettingCode
    const index = themeConfigList.value.findIndex(
      (item: any) => item.themeSettingCode === currentThemeSettingData.value.themeSettingCode,
    )
    if (index === -1) {
      themeConfigList.value.push({
        ...currentThemeSettingData.value,
      })
    } else {
      themeConfigList.value[index].content = currentThemeSettingData.value.content
    }
  } else {
    themeConfigList.value = []
    themeConfigList.value.push({
      ...currentThemeSettingData.value,
    })
  }

  const payload = {
    themeConfig: JSON.stringify(themeConfigList.value),
  }
  await editThemeConfig(id, payload).catch(err => {
    loading.init = false
    throw err
  })

  loading.init = false
  ElMessage.success('保存成功')
}
</script>

<template>
  <div v-loading="loading.init" class="view-page">
    <div class="view-header">
      <ElRow type="flex" justify="space-between" align="middle">
        <div>
          <h4>主题设置</h4>
        </div>
        <div>
          <EBtn size="small" type="danger" @click="save">
            <div class="flex items-center justify-between">
              <span><Icon icon="ant-design:save-outlined" class="mr-1" /></span>
              <span>保存</span>
            </div>
          </EBtn>
        </div>
      </ElRow>
    </div>
    <div class="flex px-2 py-2 h-screen">
      <div class="w-1/4 px-2 py-2">
        <ElCard shadow="never" class="h-screen">
          <div v-for="(item, index) in themeConfigList" :key="index">
            <div
              :class="`${currentThemeSettingData.themeSettingCode === item.themeSettingCode ? 'bg-red-600 text-white' : 'bg-white'} w-full mb-3 text-left cursor-pointer border-1 border-gray-300 px-6 py-3`"
              @click="handleChangeThemeSetting(item)"
            >
              <div class="flex items-center">
                <Icon icon="ant-design:holder-outlined" class="mr-1" />
                <span>{{ item.themeSettingName }}</span>
              </div>
            </div>
          </div>
        </ElCard>
      </div>
      <div class="w-3/4 ml-1 px-2 py-2">
        <ElCard v-if="currentThemeSettingData.themeSettingCode" shadow="never" class="h-screen">
          <template #header>
            <div class="card-header">
              <div class="flex justify-between items-center">
                <span>{{ currentThemeSettingData.themeSettingName }}</span>
              </div>
            </div>
          </template>
          <div :loading="loading.ref">
            <component
              :is="getThemeComponent(currentThemeSettingData.themeSettingCode)"
              ref="currentComponentRef"
              :component-data="currentThemeSettingData.content"
              v-bind="currentThemeSettingData"
            />
          </div>
        </ElCard>
      </div>
    </div>
  </div>
</template>
