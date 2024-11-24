<script setup lang="ts">
import { uploadFileApi } from '@/api/file'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'

// 定义编辑器和上传进度的状态
const editorContainer = ref()
const _uploadProgress = ref<number | null>(null) // 私有的上传进度
let quillInstance: Quill | null = null // 保存 Quill 实例

const uploadProgress = ref<number | null>(null)

// 获取文件的源 URL（根据你的项目配置）
const sourceUrl = import.meta.env.VITE_RESOURCE_URL

// 处理图片/视频上传
const handleFileUpload = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)

  try {
    // 调用 uploadFileApi，并传递进度回调
    const { data } = await uploadFileApi(formData, {
      onUploadProgress: (progressEvent: ProgressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        console.log(progress)
        uploadProgress.value = progress // 更新上传进度
      },
    })
    return data.fileUrl // 上传成功后返回文件的完整URL
  } catch (err) {
    console.error('Error uploading file:', err)
    throw err
  } finally {
    uploadProgress.value = null // 上传完成后重置进度
  }
}

// 将图片或视频插入到 Quill 编辑器中
const insertToEditor = (editor: Quill, url: string, type: string) => {
  const range = editor.getSelection()
  if (range) {
    if (type === 'image') {
      editor.insertEmbed(range.index, 'image', url)
    } else if (type === 'video') {
      editor.insertEmbed(range.index, 'video', url)
    }
  }
}

// 初始化 Quill 编辑器
onMounted(() => {
  quillInstance = new Quill(editorContainer.value, {
    theme: 'snow',
    modules: {
      toolbar: {
        container: [
          [{ font: ['sans-serif', 'serif', 'monospace', 'cursive', 'fantasy'] }], // 更多字体选择
          [{ size: ['small', 'normal', 'large', 'huge'] }], // 更多字体大小选择
          [{ header: [1, 2, 3, 4, 5, 6, false] }], // 更多 header 选项
          [{ align: [] }], // 添加对齐方式选择
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'image', 'video', 'code-block'],
        ],
        handlers: {
          // 自定义图片上传逻辑
          image() {
            const input = document.createElement('input')
            input.setAttribute('type', 'file')
            input.setAttribute('accept', 'image/*')
            input.click()

            input.onchange = async () => {
              const file = input.files?.[0]
              if (file) {
                const url = await handleFileUpload(file)
                if (url) {
                  insertToEditor(quillInstance!, sourceUrl + url, 'image')
                }
              }
            }
          },
          // 自定义视频上传逻辑
          video() {
            const input = document.createElement('input')
            input.setAttribute('type', 'file')
            input.setAttribute('accept', 'video/*')
            input.click()

            input.onchange = async () => {
              const file = input.files?.[0]
              if (file) {
                const url = await handleFileUpload(file)
                if (url) {
                  insertToEditor(quillInstance!, sourceUrl + url, 'video')
                }
              }
            }
          },
        },
      },
    },
  })
})

// 获取编辑器内容
const getEditorContent = () => {
  if (quillInstance) {
    return quillInstance.root.innerHTML // 获取编辑器的 HTML 内容
  }
  return ''
}

// 设置编辑器内容
const setEditorContent = (content: string) => {
  if (quillInstance) {
    quillInstance.clipboard.dangerouslyPasteHTML(content) // 设置编辑器内容为指定的 HTML
  }
}

defineExpose({
  getEditorContent,
  setEditorContent,
})
</script>

<template>
  <div>
    <div ref="editorContainer" class="quill-editor w-full" />
    <!-- 仅当有上传进度时显示 -->
    <p v-if="uploadProgress !== null">
      Upload Progress: {{ uploadProgress }}%
    </p>
  </div>
</template>

<style>
.quill-editor {
  width:100%;
  height: 400px;
}
</style>
