<script setup lang="ts">
import { parameterGroupListApi, parameterGroupParameterRelationListApi } from '@/api/parameter'
import { updateProductParameterApi } from '@/api/product'
import { useLocale } from '@/hooks/useLocale'
import { usePreferenceStore } from '@/stores/preference'
import { ElMessage, ElSwitch, ElTableColumn } from 'element-plus'

const { form } = defineProps<{ form: ShowProduct & CommonField }>()

const emit = defineEmits(['resetFormData'])

const { t: $t } = useLocale()

const loading = reactive({
  init: false,
  list: false,
  parameterGroup: false,
  parameter: false,
})

const id = useRoute().params.id as string

const formData = ref<ShowProduct & CommonField>(form)

const productParameterData = ref<UpdateProductParameterParams>({
  productId: id,
  productParameterRelationRequestDos: [],
  deletedProductParameterIds: [],
  languageId: usePreferenceStore().preference?.language.id,
  parameterGroupId: formData.value.parameterGroupId,
})

const selectedParameterGroup = ref('')

const inputParameterForm = ref<string[]>([])

const productParameterForm = ref<ProductParameterRelationRequest[]>([])

const formatInputParameterValue = (index: number, value: ParameterGroupParameterRelationData & CommonField) => {
  const parameterValueContent = inputParameterForm.value[index]
  const parameterValue: ProductParameterRelationRequest = {
    parameterGroupId: selectedParameterGroup.value,
    parameterId: value.parameterId,
    parameterValueContent,
    parameterValueId: '',
  }
  productParameterForm.value[index] = parameterValue
}

const listParameterQuery = reactive<ParameterGroupParameterRelationParams>({
  languageId: usePreferenceStore().preference?.language.id,
  parameterGroupId: '',
})

const listParameterResult = ref<TableResponse<ParameterGroupParameterRelationData & CommonField>>({
  list: [],
  total: 0,
})

const getParameterList = async () => {
  loading.parameter = true
  const { data } = await parameterGroupParameterRelationListApi(listParameterQuery).catch(err => {
    loading.parameter = false
    throw err
  })
  listParameterResult.value = data
  loading.parameterGroup = false
}

watch(
  () => form,
  async val => {
    if (val) {
      formData.value = JSON.parse(JSON.stringify(form))
      productParameterData.value.productParameterRelationRequestDos = []
      inputParameterForm.value = []
      productParameterForm.value = []
      selectedParameterGroup.value = formData.value.parameterGroupId
      listParameterQuery.parameterGroupId = formData.value.parameterGroupId
      if (listParameterQuery.parameterGroupId) {
        await getParameterList()
      }
      if (
        formData.value.productParameterRelationListResultDos
        && formData.value.productParameterRelationListResultDos.length > 0
      ) {
        formData.value.productParameterRelationListResultDos.map(item => {
          if (item.parameterType === 2) {
            inputParameterForm.value.push(item.parameterValueContent)
          }
          if (item.parameterType === 1) {
            productParameterForm.value.push(item)
          }
          // const parameterItemData = {
          //   parameterGroupId: item.parameterGroupId,
          //   productParameterRelationId: item.id,
          //   parameterId: item.parameterId,
          //   parameterName: item.parameterName,
          //   parameterType: item.parameterType,
          //   parameterValueId: item.parameterValueId,
          //   parameterValueContent: item.parameterValueContent,
          // }
          // productParameterData.value.productParameterRelationRequestDos.push(parameterItemData)
        })
      }
    }
  },
  { deep: true, immediate: true },
)

const listParameterGroupResult = ref<TableResponse<ParameterGroupListData & CommonField>>({
  list: [],
  total: 0,
})

const listParameterGroupQuery = reactive<ParameterGroupListParams>({
  languageId: usePreferenceStore().preference?.language.id,
  parameterGroupName: '',
})

const getParameterGroupList = async () => {
  loading.parameterGroup = true
  if (listParameterGroupQuery.parameterGroupName === '') {
    listParameterGroupQuery.parameterGroupName = null
  }
  const { data } = await parameterGroupListApi(listParameterGroupQuery).catch(err => {
    loading.parameterGroup = false
    throw err
  })
  listParameterGroupResult.value = data
  loading.parameterGroup = false
}

getParameterGroupList()

const handleParameterGroupChange = async (val: string) => {
  productParameterData.value.parameterGroupId = val
  listParameterQuery.parameterGroupId = val
  await getParameterList()
}

const handleSave = async () => {
  loading.init = true
  const { data } = await updateProductParameterApi(productParameterData.value).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  emit('resetFormData', data)
  ElMessage.success($t('success.edit'))
}
</script>

<template>
  <ElCard shadow="never" class="mb-5">
    <template #header>
      <div class="flex items-center justify-between">
        <div class="text-base font-bold">
          {{ $t('product.parameterInfo') }}
        </div>
        <div class="flex items-center justify-end">
          <ElSelect
            v-model="selectedParameterGroup"
            :placeholder="$t('product.placeholder.parameterGroup')"
            style="width: 200px"
            class="mr-3"
            @change="handleParameterGroupChange"
          >
            <ElOption
              v-for="item in listParameterGroupResult.list"
              :key="item.id"
              :label="item.parameterGroupName"
              :value="item.id"
            />
          </ElSelect>
          <EBtn size="default" type="primary" plain @click="handleSave">
            <Icon icon="ant-design:save-outlined" class="mr-1" />
            {{ $t('common.save') }}
          </EBtn>
        </div>
      </div>
    </template>
    <div class="w-full mt-5">
      <ElForm label-width="100px">
        <div v-if="listParameterResult && listParameterResult.list.length > 0">
          <div v-for="(item, index) in listParameterResult.list" :key="item.id">
            <ElFormItem v-if="item.parameterType === 2" :label="item.parameterName">
              <ElInput v-model="inputParameterForm[index]" @input="formatInputParameterValue(index, item)" />
            </ElFormItem>
            <ElFormItem v-if="item.parameterType === 1" :label="item.parameterName">
              <ElSelect v-model="productParameterForm[index]" value-key="id">
                <ElOption
                  v-for="vItem in item.parameterValueListResultDos"
                  :key="vItem.id"
                  :label="vItem.parameterValueContent"
                  :value="vItem"
                />
              </ElSelect>
            </ElFormItem>
          </div>
        </div>
      </ElForm>
    </div>
  </ElCard>
</template>
