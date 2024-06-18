<template>
  <BasicModal
    v-bind="$attrs"
    title="代码预览(鼠标滑动切换)"
    okText="复制代码"
    :width="1000"
    @register="registerInnerModal"
    @cancel="handleReset"
    @ok="handleCopy"
  >
    <Tabs v-model:activeKey="activeKey">
      <TabPane v-for="item in Object.keys(codeData)" :key="item" :tab="formatTabName(item)">
        <CodeEditor v-model:value="codeData[item]" readonly />
      </TabPane>
    </Tabs>
  </BasicModal>
</template>

<script setup lang="ts">
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { preview } from '/@/api/tool/gen';
  import { Tabs, TabPane } from 'ant-design-vue';
  import { CodeEditor } from '/@/components/CodeEditor';
  import { ref } from 'vue';
  import { copyText } from '/@/utils/copyTextToClipboard';

  defineOptions({ name: 'PreViewModal' });

  function formatTabName(name: string) {
    const pattern = /\/([^/]+)\.vm$/;
    const matchResult = name.match(pattern);

    if (matchResult) {
      const extractedString = matchResult[1];
      return extractedString;
    }
    return name;
  }

  const activeKey = ref('');
  const codeData = ref<any[]>([]);
  const [registerInnerModal, { changeLoading }] = useModalInner(async (tableId: string) => {
    try {
      changeLoading(true);
      const ret = await preview(tableId);
      codeData.value = ret;
      activeKey.value = Object.keys(ret)[0];
    } catch (e) {
    } finally {
      changeLoading(false);
    }
  });

  function handleReset() {
    codeData.value = [];
  }

  function handleCopy() {
    if (!activeKey.value) {
      return;
    }
    const data = codeData.value[activeKey.value];
    copyText(data, '复制成功.');
  }
</script>

<style lang="less" scoped></style>
