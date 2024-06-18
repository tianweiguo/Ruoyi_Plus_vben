<template>
  <BasicModal
    v-bind="$attrs"
    :width="600"
    :title="title"
    @register="registerInnerModal"
    @ok="handleSubmit"
    @cancel="resetForm"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { computed, ref, unref } from 'vue';
  import { userAdd, userUpdate, userInfo, departmentTree } from '/@/api/system/user';
  import { modalSchemas } from './user.data';
  import { addFullName } from '@/utils/helper/treeHelper';

  defineOptions({ name: 'UserModal' });

  const emit = defineEmits(['register', 'reload']);

  const isUpdate = ref<boolean>(false);

  const title = computed<string>(() => {
    return isUpdate.value ? '编辑用户' : '新增用户';
  });

  const [registerInnerModal, { modalLoading, closeModal }] = useModalInner(
    async (data: { record?: Recordable; update: boolean }) => {
      const { record, update } = data;
      isUpdate.value = update;
      // 在这里更新主要是打开编辑/新增 会有一个明显的隐藏/显示效果 不美观
      await updateSchema([
        {
          field: 'userName',
          componentProps: {
            disabled: update,
          },
        },
        {
          field: 'password',
          ifShow: !update,
        },
      ]);
      const response = record ? await userInfo(record.userId) : await userInfo();
      // 外部的roleIds postIds才是真正对应的  新增时为空
      const { postIds = [], roleIds = [], user, roles, posts } = response;
      // user不为空为更新
      if (user) {
        user.postIds = postIds;
        user.roleIds = roleIds;
      }
      // updateSchema
      const deptTree = await departmentTree();
      // 选中后显示在输入框的值 即父节点 >> 子节点
      addFullName(deptTree, 'label', ' >> ');
      // 岗位下拉框
      const deptOptions = posts;
      // 角色
      const roleOptions = roles;
      await updateSchema([
        {
          field: 'deptId',
          componentProps: {
            treeData: deptTree,
            fieldNames: { value: 'id', label: 'label' },
            treeDefaultExpandAll: true,
            treeLine: { showLeafIcon: false },
            // 选中后显示在输入框的值
            treeNodeLabelProp: 'fullName',
          },
        },
        {
          field: 'postIds',
          componentProps: {
            options: deptOptions,
            fieldNames: { label: 'postName', value: 'postId' },
            // 搜索
            optionFilterProp: 'postName',
            mode: 'multiple',
          },
        },
        {
          field: 'roleIds',
          componentProps: {
            options: roleOptions,
            fieldNames: { label: 'roleName', value: 'roleId' },
            // 搜索
            optionFilterProp: 'roleName',
            mode: 'multiple',
          },
        },
      ]);

      // 更新信息
      if (user && update) {
        await setFieldsValue(user);
      }
    },
  );

  const [registerForm, { setFieldsValue, resetForm, validate, updateSchema }] = useForm({
    labelWidth: 100,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
    schemas: modalSchemas,
  });

  async function handleSubmit() {
    try {
      modalLoading(true);
      const data = await validate();
      if (unref(isUpdate)) {
        await userUpdate(data);
      } else {
        await userAdd(data);
      }
      await resetForm();
      emit('reload', closeModal);
    } catch (e) {
    } finally {
      modalLoading(false);
    }
  }
</script>

<style scoped></style>
