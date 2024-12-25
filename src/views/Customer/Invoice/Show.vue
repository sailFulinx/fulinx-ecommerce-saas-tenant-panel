<script setup name="CustomerInvoiceDetail" lang="ts">
import type { InputInstance } from 'element-plus'
import { showCustomerInvoiceApi } from '@/api/customer'
import UploadMultiPdf from '@/components/Upload/UploadMultiPdf.vue'
import { getCustomerInvoiceTypeLabel } from '@/data/customerInvoice'
import { useLocale } from '@/hooks/useLocale'
import { ElAlert, ElCard, ElDivider, ElInput, ElMessage, ElSwitch, ElTable, ElTabPane } from 'element-plus'
import { debounce } from 'lodash-es'
import ApprovalDialog from './Modules/ApprovalDialog.vue'
import InvoiceUploadDialog from './Modules/InvoiceUploadDialog.vue'

const { t: $t } = useLocale()

const sourceUrl = import.meta.env.VITE_RESOURCE_URL

const id = useRoute().params.id as string

const loading = reactive({
  init: false,
  categories: false,
})

// 创建customerInvoice请求参数
const createFormData = (): CustomerInvoiceShowData & CommonField => {
  return {
    id: '',
    customerId: '',
    email: '',
    invoiceType: 0,
    invoiceNumber: '',
    invoiceAmount: 0,
    companyName: '',
    companyAddressProvinceId: '',
    companyAddressProvinceFullName: '',
    companyAddressProvinceShortName: '',
    companyAddressCityId: '',
    companyAddressCityFullName: '',
    companyAddressCityShortName: '',
    companyAddressDistrictId: '',
    companyAddressDistrictFullName: '',
    companyAddressDistrictShortName: '',
    companyAddress: '',
    companyPhoneNumber: '',
    bankName: '',
    bankNumber: '',
    taxNumber: '',
    status: 0,
    statusText: '',
    invoiceFileId: '',
    invoiceFileVo: {
      id: '',
      fileRemoteType: 0,
      bucket: '',
      originalPath: '',
      originalFileName: '',
      fileName: '',
      fileContentType: '',
      fileExtensionName: '',
      fileWidth: 0,
      fileHeight: 0,
      etag: '',
      bucketKey: '',
      fileUrl: '',
      sha256: '',
      isDelete: 0,
      remark: '',
      recordVersion: 0,
      recordCreateName: '',
      recordUpdateName: '',
      recordCreateTime: '',
      recordUpdateTime: '',
    },
    rejectedReason: '',
    reviewOperatorName: '',
    customerInvoiceOrderRelationListResultDos: [
      {
        id: '',
        customerInvoiceId: '',
        orderId: '',
        orderTotalAmount: 0,
        isDelete: 0,
        remark: '',
        recordVersion: 0,
        recordCreateName: '',
        recordUpdateName: '',
        recordCreateTime: '',
        recordUpdateTime: '',
      },
    ],
    isDelete: 0,
    remark: '',
    recordVersion: 0,
    recordCreateName: '',
    recordUpdateName: '',
    recordCreateTime: '',
    recordUpdateTime: '',
  }
}

// form初始化
const form = reactive<CustomerInvoiceShowData>(createFormData())

// 获取文章数据
const getCustomerInvoiceData = async () => {
  loading.init = true
  const { data } = await showCustomerInvoiceApi(id).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  return data
}

const resetFormData = async (val: CustomerInvoiceShowData) => {
  await nextTick(() => {
    Object.assign(form, JSON.parse(JSON.stringify(val)))
  })
}

const initFormData = async () => {
  const res = await getCustomerInvoiceData()
  resetFormData(res)
}

initFormData()

// 审核订单
const approvalDialogRef = ref()
const handleApproval = async () => {
  approvalDialogRef.value.open(id)
}

const invoiceUploadDialogRef = ref()

const handleUploadInvoice = () => {
  invoiceUploadDialogRef.value.open(id)
}
</script>

