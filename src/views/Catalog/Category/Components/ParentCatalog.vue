<script setup lang="ts">
import type { FormRules } from 'element-plus'

const emit = defineEmits(['initFormData'])

const { t: $t } = useLocale()

const id = useRoute().params.id as string

const dialogVisible = ref(false)

const loading = reactive({
  init: false,
  categories: false,
})

const rules: FormRules = {
  parentIds: [{ required: true, type: 'array', message: '请选择选择上级分类', trigger: 'change' }],
}

const formRef = useTemplateRef('formRef')

interface ParentForm {
  parentId: string
  parentIds: string[]
  languageId: string
}
const form = reactive<ParentForm>({
  parentId: '0',
  parentIds: [],
  languageId: '',
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

// Disable all children
const disableAllChildren = (children: CategoryData[]) => {
  if (!children.length) {
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
const disableCategoryById = (categories: CategoryData[], id: string) => {
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
  categoriesData.value.list = disableCategoryById(newCategories, id)
  loading.categories = false
}

const cascaderDisabled = ref(false)

const resetForm = (languageId: string) => {
  form.parentId = ''
  form.parentIds = []
  form.languageId = languageId
}

const openDialog = async (val: CategoryShowData, languageId: string) => {
  cascaderDisabled.value = false
  resetForm(languageId)
  dialogVisible.value = true
  if (val?.parentIds?.length) {
    form.parentIds = [...val.parentIds]
  }
  await getCategoriesData()
}

const onSave = async () => {
  $catch(async () => {
    form.parentId = form.parentIds!.at(-1) as string

    const valid = await formRef.value!.validate()
    if (!valid) {
      return false
    }

    const payload = {
      categoryId: id,
      parentId: form.parentId,
      languageId: form.languageId,
    }
    await categoryParentEditApi(payload).catch(error => {
      throw error
    })
    ElMessage.success($t('success.edit'))
    emit('initFormData')
    dialogVisible.value = false
  })
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
        <EBtn type="primary" @click="onSave">
          提交
        </EBtn>
      </div>
    </template>
  </ElDialog>
</template>
