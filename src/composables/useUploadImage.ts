import type { UploadFile, UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import { uploadFileApi } from '@/api/file'

interface UseUploadImageOptions {
  /** 最大上传文件数量限制 */
  maxCount?: number
  /** 文件大小限制（MB） */
  maxSize?: number
  /** 支持的文件类型 */
  acceptTypes?: string[]
  /** 上传路径 */
  uploadPath?: string
  /** 上传成功后的回调函数 */
  onSuccessCallback?: (fileData: FileData) => void
}

/**
 * 图像上传 composable
 * 提供图像上传的核心功能，包括验证、上传、进度跟踪等功能
 */
export const useUploadImage = (options: UseUploadImageOptions = {}) => {
  const {
    maxCount = 10,
    maxSize = 50,
    acceptTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'],
    uploadPath = 'images',
    onSuccessCallback,
  } = options

  // 上传过程中的文件列表
  const beforeUploadFileDataList = ref<UploadFile[]>([])
  // 已上传的文件数据列表
  const fileDataList = ref<FileData[]>([])
  // 上传进度
  const uploadProgress = ref<{ [key: string]: number }>({})
  // 是否正在上传
  const loading = ref(false)

  /**
   * 文件上传前的验证
   */
  const beforeUpload: UploadProps['beforeUpload'] = rawFile => {
    const isAcceptedType = acceptTypes.includes(rawFile.type)
    const isLtMaxSize = rawFile.size / 1024 / 1024 < maxSize

    if (!isAcceptedType) {
      ElMessage.error(`上传文件必须是 ${acceptTypes.join(', ')} 格式!`)
      return false
    }
    if (!isLtMaxSize) {
      ElMessage.error(`上传文件大小不能超过 ${maxSize}MB!`)
      return false
    }
    return true
  }

  /**
   * 上传超出限制的处理
   */
  const handleExceed = (_files: File[]) => {
    ElMessage.error(`您最多只能上传${maxCount}个文件!`)
  }

  /**
   * 处理文件上传
   */
  const processUpload = async (formData: FormData) => {
    loading.value = true
    try {
      const { data } = await uploadFileApi(formData)
      return data
    } catch (error) {
      ElMessage.error('文件上传失败!')
      console.error('文件上传失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 上传文件的主要处理函数
   */
  const handleUpload = async ({ file }: { file: any }) => {
    beforeUploadFileDataList.value.push(file)

    const formData = new FormData()
    formData.append('file', file)

    // 生成当前日期格式为 YYYYMMDD 的字符串
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const datePath = `${year}${month}${day}`

    // 构造新的上传路径
    formData.append('folder', `${uploadPath}/${datePath}`)
    formData.append('isPublic', 'true')

    const res = await processUpload(formData)
    if (res) {
      if (!res.sort) {
        res.sort = fileDataList.value.length + 1
      }
      fileDataList.value.push(res)

      // 如果提供了上传成功回调函数，则调用它
      if (onSuccessCallback) {
        onSuccessCallback(res)
      }
    }
  }

  /**
   * 上传成功后的处理
   */
  const handleSuccess = (response: any, uploadFile: UploadFile) => {
    beforeUploadFileDataList.value = beforeUploadFileDataList.value.filter(
      item => item.uid !== uploadFile.uid,
    )
    delete uploadProgress.value[uploadFile.uid]
  }

  /**
   * 上传进度处理
   */
  const handleProgress = (event: { percent: number }, uploadFile: UploadFile) => {
    uploadProgress.value[uploadFile.uid] = event.percent
  }

  /**
   * 删除文件
   */
  const removeFile = (index: number) => {
    fileDataList.value.splice(index, 1)
  }

  /**
   * 批量删除文件
   */
  const removeFiles = (indexes: number[]) => {
    // 按降序排列，避免索引错位问题
    indexes.sort((a, b) => b - a).forEach(index => {
      removeFile(index)
    })
  }

  /**
   * 重新排序文件
   */
  const reorderFiles = () => {
    fileDataList.value.forEach((item, index) => {
      item.sort = index + 1
    })
  }

  /**
   * 获取文件数据
   */
  const getFileData = () => {
    return { fileDataList: JSON.parse(JSON.stringify(fileDataList.value)) }
  }

  /**
   * 设置文件数据（替换当前列表）
   */
  const setFileData = (fileList: FileData[]) => {
    if (fileList && fileList.length === 0) {
      fileDataList.value = []
      return
    }
    // 为文件设置正确的排序号
    fileList.forEach((file, index) => {
      file.sort = index + 1
    })
    // 替换整个列表而不是简单赋值，以保持响应性
    fileDataList.value.splice(0, fileDataList.value.length, ...fileList)
  }

  /**
   * 清空所有文件数据
   */
  const clearAllFiles = () => {
    fileDataList.value = []
  }

  /**
   * 获取当前上传文件的数量
   */
  const getCurrentFileCount = () => {
    return fileDataList.value.length
  }

  return {
    // refs
    beforeUploadFileDataList,
    fileDataList,
    uploadProgress,
    loading,

    // methods
    beforeUpload,
    handleExceed,
    processUpload,
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

    // options
    maxCount,
    maxSize,
    acceptTypes,
    uploadPath,
  }
}