<template>
  <div v-loading="loading.init" class="view-page">
    <div class="view-header">
      <div class="flex justify-between items-center">
        <div>
          <span>{{ $t('invoice.show') }}</span>
        </div>
        <div>
          <div class="flex items-center">
            <div class="mr-2" />
            <div class="mr-2 flex items-center">
              <span class="text-sm mr-2">{{ $t('invoice.status') }}：</span>
              <span class="mr-2">{{ form.statusText }}</span>
              <span><EBtn size="small" type="danger" @click="handleApproval">审核</EBtn></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!loading.init" class="view-main theme-card">
      <div class="mb-5">
        <div class="w-full mb-5">
          <ElDescriptions class="margin-top" title="开票信息" :column="2" size="default" border>
            <ElDescriptionsItem>
              <template #label>
                <div class="cell-item">
                  发票类型
                </div>
              </template>
              {{ getCustomerInvoiceTypeLabel(form.invoiceType) }}
            </ElDescriptionsItem>
            <ElDescriptionsItem>
              <template #label>
                <div class="cell-item">
                  发票金额
                </div>
              </template>
              {{ form.invoiceAmount.toFixed(2) }}
            </ElDescriptionsItem>
            <ElDescriptionsItem v-if="form?.invoiceNumber">
              <template #label>
                <div class="cell-item">
                  发票号码
                </div>
              </template>
              {{ form?.invoiceNumber }}
            </ElDescriptionsItem>
            <ElDescriptionsItem>
              <template #label>
                <div class="cell-item">
                  公司名称
                </div>
              </template>
              {{ form.companyName }}
            </ElDescriptionsItem>
            <ElDescriptionsItem>
              <template #label>
                <div class="cell-item">
                  公司地址
                </div>
              </template>
              {{ form?.companyAddressProvinceShortName }}{{ form?.companyAddressCityShortName
              }}{{ form?.companyAddressDistrictShortName }}{{ form?.companyAddress }}
            </ElDescriptionsItem>
            <ElDescriptionsItem>
              <template #label>
                <div class="cell-item">
                  公司电话
                </div>
              </template>
              {{ form?.companyPhoneNumber }}
            </ElDescriptionsItem>
            <ElDescriptionsItem>
              <template #label>
                <div class="cell-item">
                  银行名称
                </div>
              </template>
              {{ form?.bankName }}
            </ElDescriptionsItem>
            <ElDescriptionsItem>
              <template #label>
                <div class="cell-item">
                  税务登记号
                </div>
              </template>
              {{ form?.taxNumber }}
            </ElDescriptionsItem>
            <ElDescriptionsItem>
              <template #label>
                <div class="cell-item">
                  发票下载
                </div>
              </template>
              <a :href="`${sourceUrl + form?.invoiceFileVo?.fileUrl}`" target="_blank" class="mr-2">
                <span class="text-blue-600 underline">{{ form?.invoiceFileVo?.originalFileName }}</span>
              </a>
              <EBtn size="small" type="primary" @click="handleUploadInvoice">
                上传
              </EBtn>
            </ElDescriptionsItem>
            <ElDescriptionsItem v-if="form?.rejectedReason">
              <template #label>
                <div class="cell-item">
                  拒绝原因
                </div>
              </template>
              {{ form?.rejectedReason }}
            </ElDescriptionsItem>
          </ElDescriptions>
        </div>
        <div class="w-full mb-5">
          <div class="text-[16px] font-bold border-b border-gray-200 p-3">
            订单列表
          </div>
          <div class="p-5">
            <ElTable :border="true" :data="form.customerInvoiceOrderRelationListResultDos" style="width: 100%">
              <ElTableColumn prop="orderId" label="订单ID">
                <template #default="scope">
                  <span class="text-blue-600 underline">{{ scope.row.orderId }}</span>
                </template>
              </ElTableColumn>

              <ElTableColumn prop="orderTotalAmount" label="订单金额">
                <template #default="scope">
                  {{ scope.row.orderTotalAmount.toFixed(2) }}
                </template>
              </ElTableColumn>
            </ElTable>
          </div>
        </div>
      </div>
    </div>
    <ApprovalDialog ref="approvalDialogRef" @get-order="initFormData" />
    <InvoiceUploadDialog ref="invoiceUploadDialogRef" @get-order="initFormData" />
  </div>
</template>
