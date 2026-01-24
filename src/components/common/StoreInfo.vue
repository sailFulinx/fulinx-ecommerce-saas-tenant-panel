<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useTenantStore } from '@/stores/tenant'

const tenantStore = useTenantStore()
const { tenantStoreList, currentTenantStoreId, getDefaultStore } = storeToRefs(tenantStore)

// 切换店铺
const switchStore = (storeId: string) => {
  tenantStore.setDefaultStoreId(storeId)
  // 可以在这里添加一些切换店铺后的处理逻辑，例如重新加载数据
  console.log(`切换到店铺: ${storeId}`)
}
</script>

<template>
  <div class="flex items-center cursor-pointer">
    <ElDropdown trigger="click">
      <div v-if="tenantStoreList && tenantStoreList.length > 0">
        <div class="flex items-center text-13px">
          <Icon name="material-symbols:store" :size="6" color="#409EFF" class="mr-1" />
          <span class="mr-1">{{ getDefaultStore?.storeName || tenantStoreList[0].storeName }}</span>
          <Icon name="ep:arrow-down" :size="4" />
        </div>
      </div>
      <template #dropdown>
        <ElDropdownMenu>
          <ElDropdownItem @click="$router.push('/store/create')">
            <div>
              {{ $t('store.create') }}
            </div>
          </ElDropdownItem>
          <ElDropdownItem
            v-for="item in tenantStoreList"
            :key="item.id"
            :divided="true"
            :class="{ 'bg-blue-100': item.id === currentTenantStoreId }"
            @click="switchStore(item.id)"
          >
            <div class="flex items-center justify-between">
              <span>{{ item.storeName }}</span>
              <span v-if="item.id === currentTenantStoreId" class="text-blue-500">
                <Icon name="ep:check" :size="4" />
              </span>
            </div>
          </ElDropdownItem>
        </ElDropdownMenu>
      </template>
    </ElDropdown>
  </div>
</template>
