<script setup lang="ts">
import { useRouter } from 'vue-router'
import { tenantForgetPasswordApi } from '@/api/auth'
import { fetchCaptchaApi } from '@/api/captcha'
import { useLocale } from '@/hooks/useLocale'

const { t: $t } = useLocale()
const { push } = useRouter()

const formRef = ref()

const form = ref<ForgetPasswordParams>({
  email: '',
  captchaKey: '',
  captchaValue: '',
})

const rules = reactive({
  email: [
    { required: true, type: 'email', message: $t('forgetPassword.emailPlaceholder'), trigger: 'blur' },
  ],
  captchaValue: [
    { required: true, message: $t('forgetPassword.captchaValuePlaceholder'), trigger: 'blur' },
  ],
})

const loading = reactive({
  captchaValue: false,
  submit: false,
})

const captchaImageData = ref<string>('')

const captchaKey = ref<string>('')

const initCaptchaKey = () => {
  captchaKey.value = new Date().getTime().toString()
}

initCaptchaKey()

const fetchCaptcha = async () => {
  loading.captchaValue = true
  const payload = {
    captchaKey: captchaKey.value,
    captchaType: 1,
  }
  const { data } = await fetchCaptchaApi(payload).catch(error => {
    loading.captchaValue = false
    throw error
  })
  captchaImageData.value = data
  loading.captchaValue = false
}

fetchCaptcha()

const inputStyle = 'padding-right:0px;'

// 提交忘记密码请求
const handleSubmit = async () => {
  const valid = await formRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
  })
  if (!valid) {
    return false
  }
  loading.submit = true
  form.value.captchaKey = captchaKey.value
  try {
    await tenantForgetPasswordApi(form.value)
    ElMessage.success($t('forgetPassword.submitSuccess'))
    loading.submit = false
    // 跳转到登录页
    push('/auth/login')
  } catch (error) {
    console.log(error)
    fetchCaptcha()
    loading.submit = false
  }
}

const goToLogin = () => {
  push('/auth/login')
}
</script>

<template>
  <div>
    <h1 class="text-center mb-5 font-bold text-2xl">
      {{ $t('forgetPassword.title') }}
    </h1>
    <ElForm ref="formRef" :model="form" label-width="120px" label-position="top" size="large" :rules="rules">
      <ElFormItem :label="$t('forgetPassword.email')" prop="email">
        <ElInput
          v-model="form.email"
          class="input-line"
          clearable
          :placeholder="$t('forgetPassword.emailPlaceholder')"
        />
      </ElFormItem>
      <ElFormItem :label="$t('forgetPassword.captchaValue')" prop="captchaValue">
        <ElInput
          v-model="form.captchaValue"
          class="input-line-captcha"
          :placeholder="$t('forgetPassword.captchaValuePlaceholder')"
          :input-style="inputStyle"
        >
          <template #suffix>
            <ElImage v-loading="loading.captchaValue" :src="captchaImageData" @click="fetchCaptcha" />
          </template>
        </ElInput>
      </ElFormItem>
    </ElForm>
    <EBtn :loading="loading.submit" type="primary" class="w-[100%]" @click="handleSubmit">
      {{ $t('forgetPassword.submit') }}
    </EBtn>
    <div class="mt-4 text-center">
      <ElButton type="primary" link @click="goToLogin">
        {{ $t('forgetPassword.goToLogin') }}
      </ElButton>
    </div>
  </div>
</template>

<style scoped>
:deep .input-line-captcha .el-input__wrapper {
  padding-right: 0 !important;
}
</style>
