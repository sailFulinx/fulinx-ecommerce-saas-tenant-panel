<script setup lang="ts">
import { usePreferenceStore } from '@/stores/preference'
import { formatTime } from '@/utils'

const router = useRouter()

const listResult = ref<TableResponse<ProductListData & CommonField>>({
  list: [],
  total: 0,
})

const loading = reactive({
  list: false,
  del: false,
})
const listQuery = reactive<ProductListParams & Pagination>({
  languageId: usePreferenceStore().preference?.language.id,
  productName: '',
  pageSize: 20,
  pageNumber: 1,
})
const selectedList = ref<string[]>([])

const getList = async () => {
  loading.list = true
  if (listQuery.productName === '') {
    listQuery.productName = null
  }
  const { data } = await productPaginationApi(listQuery).catch(err => {
    loading.list = false
    throw err
  })
  listResult.value = data
  loading.list = false
}

// watch preference language
watch(
  () => usePreferenceStore().preference?.language,
  val => {
    if (val) {
      listQuery.languageId = val.id
      getList()
    }
  },
  { immediate: true },
)

const pagination = (val: PaginationComponentDataType) => {
  if (val) {
    listQuery.pageSize = val.limit
    listQuery.pageNumber = val.page
  }
  getList()
}

const selectedProductItem = (val: (ProductListData & CommonField)[]) => {
  selectedList.value = []
  val.forEach(item => {
    selectedList.value.push(item.id)
  })
}
const handleDelete = async (_row: ProductListData & CommonField) => {
  loading.list = true
  // await removeProductApi({ productIds: [row.id] }).catch(err => {
  //   loading.list = false
  //   throw err
  // })
  getList()
  ElMessage({
    message: '删除成功',
    type: 'success',
    duration: 2000,
  })
}
const handleMultiDelete = async () => {
  loading.list = true
  if (selectedList.value.length === 0) {
    ElMessage({
      message: '您没有选择哦',
      type: 'error',
      duration: 2000,
    })
    loading.list = false
    return
  }
  // await removeProductApi({ productIds: selectedList.value }).catch(err => {
  //   loading.list = false
  //   throw err
  // })
  loading.list = false
  getList()
  ElMessage({
    message: '删除成功',
    type: 'success',
    duration: 2000,
  })
}
const handleCreate = () => {
  router.push({ name: 'CreateProduct' })
}

const handleRedirectEdit = (val: ProductListData & CommonField) => {
  router.push({ name: 'ShowProduct', params: { id: val.id } })
}

const impDialogRef = ref()

// 导入
const handleImport = () => {
  impDialogRef.value.handleOpen()
}

// init()
</script>

<template>
  <div class="view-page">
    <div class="view-header">
      <div class="flex justify-between items-center">
        <div class="flex flex-1 items-center">
          <div class="mr-5">
            {{ $t('router.product') }}
          </div>
          <ElInput
            v-model="listQuery.productName"
            clearable
            :placeholder="$t('product.placeholder.productNameQuery')"
            style="width: 200px"
            class="filter-item mr-5"
            @clear="getList"
          />
          <ElInput
            v-model="listQuery.spu"
            clearable
            :placeholder="$t('product.placeholder.spuQuery')"
            style="width: 200px"
            class="filter-item mr-5"
            @clear="getList"
          />

          <EBtn size="default" class="filter-item" plain type="primary" @click="getList">
            <Icon icon="ep:search" class="mr-1" />
            {{ $t('common.search') }}
          </EBtn>
        </div>
        <div>
          <EBtn type="default" @click="handleImport">
            {{ $t('imp.name') }}
          </EBtn>
          <EBtn type="danger" @click="handleMultiDelete">
            <Icon icon="ep:delete" class="mr-1" />
            {{ $t('common.remove') }}
          </EBtn>
          <EBtn type="primary" @click="handleCreate">
            <Icon icon="ep:plus" class="mr-1" />
            {{ $t('common.add') }}
          </EBtn>
        </div>
      </div>
    </div>
    <div class="view-main">
      <ElTable
        v-loading="loading.list"
        :data="listResult.list"
        row-key="id"
        tooltip-effect="dark"
        default-expand-all
        highlight-current-row
        border
        @selection-change="selectedProductItem"
      >
        <ElTableColumn type="selection" width="55" />
        <ElTableColumn :label="$t('product.productImage')">
          <template #default="scope">
            <SImg
              v-if="scope.row.productMainImageUrl"
              :src="scope.row.productMainImageUrl"
              :alt="scope.row.productName"
              fit="cover"
              lazy
              width="120px"
              placeholder
            />
          </template>
        </ElTableColumn>
        <ElTableColumn :label="$t('product.spu')">
          <template #default="scope">
            <span>{{ scope.row.spu }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn :label="$t('product.productName')">
          <template #default="scope">
            <span>{{ scope.row.productName }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn :label="$t('product.productPrice')">
          <template #default="scope">
            <span>
              {{ scope.row.currencyListResultDo?.currencyCode || '' }}
              {{ scope.row.currencyListResultDo?.symbolLeft || ''
              }}{{ scope.row.minPrice ? scope.row.minPrice?.toFixed(2) : '' }} - {{ scope.row.maxPrice ? scope.row.maxPrice?.toFixed(2) : '' }}
            </span>
          </template>
        </ElTableColumn>
        <ElTableColumn :label="$t('product.salePrice')">
          <template #default="scope">
            <span>
              {{ scope.row.currencyListResultDo?.currencyCode || '' }}
              {{ scope.row.currencyListResultDo?.symbolLeft || ''
              }}{{ scope.row.minPromotionPrice ? scope.row.minPromotionPrice?.toFixed(2) : '' }} - {{ scope.row.maxPromotionPrice ? scope.row.maxPromotionPrice?.toFixed(2) : '' }}
            </span>
          </template>
        </ElTableColumn>
        <ElTableColumn :label="$t('product.recordCreateTime')">
          <template #default="scope">
            <span>{{ formatTime(scope.row.recordCreateTime) }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn label="操作" header-align="center" width="220" align="center" class-name="pl-15 fixed-width">
          <template #default="scope">
            <span class="mr-5">
              <EBtn size="small" @click="handleRedirectEdit(scope.row)">
                <Icon icon="ep:edit" class="mr-1" />
                {{ $t('common.view') }}
              </EBtn>
            </span>
            <span>
              <EBtn size="small" type="danger" :loading="loading.del" @click="handleDelete(scope.row)">
                <Icon icon="ep:delete" class="mr-1" />
                {{ $t('common.remove') }}
              </EBtn>
            </span>
          </template>
        </ElTableColumn>
      </ElTable>
      <Pagination
        v-show="listResult.total > 0"
        v-model:page="listQuery.pageNumber"
        v-model:limit="listQuery.pageSize"
        :total="listResult.total"
        @pagination="pagination"
      />
    </div>
    <ImpDialog ref="impDialogRef" import-type="product" />
  </div>
</template>
