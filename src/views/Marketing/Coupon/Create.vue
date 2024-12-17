<script setup lang="ts">
import { createCouponApi } from '@/api/coupon'
import { couponRuleTypes, couponTypes } from '@/data/coupon.ts'
import { useLocale } from '@/hooks/useLocale'
import { usePreferenceStore } from '@/stores/preference'
import { useTagsViewStore } from '@/stores/tagsView'
import { convertCustomTypeValue } from '@/utils/general'
import { ElCard, ElInput, ElMessage } from 'element-plus'

const { t: $t } = useLocale()

const rules = reactive({
  couponType: [{ required: true, type: 'number', message: '优惠券类型必填', trigger: 'change' }],
  couponName: [{ required: true, type: 'string', message: '优惠券名称必须填写', trigger: 'blur' }],
  issueCount: [{ required: true, type: 'number', message: '发行数量必须填写', trigger: 'blur' }],
})

const loading = reactive({
  init: false,
  button: false,
})

const pageTitle = $t('coupon.add')

const couponFormRef = ref()

const editorRef = ref()

const createCouponForm = (): CreateCouponParams => {
  return {
    couponName: '',
    couponType: 1,
    couponValue: 0,
    couponRuleType: 1,
    couponRuleValue: 0,
    customerRetentionCycle: 0,
    issueCount: 0,
    startedTime: '',
    endedTime: '',
    couponDescription: '',
  }
}

const couponForm = reactive<CreateCouponParams>(createCouponForm())

const closeViewTag = () => {}

const tagsViewStore = useTagsViewStore()

const deleteTagView = (refresh: boolean) => {
  if (refresh) {
    tagsViewStore.delCachedView()
  }
  tagsViewStore.delVisitedView(router.currentRoute.value)
  router.push({ name: 'CouponList' })
}

const save = async () => {
  couponForm.couponDescription = editorRef.value.getEditorContent()
  const valid = await couponFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
  })
  if (!valid) {
    return false
  }

  await createCouponApi(couponForm).catch(err => {
    throw err
  })
  ElMessage({
    message: '保存成功',
    type: 'success',
    duration: 2000,
  })

  deleteTagView(true)
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
      <ElForm ref="couponFormRef" :model="couponForm" :rules="rules" label-width="120px">
        <ElFormItem label="优惠券类型" prop="couponType" class="w-full">
          <ElSelect v-model="couponForm.couponType" class="flex-1">
            <ElOption v-for="item in couponTypes" :key="item.id" :value="item.id" :label="item.label" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="优惠券名称" prop="couponName">
          <ElInput
            v-model="couponForm.couponName"
            minlength="1"
            maxlength="120"
            placeholder="优惠券名称，少于120个字符"
          />
        </ElFormItem>
        <ElFormItem v-if="couponForm.couponType !== 3" label="发行规则" required class="w-full">
          <div>
            <ElFormItem label="规则类型" prop="couponRuleType" class="w-full">
              <ElSelect v-model="couponForm.couponRuleType" class="flex-1" style="width: 200px">
                <ElOption v-for="item in couponRuleTypes" :key="item.id" :value="item.id" :label="item.label" />
              </ElSelect>
            </ElFormItem>
          </div>
          <div>
            <ElFormItem label="优惠券金额" prop="couponRuleValue" class="w-full">
              <span class="mr-2">满</span>
              <ElInputNumber v-model="couponForm.couponRuleValue" class="mr-2" :min="1" :max="99999" :step="1" />
              <span class="mr-2">减</span>
              <div v-if="couponForm.couponType === 1">
                <ElInputNumber v-model="couponForm.couponValue" :min="0.01" :max="100" :step="0.01" class="mr-2" /><span>%</span>
              </div>
              <div v-if="couponForm.couponType === 2">
                <ElInputNumber v-model="couponForm.couponValue" :min="0.01" :max="999999.99" :step="0.01" class="mr-2" />
              </div>
            </ElFormItem>
          </div>
          <div class="mt-5">
            <ElFormItem
              v-if="couponForm.couponRuleType === 2"
              label="留存用户周期"
              prop="customerRetentionCycle"
              class="w-full"
            >
              <ElInputNumber v-model="couponForm.customerRetentionCycle" class="mr-2" :min="1" :max="365" :step="1" />
              <span>(天，最大录入值为365天)</span>
            </ElFormItem>
          </div>
        </ElFormItem>
        <ElFormItem label="发行数量" prop="issueCount" class="w-full">
          <ElInputNumber v-model="couponForm.issueCount" :min="1" :max="99999" :step="1" />
        </ElFormItem>
        <ElFormItem label="开始时间" prop="startedTime" class="w-full">
          <ElDatePicker v-model="couponForm.startedTime" type="datetime" placeholder="请选择开始时间" />
        </ElFormItem>
        <ElFormItem label="结束时间" prop="endedTime" class="w-full">
          <ElDatePicker v-model="couponForm.endedTime" type="datetime" placeholder="请选择结束时间" />
        </ElFormItem>
        <ElFormItem label="内容" prop="couponDescription">
          <Editor ref="editorRef" v-model="couponForm.couponDescription" :height="300" />
        </ElFormItem>
      </ElForm>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
