<script setup lang="ts">
import { fetchSiteConfigCheckoutSetting, siteConfigCheckoutSetting } from '@/api/site'
import { ElInput } from 'element-plus'

const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false,
  },
})

const id = ref<string>('')

if (useRoute().params.id && typeof useRoute().params.id === 'string') {
  id.value = (useRoute().params.id as string) || ''
}

const rules = reactive({
  freeShippingAmount: [{ required: true, message: '满多少免运费必须填写', trigger: 'blur' }],
  defaultShippingAmount: [{ required: true, message: '默认运费金额必须填写', trigger: 'blur' }],
  supportEmailAddress: [{ required: true, message: '客户支持邮箱必须填写', trigger: 'blur' }],
})

const loading = reactive({
  init: false,
  button: false,
  theme: false,
})

const siteConfigCheckoutFormRef = ref()

const siteConfigCheckoutForm = ref<SiteConfigCheckoutSetting>({
  siteId: id.value,
  freeShippingAmount: 0,
  defaultShippingAmount: 0,
  supportEmailAddress: '',
})

const getSiteConfigCheckoutData = async () => {
  loading.init = true
  try {
    const { data } = await fetchSiteConfigCheckoutSetting(id.value)
    Object.assign(siteConfigCheckoutForm.value, data)
  } catch (error) {
    console.error('Failed to fetch site data:', error)
  } finally {
    loading.init = false
  }
}
const init = async () => {
  if (props.isEdit && id.value) {
    await getSiteConfigCheckoutData()
  }
}

const save = async () => {
  const valid = await siteConfigCheckoutFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
  })
  if (!valid) {
    return false
  }
  await siteConfigCheckoutSetting(siteConfigCheckoutForm.value).catch(err => {
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
  <ElForm ref="siteConfigCheckoutFormRef" :model="siteConfigCheckoutForm" :rules="rules" label-width="120px">
    <ElCard shadow="never">
      <ElFormItem label="满多少免运费" prop="freeShippingAmount">
        <ElInputNumber
          v-model="siteConfigCheckoutForm.freeShippingAmount"
          class="input-line"
          :min="1"
          :max="9999999"
          placeholder="请输入金额"
        />
      </ElFormItem>
      <ElFormItem label="默认运费金额" prop="defaultShippingAmount">
        <ElInputNumber
          v-model="siteConfigCheckoutForm.defaultShippingAmount"
          class="input-line"
          :min="1"
          :max="9999999"
          placeholder="请输入金额"
        />
      </ElFormItem>
      <ElFormItem label="客户支持邮箱" prop="supportEmailAddress">
        <ElInput
          v-model="siteConfigCheckoutForm.supportEmailAddress"
          class="input-line"
          minlength="1"
          maxlength="120"
          placeholder="请输入客户支持邮箱"
        />
      </ElFormItem>
    </ElCard>
  </ElForm>
</template>

<style lang="scss" scoped></style>
