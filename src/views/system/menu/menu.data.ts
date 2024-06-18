import { BasicColumn } from '/@/components/Table';
import { useRender } from '/@/hooks/component/useRender';
import { FormSchema } from '/@/components/Form';
import { getDictOptions } from '@/utils/dict';
import { DictEnum } from '/@/enums/dictEnum';

// （M目录 C菜单 F按钮）
const menuTypes = {
  M: { value: '目录', icon: 'ic:outline-folder' },
  C: { value: '菜单', icon: 'gg:menu-round' },
  F: { value: '按钮', icon: 'mdi:button-cursor' },
};

const { renderDict, renderIcon, renderIconSpan } = useRender();
export const tableColumns: BasicColumn[] = [
  {
    title: '菜单名称',
    dataIndex: 'menuName',
  },
  {
    title: '图标',
    dataIndex: 'icon',
    width: 80,
    customRender({ value }) {
      if (value === '#') {
        return '';
      }
      return renderIcon(value);
    },
  },
  {
    title: '排序',
    dataIndex: 'orderNum',
    width: 120,
  },
  {
    title: '组件类型',
    dataIndex: 'menuType',
    width: 150,
    customRender({ value }) {
      const current = menuTypes[value];
      return renderIconSpan(current.icon, current.value);
    },
  },
  {
    title: '权限标识',
    dataIndex: 'perms',
  },
  {
    title: '组件路径',
    dataIndex: 'component',
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    customRender({ value }) {
      return renderDict(value, DictEnum.NORMAL_DISABLE);
    },
  },
  {
    title: '显示',
    dataIndex: 'visible',
    width: 100,
    customRender({ value }) {
      return renderDict(value, DictEnum.SHOW_HIDE);
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
];

export const formSchemas: FormSchema[] = [
  {
    field: 'menuName',
    label: '菜单名称 ',
    component: 'Input',
  },
  {
    field: 'status',
    label: '菜单状态 ',
    component: 'Select',
    componentProps: {
      options: getDictOptions(DictEnum.NORMAL_DISABLE),
    },
  },
  {
    field: 'visible',
    label: '显示状态',
    component: 'Select',
    componentProps: {
      options: getDictOptions(DictEnum.SHOW_HIDE),
    },
  },
];

export const modalSchemas: FormSchema[] = [
  {
    field: 'menuId',
    label: '菜单ID',
    component: 'Input',
    show: false,
  },
  {
    field: 'parentId',
    label: '上级菜单 ',
    required: true,
    defaultValue: 0,
    component: 'TreeSelect',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'menuType',
    label: '菜单类型 ',
    component: 'RadioButtonGroup',
    defaultValue: 'M',
    componentProps({ formActionType }) {
      return {
        // 型（M目录 C菜单 F按钮）
        options: [
          { label: '目录', value: 'M' },
          { label: '菜单', value: 'C' },
          { label: '按钮', value: 'F' },
        ],
        // 切换后清空校验结果
        onChange: async () => {
          if (formActionType) {
            await formActionType.clearValidate();
          }
        },
      };
    },
    colProps: {
      span: 12,
    },
  },
  {
    field: 'icon',
    label: '菜单图标 ',
    component: 'IconPicker',
    helpMessage: '选择或者从 https://icon-sets.iconify.design/ 查找名称粘贴',
    colProps: {
      span: 12,
    },
    ifShow: ({ values }) => {
      // 类型不为按钮时显示
      return values.menuType !== 'F';
    },
  },
  {
    field: 'menuName',
    label: '菜单名称 ',
    helpMessage: '显示在菜单栏的名称',
    component: 'Input',
    required: true,
    colProps: {
      span: 12,
    },
  },
  {
    field: 'orderNum',
    label: '显示排序 ',
    component: 'InputNumber',
    helpMessage: '排序, 数字越小越靠前',
    required: true,
    colProps: {
      span: 12,
    },
  },
  {
    field: 'path',
    label: '路由地址',
    component: 'Input',
    helpMessage: ['路由地址不带/, 如: menu, user', '外链为http(s)://开头'],
    required: true,
    colProps: {
      span: 24,
    },
    ifShow: ({ values }) => {
      // 类型不为按钮时显示
      return values.menuType !== 'F';
    },
    dynamicRules({ model }) {
      if (model.isFrame !== '0') {
        return [];
      }
      return [{ required: true, message: '输入正确的链接', type: 'url', trigger: 'change' }];
    },
  },
  {
    field: 'component',
    label: '组件路径',
    component: 'Input',
    defaultValue: '',
    helpMessage: '填写./src/views下的组件路径, 如system/menu/index',
    colProps: {
      span: 24,
    },
    ifShow: ({ values }) => {
      // 类型为菜单时显示
      return values.menuType === 'C';
    },
    dynamicDisabled: ({ values }) => {
      // 为链接时组件disabled
      return values.isFrame === '0';
    },
  },
  {
    field: 'isFrame',
    label: '是否链接',
    component: 'RadioButtonGroup',
    helpMessage: '外链为http(s)://开头',
    defaultValue: '1',
    componentProps: {
      options: [
        { label: '是', value: '0' },
        { label: '否', value: '1' },
      ],
    },
    colProps: {
      span: 12,
    },
    ifShow: ({ values }) => {
      // 类型不为按钮时显示
      return values.menuType !== 'F';
    },
  },
  {
    field: 'visible',
    label: '显示状态',
    component: 'RadioButtonGroup',
    defaultValue: '0',
    helpMessage: '隐藏后不会出现在菜单栏, 但仍然可以访问',
    colProps: {
      span: 12,
    },
    ifShow: ({ values }) => {
      // 类型不为按钮时显示
      return values.menuType !== 'F';
    },
    componentProps: {
      options: getDictOptions(DictEnum.SHOW_HIDE),
    },
  },
  {
    field: 'status',
    label: '菜单状态',
    component: 'RadioButtonGroup',
    defaultValue: '0',
    helpMessage: '停用后不会出现在菜单栏, 也无法访问',
    colProps: {
      span: 12,
    },
    componentProps: {
      options: getDictOptions(DictEnum.NORMAL_DISABLE),
    },
    ifShow: ({ values }) => {
      // 类型不为按钮时显示
      return values.menuType !== 'F';
    },
  },

  {
    field: 'perms',
    label: '需要权限',
    component: 'Input',
    defaultValue: '',
    helpMessage: `控制器中定义的权限字符, 如: @SaCheckPermission("system:user:import")`,
    colProps: {
      span: 12,
    },
    ifShow: ({ values }) => {
      // 类型为菜单/按钮时显示
      return values.menuType === 'C' || values.menuType === 'F';
    },
  },
  {
    field: 'query',
    label: '路由参数',
    component: 'Input',
    defaultValue: '',
    helpMessage: `vue-router中的query属性, 如{name: 'xxx', age: '16'}`,
    colProps: {
      span: 12,
    },
    ifShow: ({ values }) => {
      // 类型为菜单时显示
      return values.menuType === 'C';
    },
    dynamicDisabled: ({ values }) => {
      // 为链接时组件disabled
      return values.isFrame === '0';
    },
  },
  {
    field: 'isCache',
    label: '是否缓存',
    component: 'RadioButtonGroup',
    helpMessage: '路由的keepAlive属性',
    defaultValue: '0',
    componentProps: {
      options: [
        { label: '是', value: '0' },
        { label: '否', value: '1' },
      ],
    },
    colProps: {
      span: 12,
    },
    ifShow: ({ values }) => {
      // 类型为菜单时显示
      return values.menuType === 'C';
    },
  },
];
