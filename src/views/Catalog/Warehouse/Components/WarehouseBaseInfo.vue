<script setup lang="ts">
import { warehouseKey } from '../type/injectionKeys'

const { currentItem, languageId } = defineProps<{
  currentItem: WarehouseAdminLocalizedViewDo
  warehouseAdminLocalizedViewDos: WarehouseAdminLocalizedViewDo[]
  languageId: string
}>()

const { loading, id: warehouseId, resetFormData } = inject(warehouseKey)!

const { t: $t } = useLocale()

const currentData = ref<WarehouseAdminLocalizedViewDo>(currentItem)

// 本地状态
const inputWarehouseNameVisible = ref(false)
const currentWarehouseName = ref('')

// 更新名称
const handleClickUpdateWarehouseName = (warehouseName: string) => {
  currentWarehouseName.value = warehouseName
  inputWarehouseNameVisible.value = true
}

const handleCancelUpdateWarehouseName = () => {
  inputWarehouseNameVisible.value = false
}

const editWarehouseName = async (warehouseDetailId: string) => {
  if (!currentWarehouseName.value) {
    ElMessage.warning($t('warehouse.error.warehouseName'))
    return
  }
  loading.init = true
  const { data } = await updateWarehouseNameApi({
    warehouseDetailId,
    warehouseName: currentWarehouseName.value,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentWarehouseName.value = ''
  await resetFormData(data)
  inputWarehouseNameVisible.value = false
  ElMessage.success($t('success.edit'))
}
// 创建属性名称
const createWarehouseName = async () => {
  if (!currentWarehouseName.value) {
    ElMessage.warning($t('warehouse.error.warehouseName'))
    return
  }
  loading.init = true
  const { data } = await createWarehouseNameApi({
    warehouseId,
    languageId,
    warehouseName: currentWarehouseName.value,
  }).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  currentWarehouseName.value = ''
  await resetFormData(data)
  ElMessage.success($t('success.create'))
}
</script>

<template>
  <div v-if="currentData">
    <ElCard v-if="currentData.warehouseDetailListResultDo" shadow="never" class="mb-5">
      <div class="w-full mt-0 pt-0">
        <!-- 属性名称 -->
        <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
          <div class="col-span-1 font-semibold text-gray-700">
            {{ $t('warehouse.warehouseName') }}:
          </div>
          <div class="col-span-11 w-full flex items-center">
            <span v-if="!inputWarehouseNameVisible" class="mr-2">
              {{ currentData.warehouseDetailListResultDo.warehouseName }}
            </span>
            <span v-else>
              <ElInput
                v-model="currentWarehouseName"
                style="width: 300px"
                class="mr-2"
                @blur="editWarehouseName(currentData.warehouseDetailListResultDo!.id)"
              />
              <ElButton text @click="handleCancelUpdateWarehouseName">
                <Icon icon="ep:close" :size="5" class="mr-1" />
              </ElButton>
            </span>
            <ElButton
              v-if="!inputWarehouseNameVisible"
              type="primary"
              text
              @click="handleClickUpdateWarehouseName(currentData.warehouseDetailListResultDo.warehouseName)"
            >
              <Icon icon="ep:edit" :size="5" class="mr-1" />
            </ElButton>
          </div>
        </div>
      </div>
    </ElCard>
    <ElCard v-else>
      <div class="flex-col justify-center items-center mb-5">
        <div class="w-full mb-5">
          <ElAlert :title="$t('warehouse.warning.noDetailData')" type="warning" show-icon />
        </div>
      </div>
      <div class="pa-3 flex justify-center items-center mb-5">
        <ElInput v-model="currentWarehouseName" :placeholder="$t('warehouse.placeholder.warehouseName')" />
        <ElButton type="primary" class="ml-5" @click="createWarehouseName">
          <Icon icon="ant-design:save-outlined" :size="5" class="mr-1" />
          {{ $t('common.save') }}
        </ElButton>
      </div>
    </ElCard>
  </div>
</template>
