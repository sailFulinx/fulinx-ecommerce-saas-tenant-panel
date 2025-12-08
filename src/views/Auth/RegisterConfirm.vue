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

const token = computed(() => route.query.token as string)

const handleConfirm = async () => {
  if (!token.value || token.value === '') {
    ElMessage.error($t('auth.invalidToken'))
    throw new Error($t('auth.invalidToken'))
  }

  loading.value = true

  const { data } = await tenantRegisterConfirmApi({ token: token.value }).catch(error => {
    ElMessage.error($t('auth.registerConfirmFailed'))
    console.error('Error confirming registration:', error)
  })
  if (data) {
    confirmSuccess.value = true
    ElMessage.success($t('auth.registerConfirmSuccess'))
    localStorage.setItem('token', data.accessToken)
    localStorage.setItem('tokenExpiration', data.accessTokenExpiration)
    const tenantStore = useTenantStore()
    tenantStore.setTenantDetail(data.tenantDetail)
    router.push('/dashboard')
  }
  loading.value = false
}

const handleRegister = () => {
  router.push('/auth/register')
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
          <img key="1" src="@/assets/svgs/login-box-bg.svg" :alt="title" class="w-80" />
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
                {{ $t('auth.registerConfirm') }}
              </h1>
              <div class="text-center">
                <p class="mb-4">
                  {{ $t('auth.registerConfirmDescription') }}
                </p>
                <EBtn :loading="loading" @click="handleRegister">
                  {{ $t('common.back') }}
                </EBtn>
                <EBtn :loading="loading" type="primary" @click="handleConfirm">
                  {{ $t('auth.confirmRegistration') }}
                </EBtn>
              </div>
            </div>
            <div v-else class="text-center">
              <h1 class="text-center mb-5 font-bold text-2xl text-green-600">
                {{ $t('auth.registerConfirmSuccess') }}
              </h1>
              <p class="mb-4">
                {{ $t('auth.redirectToLogin') }}
              </p>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>
