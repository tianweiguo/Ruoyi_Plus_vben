<template>
  <div v-if="showToggle">
    <Select
      v-model:value="selected"
      placeholder="选择租户"
      class="w-60"
      allowClear
      @select="onSelected"
      @deselect="onDeselect"
    >
      <SelectOption
        v-for="item in tenantList"
        :key="item.tenantId"
        :value="item.tenantId"
        :title="item.companyName"
      >
        {{ item.companyName }}
      </SelectOption>
    </Select>
  </div>
</template>

<script setup lang="ts">
  import { Select } from 'ant-design-vue';
  import { ref, computed, onMounted, unref } from 'vue';
  import { useUserStore } from '@/store/modules/user';
  import { RoleEnum } from '/@/enums/roleEnum';
  import { tenantDynamicToggle, tenantDynamicClear } from '@/api/system/tenant';
  import { useGo } from '@/hooks/web/usePage';
  import { PageEnum } from '@/enums/pageEnum';
  import { useTabs } from '@/hooks/web/useTabs';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useTenantStore } from '@/store/modules/tenant';
  import { storeToRefs } from 'pinia';

  const SelectOption = Select.Option;

  const { roleList } = useUserStore();
  const showToggle = computed<boolean>(() => {
    // 超级管理员 && 启用租户
    return roleList.includes('superadmin' as RoleEnum) && unref(tenantEnabled);
  });

  // 上一次选择的租户
  const lastSelected = ref<string>();
  // 当前选择租户的id
  const selected = ref<string>();

  const tenantStore = useTenantStore();
  const { initTenant, setChecked } = tenantStore;
  const { tenantEnabled, tenantList } = storeToRefs(tenantStore);
  onMounted(async () => {
    if (!roleList.includes('superadmin' as RoleEnum)) {
      return;
    }
    await initTenant();
  });

  const go = useGo();
  const { closeAll } = useTabs();
  const { createMessage } = useMessage();

  function close(checked: boolean) {
    // store设置状态
    setChecked(checked);
    // 需要关闭全部标签页
    closeAll();
    // 切换完加载首页
    go(PageEnum.BASE_HOME);
  }
  async function onSelected(tenantId: string, option: any) {
    if (unref(lastSelected) === tenantId) {
      // createMessage.info('选择一致');
      return;
    }
    await tenantDynamicToggle(tenantId);
    lastSelected.value = tenantId;
    createMessage.success('切换当前租户为: ' + option.title);
    close(true);
  }

  async function onDeselect() {
    await tenantDynamicClear();
    createMessage.success('还原为默认租户');
    close(false);
  }
</script>

<style scoped></style>
