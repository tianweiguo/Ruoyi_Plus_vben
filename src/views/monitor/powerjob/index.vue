<template>
  <IFrame :frameSrc="url" />
</template>

<script setup lang="ts">
  import IFrame from '@/layouts/components/iframe/index.vue';
  import { useGlobSetting } from '/@/hooks/setting';
  import { computed } from 'vue';

  defineOptions({ name: 'PowerJob' });

  const globSetting = useGlobSetting();
  const url = computed<string>(() => {
    const { apiUrl, powerjobUrl = '' } = globSetting;
    const defaultUrl = `${apiUrl}/xxljob`;
    if (powerjobUrl.startsWith('http')) {
      return powerjobUrl;
    }
    return defaultUrl;
  });
</script>

<style scoped></style>
