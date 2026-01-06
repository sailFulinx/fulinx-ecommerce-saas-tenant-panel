<script setup name="ProductDetail" lang="ts">
import type { FormRules } from 'element-plus'

const emit = defineEmits(['getList'])
const { t: $t } = useLocale()

const dialogVisible = ref(false)

const loading = reactive({
  init: false,
  country: false,
  state: false,
  city: false,
  warehouses: false,
})

const countryList = ref<(RegionCountryListData & CommonField)[]>([])

const countryPayload = reactive<RegionCountryListParams>({
  id: null,
  countryName: null,
  iso2: null,
})

const getCountryList = async () => {
  loading.country = true
  const { data } = await regionCountryListApi(countryPayload).catch(error => {
    loading.country = false
    throw error
  })
  countryList.value = data.list
  loading.country = false
}

const stateList = ref<(RegionStateListData & CommonField)[]>([])

const statePayload = reactive<RegionStateListParams>({
  id: null,
  countryId: null,
  stateName: null,
})

const getStateList = async () => {
  loading.state = true
  const { data } = await regionStateListApi(statePayload).catch(error => {
    loading.state = false
    throw error
  })
  stateList.value = data.list
  loading.state = false
}

const cityList = ref<(RegionCityListData & CommonField)[]>([])

const cityPayload = reactive<RegionCityListParams>({
  id: null,
  countryId: null,
  stateId: null,
  cityName: null,
})

const getCityList = async () => {
  loading.city = true
  const { data } = await regionCityListApi(cityPayload).catch(error => {
    loading.city = false
    throw error
  })
  cityList.value = data.list
  loading.city = false
}

const init = async () => {
  await Promise.all([getCountryList(), getStateList(), getCityList()])
}

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
  await init()
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
          clearable
          :placeholder="`${$t('warehouse.placeholder.warehouseName')}`"
        />
      </ElFormItem>
      <ElFormItem :label="$t('warehouse.firstName')" prop="firstName">
        <ElInput
          v-model="form.firstName"
          class="input-line"
          type="text"
          clearable
          :placeholder="`${$t('warehouse.placeholder.firstName')}`"
        />
      </ElFormItem>

      <ElFormItem :label="$t('warehouse.lastName')" prop="lastName">
        <ElInput
          v-model="form.lastName"
          class="input-line"
          type="text"
          clearable
          :placeholder="`${$t('warehouse.placeholder.lastName')}`"
        />
      </ElFormItem>

      <ElFormItem :label="$t('warehouse.telephone')" prop="telephone">
        <ElInput
          v-model="form.telephone"
          class="input-line"
          type="text"
          clearable
          :placeholder="`${$t('warehouse.placeholder.telephone')}`"
        />
      </ElFormItem>

      <ElFormItem :label="$t('warehouse.regionCountry')" prop="regionCountry">
        <ElSelect v-model="form.regionCountryId" clearable filterable :placeholder="$t('warehouse.placeholder.regionCountry')">
          <ElOption v-for="item in countryList" :key="item.id" :value="item.id" :label="item.countryName" />
        </ElSelect>
      </ElFormItem>

      <ElFormItem :label="$t('warehouse.regionState')" prop="regionState">
        <ElSelect v-model="form.regionStateId" clearable filterable :placeholder="$t('warehouse.placeholder.regionState')">
          <ElOption v-for="item in stateList" :key="item.id" :value="item.id" :label="item.stateName" />
        </ElSelect>
      </ElFormItem>

      <ElFormItem :label="$t('warehouse.regionCity')" prop="regionCity">
        <ElSelect v-model="form.regionCityId" clearable filterable :placeholder="$t('warehouse.placeholder.regionCity')">
          <ElOption v-for="item in cityList" :key="item.id" :value="item.id" :label="item.cityName" />
        </ElSelect>
      </ElFormItem>

      <ElFormItem :label="$t('warehouse.address1')" prop="address1">
        <ElInput
          v-model="form.address1"
          class="input-line"
          type="text"
          clearable
          :placeholder="`${$t('warehouse.placeholder.address1')}`"
        />
      </ElFormItem>

      <ElFormItem :label="$t('warehouse.address2')" prop="address2">
        <ElInput
          v-model="form.address2"
          class="input-line"
          type="text"
          clearable
          :placeholder="`${$t('warehouse.placeholder.address2')}`"
        />
      </ElFormItem>

      <ElFormItem :label="$t('warehouse.postcode')" prop="postcode">
        <ElInput
          v-model="form.postcode"
          class="input-line"
          type="text"
          clearable
          :placeholder="`${$t('warehouse.placeholder.postcode')}`"
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
