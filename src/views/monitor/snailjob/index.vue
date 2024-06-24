<template>
  <IFrame :frameSrc="url" />
</template>

<script setup lang="ts">
  import IFrame from '@/layouts/components/iframe/index.vue';
  import { useGlobSetting } from '/@/hooks/setting';
  import { computed } from 'vue';

  defineOptions({ name: 'SnailJob' });

  const globSetting = useGlobSetting();
  const url = computed<string>(() => {
    const { apiUrl, snailjobUrl = '' } = globSetting;
    const defaultUrl = `${apiUrl}/snail-job`;
    if (snailjobUrl.startsWith('http')) {
      return snailjobUrl;
    }
    return defaultUrl;
  });

</script>

<style scoped></style>
