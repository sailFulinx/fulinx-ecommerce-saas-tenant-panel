<script setup name="UserDetail" lang="ts">
import { createUserApi, editUserApi, editUserPasswordApi } from '@/api/user'
import { useLocale } from '@/hooks/useLocale'
import { ElMessage } from 'element-plus'
import { debounce } from 'lodash'
import Base from './Base.vue'
import Password from './Password.vue'

const props = defineProps({
  id: {
    type: Number,
    default: 0,
  },
  detail: {
    type: Object as () => UserDataType,
  },
  actionType: {
    type: String as () => 'none' | 'add' | 'edit',
    default: 'none',
  },
})
const emit = defineEmits(['getList', 'handleChangeVisible'])
const activeTab = ref('base')
const { t: $t } = useLocale()
const pageTitle = ref('')

const disabled = ref(false)

const form = reactive<UserRequestParams>({
  id: 0,
  username: '',
  userType: 1,
  password: '',
  roleIds: [],
  name: '',
  telephone: '',
  status: 0,
  post: '',
  gender: 0,
})

const loading = reactive({
  init: true,
  button: false,
})

const id = ref(0)
const actionType = ref('none')

watch(
  [() => props.id, () => props.detail, () => props.actionType],
  ([newPropId, newPropDetail, newPropActionType]) => {
    if (newPropId || newPropId === 0) {
      id.value = newPropId
    }
    if (newPropDetail) {
      Object.assign(form, newPropDetail)
    }
    if (newPropActionType) {
      actionType.value = newPropActionType
      if (actionType.value === 'add') {
        id.value = 0
        form.id = 0
        form.username = ''
        form.password = ''
        form.roleIds = []
        form.name = ''
        form.telephone = ''
        form.status = 1
        form.post = ''
        form.gender = null
      } else {
        disabled.value = false
      }
    }
    init()
  },
  { immediate: true },
)

function init() {
  loading.init = true
  if (actionType.value === 'add' && id.value === 0) {
    pageTitle.value = $t('common.create') + $t('user.name')
    disabled.value = true
  } else {
    if (id.value !== 0) {
      pageTitle.value = $t('common.edit') + $t('user.name')
    }
  }
  loading.init = false
}

init()

const baseFormRef = ref()
const passwordFormRef = ref()

// 保存
const save = debounce(async () => {
  await handleSubmit()
}, 600)

async function handleSubmit() {
  if (activeTab.value === 'base') {
    if (actionType.value === 'edit' && id.value) {
      await editUserBase()
    } else {
      await createUserBase()
    }
  }

  if (activeTab.value === 'password') {
    loading.button = true
    const postData = await passwordFormRef.value?.getFormData()
    if (postData) {
      postData.userId = id.value
      await editUserPasswordApi(postData).catch(err => {
        loading.button = false
        throw err
      })
      emit('getList')
      ElMessage({
        message: $t('success.edit'),
        type: 'success',
      })
    }
    loading.button = false
  }
  loading.button = false
}

/**
 * 修改
 */
async function editUserBase() {
  loading.button = true
  const postData = await baseFormRef.value?.getFormData()
  if (postData) {
    await editUserApi(id.value, postData).catch(err => {
      loading.button = false
      throw err
    })
    emit('getList')
    ElMessage({
      message: $t('success.edit'),
      type: 'success',
    })
  }
  loading.button = false
}

/**
 * 新增
 */
async function createUserBase() {
  loading.button = true
  const postData = await baseFormRef.value.getFormData()
  if (postData) {
    postData.password = '12345678'
    await createUserApi(postData).catch(err => {
      loading.button = false
      throw err
    })
    emit('getList')
    emit('handleChangeVisible')
    ElMessage({
      message: `${$t('success.create')}，初始密码为12345678`,
      type: 'success',
    })
  }
  loading.button = false
}

function handleChangeTab() {}

function handleChangeActiveTab(val: string) {
  activeTab.value = val
}

function handleCancel() {
  emit('handleChangeVisible')
}

defineExpose({
  handleChangeActiveTab,
})
</script>

<template>
  <div>
    <div class="view-header">
      <ElRow type="flex" justify="space-between" align="middle">
        <div>
          <h4>{{ pageTitle }}</h4>
        </div>
        <div>
          <EBtn
            class="filter-item"
            size="small"
            type="default"
            icon="Close"
            :loading="loading.button"
            @click="handleCancel"
          >
            {{ $t('common.cancel') }}
          </EBtn>
          <EBtn
            class="filter-item"
            size="small"
            type="primary"
            icon="DocumentAdd"
            :loading="loading.button"
            @click="save"
          >
            {{ $t('common.save') }}
          </EBtn>
        </div>
      </ElRow>
    </div>
    <div class="view-main">
      <ElTabs v-model="activeTab" class="demo-tabs" @tab-click="handleChangeTab">
        <ElTabPane :label="$t('user.tab.base')" name="base">
          <ElCard v-loading="loading.init" shadow="never">
            <ElRow type="flex" justify="center">
              <ElCol>
                <Base ref="baseFormRef" :form-data="form" />
              </ElCol>
            </ElRow>
          </ElCard>
        </ElTabPane>

        <ElTabPane :label="$t('user.tab.password')" name="password">
          <ElCard v-loading="loading.init" shadow="never">
            <ElRow type="flex" justify="center">
              <ElCol>
                <Password ref="passwordFormRef" />
              </ElCol>
            </ElRow>
          </ElCard>
        </ElTabPane>
      </ElTabs>
    </div>
  </div>
</template>
