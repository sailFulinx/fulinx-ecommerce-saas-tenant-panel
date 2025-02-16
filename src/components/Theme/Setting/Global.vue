<script setup lang="ts">
import { componentListApi } from '@/api/comp'
import { layoutListApi } from '@/api/layout'
import { he } from 'element-plus/es/locale'

const props = defineProps({
  componentData: {
    type: Object as () => ThemeSettingGlobal,
  },
})

const loading = reactive({
  comp: true,
  layout: false,
})
const listComponentPayload = reactive<CompListParams>({
  componentName: null,
})

const listComponentData = ref<TableResponse<CompData & CommonField>>({
  list: [],
  total: 0,
})

const getComponentList = async () => {
  loading.comp = true
  const { data } = await componentListApi(listComponentPayload).catch(error => {
    loading.comp = false
    throw error
  })
  listComponentData.value = data
  loading.comp = false
}

getComponentList()

// 布局
const listLayoutPayload = reactive<LayoutListParams>({
  layoutName: null,
})

const listLayoutData = ref<TableResponse<LayoutData & CommonField>>({
  list: [],
  total: 0,
})

const getLayoutList = async () => {
  loading.layout = true
  if (listLayoutPayload.layoutName === '') {
    listLayoutPayload.layoutName = null
  }
  if (listLayoutPayload.layoutName && listLayoutPayload.layoutName?.length <= 1) {
    loading.layout = false
    return
  }
  const { data } = await layoutListApi(listLayoutPayload).catch(error => {
    loading.layout = false
    throw error
  })
  listLayoutData.value = data
  loading.layout = false
}

getLayoutList()

const formRef = ref()

const rules = reactive({
  defaultHeaderComponentId: [{ required: true, message: '默认头部组件必须选择', trigger: 'change' }],
  defaultFooterComponentId: [{ required: true, message: '默认尾部组件必须选择', trigger: 'change' }],
  homePageLayoutId: [{ required: true, message: '默认首页布局必须选择', trigger: 'change' }],
  supplierPageLayoutId: [{ required: true, message: '默认供应商布局必须选择', trigger: 'change' }],
  helpPageLayoutId: [{ required: true, message: '默认帮助页布局必须选择', trigger: 'change' }],
})

const form = ref<ThemeSettingGlobal>({
  defaultHeaderComponentId: null,
  defaultFooterComponentId: null,
  homePageLayoutId: null,
  supplierPageLayoutId: null,
  helpPageLayoutId: null,
})

const getFormData = async () => {
  const valid = await formRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
  })
  if (!valid) {
    return false
  }
  return form.value
}
const setFormData = async (valData: ThemeSettingGlobal) => {
  Object.assign(form.value, valData)
}

watch(
  () => props.componentData,
  val => {
    if (val) {
      setFormData(val)
    }
  },
  { immediate: true },
)

defineExpose({ getFormData, setFormData })
</script>

<template>
  <div>
    <ElForm ref="formRef" :model="form" :rules="rules" label-width="140px">
      <ElFormItem label="默认头部组件" prop="defaultHeaderComponentId">
        <ElSelect v-model="form.defaultHeaderComponentId" clearable filterable placeholder="请选择">
          <ElOption v-for="item in listComponentData.list" :key="item.id" :value="item.id" :label="item.componentName" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="默认尾部组件" prop="defaultFooterComponentId">
        <ElSelect v-model="form.defaultFooterComponentId" clearable filterable placeholder="请选择">
          <ElOption v-for="item in listComponentData.list" :key="item.id" :value="item.id" :label="item.componentName" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="默认首页布局" prop="homePageLayoutId">
        <ElSelect
          v-model="form.homePageLayoutId"
          clearable
          filterable
          :placeholder="$t('theme.placeholder.homePageLayoutId')"
        >
          <ElOption
            v-for="item in listLayoutData.list"
            :key="item.id"
            :label="item.layoutName"
            :value="item.id"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="默认供应商布局" prop="supplierPageLayoutId">
        <ElSelect
          v-model="form.supplierPageLayoutId"
          clearable
          filterable
          :placeholder="$t('theme.placeholder.supplierPageLayoutId')"
        >
          <ElOption
            v-for="item in listLayoutData.list"
            :key="item.id"
            :label="item.layoutName"
            :value="item.id"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="默认帮助页布局" prop="helpPageLayoutId">
        <ElSelect
          v-model="form.helpPageLayoutId"
          clearable
          filterable
          :placeholder="$t('theme.placeholder.helpPageLayoutId')"
        >
          <ElOption
            v-for="item in listLayoutData.list"
            :key="item.id"
            :label="item.layoutName"
            :value="item.id"
          />
        </ElSelect>
      </ElFormItem>
    </ElForm>
  </div>
</template>
