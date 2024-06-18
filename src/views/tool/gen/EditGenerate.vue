<template>
  <PageWrapper contentBackground dense content-class="p-5">
    <Row justify="center" class="items-center flex-col">
      <Col v-bind="{ xs: 24, sm: 24, md: 20, lg: 16, xl: 16 }">
        <div class="mt-5 ml-3 mr-3 p-2">
          <Steps :current="current">
            <Step title="生成信息" />
            <Step title="字段信息" disabled />
            <Step title="完成" disabled />
          </Steps>
        </div>
      </Col>
    </Row>
    <!-- content -->
    <div class="mt-5">
      <BaseSetting
        v-if="genInfoData && current === 0"
        v-model:value="genInfoData"
        @jumpto="handleJumpto"
      />
      <GenConfig
        v-if="genInfoData && current === 1"
        v-model:value="genInfoData"
        @jumpto="handleJumpto"
      />
      <GenResult
        v-if="genInfoData && current === 2"
        :success="result.success"
        :err-msg="result.errMsg"
        @jumpto="handleJumpto"
      />
    </div>
  </PageWrapper>
</template>

<script setup lang="ts">
  import { PageWrapper } from '/@/components/Page';
  import { ref, onMounted, unref, reactive } from 'vue';
  import BaseSetting from './components/BaseSetting.vue';
  import GenConfig from './components/GenConfig.vue';
  import GenResult from './components/GenResult.vue';
  import { useRouter } from 'vue-router';
  import { genInfo, editSave } from '/@/api/tool/gen';
  import { Info } from '/@/api/tool/gen/data';
  import { Steps, Step, Row, Col } from 'ant-design-vue';
  import { useTabs } from '/@/hooks/web/useTabs';

  const { currentRoute } = useRouter();

  const route = currentRoute.value;
  const tableId = route.params.tableId;
  const title = route.meta.title;

  const current = ref(0);
  const genInfoData = ref<Info>();

  const { setTitle } = useTabs();
  onMounted(async () => {
    const ret = await genInfo(tableId as string);
    genInfoData.value = ret.info;
    setTitle(title + ': ' + ret.info.tableName);
  });

  const result = reactive({
    success: true,
    errMsg: '',
  });

  async function handleJumpto(id: number, data?: Info) {
    current.value = id;
    if (data && genInfoData.value) {
      Object.assign(genInfoData.value, data);
    }
    // 提交
    if (unref(current) === 2) {
      try {
        const requestData = unref(genInfoData);
        // 树表需要添加这个参数
        if (requestData && requestData.tplCategory === 'tree') {
          const { treeCode, treeName, treeParentCode } = requestData;
          requestData.params = {
            treeCode,
            treeName,
            treeParentCode,
          };
        }
        // 需要进行参数转化
        if (requestData) {
          const transform = (ret: boolean) => (ret ? '1' : '0');
          requestData.columns.forEach((column) => {
            const { insert, edit, list, query, required } = column;
            column.isInsert = transform(insert);
            column.isEdit = transform(edit);
            column.isList = transform(list);
            column.isQuery = transform(query);
            column.isRequired = transform(required);
          });
        }
        await editSave(requestData);
        result.success = true;
      } catch (e: unknown) {
        result.success = false;
        result.errMsg = (e as Error).message ?? '未知错误';
      }
    }
  }
</script>

<style lang="less" scoped>
  :deep(.ant-card-body) {
    padding: 10px;
  }
</style>
