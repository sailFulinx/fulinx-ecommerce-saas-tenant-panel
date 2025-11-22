<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router'
import { fetchCaptchaApi } from '@/api/captcha'
import { useLocale } from '@/hooks/useLocale'
import { usePermissionStore } from '@/stores/permission'

import { useUserStore } from '@/stores/user'

const { t: $t } = useLocale()

const permissionStore = usePermissionStore()

const { addRoute, push } = useRouter()

const redirect = ref<string>('')

const userStore = useUserStore()

const formRef = ref()

const form = ref<LoginRequestType>({
  username: '',
  password: '',
  captchaKey: '',
  captchaValue: '',
})

const rules = reactive({
  email: [{ required: true, message: $t('auth.emailPlaceholder'), trigger: 'blur' }],
  password: [{ required: true, message: $t('auth.passwordPlaceholder'), trigger: 'blur' }],
  captchaValue: [{ required: true, message: $t('auth.captchaValuePlaceholder'), trigger: 'blur' }],
})

const loading = reactive({
  captchaValue: false,
  login: false,
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

// 登录
const signIn = async () => {
  const valid = await formRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
  })
  if (!valid) {
    return false
  }
  loading.login = true
  form.value.captchaKey = captchaKey.value
  try {
    const res = await userStore.login(form.value)
    loading.login = false
    if (res) {
      await permissionStore.generateRoutes()
      permissionStore.getAddRouters.forEach((route: any) => {
        addRoute(route as RouteRecordRaw) // 动态添加可访问路由表
      })
      permissionStore.setIsAddRouters(true)
      push({ path: redirect.value || permissionStore.addRouters[0].path })
    }
  } catch (error) {
    console.log(error)
    fetchCaptcha()
    loading.login = false
  }
}

const goToRegister = () => {
  push('/auth/register')
}

const goToForgetPassword = () => {
  push('/auth/forget-password')
}
</script>

<template>
  <div>
    <h1 class="text-center mb-5 font-bold text-2xl">
      {{ $t('auth.login') }}
    </h1>
    <ElForm ref="formRef" :model="form" label-width="120px" label-position="top" size="large" :rules="rules">
      <ElFormItem :label="$t('auth.username')" prop="username">
        <ElInput v-model="form.username" class="input-line" clearable :placeholder="$t('auth.usernamePlaceholder')" />
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
    <EBtn :loading="loading.login" type="primary" class="w-[100%]" @click="signIn">
      {{ $t('auth.login') }}
    </EBtn>
    <div class="mt-4 flex justify-between">
      <ElButton type="primary" link @click="goToRegister">
        {{ $t('auth.goToRegister') }}
      </ElButton>
      <ElButton type="primary" link @click="goToForgetPassword">
        {{ $t('auth.forgetPassword') }}
      </ElButton>
    </div>
  </div>
</template>

<style scoped>
:deep .input-line-captcha .el-input__wrapper {
  padding-right: 0 !important;
}
</style>
