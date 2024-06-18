<template>
  <BasicModal v-bind="$attrs" title="查看日志详情" :width="700" @register="registerInnerModal">
    <Description @register="registerDescription" />
    <template #footer>
      <a-button @click="closeModal">关闭窗口</a-button>
    </template>
  </BasicModal>
</template>

<script setup lang="ts">
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { Description, useDescription } from '/@/components/Description/index';
  import { OperLog } from '/@/api/monitor/operlog';
  import { descSchema } from './operlog.data';

  defineOptions({ name: 'InfoModal' });

  const [registerInnerModal, { closeModal }] = useModalInner((data: OperLog) => {
    setDescProps({ data });
  });

  const [registerDescription, { setDescProps }] = useDescription({
    column: 1,
    schema: descSchema,
  });
</script>

<style scoped></style>
