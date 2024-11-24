<script setup lang="ts">
// 引用 Preference 组件实例
const preferenceDialogRef = ref()

// 打开偏好设置对话框
const handleOpenPreference = async () => {
  await nextTick()
  preferenceDialogRef.value?.openDialog()
}
</script>

<template>
  <div class="flex items-center justify-between w-full">
    <div class="flex items-center">
      <Collapse class="hover-trigger" />
      <!-- <Breadcrumb /> -->
    </div>
    <div class="flex items-center">
      <!-- <LocaleDropdown class="hover-trigger" color="var(--top-header-text-color)" /> -->
      <div class="mr-2 fs-14px">
        <span><a href="https://doc.cms.fulinx.com" target="_blank">{{ $t('common.document') }}</a></span>
      </div>
      <div class="mr-2 flex items-center fs-14px">
        <EBtn type="primary" text @click="handleOpenPreference">
          <Icon
            icon="ep:setting"
            class="mx-2 hover-trigger cursor-pointer"
            :size="5"
          />
          {{ $t('common.Preference') }}
        </EBtn>
      </div>
      <UserInfo class="hover-trigger" />
    </div>
    <Preference ref="preferenceDialogRef" />
  </div>
</template>
