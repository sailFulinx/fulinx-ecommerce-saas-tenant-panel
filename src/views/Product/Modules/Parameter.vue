<script setup lang="ts">
import { parameterGroupListApi, parameterListApi } from '@/api/parameter'
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

// const selectedParameterGroup = ref('')

// // 参数值
// const listParameterValueQuery = reactive<ParameterParameterValueListParams & Pagination>({
//   languageId: usePreferenceStore().preference?.language.id,
//   parameterId: id,
//   pageSize: 20,
//   pageNumber: 1,
// })

// const getParameterValueList = async () => {
//   loading.list = true
//   const { data } = await parameterValueListApi(listParameterValueQuery).catch(err => {
//     loading.list = false
//     throw err
//   })
//   loading.list = false
//   return data.total > 0 ? data.list : []
// }

const selectedParameter = ref<(ParameterListData & CommonField) | null>()

const selectedParameterList = ref<(ParameterListData & CommonField)[]>([])

// 用于提交的数据
const productParameterData = ref<UpdateProductParameterParams>({
  productId: id,
  productParameterRelationRequestDos: [],
  deletedProductParameterRelationIds: [],
  languageId: usePreferenceStore().preference?.language.id,
  // parameterGroupId: formData.value.parameterGroupId,
})

const addParameter = () => {
  if (!selectedParameter.value || selectedParameter.value === null) {
    ElMessage({
      type: 'warning',
      message: '请选择参数',
    })
    return
  }
  // 如果已经存在,不重复添加
  if (selectedParameterList.value.find(item => item.id === selectedParameter.value?.id)) {
    ElMessage({
      type: 'warning',
      message: '已存在该参数',
    })
    return
  }
  const parameterData = {
    parameterId: selectedParameter.value.id,
    parameterName: selectedParameter.value.parameterName,
    parameterType: selectedParameter.value.parameterType,
    parameterValues: selectedParameter.value.parameterValueListResultDos,
  }
  productParameterData.value.productParameterRelationRequestDos.push(parameterData)
}

const removeParameter = (index: number) => {
  if (
    productParameterData.value.productParameterRelationRequestDos[index]
    && productParameterData.value.productParameterRelationRequestDos[index].productParameterRelationId
  ) {
    productParameterData.value.deletedProductParameterRelationIds.push(
      productParameterData.value.productParameterRelationRequestDos[index].productParameterRelationId,
    )
  }
  productParameterData.value.productParameterRelationRequestDos.splice(index, 1)
}

const listParameterResult = ref<TableResponse<ParameterListData & CommonField>>({
  list: [],
  total: 0,
})

const listParameterQuery = reactive<ParameterListParams>({
  languageId: usePreferenceStore().preference?.language.id,
})

const getParameterList = async () => {
  loading.parameter = true
  const { data } = await parameterListApi(listParameterQuery).catch(err => {
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
      await getParameterList()
      formData.value = JSON.parse(JSON.stringify(form))
      productParameterData.value.productParameterRelationRequestDos = []
      // selectedParameterGroup.value = formData.value.parameterGroupId
      if (
        formData.value.productParameterRelationListResultDos
        && formData.value.productParameterRelationListResultDos.length > 0
      ) {
        formData.value.productParameterRelationListResultDos.map(async item => {
          const parameterItemData: ProductParameterRequestDo = {
            productParameterRelationId: item.id,
            parameterId: item.parameterId,
            parameterName: item.parameterName,
            parameterType: item.parameterType,
            parameterValueId: item.parameterValueId,
            parameterValueContent: item.parameterValueContent,
            parameterValues: [],
          }
          console.log(listParameterResult.value)
          if (item.parameterType === 1) {
            // 查找参数值列表
            listParameterResult.value.list.map(vItem => {
              if (vItem.id === item.parameterId) {
                parameterItemData.parameterValues = vItem.parameterValueListResultDos
              }
            })
          }
          productParameterData.value.productParameterRelationRequestDos.push(parameterItemData)
        })
      }
    }
  },
  { deep: true, immediate: true },
)

