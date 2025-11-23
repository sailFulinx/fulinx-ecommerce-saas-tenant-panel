<script setup lang="ts">
const tenantStore = useTenantStore()
const { tenantStoreList } = storeToRefs(tenantStore)
</script>

<template>
  <div>
    <ElDropdown trigger="click">
      <div v-if="tenantStoreList && tenantStoreList.length > 0" class="flex items-center cursor-pointer">
        <span class="text-13px">当前店铺: {{ tenantStoreList[0].storeName }}</span>
      </div>
      <template #dropdown>
        <ElDropdownMenu>
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
