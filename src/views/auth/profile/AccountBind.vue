<template>
  <div>
    <BasicTable @register="registerTable" @fetch-success="onFetchSuccess">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'avatar'">
          <TableImg :imgList="[record.avatar]" />
        </template>
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                label: '解绑账号',
                onClick: handleAuthUnbinding.bind(null, record),
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <!--  -->
    <div class="p-2">
      <List :grid="{ gutter: 8, xs: 1, sm: 1, md: 2, lg: 3, xl: 3, xxl: 4 }" :data-source="list">
        <template #renderItem="{ item }">
          <ListItem>
            <Card>
              <ListItemMeta>
                <template #avatar>
                  <Icon v-if="item.avatar" class="avatar" :icon="item.avatar" :color="item.color" />
                </template>
                <template #title>
                  {{ item.title }}
                  <a-button
                    :disabled="item.binded"
                    type="link"
                    size="small"
                    class="extra"
                    @click="item.action ? item.action() : defaultTip(item.title)"
                  >
                    {{ buttonText(item) }}
                  </a-button>
                </template>
                <template #description>
                  <div>{{ item.description }}</div>
                </template>
              </ListItemMeta>
            </Card>
          </ListItem>
        </template>
      </List>
      <Alert message="说明" type="info">
        <template #description>
          <p
            >需要添加第三方账号在
            <span class="font-bold"> /src/views/auth/common.ts</span> 中accountBindList按模板添加
          </p>
          <p
            >添加对应模板后会在此处显示绑定, 但只有<span class="font-bold"
              >实现了action才能在登录页显示</span
            ></p
          >
        </template>
      </Alert>
    </div>
  </div>
</template>
<script lang="ts">
  import { List, Card, Alert } from 'ant-design-vue';
  import { defineComponent, ref, computed, unref } from 'vue';
  import Icon from '/@/components/Icon/Icon.vue';
  import { socialList } from '@/api/system/social';
  import { BasicTable, useTable, TableAction, TableImg } from '@/components/Table';
  import { accountBindList, BindItem } from '@/views/auth/common';
  import { authUnbinding } from '@/api/auth';
  import { useMessage } from '@/hooks/web/useMessage';

  /**
   * 默认逻辑是绑定后不可再绑定
   * 可以自行去除 后端支持多绑定同一个账号
   * 但是无法登录(selectOne会有多个记录报错) 只有绑定单平台的单个账号才能登录
   */
  export default defineComponent({
    components: {
      List,
      ListItem: List.Item,
      ListItemMeta: List.Item.Meta,
      Icon,
      BasicTable,
      TableAction,
      TableImg,
      Card,
      Alert,
    },
    setup() {
      const [registerTable, { reload }] = useTable({
        columns: [
          {
            dataIndex: 'source',
            title: '绑定平台',
          },
          {
            dataIndex: 'avatar',
            title: '头像',
          },
          {
            dataIndex: 'userName',
            title: '账号',
          },
        ],
        title: '账号绑定',
        api: socialList,
        pagination: false,
        canResize: false,
        showIndexColumn: true,
        actionColumn: {
          key: 'action',
          title: '操作',
        },
      });

      const { createConfirm, createMessage } = useMessage();

      // 没有传递action事件则不支持绑定 弹出默认提示
      function defaultTip(title: string) {
        createMessage.info({ content: `暂不支持绑定${title}` });
      }

      // 解除绑定
      function handleAuthUnbinding(record: Recordable) {
        createConfirm({
          title: '提示',
          iconType: 'info',
          content: `是否解除绑定[${record.source}]平台的[${record.userName}]账号?`,
          onOk: async () => {
            await authUnbinding(record.id);
            await reload();
          },
        });
      }

      // 已经绑定的平台
      const bindedPlateformList = ref<string[]>([]);
      const bindList = computed<BindItem[]>(() => {
        const list = [...accountBindList];
        list.forEach((item) => {
          if (unref(bindedPlateformList).includes(item.source)) {
            item.binded = true;
          } else {
            item.binded = false;
          }
        });
        return list;
      });

      function buttonText(item: BindItem) {
        return item.binded ? '已绑定' : '绑定';
      }

      function onFetchSuccess(data: { total: number; items: Recordable[] }) {
        // 平台转小写
        bindedPlateformList.value = data.items.map((item) => item.source.toLowerCase());
      }

      return {
        list: bindList,
        registerTable,
        handleAuthUnbinding,
        defaultTip,
        onFetchSuccess,
        buttonText,
      };
    },
  });
</script>
<style lang="less" scoped>
  .avatar {
    font-size: 40px !important;
  }

  .extra {
    margin-top: 10px;
    margin-right: 30px;
    float: right;
    cursor: pointer;
  }
</style>
