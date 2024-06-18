<template>
  <BasicModal
    v-bind="$attrs"
    :title="title"
    :width="600"
    @register="registerInnerModal"
    @ok="handleSubmit"
    @cancel="clearFormFields"
  >
    <BasicForm @register="registerForm">
      <template #menuTree="{ model, field }">
        <Card>
          <BasicTree
            ref="roleTreeRef"
            v-if="roleMenuTree.length"
            title="菜单分配"
            :tree-data="roleMenuTree"
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
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { computed, ref } from 'vue';
  import { roleInfo, roleAdd, roleUpdate } from '/@/api/system/role';
  import { roleMenuTreeSelect, menuTreeSelect } from '/@/api/system/menu';
  import { MenuOption } from '/@/api/system/menu/model';
  import { Card } from 'ant-design-vue';
  import { BasicTree } from '/@/components/Tree';
  import { unref } from 'vue';
  import { nextTick } from 'vue';
  import { modalSchemas } from './role.data';
  import { findGroupParentIds } from '@/utils/helper/treeHelper';
  import { CheckInfo } from 'ant-design-vue/es/vc-tree/props';
  import { showNodeState } from '@/utils/helper/treeHelper';

  defineOptions({ name: 'RoleModal' });

  const emit = defineEmits(['register', 'reload']);

  const isUpdate = ref<boolean>(false);

  const title = computed<string>(() => {
    return isUpdate.value ? '新增角色' : '编辑角色';
  });

  const roleMenuTree = ref<MenuOption[]>([]);
  /** checkable 状态下节点选择完全受控（父子节点选中状态不再关联） */
  const menuCheckStrictly = ref<boolean>(false);

  // 展开的层级
  const defaultExpandLevel = 1;
  const roleTreeRef = ref();

  const [registerInnerModal, { modalLoading, closeModal }] = useModalInner(
    async (data: { record?: Recordable; update: boolean }) => {
      const { record, update } = data;
      isUpdate.value = update;
      if (update && record) {
        const ret = await roleInfo(record.roleId);
        // 是否节点独立/关联  后台返回的字段和antd是反的
        menuCheckStrictly.value = !ret.menuCheckStrictly;
        showNodeState(ret.menuCheckStrictly);
        await setFieldsValue(ret);
        // tree 拿到tree数据和选中
        const response = await roleMenuTreeSelect(ret.roleId);
        const { menus, checkedKeys } = response;
        roleMenuTree.value = menus;

        /**
         * 找到所有的父节点ID
         * 主要是处理未点击菜单直接保存(即未触发handleChecked)是不带父节点ID的
         */
        /** 节点关联情况下是不带父节点的 */
        if (ret.menuCheckStrictly) {
          const parentIds = findGroupParentIds(menus, checkedKeys);
          checkedMenuKeys.value = [...parentIds, ...checkedKeys];
        } else {
          checkedMenuKeys.value = checkedKeys;
        }
        /**
         * 这里只用于显示数据
         * 这里用后端返回的不带父节点的ID antd会自动勾选父节点
         */
        await setFieldsValue({ menuIds: checkedKeys });
      } else {
        // tree 这里直接返回的数组
        roleMenuTree.value = await menuTreeSelect();
      }

      // 默认展开层级
      nextTick(() => {
        if (unref(roleTreeRef)) {
          roleTreeRef.value.filterByLevel(defaultExpandLevel);
        }
      });
    },
  );

  const [registerForm, { setFieldsValue, resetForm, validate }] = useForm({
    labelWidth: 100,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
    schemas: modalSchemas,
  });

  // 已经选择的节点 包括父节点
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
      formData.menuIds = [...unref(checkedMenuKeys)];
      if (unref(isUpdate)) {
        await roleUpdate(formData);
      } else {
        await roleAdd(formData);
      }
      await clearFormFields();
      emit('reload', closeModal);
    } catch (e) {
    } finally {
      modalLoading(false);
    }
  }

  async function clearFormFields() {
    await resetForm();
    checkedMenuKeys.value = [];
  }
</script>

<style scoped>
  :deep(.ant-card-body) {
    padding: 0px;
  }
</style>
