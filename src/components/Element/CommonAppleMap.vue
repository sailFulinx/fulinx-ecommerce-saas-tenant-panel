<script setup name="CommonAppleMap" lang="ts">
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'

defineProps({
  componentData: {
    type: Object as () => FormData,
  },
})

interface FormData {
  content: {
    title: string
    titleAlign: 'left' | 'center' | 'right'
    titleColor: string
    titleSize: number
    isShowTitle: boolean
    mapUrl: string
    height: number
    isShowMap: boolean
  }
  status: boolean
}

const form = reactive<FormData>({
  content: {
    title: '',
    titleAlign: 'left',
    titleColor: '#000000',
    titleSize: 16,
    isShowTitle: true,
    mapUrl: '',
    height: 400,
    isShowMap: true,
  },
  status: true,
})

const rules = reactive({
  'content.mapUrl': [{ required: true, message: '请输入苹果地图URL', trigger: 'blur' }],
})

// TextSetting组件引用
const titleTextSettingRef = ref()

const formRef = ref()

const handleValidateMapUrl = (url: string) => {
  // 检查是否是有效的苹果地图URL
  return url.includes('apple.com/maps') || url.includes('maps.apple.com')
}

async function getFormData() {
  // 从TextSetting组件获取最新的数据
  if (titleTextSettingRef.value) {
    const titleData = titleTextSettingRef.value.getData()
    form.content.title = titleData.title
    form.content.titleAlign = titleData.titleAlign
    form.content.titleColor = titleData.titleColor
    form.content.titleSize = titleData.titleSize
    form.content.isShowTitle = titleData.isShow !== undefined ? titleData.isShow : true
  }

  if (!form.content.mapUrl) {
    ElMessage.error('请输入苹果地图URL')
    return false
  }

  if (!handleValidateMapUrl(form.content.mapUrl)) {
    ElMessage.error('请输入有效的苹果地图URL')
    return false
  }

  return form
}

function setFormData(formData: FormData) {
  form.content = { ...formData.content }
  form.status = formData.status

  // 更新TextSetting组件数据
  if (titleTextSettingRef.value) {
    titleTextSettingRef.value.setData({
      title: form.content.title,
      titleAlign: form.content.titleAlign,
      titleColor: form.content.titleColor,
      titleSize: form.content.titleSize,
      isShow: form.content.isShowTitle,
    })
  }
}

defineExpose({
  getFormData,
  setFormData,
})
</script>

<template>
  <div class="w-full overflow-hidden">
    <ElForm ref="formRef" :model="form" :rules="rules" label-width="80px">
      <ElFormItem label="标题">
        <div class="w-full">
          <TextSetting
            ref="titleTextSettingRef"
            :show-display-switch="true"
            :show-font-color-control="true"
            :show-font-size-control="true"
            :show-text-align-control="true"
            label="标题"
          />
        </div>
      </ElFormItem>

      <ElFormItem label="地图URL" prop="mapUrl">
        <ElInput
          v-model="form.content.mapUrl"
          type="textarea"
          :rows="3"
          placeholder="请输入苹果地图URL，例如：https://maps.apple.com/?ll=40.7128,-74.0060&z=12"
        />
        <div class="text-sm text-gray-500 mt-1">
          请在苹果地图中找到所需位置，点击分享按钮，选择"复制链接"，然后粘贴到这里
        </div>
      </ElFormItem>

      <ElFormItem label="地图高度">
        <ElInputNumber
          v-model="form.content.height"
          :min="100"
          :max="1000"
          :step="50"
          class="w-full"
        >
          <template #append>
            px
          </template>
        </ElInputNumber>
      </ElFormItem>

      <ElFormItem label="显示地图">
        <ElSwitch v-model="form.content.isShowMap" />
      </ElFormItem>

      <ElFormItem v-if="form.content.mapUrl && handleValidateMapUrl(form.content.mapUrl)" label="预览">
        <div class="border border-gray-300 rounded">
          <iframe
            :src="form.content.mapUrl"
            :height="form.content.height"
            class="w-full"
            frameborder="0"
            sandbox="allow-scripts allow-same-origin allow-popups"
          />
        </div>
      </ElFormItem>

      <ElFormItem label="状态" required>
        <ElSwitch v-model="form.status" />
      </ElFormItem>
    </ElForm>
  </div>
</template>
