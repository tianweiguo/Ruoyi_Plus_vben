<template>
  <PageWrapper title="缓存监控">
    <Row :gutter="[15, 15]">
      <Col :span="24">
        <CollapseContainer title="reids信息" :canExpan="false">
          <template #action>
            <a-button size="small" class="mr-2" :pre-icon="IconEnum.REFRESH" @click="load"
              >刷新</a-button
            >
          </template>
          <Description @register="registerDescription" />
        </CollapseContainer>
      </Col>
      <Col :sm="24" :xs="24" :md="24" :lg="12">
        <CollapseContainer title="命令统计" :canExpan="false">
          <CommandChart :data="chartData.command" />
        </CollapseContainer>
      </Col>
      <Col :sm="24" :xs="24" :md="24" :lg="12">
        <CollapseContainer title="内存信息" :canExpan="false">
          <MemoryChart :data="chartData.memory" />
        </CollapseContainer>
      </Col>
    </Row>
  </PageWrapper>
</template>

<script setup lang="ts">
  import { PageWrapper } from '@/components/Page';
  import { Description, useDescription } from '@/components/Description';
  import { onMounted, reactive } from 'vue';
  import { refisCacheInfo } from '@/api/monitor/cache';
  import { CollapseContainer } from '@/components/Container';
  import { descSchemas } from './cache.data';
  import { Row, Col } from 'ant-design-vue';
  import { IconEnum } from '@/enums/appEnum';
  import MemoryChart from './components/MemoryChart.vue';
  import CommandChart from './components/CommandChart.vue';
  import { useLoading } from '@/utils/components/loading';

  defineOptions({ name: 'Cache' });

  const chartData = reactive<{ memory: string; command: any[] }>({
    memory: '0',
    command: [],
  });

  onMounted(async () => {
    await load();
  });

  const [openLoading, closeLoading] = useLoading();
  async function load() {
    try {
      openLoading();
      const ret = await refisCacheInfo();

      chartData.memory = ret.info['used_memory_human'];
      chartData.command = ret.commandStats;

      setDescProps({ data: { ...ret.info, dbSize: ret.dbSize } });
    } catch (e) {
    } finally {
      closeLoading();
    }
  }

  const [registerDescription, { setDescProps }] = useDescription({
    column: { xs: 1, sm: 1, md: 3, lg: 4, xl: 4 },
    schema: descSchemas,
  });
</script>

<style scoped></style>
