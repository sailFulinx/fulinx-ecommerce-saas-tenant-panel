# useUploadImage Composable 使用指南

`useUploadImage` 是一个可复用的图像上传功能模块，它提取了图像上传的核心逻辑，可以方便地在不同组件中复用。

## 导入

```typescript
import { useUploadImage } from '@/composables/useUploadImage'
```

## 用法

### 基本用法

```typescript
const {
  // 响应式数据
  fileDataList,
  loading,
  beforeUploadFileDataList,
  uploadProgress,
  
  // 方法
  beforeUpload,
  handleExceed,
  handleUpload,
  handleSuccess,
  handleProgress,
  removeFile,
  removeFiles,
  reorderFiles,
  getFileData,
  setFileData,
  clearAllFiles,
  getCurrentFileCount,
  
  // 选项
  maxCount,
  maxSize,
  acceptTypes,
  uploadPath,
} = useUploadImage(options)
```

### 配置选项

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| maxCount | number | 10 | 最大上传文件数量 |
| maxSize | number | 50 | 单个文件最大大小（MB） |
| acceptTypes | string[] | ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'] | 支持的文件类型 |
| uploadPath | string | 'images' | 上传路径 |
| onSuccessCallback | (fileData: FileData) => void | undefined | 上传成功后的回调函数 |

### 示例

```vue
<script setup lang="ts">
import { useUploadImage } from '@/composables/useUploadImage'

const {
  fileDataList,
  loading,
  beforeUpload,
  handleUpload,
  handleSuccess,
  handleProgress,
  removeFile,
  getFileData,
  setFileData,
} = useUploadImage({
  maxCount: 5,
  maxSize: 10,
  acceptTypes: ['image/jpeg', 'image/png'],
  uploadPath: 'user-avatars',
  onSuccessCallback: (fileData) => {
    console.log('上传成功:', fileData)
  }
})
</script>

<template>
  <ElUpload
    v-loading="loading"
    action=""
    :http-request="handleUpload"
    :before-upload="beforeUpload"
    :on-success="handleSuccess"
    :on-progress="handleProgress"
    :limit="maxCount"
    :on-exceed="handleExceed"
  >
    <ElButton>上传图片</ElButton>
  </ElUpload>
  
  <div v-for="(file, index) in fileDataList" :key="file.id">
    <img :src="file.fileUrl" />
    <button @click="removeFile(index)">删除</button>
  </div>
</template>
```

## FloatingUpload 组件

我们还提供了一个浮动上传组件，集成了上传按钮、上传功能、文件选择功能和悬浮显示逻辑，可以方便地集成到上传组件中。

### 用法

```vue
<script setup lang="ts">
import FloatingUpload from '@/components/Upload/FloatingUpload.vue'

const handleFileUploaded = (fileData: FileData) => {
  console.log('文件上传成功:', fileData)
}
</script>

<template>
  <FloatingUpload 
    :show-upload-button="true" 
    @file-uploaded="handleFileUploaded" 
  />
</template>
```

### 特性

- 内置上传按钮
- 内置上传功能（本地上传）
- 内置图库选择功能（通过 FileList 组件）
- 集成了所有上传核心方法
- 包含悬浮显示和隐藏的交互控制逻辑
- 自动监听鼠标事件以显示/隐藏悬浮控件
- 支持上传成功事件发射

### Props

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| show-upload-button | boolean | true | 是否显示上传按钮 |

### Events

| 事件 | 类型 | 描述 |
|------|------|------|
| file-uploaded | (fileData: FileData) => void | 文件上传成功时触发 |

## 返回值

### 响应式数据

- `fileDataList`: 上传成功的文件列表
- `loading`: 是否正在上传
- `beforeUploadFileDataList`: 上传中的文件列表
- `uploadProgress`: 上传进度信息

### 方法

- `beforeUpload`: 上传前验证文件
- `handleExceed`: 处理超出限制的情况
- `handleUpload`: 处理文件上传
- `handleSuccess`: 上传成功回调
- `handleProgress`: 上传进度回调
- `removeFile(index)`: 删除指定索引的文件
- `removeFiles(indexes)`: 批量删除文件
- `reorderFiles()`: 重新排序文件（通常在拖拽后调用）
- `getFileData()`: 获取文件数据
- `setFileData(files)`: 设置文件数据
- `clearAllFiles()`: 清空所有文件
- `getCurrentFileCount()`: 获取当前文件数量

## 注意事项

1. 使用此 composable 时，必须正确处理上传过程中的各种状态
2. 确保在模板中正确绑定相关事件处理器
3. 如需自定义验证逻辑，可以在 options 中传递自定义验证函数
4. 上传路径应遵循项目的文件组织规范