d
<script setup lang="ts">
import { useTagsViewStore } from '@/stores/tagsView'
import { ElMessage } from 'element-plus'

import Base from './Modules/Base.vue'

import Email from './Modules/Email.vue'

const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false,
  },
})

const activeName = ref('base')

const loading = reactive({
  init: false,
  button: false,
})

const pageTitle = computed(() => (props.isEdit ? '编辑网站' : '添加网站'))

const baseRef = ref()

const emailRef = ref()

const save = async () => {
  if (activeName.value === 'base') {
    baseRef.value.save()
  }
  if (activeName.value === 'mail') {
    emailRef.value.save()
  }
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
      <ElRow type="flex" justify="space-between" align="middle">
        <div>
          <h4>{{ pageTitle }}</h4>
        </div>
        <div>
          <EBtn size="small" :loading="loading.button">
            取消
          </EBtn>
          <EBtn size="small" type="primary" icon="el-icon-document-add" :loading="loading.button" @click="save">
            保存
          </EBtn>
        </div>
      </ElRow>
    </div>
    <div class="view-main">
      <ElTabs v-model="activeName" class="demo-tabs">
        <ElTabPane label="基础设置" name="base">
          <Base ref="baseRef" :is-edit="props.isEdit" />
        </ElTabPane>
        <ElTabPane label="邮箱设置" name="mail">
          <Email ref="emailRef" :is-edit="props.isEdit" />
        </ElTabPane>
      </ElTabs>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
