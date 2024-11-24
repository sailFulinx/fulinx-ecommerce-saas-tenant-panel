<script setup name="UserBase" lang="ts">
import { useLocale } from '@/hooks/useLocale'

const form = reactive<EditUserPasswordType>({
  userId: 0,
  newPassword: '',
})
const { t: $t } = useLocale()

const rules = reactive({
  newPassword: [{ required: true, type: 'string', message: $t('user.rules.password'), trigger: 'blur' }],
})

const formRef = ref()

async function getFormData() {
  const valid = await formRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
  })
  if (!valid) {
    return false
  }
  return form
}

defineExpose({
  getFormData,
})
</script>

<template>
  <ElForm ref="formRef" :model="form" :rules="rules" label-width="120px">
    <ElFormItem :label="$t('user.password')" prop="password">
      <ElInput
        v-model="form.newPassword"
        class="input-line"
        clearable
        show-word-limit
        minlength="1"
        maxlength="120"
        :placeholder="$t('user.placeholder.password')"
      />
    </ElFormItem>
  </ElForm>
</template>
