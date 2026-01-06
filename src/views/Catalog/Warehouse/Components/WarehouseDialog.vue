<script setup name="ProductDetail" lang="ts">
import type { FormRules } from 'element-plus'

const emit = defineEmits(['getList'])
const { t: $t } = useLocale()

const dialogVisible = ref(false)

const dialogTitle = ref($t('warehouse.add'))

const isEdit = ref(false)

const warehouseId = ref('')

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

// const cityList = ref<(RegionCityListData & CommonField)[]>([])

// const cityPayload = reactive<RegionCityListParams>({
//   id: null,
//   countryId: null,
//   stateId: null,
//   cityName: null,
// })

// const getCityList = async () => {
//   loading.city = true
//   const { data } = await regionCityListApi(cityPayload).catch(error => {
//     loading.city = false
//     throw error
//   })
//   cityList.value = data.list
//   loading.city = false
// }

const handleChangeCountry = async (val: string) => {
  statePayload.countryId = val
  await getStateList()
}

const createForm = () =>
  reactive<WarehouseReqParams>({
    warehouseId: null,
    warehouseName: '',
    firstName: '',
    lastName: '',
    regionCountryId: '',
    regionStateId: '',
    regionCityName: '',
    address1: '',
    address2: '',
    telephone: '',
    postcode: '',
  })

let form = reactive(createForm())

const resetForm = () => {
  form = createForm()
}

const openDialog = async (val?: WarehouseData & CommonField) => {
  dialogVisible.value = true
  loading.init = true
  countryPayload.countryName = null
  countryPayload.id = null
  isEdit.value = false
  await getCountryList()
  warehouseId.value = ''
  if (!val) {
    resetForm()
  } else {
    form = Object.assign(form, val)
    isEdit.value = true
    warehouseId.value = val.id
    statePayload.countryId = val.regionCountryId
    await getStateList()
    dialogTitle.value = $t('warehouse.edit')
  }
  loading.init = false
}

const saveWarehouse = async () => {
  loading.init = true
  const payload = $clone(form)
  if (isEdit.value) {
    payload.warehouseId = warehouseId.value
    await editWarehouseApi(payload).catch(error => {
      loading.init = false
      throw error
    })
    return
  }
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
    await saveWarehouse()
    ElMessage.success($t('success.create'))
    loading.init = false
    emit('getList')
    dialogVisible.value = false
  })
}

const rules: FormRules = {
  warehouseName: [{ required: true, message: '请输入仓库名称', trigger: 'blur' }],
  firstName: [{ required: true, message: $t('common.placeholder.firstName'), trigger: 'blur' }],
  lastName: [{ required: true, message: $t('common.placeholder.lastName'), trigger: 'blur' }],
  telephone: [{ required: true, message: $t('common.placeholder.telephone'), trigger: 'blur' }],
  regionCountryId: [{ required: true, message: $t('common.placeholder.regionCountry'), trigger: 'change' }],
  regionStateId: [{ required: true, message: $t('common.placeholder.regionState'), trigger: 'change' }],
  regionCityName: [{ required: true, message: $t('common.placeholder.regionCity'), trigger: 'change' }],
  address1: [{ required: true, message: $t('common.placeholder.address1'), trigger: 'blur' }],
  postcode: [{ required: true, message: $t('common.placeholder.postcode'), trigger: 'blur' }],
}

defineExpose({
  openDialog,
})
</script>

<template>
  <ElDrawer v-model="dialogVisible" :loading="loading.init" :title="dialogTitle" size="50%">
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
      <ElFormItem :label="$t('common.firstName')" prop="firstName">
        <ElInput
          v-model="form.firstName"
          class="input-line"
          type="text"
          clearable
          :placeholder="`${$t('common.placeholder.firstName')}`"
        />
      </ElFormItem>

      <ElFormItem :label="$t('common.lastName')" prop="lastName">
        <ElInput
          v-model="form.lastName"
          class="input-line"
          type="text"
          clearable
          :placeholder="`${$t('common.placeholder.lastName')}`"
        />
      </ElFormItem>

      <ElFormItem :label="$t('common.telephone')" prop="telephone">
        <ElInput
          v-model="form.telephone"
          class="input-line"
          type="text"
          clearable
          :placeholder="`${$t('common.placeholder.telephone')}`"
        />
      </ElFormItem>

      <ElFormItem :label="$t('common.regionCountry')" prop="regionCountryId">
        <ElSelect
          v-model="form.regionCountryId"
          clearable
          filterable
          :placeholder="$t('common.placeholder.regionCountry')"
          @change="handleChangeCountry"
        >
          <ElOption v-for="item in countryList" :key="item.id" :value="item.id" :label="item.countryName" />
        </ElSelect>
      </ElFormItem>

      <ElFormItem :label="$t('common.regionState')" prop="regionStateId">
        <ElSelect v-model="form.regionStateId" clearable filterable :placeholder="$t('common.placeholder.regionState')">
          <ElOption v-for="item in stateList" :key="item.id" :value="item.id" :label="item.stateName" />
        </ElSelect>
      </ElFormItem>

      <ElFormItem :label="$t('common.regionCity')" prop="regionCityName">
        <!-- <ElSelect v-model="form.regionCityId" clearable filterable :placeholder="$t('common.placeholder.regionCity')">
          <ElOption v-for="item in cityList" :key="item.id" :value="item.id" :label="item.cityName" />
        </ElSelect> -->
        <ElInput
          v-model="form.regionCityName"
          class="input-line"
          type="text"
          clearable
          :placeholder="`${$t('common.placeholder.regionCity')}`"
        />
      </ElFormItem>

      <ElFormItem :label="$t('common.address1')" prop="address1">
        <ElInput
          v-model="form.address1"
          class="input-line"
          type="text"
          clearable
          :placeholder="`${$t('common.placeholder.address1')}`"
        />
      </ElFormItem>

      <ElFormItem :label="$t('common.address2')" prop="address2">
        <ElInput
          v-model="form.address2"
          class="input-line"
          type="text"
          clearable
          :placeholder="`${$t('common.placeholder.address2')}`"
        />
      </ElFormItem>

      <ElFormItem :label="$t('common.postcode')" prop="postcode">
        <ElInput
          v-model="form.postcode"
          class="input-line"
          type="text"
          clearable
          :placeholder="`${$t('common.placeholder.postcode')}`"
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
