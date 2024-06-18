import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Form';

export const columns: BasicColumn[] = [
  // {
  //   title: '字典编号',
  //   dataIndex: 'dictId',
  // },
  {
    title: '字典名称',
    dataIndex: 'dictName',
  },
  {
    title: '字典类型',
    dataIndex: 'dictType',
  },
  // 该字段已经删除 分支:ddc43b3057ba8f2d20f5b1e627c5e03f871371b5
  // {
  //   dataIndex: 'status',
  //   title: '状态',
  //   customRender({ value }) {
  //     return renderDict(value, DictEnum.NORMAL_DISABLE);
  //   },
  // },
  {
    title: '备注',
    dataIndex: 'remark',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
];

export const formSchemas: FormSchema[] = [
  {
    field: 'dictName',
    label: '字典名称',
    component: 'Input',
  },
  {
    field: 'dictType',
    label: '字典类型',
    component: 'Input',
  },
];

export const modalSchemas: FormSchema[] = [
  {
    field: 'dictId',
    label: '字典编号',
    component: 'Input',
    show: false,
  },
  {
    label: '字典名称',
    field: 'dictName',
    component: 'Input',
    required: true,
    helpMessage: '字典的名称',
  },
  {
    label: '字典类型',
    field: 'dictType',
    component: 'Input',
    required: true,
    helpMessage: '使用英文/下划线命名, 如:sys_normal_disable',
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
  },
];
