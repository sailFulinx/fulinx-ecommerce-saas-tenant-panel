<script setup lang="ts">
import { resetPasswordApi } from '@/api/user'
import { useLocale } from '@/hooks/useLocale'
import { resetRouter } from '@/router'
import { useTagsViewStore } from '@/stores/tagsView'
import { useUserStore } from '@/stores/user'
import { ElDropdown, ElDropdownItem, ElDropdownMenu, ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'

const tagsViewStore = useTagsViewStore()

const userStore = useUserStore()

const { replace } = useRouter()

const { t } = useLocale()

const loginOut = () => {
  ElMessageBox.confirm(t('common.loginOutMessage'), t('common.reminder'), {
    confirmButtonText: t('common.ok'),
    cancelButtonText: t('common.cancel'),
    type: 'warning',
  })
    .then(async () => {
      tagsViewStore.delAllViews()
      localStorage.removeItem('token')
      localStorage.removeItem('tokenExpiration')
      userStore.resetUser()
      resetRouter() // 重置静态路由表
      replace('/login')
    })
    .catch(() => {})
}

const dialogVisiblePassword = ref(false)

const passwordFormRef = ref()

const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
})

const passwordRules = reactive({
  oldPassword: [{ required: true, type: 'string', message: '请输入旧密码', trigger: 'blur' }],
  newPassword: [{ required: true, type: 'string', message: '请输入密新码', trigger: 'blur' }],
})

const handleEditPassword = () => {
  dialogVisiblePassword.value = true
}

const updatePassword = async () => {
  const valid = await passwordFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
  })
  if (!valid) {
    return false
  }
  await resetPasswordApi({
    oldPassword: passwordForm.value.oldPassword,
    newPassword: passwordForm.value.newPassword,
  }).catch(err => {
    throw err
  })
  ElMessage.success(t('common.updatePasswordSuccess'))
  dialogVisiblePassword.value = false
  tagsViewStore.delAllViews()
  localStorage.removeItem('token')
  localStorage.removeItem('tokenExpiration')
  resetRouter() // 重置静态路由表
  replace('/login')
}
</script>

<template>
  <div>
    <ElDropdown trigger="click">
      <div class="flex items-center">
        <img src="@/assets/imgs/avatar.jpg" alt="" class="w-36px rounded-[50%]">
        <span class="text-13px pl-3">{{ userStore.userDetail?.username || 'admin' }}</span>
      </div>
      <template #dropdown>
        <ElDropdownMenu>
          <ElDropdownItem>
            <div @click="handleEditPassword">
              {{ t('common.editPassword') }}
            </div>
          </ElDropdownItem>
          <ElDropdownItem divided>
            <div @click="loginOut">
              {{ t('common.loginOut') }}
            </div>
          </ElDropdownItem>
        </ElDropdownMenu>
      </template>
    </ElDropdown>
    <ElDialog v-model="dialogVisiblePassword" :title="`${t('common.editPassword')}`" width="500">
      <ElForm ref="passwordFormRef" :model="passwordForm" :rules="passwordRules" label-width="100px">
        <ElFormItem :label="t('common.oldPassword')" prop="oldPassword">
          <ElInput v-model="passwordForm.oldPassword" type="password" />
        </ElFormItem>
        <ElFormItem :label="t('common.newPassword')" prop="newPassword">
          <ElInput v-model="passwordForm.newPassword" type="password" />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <div class="dialog-footer">
          <ElButton @click="dialogVisiblePassword = false">
            {{ t('common.cancel') }}
          </ElButton>
          <ElButton type="primary" @click="updatePassword">
            {{ t('common.submit') }}
          </ElButton>
        </div>
      </template>
    </ElDialog>
  </div>
</template>
