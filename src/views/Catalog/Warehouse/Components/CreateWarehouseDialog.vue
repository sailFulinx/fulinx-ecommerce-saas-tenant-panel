<script setup name="ProductDetail" lang="ts">
import type { FormRules } from 'element-plus'

const emit = defineEmits(['getList'])
const { t: $t } = useLocale()

const dialogVisible = ref(false)

const loading = reactive({
  init: false,
  warehouses: false,
})

const form = reactive<CreateWarehouseParams>({
  warehouseName: '',
  firstName: '',
  lastName: '',
  regionCountryId: '',
  regionCountryName: '',
  regionStateId: '',
  regionStateName: '',
  regionCityId: '',
  regionCityName: '',
  address1: '',
  address2: '',
  telephone: '',
  postcode: '',
  warehouseType: 0,
  sort: 0,
})

const resetForm = () => {
  form.warehouseName = ''
}

const openDialog = async (val?: WarehouseData) => {
  form.warehouseName = val?.warehouseName || ''
  resetForm()
  dialogVisible.value = true
}

const createWarehouse = async () => {
  loading.init = true
  const payload = $clone(form)
  // delete payload.parentIds
  await createWarehouseApi(payload).catch(error => {
    loading.init = false
    throw error
  })
}

const formRef = useTemplateRef('formRef')

const onSave = () => {
  $catch(async () => {
    const valid = await formRef.value!.validate()
    if (!valid) {
      return false
    }

    createWarehouse()

    ElMessage.success($t('success.create'))
    loading.init = false
    emit('getList')
    dialogVisible.value = false
  })
}

const rules: FormRules = {
  warehouseName: [{ required: true, message: '请输入至少一个属性名称', trigger: 'blur' }],
}

defineExpose({
  openDialog,
})
</script>

<template>
  <ElDrawer v-model="dialogVisible" :title="$t('warehouse.add')" size="50%">
    <ElForm ref="formRef" :model="form" :rules="rules" label-width="120px">
      <ElFormItem :label="$t('warehouse.warehouseName')" prop="warehouseName">
        <ElInput
          v-model="form.warehouseName"
          class="input-line"
          type="text"
          :rows="6"
          clearable
          :placeholder="`${$t('warehouse.placeholder.warehouseName')}`"
        />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <div class="dialog-footer">
        <ElButton @click="dialogVisible = false">
          取消
        </ElButton>
        <ElButton type="primary" :loading="loading.init" @click="onSave">
          提交
        </ElButton>
      </div>
    </template>
  </ElDrawer>
</template>
