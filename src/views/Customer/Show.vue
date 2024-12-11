<script setup name="CustomerDetail" lang="ts">
import type { InputInstance } from 'element-plus'
import { showCustomerApi } from '@/api/customer'
import { useLocale } from '@/hooks/useLocale'
import { ElAlert, ElCard, ElDivider, ElInput, ElMessage, ElSwitch, ElTable, ElTabPane } from 'element-plus'
import { debounce } from 'lodash-es'

const { t: $t } = useLocale()

const id = useRoute().params.id as string

const activeName = ref<string>('base')

const loading = reactive({
  init: false,
  categories: false,
})

// 创建customer请求参数
const createFormData = (): CustomerShowData & CommonField => {
  return {
    id: '',
    siteId: '',
    email: '',
    userName: '',
    telephone: '',
    password: '',
    salt: '',
    isEmailVerify: 0,
    status: 0,
    customerProfileVo: {
      id: '',
      customerId: '',
      avatarFileId: '',
      nickName: '',
      realName: '',
      birthday: '',
      telephone: '',
      gender: 0,
      companyName: '',
      companyAddressProvinceId: '',
      companyAddressProvinceShortName: '',
      companyAddressCityId: '',
      companyAddressCityShortName: '',
      companyAddressDistrictId: '',
      companyAddressDistrictShortName: '',
      companyAddress: '',
      companyPhoneNumber: '',
      bankName: '',
      bankNumber: '',
      taxNumber: '',
      isDelete: 0,
      remark: '',
      recordVersion: 0,
      recordCreateName: '',
      recordUpdateName: '',
      recordCreateTime: '',
      recordUpdateTime: '',
    },
    customerAddressListResultDos: [
      {
        id: '',
        fullName: '',
        telephone: '',
        customerId: '',
        administrativeProvinceId: '',
        administrativeProvinceShortName: '',
        administrativeProvinceFullName: '',
        administrativeCityId: '',
        administrativeCityShortName: '',
        administrativeCityFullName: '',
        administrativeDistrictId: '',
        administrativeDistrictShortName: '',
        administrativeDistrictFullName: '',
        address1: '',
        address2: '',
        postcode: '',
        isDefault: true,
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
const form = reactive<CustomerShowData>(createFormData())

// 获取文章数据
const getCustomerData = async () => {
  loading.init = true
  const { data } = await showCustomerApi(id).catch(error => {
    loading.init = false
    throw error
  })
  loading.init = false
  return data
}

const resetFormData = async (val: CustomerShowData) => {
  await nextTick(() => {
    Object.assign(form, JSON.parse(JSON.stringify(val)))
  })
}

const initFormData = async () => {
  const res = await getCustomerData()
  resetFormData(res)
}

initFormData()

const editCustomerStatus = async () => {}
</script>

<template>
  <div v-loading="loading.init" class="view-page">
    <div class="view-header">
      <div class="flex justify-between items-center">
        <div>
          <span>{{ $t('customer.show') }}</span>
        </div>
        <div>
          <div class="flex items-center">
            <div class="mr-2" />
            <div class="mr-2">
              <span class="text-sm mr-2">{{ $t('customer.status') }}：</span>
              <ElSwitch v-model="form.status" @change="editCustomerStatus" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!loading.init" class="view-main theme-card">
      <ElTabs v-model="activeName" class="demo-tabs">
        <ElTabPane :label="$t('customer.base')" name="base">
          <ElCard shadow="never" class="mb-5">
            <div class="w-full mt-0 pt-0">
              <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
                <div class="col-span-1 font-semibold text-gray-700">
                  {{ $t('customer.email') }}:
                </div>
                <div class="col-span-11 w-full flex items-center">
                  {{ form.email }}
                </div>
              </div>
            </div>
          </ElCard>
        </ElTabPane>
        <ElTabPane :label="$t('customer.profile')" name="profile">
          <ElCard shadow="never" class="mb-5">
            <div class="w-full mt-0 pt-0">
              <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
                <div class="col-span-1 font-semibold text-gray-700">
                  {{ $t('customer.nickName') }}:
                </div>
                <div class="col-span-11 w-full flex items-center">
                  {{ form.customerProfileVo.nickName }}
                </div>
              </div>
              <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
                <div class="col-span-1 font-semibold text-gray-700">
                  {{ $t('customer.nickName') }}:
                </div>
                <div class="col-span-11 w-full flex items-center">
                  {{ form.customerProfileVo.nickName }}
                </div>
              </div>
              <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
                <div class="col-span-1 font-semibold text-gray-700">
                  {{ $t('customer.realName') }}:
                </div>
                <div class="col-span-11 w-full flex items-center">
                  {{ form.customerProfileVo.realName }}
                </div>
              </div>
              <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
                <div class="col-span-1 font-semibold text-gray-700">
                  {{ $t('customer.birthday') }}:
                </div>
                <div class="col-span-11 w-full flex items-center">
                  {{ form.customerProfileVo.birthday }}
                </div>
              </div>
              <div class="w-full grid grid-cols-12 gap-8 p-4 ">
                <div class="col-span-1 font-semibold text-gray-700">
                  {{ $t('customer.telephone') }}:
                </div>
                <div class="col-span-11 w-full flex items-center">
                  {{ form.customerProfileVo.telephone }}
                </div>
              </div>
              <ElDivider class="my-5">
                公司资料
              </ElDivider>
              <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
                <div class="col-span-1 font-semibold text-gray-700">
                  {{ $t('customer.companyName') }}:
                </div>
                <div class="col-span-11 w-full flex items-center">
                  {{ form.customerProfileVo.companyName }}
                </div>
              </div>
              <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
                <div class="col-span-1 font-semibold text-gray-700">
                  {{ $t('customer.companyAddress') }}:
                </div>
                <div class="col-span-11 w-full flex items-center">
                  {{ form.customerProfileVo.companyAddressProvinceShortName }}{{ form.customerProfileVo.companyAddressCityShortName }}{{ form.customerProfileVo.companyAddressDistrictShortName }}{{ form.customerProfileVo.companyAddress }}
                </div>
              </div>
              <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
                <div class="col-span-1 font-semibold text-gray-700">
                  {{ $t('customer.companyPhoneNumber') }}:
                </div>
                <div class="col-span-11 w-full flex items-center">
                  {{ form.customerProfileVo.companyPhoneNumber }}
                </div>
              </div>
              <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
                <div class="col-span-1 font-semibold text-gray-700">
                  {{ $t('customer.bankName') }}:
                </div>
                <div class="col-span-11 w-full flex items-center">
                  {{ form.customerProfileVo.bankName }}
                </div>
              </div>
              <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
                <div class="col-span-1 font-semibold text-gray-700">
                  {{ $t('customer.bankNumber') }}:
                </div>
                <div class="col-span-11 w-full flex items-center">
                  {{ form.customerProfileVo.bankNumber }}
                </div>
              </div>
              <div class="w-full grid grid-cols-12 gap-8 p-4 border-b border-gray-200">
                <div class="col-span-1 font-semibold text-gray-700">
                  {{ $t('customer.taxNumber') }}:
                </div>
                <div class="col-span-11 w-full flex items-center">
                  {{ form.customerProfileVo.taxNumber }}
                </div>
              </div>
            </div>
          </ElCard>
        </ElTabPane>
        <ElTabPane :label="$t('customer.addresses')" name="addresses">
          <ElCard shadow="never">
            <div class="w-full mt-0 pt-0">
              <div v-for="item in form.customerAddressListResultDos" :key="item.id" class="w-full border-b border-gray-400 p-4">
                <div class="w-full flex items-center mb-3">
                  <span v-if="item.isDefault" class="bg-red-600 text-white mr-2 px-2 py-1 text-[14px]">默认</span> {{ item.fullName }}{{ item.telephone }}
                </div>
                <div class="w-full flex items-center">
                  {{ item.administrativeProvinceShortName }}{{ item.administrativeCityShortName }}{{ item.administrativeDistrictShortName }}{{ item.address1 }}{{ item.address2 }}{{ item.postcode }}
                </div>
              </div>
            </div>
          </ElCard>
        </ElTabPane>
      </ElTabs>
    </div>
  </div>
</template>
