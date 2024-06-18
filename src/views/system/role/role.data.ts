import { BasicColumn } from '/@/components/Table';
import { DictEnum } from '/@/enums/dictEnum';
import { getDictOptions } from '@/utils/dict';
import { FormSchema } from '/@/components/Form';
import { useRender } from '@/hooks/component/useRender';
import { roleChangeStatus } from '/@/api/system/role';

const { renderSwitch } = useRender();
export const columns: BasicColumn[] = [
  {
    title: '角色名称',
    dataIndex: 'roleName',
  },
  {
    title: '权限字符',
    dataIndex: 'roleKey',
  },
  {
    title: '排序',
    dataIndex: 'roleSort',
  },
  {
    title: '状态',
    dataIndex: 'status',
    customRender({ record }) {
      return renderSwitch(record, roleChangeStatus, (newStatusStr) => {
        return `确认要${newStatusStr}角色[${record.roleName}]吗?`;
      });
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
];

export const formSchems: FormSchema[] = [
  {
    label: '角色名称',
    field: 'roleName',
    component: 'Input',
  },
  {
    label: '权限字符',
    field: 'roleKey',
    component: 'Input',
  },
  {
    label: '状态',
    field: 'status',
    component: 'Select',
    componentProps: {
      options: getDictOptions(DictEnum.NORMAL_DISABLE),
    },
  },
  {
    label: '创建时间',
    field: 'createTime',
    component: 'RangePicker',
  },
];

export const modalSchemas: FormSchema[] = [
  {
    label: '角色ID',
    field: 'roleId',
    component: 'Input',
    show: false,
  },
  {
    label: '角色名称',
    field: 'roleName',
    component: 'Input',
    required: true,
  },
  {
    label: '权限标识',
    field: 'roleKey',
    helpMessage: [
      '控制器中定义的权限字符',
      "如: @PreAuthorize(`@ss.hasRole('admin'), 也可以自行定义",
    ],
    component: 'Input',
    required: true,
  },
  {
    label: '角色排序',
    field: 'roleSort',
    component: 'InputNumber',
    required: true,
  },
  {
    label: '角色状态',
    field: 'status',
    defaultValue: '0',
    component: 'RadioButtonGroup',
    required: true,
    componentProps: { options: getDictOptions(DictEnum.NORMAL_DISABLE) },
  },
  {
    label: '菜单权限',
    field: 'menuIds',
    slot: 'menuTree',
    defaultValue: [],
    component: 'Input',
  },
  {
    label: '备注',
    field: 'remark',
    defaultValue: '',
    component: 'InputTextArea',
  },
];

const authScopeOptions = [
  { label: '全部数据权限', value: '1' },
  { label: '自定数据权限', value: '2' },
  { label: '本部门数据权限', value: '3' },
  { label: '本部门及以下数据权限', value: '4' },
  { label: '仅本人数据权限', value: '5' },
];

export const authSchemas: FormSchema[] = [
  {
    field: 'roleId',
    label: '角色ID',
    component: 'Input',
    show: false,
  },
  {
    label: '角色名称',
    field: 'roleName',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    label: '权限标识',
    field: 'roleKey',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    label: '权限范围',
    field: 'dataScope',
    helpMessage: '更改后需要用户重新登录才能生效',
    component: 'Select',
    componentProps: {
      options: authScopeOptions,
    },
  },
  {
    label: '部门权限',
    field: 'deptIds',
    slot: 'deptTree',
    helpMessage: '更改后立即生效',
    defaultValue: [],
    component: 'Input',
    show({ values }) {
      // 为自定义的时候才显示
      return values.dataScope === '2';
    },
  },
];
