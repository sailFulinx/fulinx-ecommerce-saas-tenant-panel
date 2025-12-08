<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useLocale } from '@/hooks/useLocale'

const { t: $t } = useLocale()
const route = useRoute()
const router = useRouter()

const title = ref(import.meta.env.VITE_APP_TITLE)
const version = useVersion()
const loading = ref(false)
const confirmSuccess = ref(false)

// 添加表单引用和数据
const formRef = ref()
const form = ref({
  token: '',
  password: '',
  confirmPassword: '',
})

// 添加表单验证规则
const rules = reactive({
  password: [
    { required: true, message: $t('auth.passwordPlaceholder'), trigger: 'blur' },
    { min: 6, message: $t('auth.passwordMinLength'), trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: $t('auth.confirmPasswordPlaceholder'), trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' },
  ],
})

// 验证确认密码
function validateConfirmPassword(rule: any, value: string, callback: any) {
  if (value !== form.value.password) {
    callback(new Error($t('auth.passwordNotMatch')))
  } else {
    callback()
  }
}

const token = computed(() => route.query.token as string)

// 在组件挂载时设置token
onMounted(() => {
  form.value.token = token.value
})

const handleConfirm = async () => {
  if (!form.value.token || form.value.token === '') {
    ElMessage.error($t('auth.invalidToken'))
    throw new Error($t('auth.invalidToken'))
  }

  const valid = await formRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
  })

  if (!valid) {
    return false
  }

  loading.value = true

  const { data } = await tenantForgetPasswordConfirmApi(form.value).catch(error => {
    ElMessage.error($t('auth.forgetPasswordConfirmFailed'))
    console.error('Error confirming password reset:', error)
    loading.value = false
    return { data: null }
  })

  if (data) {
    confirmSuccess.value = true
    ElMessage.success($t('auth.forgetPasswordConfirmSuccess'))
  }
  loading.value = false
}

const handleLogin = () => {
  router.push('/auth/login')
}
</script>

<template>
  <div class="h-screen w-screen relative flex overflow-hidden">
    <div class="flex-1 bg-blue-500 bg-opacity-20 relative p-8">
      <div class="flex items-center relative text-white">
        <span class="text-2xl font-bold text-black">{{ title }}</span>
      </div>
      <div
        class="flex justify-center items-center h-80 w-full absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"
      >
        <TransitionGroup appear tag="div" enter-active-class="animate__animated animate__bounceInLeft">
          <img key="1" src="@/assets/svgs/login-box-bg.svg" :alt="title" class="w-80">
          <div key="2" class="text-3xl text-black">
            {{ $t('auth.welcome') }}
          </div>
        </TransitionGroup>
      </div>
      <div class="flex items-center absolute bottom-10 text-black">
        <span class="text-lg">{{ version }}</span>
      </div>
    </div>
    <div class="flex-1 p-8 relative">
      <Transition appear enter-active-class="animate__animated animate__bounceInRight">
        <div class="h-full flex items-center justify-center w-full">
          <div class="w-full max-w-lg p-5 h-auto bg-white rounded-3xl">
            <div v-if="!confirmSuccess">
              <h1 class="text-center mb-5 font-bold text-2xl">
                {{ $t('auth.forgetPasswordConfirm') }}
              </h1>
              <ElForm
                ref="formRef"
                :model="form"
                label-width="120px"
                label-position="top"
                size="large"
                :rules="rules"
              >
                <ElFormItem :label="$t('auth.password')" prop="password">
                  <ElInput
                    v-model="form.password"
                    type="password"
                    class="input-line"
                    clearable
                    show-password
                    :placeholder="$t('auth.passwordPlaceholder')"
                  />
                </ElFormItem>

                <ElFormItem :label="$t('auth.confirmPassword')" prop="confirmPassword">
                  <ElInput
                    v-model="form.confirmPassword"
                    type="password"
                    class="input-line"
                    clearable
                    show-password
                    :placeholder="$t('auth.confirmPasswordPlaceholder')"
                  />
                </ElFormItem>
              </ElForm>

              <div class="w-full">
                <ElButton :loading="loading" size="default" type="primary" class="w-full mb-5" @click="handleConfirm">
                  {{ $t('auth.confirmPasswordReset') }}
                </ElButton>
              </div>
              <div class="w-full">
                <ElButton :loading="loading" size="default" class="w-full ml-0" @click="handleLogin">
                  {{ $t('common.back') }}
                </ElButton>
              </div>
            </div>
            <div v-else class="text-center">
              <h1 class="text-center mb-5 font-bold text-2xl text-green-600">
                {{ $t('auth.forgetPasswordConfirmSuccess') }}
              </h1>
              <p class="mb-4">
                {{ $t('auth.redirectToLogin') }}
              </p>
              <EBtn type="primary" @click="handleLogin">
                {{ $t('auth.goToLogin') }}
              </EBtn>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>
