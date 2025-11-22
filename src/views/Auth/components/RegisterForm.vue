<script setup lang="ts">
import { useRouter } from 'vue-router'
import { tenantRegisterApi } from '@/api/auth'
import { fetchCaptchaApi } from '@/api/captcha'
import { useLocale } from '@/hooks/useLocale'

const { t: $t } = useLocale()
const { push } = useRouter()

const formRef = ref()

const form = ref<RegisterParams>({
  email: '',
  password: '',
  confirmPassword: '',
  captchaKey: '',
  captchaValue: '',
})

const rules = reactive({
  email: [
    { required: true, type: 'email' as const, message: $t('auth.emailPlaceholder'), trigger: 'blur' },
  ],
  password: [
    { required: true, message: $t('auth.passwordPlaceholder'), trigger: 'blur' },
    { min: 6, message: $t('auth.passwordLength'), trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: $t('auth.confirmPasswordPlaceholder'), trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: any) => {
        if (value !== form.value.password) {
          callback(new Error($t('auth.passwordNotMatch')))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  captchaValue: [
    { required: true, message: $t('auth.captchaValuePlaceholder'), trigger: 'blur' },
  ],
})

const loading = reactive({
  captchaValue: false,
  register: false,
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
    captchaType: 2,
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

// 注册
const handleRegister = async () => {
  const valid = await formRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
  })
  if (!valid) {
    return false
  }
  loading.register = true
  form.value.captchaKey = captchaKey.value
  try {
    await tenantRegisterApi(form.value)
    ElMessage.success($t('auth.registerSuccess'))
    loading.register = false
    // 跳转到登录页
    push('/auth/login')
  } catch (error) {
    console.log(error)
    fetchCaptcha()
    loading.register = false
  }
}

const goToLogin = () => {
  push('/auth/login')
}
</script>

<template>
  <div>
    <h1 class="text-center mb-5 font-bold text-2xl">
      {{ $t('auth.register') }}
    </h1>
    <ElForm ref="formRef" :model="form" label-width="120px" label-position="top" size="large" :rules="rules">
      <ElFormItem :label="$t('auth.email')" prop="email">
        <ElInput
          v-model="form.email"
          class="input-line"
          clearable
          :placeholder="$t('auth.emailPlaceholder')"
        />
      </ElFormItem>
      <ElFormItem :label="$t('auth.password')" prop="password">
        <ElInput
          v-model="form.password"
          class="input-line"
          clearable
          type="password"
          show-password
          :placeholder="$t('auth.passwordPlaceholder')"
        />
      </ElFormItem>
      <ElFormItem :label="$t('auth.confirmPassword')" prop="confirmPassword">
        <ElInput
          v-model="form.confirmPassword"
          class="input-line"
          clearable
          type="password"
          show-password
          :placeholder="$t('auth.confirmPasswordPlaceholder')"
        />
      </ElFormItem>
      <ElFormItem :label="$t('auth.captchaValue')" prop="captchaValue">
        <ElInput
          v-model="form.captchaValue"
          class="input-line-captcha"
          :placeholder="$t('auth.captchaValuePlaceholder')"
          :input-style="inputStyle"
        >
          <template #suffix>
            <ElImage v-loading="loading.captchaValue" :src="captchaImageData" @click="fetchCaptcha" />
          </template>
        </ElInput>
      </ElFormItem>
    </ElForm>
    <EBtn :loading="loading.register" type="primary" class="w-[100%]" @click="handleRegister">
      {{ $t('auth.register') }}
    </EBtn>
    <div class="mt-4 text-center">
      <ElButton type="primary" link @click="goToLogin">
        {{ $t('auth.goToLogin') }}
      </ElButton>
    </div>
  </div>
</template>

<style scoped>
:deep .input-line-captcha .el-input__wrapper {
  padding-right: 0 !important;
}
</style>
