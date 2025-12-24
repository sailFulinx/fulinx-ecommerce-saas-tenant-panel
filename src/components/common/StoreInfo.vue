<script setup lang="ts">
const tenantStore = useTenantStore()
const { tenantStoreList } = storeToRefs(tenantStore)
</script>

<template>
  <div class="flex items-center cursor-pointer">
    <ElDropdown trigger="click">
      <div v-if="tenantStoreList && tenantStoreList.length > 0">
        <div class="flex items-center text-13px">
          <Icon name="material-symbols:store" :size="6" color="#409EFF" class="mr-1" />
          <span class="mr-1">{{ tenantStoreList[0].storeName }}</span>
          <Icon name="ep:arrow-down" :size="4" />
        </div>
      </div>
      <template #dropdown>
        <ElDropdownMenu>
          <ElDropdownItem>
            <div>
              {{ $t('store.create') }}
            </div>
          </ElDropdownItem>
          <ElDropdownItem v-for="item in tenantStoreList" :key="item.id" divided>
            <div>
              {{ item.storeName }}
            </div>
          </ElDropdownItem>
        </ElDropdownMenu>
      </template>
    </ElDropdown>
  </div>
</template>
