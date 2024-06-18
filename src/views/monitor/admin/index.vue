<template>
  <IFrame :frameSrc="url" />
</template>

<script setup lang="ts">
  import IFrame from '@/layouts/components/iframe/index.vue';
  import { useGlobSetting } from '/@/hooks/setting';
  import { computed } from 'vue';

  defineOptions({ name: 'Admin' });

  const globSetting = useGlobSetting();
  const url = computed<string>(() => {
    const { apiUrl, adminMonitorUrl = '' } = globSetting;
    const defaultUrl = `${apiUrl}/admin/applications`;
    if (adminMonitorUrl.startsWith('http')) {
      return adminMonitorUrl;
    }
    return defaultUrl;
  });
</script>

<style scoped></style>
