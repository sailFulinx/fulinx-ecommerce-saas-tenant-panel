<script setup lang="ts">
import { createShippingCompanyApi } from '@/api/shipping'
import { useLocale } from '@/hooks/useLocale'
import { useTagsViewStore } from '@/stores/tagsView'
import { ElCard, ElInput, ElMessage } from 'element-plus'

const { t: $t } = useLocale()

const rules = reactive({
  shippingCompanyName: [{ required: true, type: 'string', message: '内容名称必须填写', trigger: 'blur' }],
})

const loading = reactive({
  init: false,
  button: false,
})

const pageTitle = $t('shipping.add')

const shippingCompanyFormRef = ref()

const createShippingCompanyForm = (): CreateShippingCompanyParams => {
  return {
    shippingCompanyName: '',
  }
}

const shippingCompanyForm = reactive<CreateShippingCompanyParams>(createShippingCompanyForm())

const closeViewTag = () => {}

const tagsViewStore = useTagsViewStore()

const deleteTagView = (refresh: boolean) => {
  if (refresh) {
    tagsViewStore.delCachedView()
  }
  tagsViewStore.delVisitedView(router.currentRoute.value)
  router.push({ name: 'ShippingCompanyList' })
}

const save = async () => {
  const valid = await shippingCompanyFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
  })
  if (!valid) {
    return false
  }

  await createShippingCompanyApi(shippingCompanyForm).catch(err => {
    throw err
  })

  deleteTagView(true)
  ElMessage({
    message: '保存成功',
    type: 'success',
    duration: 2000,
  })
}
</script>

<template>
  <div v-loading="loading.init" class="view-page">
    <div class="view-header">
      <div class="flex justify-between items-center">
        <div>
          <h4>{{ pageTitle }}</h4>
        </div>
        <div>
          <EBtn size="small" :loading="loading.button" @click="closeViewTag()">
            <Icon icon="ant-design:close-outlined" class="mr-1" />
            {{ $t('common.cancel') }}
          </EBtn>
          <EBtn size="small" type="primary" :loading="loading.button" @click="save">
            <Icon icon="ant-design:save-outlined" class="mr-1" />
            {{ $t('common.save') }}
          </EBtn>
        </div>
      </div>
    </div>
    <div class="view-main theme-card">
      <ElCard shadow="never">
        <ElForm ref="shippingCompanyFormRef" :model="shippingCompanyForm" :rules="rules" label-width="120px">
          <ElFormItem :label="$t('shipping.shippingCompanyName')" prop="shippingCompanyName">
            <ElInput
              v-model="shippingCompanyForm.shippingCompanyName"
              minlength="1"
              maxlength="120"
              :placeholder="$t('shipping.placeholder.shippingCompanyName')"
            />
          </ElFormItem>
        </ElForm>
      </ElCard>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
