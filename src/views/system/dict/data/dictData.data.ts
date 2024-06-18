import { BasicColumn } from '/@/components/Table';
import { useRender } from '/@/hooks/component/useRender';
import { FormSchema } from '/@/components/Form';
import { dictOptionSelctList } from '/@/api/system/dict/dictType';
import { tagSelectOptions } from '/@/components/Dict/src/data';

const { renderDictTag } = useRender();
export const columns: BasicColumn[] = [
  // {
  //   title: '字典CODE',
  //   dataIndex: 'dictCode',
  // },
  {
    title: '字典标签',
    dataIndex: 'dictLabel',
  },
  {
    title: '标签预览',
    dataIndex: 'cssClass',
    customRender({ record }) {
      const { dictValue } = record;
      return renderDictTag(dictValue, [record as any]);
    },
  },
  {
    title: '字典键值',
    dataIndex: 'dictValue',
  },
  {
    title: '字典排序',
    dataIndex: 'dictSort',
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
];

export const formSchems: FormSchema[] = [
  {
    label: '字典类型',
    field: 'dictType',
    component: 'ApiSelect',
    componentProps: {
      api: dictOptionSelctList,
      labelField: 'dictName',
      valueField: 'dictType',
    },
  },
  {
    label: '字典标签',
    field: 'dictLabel',
    component: 'Input',
  },
];

// modal
export const modalSchemas: FormSchema[] = [
  {
    label: '字典CODE',
    field: 'dictCode',
    component: 'Input',
    show: false,
  },
  {
    label: '字典类型',
    field: 'dictType',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    label: '标签样式',
    field: 'listClass',
    defaultValue: 'default',
    component: 'Select',
    componentProps: {
      options: tagSelectOptions(),
    },
  },
  {
    label: '数据标签',
    field: 'dictLabel',
    component: 'Input',
    required: true,
  },
  {
    label: '数据键值',
    field: 'dictValue',
    component: 'Input',
    required: true,
  },
  {
    label: '标签颜色',
    field: 'cssClass',
    helpMessage: ['输入16进制自定义颜色', '优先级高于"标签样式"'],
    rules: [
      {
        required: false,
        message: '输入正确的16进制颜色',
        pattern: /^#([0-9a-fA-F]{3}){1,2}$/,
        trigger: 'blur',
      },
    ],
    component: 'ColorPicker',
  },
  {
    label: '显示排序',
    field: 'dictSort',
    component: 'InputNumber',
    required: true,
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
  },
];
