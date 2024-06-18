<template>
  <div></div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { authCallback } from '@/api/auth';
  import { OAuthLoginParams } from '@/api/auth/model';
  import { getToken } from '@/utils/auth';
  import { PageEnum } from '@/enums/pageEnum';
  import { useGo } from '@/hooks/web/usePage';
  import { useLocalStorage } from '@vueuse/core';
  import { useLoading } from '@/utils/components/loading';
  import { accountBindList } from '@/views/auth/common';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useUserStore } from '@/store/modules/user';

  const route = useRoute();

  const code = route.query.code as string;
  const state = route.query.state as string;
  // 来源
  const source = route.query.source as string;
  // 租户ID
  const defaultTenantId = '000000';
  const tenantId = useLocalStorage('tenantId', defaultTenantId);

  const go = useGo();
  const { createMessage } = useMessage();
  const [openLoading, closeLoading] = useLoading();
  const { login } = useUserStore();

  onMounted(async () => {
    try {
      openLoading();
      // 已经实现的平台
      const currentClient = accountBindList.find((item) => item.source === source && item.action);
      if (!currentClient) {
        createMessage.error({ content: `未找到${source}平台` });
        return;
      }
      const data: OAuthLoginParams = {
        socialCode: code,
        socialState: state,
        tenantId: tenantId.value,
        source,
        grantType: 'social',
      };
      // 没有token为登录 有token是授权
      if (!getToken()) {
        // todo
        await login(data);
        createMessage.success(source + '登录成功');
      } else {
        await authCallback(data);
        createMessage.success(source + '授权成功');
      }
    } catch (e) {
      // 500 你还没有绑定第三方账号，绑定后才可以登录！
    } finally {
      closeLoading();
      setTimeout(() => {
        go(PageEnum.BASE_HOME);
      }, 2000);
    }
  });
</script>

<style scoped></style>
