<script setup lang="ts">
const isDark = useDark()
const toggleDark = useToggle(isDark)

// useHead({
//   meta: [
//     {
//       id: 'theme-color',
//       name: 'theme-color',
//       content: () => (isDark.value ? '#222222' : '#ffffff'),
//     },
//   ],
// })
</script>

<template>
  <button icon-btn title="Switch theme mode" role="button" @click="toggleDark()">
    <div class="i-carbon-sun dark:i-carbon-moon" />
  </button>
</template>
