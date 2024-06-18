<template>
  <BasicModal
    v-bind="$attrs"
    :title="title"
    :width="600"
    @register="registerModal"
    @ok="handleSubmit"
    @cancel="resetFormFields"
  >
    <BasicForm @register="registerForm">
      <template #menuIds="{ model, field }">
        <Card>
          <BasicTree
            ref="menuTreeRef"
            v-if="menuTree.length"
            title="菜单分配"
            :tree-data="menuTree"
            :fieldNames="{ title: 'label', key: 'id' }"
            checkable
            search
            toolbar
            :checkStrictly="menuCheckStrictly"
            :strictly-btn="true"
            :selectable="false"
            v-model:checkedKeys="model[field]"
            @check="handleChecked"
          />
        </Card>
      </template>
    </BasicForm>
  </BasicModal>
</template>

<script setup lang="ts">
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { ref, unref } from 'vue';
  import { BasicForm, useForm } from '@/components/Form';
  import { modalSchemas } from './tenantPackage.data';
  import { packageAdd, packageUpdate, packageInfo } from '@/api/system/tenantPackage';
  import { computed } from 'vue';
  import { Card } from 'ant-design-vue';
  import { BasicTree } from '@/components/Tree';
  import { tenantPackageMenuTreeSelect, menuTreeSelect } from '/@/api/system/menu';
  import { MenuOption } from '/@/api/system/menu/model';
  import { CheckInfo } from 'ant-design-vue/es/vc-tree/props';
  import { nextTick } from 'vue';
  import { showNodeState } from '@/utils/helper/treeHelper';

  defineOptions({ name: 'TenantPackageModal' });

  const emit = defineEmits(['register', 'reload']);
  const isUpdate = ref<boolean>(false);
  const title = computed(() => {
    return isUpdate.value ? '编辑租户套餐' : '新增租户套餐';
  });

  const menuTreeRef = ref();
  const menuTree = ref<MenuOption[]>([]);
  /** 默认展开层级 */
  const defaultExpandLevel = 1;

  // checkable 状态下节点选择完全受控（父子节点选中状态不再关联）
  const menuCheckStrictly = ref<boolean>(false);

  const [registerModal, { closeModal, modalLoading }] = useModalInner(
    async (data: { record?: Recordable; update: boolean }) => {
      const { record, update } = data;
      isUpdate.value = update;
      if (update && record) {
        const ret = await packageInfo(record.packageId);

        // 用于未操作菜单(即没有触发handleChecked)直接点击确定的情况
        // 直接点击确定是不带父节点的  在这里保存所有节点的ID
        // 这里用于提交
        const allNodeIds = transformIdStr(ret.menuIds as string);
        checkedMenuKeys.value = allNodeIds;
        // 是否节点独立/关联  后台返回的字段和antd是反的
        menuCheckStrictly.value = !ret.menuCheckStrictly;
        showNodeState(ret.menuCheckStrictly);

        // tree
        const { checkedKeys, menus } = await tenantPackageMenuTreeSelect(record.packageId);
        // 菜单
        menuTree.value = menus;
        // 已经选择的菜单 这里是不带父节点的  只用于显示
        ret.menuIds = checkedKeys;
        setFieldsValue(ret);
      } else {
        const menus = await menuTreeSelect();
        menuTree.value = menus;
      }
      /** 默认展开defaultExpandLevel层 */
      nextTick(() => {
        if (unref(menuTreeRef)) {
          unref(menuTreeRef).filterByLevel(defaultExpandLevel);
        }
      });
    },
  );

  /**
   * 后端返回的string类型的字符串转为number类型的数组
   * @param idStr id字符串 如"1, 2, 3, 4"
   * @returns 转换后的数组 [1, 2, 3, 4]
   */
  function transformIdStr(idStr: string): number[] {
    if (!idStr) {
      return [];
    }
    return idStr.split(', ').map(Number);
  }

  const [registerForm, { setFieldsValue, validate, resetForm }] = useForm({
    labelWidth: 100,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
    schemas: modalSchemas,
  });

  /** 已经选择的所有节点  包括子/父节点 */
  const checkedMenuKeys = ref<number[]>([]);
  /**
   *
   * @param checkedKeys 已经选中的子节点的ID
   * @param info info.halfCheckedKeys为父节点的ID
   */
  type CheckedState<T = number> = T[] | { checked: T[]; halfChecked: T[] };
  function handleChecked(checkedKeys: CheckedState, info: CheckInfo) {
    // 数组的话为节点关联
    if (checkedKeys instanceof Array) {
      const halfCheckedKeys: number[] = (info.halfCheckedKeys || []) as number[];
      checkedMenuKeys.value = [...halfCheckedKeys, ...checkedKeys];
      // 由于点击按钮 层级关联/独立并不会更新  需要在这里自行更改
      menuCheckStrictly.value = false;
    } else {
      checkedMenuKeys.value = [...checkedKeys.checked];

      menuCheckStrictly.value = true;
    }
  }

  async function handleSubmit() {
    try {
      modalLoading(true);
      const formData = await validate();
      // 这里是已经保存的节点
      formData.menuIds = checkedMenuKeys.value.sort();
      formData.menuCheckStrictly = !unref(menuCheckStrictly);
      if (unref(isUpdate)) {
        await packageUpdate(formData);
      } else {
        await packageAdd(formData);
      }
      await resetFormFields();
      emit('reload', closeModal);
    } catch (e) {
    } finally {
      modalLoading(false);
    }
  }

  async function resetFormFields() {
    await resetForm();
    checkedMenuKeys.value = [];
    menuCheckStrictly.value = false;
  }
</script>

<style scoped>
  :deep(.ant-card-body) {
    padding: 0px;
  }
</style>
