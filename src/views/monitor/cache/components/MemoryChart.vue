<template>
  <div ref="memoryRef" class="w-full h-100"></div>
</template>

<script lang="ts">
  import { defineComponent, onMounted } from 'vue';
  import { ref, watch } from 'vue';
  import { useECharts } from '@/hooks/web/useECharts';
  import { propTypes } from '@/utils/propTypes';
  import type { EChartsOption } from 'echarts';

  export default defineComponent({
    name: 'MemoryChart',
    props: {
      data: propTypes.string.def('0'),
    },
    setup(props) {
      const memoryRef = ref<HTMLDivElement>();

      const { setOptions } = useECharts(memoryRef as any);

      watch(
        () => props.data,
        () => {
          if (!memoryRef.value) return;
          setEchartsOption(props.data);
        },
        { immediate: true },
      );

      onMounted(() => {
        setEchartsOption(props.data);
      });

      function setEchartsOption(value: string) {
        const options: EChartsOption = {
          tooltip: {
            formatter: '{b} <br/>{a} : ' + value,
          },
          series: [
            {
              name: '峰值',
              type: 'gauge',
              min: 0,
              max: 1000,
              detail: {
                formatter: value,
              },
              data: [
                {
                  value: parseFloat(value),
                  name: '内存消耗',
                },
              ],
            },
          ],
        };
        setOptions(options);
      }

      return {
        memoryRef,
      };
    },
  });
</script>

<style scoped></style>
