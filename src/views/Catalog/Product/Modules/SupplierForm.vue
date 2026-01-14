<script setup lang="ts">
const { loading: supplierLoading, listData: supplierListData, promise: supplierPromise } = useSupplierList()

const loading = reactive({
  init: false,
})

onMounted(async () => {
  // 设置初始化加载状态
  loading.init = true
  try {
    // 并行等待所有数据加载完成
    await Promise.all([supplierPromise])
  } catch (error) {
    console.error('加载数据失败:', error)
  } finally {
    loading.init = false
  }
})
// supplier
const suppliers = ref<ProductSupplierRequestDo[]>([])

const currentSupplier = ref<ProductSupplierRequestDo>({
  supplierUrl: '',
  supplierData: undefined,
})

const supplierInputVisible = ref(false)

const handleCreateSupplier = () => {
  supplierInputVisible.value = true
}

const handleAddSupplier = () => {
  supplierInputVisible.value = true
}

const handleAddSupplierCancel = () => {
  supplierInputVisible.value = false
}

const handleEditSupplier = (index: number) => {
  currentSupplier.value = suppliers.value[index]
  supplierInputVisible.value = true
}

const handleDeleteSupplier = (index: number) => {
  suppliers.value.splice(index, 1)
}

const handleAddSupplierConfirm = () => {
  suppliers.value.push(currentSupplier.value)
  console.log(suppliers.value)
  supplierInputVisible.value = false
  currentSupplier.value = {
    supplierUrl: '',
    supplierData: undefined,
  }
}

const setData = (data: ProductSupplierRequestDo[]) => {
  suppliers.value = data
}

const getData = () => {
  return suppliers.value
}

defineExpose({
  setData,
  getData,
})
</script>

<template>
  <div class="w-full" :class="supplierInputVisible ? 'mb-4' : ''">
    <EBtn plain type="primary" @click="handleAddSupplier">
      {{ $t('common.add') }}{{ $t('product.supplier') }}
    </EBtn>
  </div>
  <div
    v-for="(item, index) in suppliers"
    :key="index"
    class="w-full"
    :class="suppliers.length > 0 ? 'bg-[#F6F7FD] mt-4 border border-gray-200 pa-4 ' : ''"
  >
    <div class="w-full py-2 border-b border-gray-200 flex items-center justify-between">
      <div>
        <span class="text-gray-500 mr-2">{{ item.supplierData?.supplierName || '' }},</span>
        <span class="text-gray-500">{{ item.supplierUrl }}</span>
      </div>
      <div>
        <EBtn plain type="default" @click="handleEditSupplier(index)">
          {{ $t('common.edit') }}
        </EBtn>
        <EBtn plain type="danger" @click="handleDeleteSupplier(index)">
          {{ $t('common.delete') }}
        </EBtn>
      </div>
    </div>
  </div>
  <div v-if="supplierInputVisible" class="mt-4 bg-[#F6F7FD] w-full border border-gray-200">
    <div class="flex justify-between items-center border-b border-gray-200 px-4 py-2">
      <div>选择供应商</div>
      <div class="flex justify-between items-center cursor-pointer" @click="handleCreateSupplier">
        <Icon name="mynaui:plus" class="mr-1" />
        新增供应商
      </div>
    </div>
    <div class="w-full flex items-center justify-between mb-4 p-4">
      <div class="w-[200px] mr-2">
        <ElSelect
          v-model="currentSupplier.supplierData"
          v-loading="supplierLoading"
          clearable
          filterable
          value-key="id"
          :placeholder="`${$t('product.placeholder.supplier')}`"
        >
          <ElOption
            v-for="item in supplierListData?.list || []"
            :key="item.id"
            :value="item"
            :label="item.supplierName"
          />
        </ElSelect>
      </div>
      <div class="flex-1">
        <ElInput
          v-model="currentSupplier.supplierUrl"
          clearable
          minlength="1"
          maxlength="120"
          :placeholder="$t('product.placeholder.supplierUrl')"
        />
      </div>
    </div>
    <div class="w-full flex  p-4">
      <EBtn plain type="default" @click="handleAddSupplierCancel">
        {{ $t('common.cancel') }}
      </EBtn>
      <EBtn plain type="primary" @click="handleAddSupplierConfirm">
        {{ $t('common.save') }}
      </EBtn>
    </div>
  </div>
</template>
