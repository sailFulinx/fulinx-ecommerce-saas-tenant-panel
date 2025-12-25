<script setup name="ProductDetail" lang="ts">
import type { FormRules } from 'element-plus'

const emit = defineEmits(['getList'])
const { t: $t } = useLocale()

const preferenceStore = usePreferenceStore()
// 修复：使用 getPreferences() 方法确保 preference 被正确初始化
const preference = preferenceStore.getPreferences()
const preferenceLanguage = computed(() => preference?.language)

const dialogVisible = ref(false)

const loading = reactive({
  init: false,
  categories: false,
})

const form = reactive<CategoryCreateParams>({
  languageId: preferenceLanguage.value?.id || '',
  categoryType: 1,
  categoryName: '',
  parentId: '0',
  parentIds: [],
})

const cascaderProps = {
  value: 'id',
  checkStrictly: true,
  label: 'categoryName',
  children: 'children',
  disabled: 'disabled',
}

// Category
const categoriesData = ref<CategoryListRes>({
  list: [],
  total: 0,
})

const getCategoriesData = async () => {
  loading.categories = true
  const { data } = await categoryListApi({ languageId: form.languageId }).catch(error => {
    loading.categories = false
    throw error
  })
  const newCategories: any[] = []
  if (data.list.length) {
    newCategories[0] = {
      id: '0',
      categoryName: '一级栏目',
      children: data.list,
    }
  } else {
    newCategories[0] = {
      id: '0',
      categoryName: '一级栏目',
    }
  }
  categoriesData.value.list = newCategories
  loading.categories = false
}

const handleChangeCategory = () => {}

const cascaderDisabled = ref<boolean>(false)

const resetForm = () => {
  form.parentIds = []
  form.parentId = '0'
  form.categoryName = ''
  form.languageId = preferenceLanguage.value?.id || ''
}

const openDialog = async (val?: CategoryData) => {
  form.categoryName = val?.categoryName || ''
  cascaderDisabled.value = false
  resetForm()
  dialogVisible.value = true
  if (val?.parentIds?.length) {
    form.languageId = val.languageId
    cascaderDisabled.value = true
    form.parentIds = [...val.parentIds, val.id] as string[]
  }
  await getCategoriesData()
}

const createCategory = async (categoryName: string) => {
  loading.init = true
  const payload = $clone(form)
  payload.categoryName = categoryName
  // delete payload.parentIds
  await categoryCreateApi(payload).catch(error => {
    loading.init = false
    throw error
  })
}

const formRef = useTemplateRef('formRef')

const onSave = () => {
  $catch(async () => {
    form.parentId = form.parentIds!.at(-1) || '0'
    const valid = await formRef.value!.validate()
    if (!valid) {
      return false
    }

    // 解析多行输入的分类名称
    const categoryNames = form.categoryName.split('\n').filter(name => name.trim() !== '')

    // 批量创建分类
    const promises = categoryNames.map(name => createCategory(name.trim()))
    await Promise.all(promises)

    ElMessage.success($t('success.create'))
    loading.init = false
    emit('getList')
    dialogVisible.value = false
  })
}

const rules: FormRules = {
  parentIds: [{ required: true, type: 'array', message: '请选择选择上级分类', trigger: 'change' }],
  categoryName: [{ required: true, message: '请输入至少一个分类名称', trigger: 'blur' }],
}

defineExpose({
  openDialog,
})
</script>

<template>
  <ElDrawer v-model="dialogVisible" :title="$t('category.create')" size="50%">
    <ElForm ref="formRef" :model="form" :rules="rules" label-width="120px">
      <ElFormItem :label="$t('category.parentId')" prop="parentIds">
        <div v-loading="loading.categories">
          <ElCascader
            v-model="form.parentIds"
            :props="cascaderProps"
            :options="categoriesData.list"
            :show-all-levels="false"
            :disabled="cascaderDisabled"
            @change="handleChangeCategory"
          />
        </div>
      </ElFormItem>

      <ElFormItem :label="$t('category.categoryName')" prop="categoryName">
        <ElInput
          v-model="form.categoryName"
          class="input-line"
          type="textarea"
          :rows="6"
          clearable
          :placeholder="`${$t('category.placeholder.categoryName')}（每行一个分类名称）`"
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
