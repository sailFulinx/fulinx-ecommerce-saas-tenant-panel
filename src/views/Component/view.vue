<script setup lang="ts">
import type { DefineComponent } from 'vue'

interface ModuleType {
  default: DefineComponent
}
const modules = import.meta.glob<ModuleType>('@/components/Element/*.vue', { eager: true })

console.log(modules)
</script>

<template>
  <div class="view-page">
    <div class="view-main">
      <div grid grid-cols-2 gap-5>
        <div v-for="(item, index) in modules" :key="index" card>
          {{ item.default.__name }}
          <Component :is="item.default" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