// const listParameterGroupResult = ref<TableResponse<ParameterGroupListData & CommonField>>({
//   list: [],
//   total: 0,
// })

// const listParameterGroupQuery = reactive<ParameterGroupListParams>({
//   languageId: usePreferenceStore().preference?.language.id,
//   parameterGroupName: '',
// })

// const getParameterGroupList = async () => {
//   loading.parameterGroup = true
//   if (listParameterGroupQuery.parameterGroupName === '') {
//     listParameterGroupQuery.parameterGroupName = null
//   }
//   const { data } = await parameterGroupListApi(listParameterGroupQuery).catch(err => {
//     loading.parameterGroup = false
//     throw err
//   })
//   listParameterGroupResult.value = data
//   loading.parameterGroup = false
// }

// getParameterGroupList()

// const handleParameterGroupChange = async (val: string) => {
//   // 如果val的值不等于 formData.value.parameterGroupId，则重新获取参数列表，且把原来的数据全部清空
//   if (val !== formData.value.parameterGroupId) {
//     // 重新组合用于提交的数据，把原来的参数数据全部放到deletedProductParameterIds中
//     if (productParameterData.value.productParameterRelationRequestDos.length > 0) {
//       productParameterData.value.deletedProductParameterRelationIds
//         = productParameterData.value.productParameterRelationRequestDos.map(item => item.productParameterRelationId)
//     }
//     productParameterData.value.productParameterRelationRequestDos = []
//     productParameterData.value.parameterGroupId = val
//     listParameterQuery.parameterGroupId = val
//     await getParameterList()
//   }
// }

const handleSave = async () => {
  loading.init = true
  // productParameterData.value.parameterGroupId = selectedParameterGroup.value
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
          <!-- <ElSelect
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
          </ElSelect> -->
          <ElSelect
            v-model="selectedParameter"
            value-key="id"
            filterable
            clearable
            placeholder="请选择参数"
            style="width: 200px"
            class="mr-3"
          >
            <ElOption
              v-for="item in listParameterResult.list"
              :key="item.id"
              :label="item.parameterName"
              :value="item"
            />
          </ElSelect>

          <EBtn size="small" type="primary" @click="addParameter">
            <Icon icon="ant-design:plus-outlined" class="mr-1" />
            {{ $t('common.add') }}
          </EBtn>
          <EBtn size="default" type="primary" plain @click="handleSave">
            <Icon icon="ant-design:save-outlined" class="mr-1" />
            {{ $t('common.save') }}
          </EBtn>
        </div>
      </div>
    </template>
    <div class="w-full mt-5">
      <ElForm label-width="100px">
        <div
          v-if="
            productParameterData.productParameterRelationRequestDos
              && productParameterData.productParameterRelationRequestDos.length > 0
          "
        >
          <div v-for="(item, index) in productParameterData.productParameterRelationRequestDos" :key="index">
            <ElFormItem v-if="item.parameterType === 2" :label="item.parameterName">
              <ElInput v-model="item.parameterValueContent" style="width: 200px; margin-right: 10px" />
              <EBtn plain type="danger" @click="removeParameter(index)">
                <Icon icon="ant-design:delete-outlined" />
              </EBtn>
            </ElFormItem>
            <ElFormItem v-if="item.parameterType === 1" :label="item.parameterName">
              <ElSelect
                v-model="item.parameterValueId"
                value-key="id"
                filterable
                clearable
                style="width: 200px; margin-right: 10px"
              >
                <ElOption
                  v-for="vItem in item.parameterValues"
                  :key="vItem.id"
                  :label="vItem.parameterValueContent"
                  :value="vItem.id"
                />
              </ElSelect>
              <EBtn plain type="danger" @click="removeParameter(index)">
                <Icon icon="ant-design:delete-outlined" />
              </EBtn>
            </ElFormItem>
          </div>
        </div>
      </ElForm>
    </div>
  </ElCard>
</template>
