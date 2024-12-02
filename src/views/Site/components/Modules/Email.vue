<script setup lang="ts">
import { fetchSiteConfigMailSetting, siteConfigMailSetting } from '@/api/site'
import { ElInput } from 'element-plus'

const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false,
  },
})

const id = ref<string>('')

if (useRoute().params.id && typeof useRoute().params.id === 'string') {
  id.value = useRoute().params.id as string || ''
}

const rules = reactive({
  smtpHost: [{ required: true, message: 'SMTP主机必须填写', trigger: 'blur' }],
  smtpPort: [{ required: true, message: 'SMTP端口必须填写', trigger: 'blur' }],
  fromEmail: [{ required: true, message: '发信邮箱必须填写', trigger: 'blur' }],
  username: [{ required: true, message: 'SMTP用户名必须填写', trigger: 'blur' }],
  password: [{ required: true, message: 'SMTP密码必须填写', trigger: 'blur' }],
  starttlsEnable: [{ required: true, message: '是否采用SSL连接', trigger: 'blur' }],
})

const loading = reactive({
  init: false,
  button: false,
  theme: false,
})

const siteConfigMailFormRef = ref()

const siteConfigMailForm = ref<SiteConfigMailSetting>({
  siteId: id.value,
  smtpHost: '',
  smtpPort: 0,
  fromEmail: '',
  username: '',
  password: '',
  starttlsEnable: true,
})

const getSiteConfigMailData = async () => {
  loading.init = true
  try {
    const { data } = await fetchSiteConfigMailSetting(id.value)
    Object.assign(siteConfigMailForm.value, data)
  } catch (error) {
    console.error('Failed to fetch site data:', error)
  } finally {
    loading.init = false
  }
}
const init = async () => {
  if (props.isEdit && id.value) {
    await getSiteConfigMailData()
  }
}

const save = async () => {
  const valid = await siteConfigMailFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
  })
  if (!valid) {
    return false
  }
  await siteConfigMailSetting(siteConfigMailForm.value).catch(err => {
    throw err
  })
}

onMounted(() => {
  init()
})

defineExpose({
  save,
})
</script>

<template>
  <ElForm ref="siteConfigMailFormRef" :model="siteConfigMailForm" :rules="rules" label-width="120px">
    <ElCard shadow="never">
      <ElFormItem label="SMTP主机" prop="smtpHost">
        <ElInput
          v-model="siteConfigMailForm.smtpHost"
          class="input-line"
          minlength="1"
          maxlength="120"
          placeholder="请输入SMTP主机"
        />
      </ElFormItem>
      <ElFormItem label="SMTP端口号" prop="smtpPort">
        <ElInputNumber
          v-model="siteConfigMailForm.smtpPort"
          class="input-line"
          :min="465"
          :max="65535"
          placeholder="请输入SMTP端口号"
        />
      </ElFormItem>
      <ElFormItem label="来源邮箱" prop="fromEmail">
        <ElInput
          v-model="siteConfigMailForm.fromEmail"
          class="input-line"
          placeholder="请输入来源邮箱"
        />
      </ElFormItem>
      <ElFormItem label="SMTP用户名" prop="username">
        <ElInput
          v-model="siteConfigMailForm.username"
          class="input-line"
          placeholder="请输入SMTP用户名"
        />
      </ElFormItem>
      <ElFormItem label="SMTP密码" prop="password">
        <ElInput
          v-model="siteConfigMailForm.password"
          class="input-line"
          placeholder="请输入SMTP密码"
        />
      </ElFormItem>
      <ElFormItem label="是否启用SSL" prop="starttlsEnable">
        <ElSwitch v-model="siteConfigMailForm.starttlsEnable" />
      </ElFormItem>
    </ElCard>
  </ElForm>
</template>

<style lang="scss" scoped></style>
