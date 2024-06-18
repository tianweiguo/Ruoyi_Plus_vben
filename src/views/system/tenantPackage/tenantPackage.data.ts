import { BasicColumn } from '/@/components/Table';
import { useRender } from '/@/hooks/component/useRender';
import { FormSchema } from '/@/components/Form';
import { packageChangeStatus } from '@/api/system/tenantPackage';

const { renderSwitch } = useRender();
export const columns: BasicColumn[] = [
  {
    title: '套餐名称',
    dataIndex: 'packageName',
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
  {
    title: '租户状态',
    dataIndex: 'status',
    customRender({ record }) {
      return renderSwitch(record, packageChangeStatus, (newStatusStr) => {
        return `确认${newStatusStr}租户套餐[${record.packageName}]吗?`;
      });
    },
  },
];

export const formSchemas: FormSchema[] = [
  {
    label: '套餐名称',
    field: 'packageName',
    component: 'Input',
  },
];

export const modalSchemas: FormSchema[] = [
  {
    label: '套餐ID',
    field: 'packageId',
    component: 'Input',
    show: false,
  },
  {
    label: '节点关联',
    field: 'menuCheckStrictly',
    component: 'Checkbox',
    show: false,
  },
  {
    label: '套餐名称',
    field: 'packageName',
    component: 'Input',
  },
  {
    label: '关联菜单',
    field: 'menuIds',
    defaultValue: [],
    component: 'Input',
    slot: 'menuIds',
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
  },
];
