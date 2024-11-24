<script setup name="ProductDetail" lang="ts">
import { createCategoryApi, listCategoryApi } from '@/api/category'
import { useLocale } from '@/hooks/useLocale'
import { usePreferenceStore } from '@/stores/preference'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['getList'])
const { t: $t } = useLocale()

const preferenceLanguage = ref<LanguageData>(usePreferenceStore().preference?.language)

const dialogVisible = ref(false)

const loading = reactive({
  init: false,
  categories: false,
})

let form = reactive<CategoryCreateRequestParams>({
  languageId: preferenceLanguage.value?.id,
  categoryName: '',
  parentId: 0,
})

// watch preference language
watch(
  () => usePreferenceStore().preference?.language,
  val => {
    if (val) {
      form.languageId = val.id
    }
  },
  { immediate: true },
)

const rules = reactive({
  parentId: [{ required: true, type: 'number', message: $t('category.rules.parentId'), trigger: 'change' }],
  categoryName: [{ required: true, type: 'string', message: $t('category.rules.categoryName'), trigger: 'blur' }],
})

const cascaderProps = {
  value: 'id',
  checkStrictly: true,
  label: 'categoryName',
  children: 'children',
  disabled: 'disabled',
}

// Category
const categoriesData = ref<ListCategoryRes>({
  list: [],
  total: 0,
})

const getCategoriesData = async () => {
  loading.categories = true
  const { data } = await listCategoryApi({ languageId: form.languageId }).catch(error => {
    loading.categories = false
    throw error
  })
  const newCategories: any[] = []
  if (data.list.length !== 0) {
    newCategories[0] = {
      id: 0,
      categoryName: '一级栏目',
      children: data.list,
    }
  } else {
    newCategories[0] = {
      id: 0,
      categoryName: '一级栏目',
    }
  }
  categoriesData.value.list = newCategories
  loading.categories = false
}

const handleChangeCategory = () => {}

const createCategory = async () => {
  loading.init = true
  form.languageId = usePreferenceStore().preference?.language.id
  await createCategoryApi(form).catch(error => {
    loading.init = false
    throw error
  })
  ElMessage.success($t('success.create'))
  loading.init = false
}

const formRef = ref()

const cascaderDisabled = ref<boolean>(false)

const resetForm = () =>
  reactive<CategoryCreateRequestParams>({
    languageId: preferenceLanguage.value?.id,
    categoryName: '',
    parentId: 0,
  })

const openDialog = async (val?: CategoryData & CommonField) => {
  cascaderDisabled.value = false
  form = resetForm()
  dialogVisible.value = true
  if (val && val.parentIds && val.parentIds?.length > 0) {
    form.languageId = val.languageId
    cascaderDisabled.value = true
    form.parentIds = [...val.parentIds, val.id]
  }
  await getCategoriesData()
}

const handleSave = async () => {
  form.parentId = form.parentIds?.at(-1) as number
  const valid = await formRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
  })
  if (!valid) {
    return false
  }
  await createCategory()
  emit('getList')
  dialogVisible.value = false
}

defineExpose({
  openDialog,
})
</script>

<template>
  <ElDrawer v-model="dialogVisible" :title="$t('category.create')" size="50%">
    <ElForm ref="formRef" :model="form" :rules="rules" label-width="120px">
      <ElFormItem :label="$t('category.parentId')" prop="parentId">
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
          clearable
          show-word-limit
          minlength="1"
          maxlength="120"
          :placeholder="$t('category.placeholder.categoryName')"
        />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <div class="dialog-footer">
        <EBtn @click="dialogVisible = false">
          取消
        </EBtn>
        <EBtn type="primary" @click="handleSave">
          提交
        </EBtn>
      </div>
    </template>
  </ElDrawer>
</template>
