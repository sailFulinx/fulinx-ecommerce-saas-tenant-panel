<script setup lang="ts">
import { editCategoryParentApi, listCategoryApi } from '@/api/category'
import { useLocale } from '@/hooks/useLocale'
import { usePreferenceStore } from '@/stores/preference'

const emit = defineEmits(['initFormData'])

const selectLanguage = ref<LanguageData>(usePreferenceStore().preference?.language)

const { t: $t } = useLocale()

const id = Number(useRoute().params.id as unknown)

const dialogVisible = ref<boolean>(false)

const loading = reactive({
  init: false,
  categories: false,
})

const rules = reactive({
  parentId: [{ required: true, type: 'number', message: $t('category.rules.parentId'), trigger: 'change' }],
})

const formRef = ref()

interface ParentForm {
  parentId: number
  parentIds: number[]
}
let form = reactive<ParentForm>({
  parentId: 0,
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
const categoriesData = ref<ListCategoryRes>({
  list: [],
  total: 0,
})

// Disable all children
const disableAllChildren = (children: CategoryData[]) => {
  if (!children || children.length === 0) {
    return
  }

  children.forEach(child => {
    child.disabled = true
    if (child.children) {
      disableAllChildren(child.children)
    }
  })
}

// Disable category by id
const disableCategoryById = (categories: CategoryData[], id: number) => {
  return categories.map(item => {
    if (item.id === id) {
      item.disabled = true
      // 如果当前节点的 id 匹配，设置所有子节点的 disabled 为 true
      if (item.children) {
        disableAllChildren(item.children)
      }
    }

    // 递归处理子节点
    if (item.children && item.children.length > 0) {
      disableCategoryById(item.children, id)
    }

    return item
  })
}

const getCategoriesData = async () => {
  loading.categories = true
  const { data } = await listCategoryApi({ languageId: selectLanguage.value.id }).catch(error => {
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
  categoriesData.value.list = disableCategoryById(newCategories, id)
  loading.categories = false
}

const cascaderDisabled = ref<boolean>(false)

const resetForm = () =>
  reactive({
    parentId: 0,
    parentIds: [],
  })

const openDialog = async (val: CategoryData & CommonField) => {
  cascaderDisabled.value = false
  form = resetForm()
  dialogVisible.value = true
  if (val && val.parentIds && val.parentIds?.length > 0) {
    form.parentIds = [...val.parentIds]
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
  const payload = {
    categoryId: id,
    parentId: form.parentId,
    languageId: usePreferenceStore().preference?.language?.id,
  }
  await editCategoryParentApi(payload).catch(error => {
    throw error
  })
  emit('initFormData')
  dialogVisible.value = false
}

defineExpose({
  openDialog,
})
</script>

<template>
  <ElDialog v-model="dialogVisible" title="提示">
    <ElForm ref="formRef" :model="form" :rules="rules" label-width="120px">
      <ElFormItem :label="$t('category.parentId')" prop="parentId">
        <div v-loading="loading.categories">
          <ElCascader
            v-model="form.parentIds"
            :props="cascaderProps"
            :options="categoriesData.list"
            :show-all-levels="false"
            :disabled="cascaderDisabled"
          />
        </div>
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
  </ElDialog>
</template>
