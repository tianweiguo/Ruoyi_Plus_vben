import { BasicColumn } from '/@/components/Table';
import { dictOptionSelctList } from '/@/api/system/dict/dictType';
import { reactive } from 'vue';

const JavaTypes: string[] = [
  'Long',
  'String',
  'Integer',
  'Double',
  'BigDecimal',
  'Date',
  'Boolean',
  'LocalDate',
  'LocalDateTime',
];

const queryTypeOptions = [
  { label: '=', value: 'EQ' },
  { label: '!=', value: 'NE' },
  { label: '>', value: 'GT' },
  { label: '>=', value: 'GE' },
  { label: '<', value: 'LT' },
  { label: '<=', value: 'LE' },
  { label: 'LIKE', value: 'LIKE' },
  { label: 'BETWEEN', value: 'BETWEEN' },
];

const componentsOptions = [
  { label: '文本框', value: 'input' },
  { label: '文本域', value: 'textarea' },
  { label: '下拉框', value: 'select' },
  { label: '单选框', value: 'radio' },
  { label: '复选框', value: 'checkbox' },
  { label: '日期控件', value: 'datetime' },
];

function transform(state: boolean) {
  return state ? '是' : '否';
}

const dictOptions = reactive<any[]>([]);
/**
 * 在这里初始化字典下拉框
 */
(async function init() {
  const ret = await dictOptionSelctList();

  ret.forEach((dict) => {
    const option = {
      label: `${dict.dictName} | ${dict.dictType}`,
      value: dict.dictType,
    };
    dictOptions.push(option);
  });
})();

export const columns: BasicColumn[] = [
  {
    title: '字段列名',
    dataIndex: 'columnName',
  },
  {
    title: '字段描述',
    dataIndex: 'columnComment',
    editRow: true,
  },
  {
    title: 'db类型',
    dataIndex: 'columnType',
  },
  {
    title: 'Java类型',
    dataIndex: 'javaType',
    editRow: true,
    editComponent: 'Select',
    editComponentProps: {
      options: JavaTypes.map((item) => ({ label: item, value: item })),
    },
  },
  {
    title: 'Java属性名',
    dataIndex: 'javaField',
    editRow: true,
  },
  {
    title: '插入',
    dataIndex: 'insert',
    editRow: true,
    editComponent: 'Checkbox',
    width: 60,
    editValueMap: (value) => {
      return transform(value);
    },
  },
  {
    title: '编辑',
    dataIndex: 'edit',
    editRow: true,
    editComponent: 'Checkbox',
    width: 60,
    editValueMap: (value) => {
      return transform(value);
    },
  },
  {
    title: '列表',
    dataIndex: 'list',
    editRow: true,
    editComponent: 'Checkbox',
    width: 60,
    editValueMap: (value) => {
      return transform(value);
    },
  },
  {
    title: '查询',
    dataIndex: 'query',
    editRow: true,
    editComponent: 'Checkbox',
    width: 60,
    editValueMap: (value) => {
      return transform(value);
    },
  },
  {
    title: '查询方式',
    dataIndex: 'queryType',
    editRow: true,
    editComponent: 'Select',
    editComponentProps: {
      options: queryTypeOptions,
    },
  },
  {
    title: '必填',
    dataIndex: 'isRequired',
    editRow: true,
    editComponent: 'Checkbox',
    editValueMap: (value) => {
      return value ? '是' : '否';
    },
  },
  {
    title: '显示类型',
    dataIndex: 'htmlType',
    editRow: true,
    editComponent: 'Select',
    editComponentProps: {
      options: componentsOptions,
    },
  },
  {
    title: '字典类型',
    dataIndex: 'dictType',
    editRow: true,
    editComponent: 'Select',
    editComponentProps: {
      options: dictOptions,
    },
  },
];
