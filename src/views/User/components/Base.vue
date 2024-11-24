<script setup name="UserBase" lang="ts">
import { fetchRolePaginationApi } from '@/api/role'
import { genders, statuses, userTypes } from '@/data/user'
import { useLocale } from '@/hooks/useLocale'

import { debounce } from 'lodash'

const props = defineProps({
  formData: {
    type: Object as () => UserRequestParams,
    default: null,
  },
})
const loading = ref(false)
let form = reactive<UserRequestParams>({
  id: 0,
  username: '',
  userType: null,
  roleIds: [],
  name: '',
  telephone: '',
  status: 1,
  post: '',
  gender: null,
})

watch(
  () => props.formData,
  val => {
    if (val) {
      form = val
    }
  },
  { immediate: true },
)
const { t: $t } = useLocale()

const rules = reactive({
  username: [{ required: true, type: 'string', message: $t('user.rules.username'), trigger: 'blur' }],
  roleIds: [{ required: true, type: 'array', message: $t('user.rules.roleIds'), trigger: 'blur' }],
  name: [{ required: false, type: 'string', message: $t('user.rules.name'), trigger: 'blur' }],
  telephone: [{ required: false, type: 'string', message: $t('user.rules.telephone'), trigger: 'blur' }],
  post: [{ required: false, type: 'string', message: $t('user.rules.post'), trigger: 'blur' }],
  gender: [{ required: false, type: 'number', message: $t('user.rules.gender'), trigger: 'blur' }],
  status: [{ required: true, type: 'number', message: $t('user.rules.status'), trigger: 'blur' }],
})

const formRef = ref()

// 列表
const listRoleData = ref<TableResponse<RoleDataType & CommonField>>({
  list: [],
  total: 0,
})
// 列表查询变量
const listRolePayload = reactive<RoleRequestQueryParameterType & Pagination>({
  isDelete: 0,
  pageNumber: 1,
  pageSize: 9999,
  roleName: null,
})
// 获取列表数据
const getList = debounce(async () => {
  if (listRolePayload.roleName === '') {
    listRolePayload.roleName = null
  }
  loading.value = true
  const { data } = await fetchRolePaginationApi(listRolePayload).catch(err => {
    loading.value = false
    throw err
  })
  listRoleData.value = { ...data }
  loading.value = false
}, 100)

async function init() {
  await Promise.all([getList()])
}
init()

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
    <ElFormItem :label="$t('user.userType')" prop="roleIds">
      <ElSelect v-model="form.userType" clearable filterable :placeholder="$t('user.placeholder.userType')">
        <ElOption v-for="item in userTypes" :key="item.value" :value="item.value" :label="item.label" />
      </ElSelect>
    </ElFormItem>
    <ElFormItem :label="$t('user.username')" prop="username">
      <ElInput
        v-model="form.username"
        class="input-line"
        clearable
        show-word-limit
        minlength="1"
        maxlength="120"
        :placeholder="$t('user.placeholder.username')"
      />
    </ElFormItem>
    <ElFormItem :label="$t('user.roleIds')" prop="roleIds">
      <ElSelect v-model="form.roleIds" multiple clearable filterable :placeholder="$t('user.placeholder.roleIds')">
        <ElOption v-for="item in listRoleData.list" :key="item.id" :value="item.id" :label="item.roleName" />
      </ElSelect>
    </ElFormItem>
    <ElFormItem :label="$t('user.names')" prop="name">
      <ElInput
        v-model="form.name"
        class="input-line"
        clearable
        show-word-limit
        minlength="1"
        maxlength="120"
        :placeholder="$t('user.placeholder.names')"
      />
    </ElFormItem>
    <ElFormItem :label="$t('user.telephone')" prop="telephone">
      <ElInput
        v-model="form.telephone"
        class="input-line"
        clearable
        show-word-limit
        minlength="1"
        maxlength="120"
        :placeholder="$t('user.placeholder.telephone')"
      />
    </ElFormItem>
    <ElFormItem :label="$t('user.post')" prop="post">
      <ElInput
        v-model="form.post"
        class="input-line"
        clearable
        show-word-limit
        minlength="1"
        maxlength="120"
        :placeholder="$t('user.placeholder.post')"
      />
    </ElFormItem>
    <ElFormItem :label="$t('user.gender')" prop="gender">
      <ElSelect v-model="form.gender" clearable filterable :placeholder="$t('user.placeholder.gender')">
        <ElOption v-for="item in genders" :key="item.value" :value="item.value" :label="item.label" />
      </ElSelect>
    </ElFormItem>
    <ElFormItem :label="$t('user.status')" prop="status">
      <ElSelect v-model="form.status" clearable filterable :placeholder="$t('user.placeholder.status')">
        <ElOption v-for="item in statuses" :key="item.value" :value="item.value" :label="item.label" />
      </ElSelect>
    </ElFormItem>
  </ElForm>
</template>
