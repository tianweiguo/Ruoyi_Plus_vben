import { BasicColumn } from '/@/components/Table';
import { DictEnum } from '/@/enums/dictEnum';
import { getDictOptions, getDict } from '@/utils/dict';
import { FormSchema } from '/@/components/Form';
import { useRender } from '@/hooks/component/useRender';
import { clientChangeStatus } from '@/api/system/client';

export const formSchems: FormSchema[] = [
  {
    label: '客户端key',
    field: 'clientKey',
    component: 'Input',
  },
  {
    label: '客户端秘钥',
    field: 'clientSecret',
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
];

const { renderSwitch, renderDictTag, renderDictTags } = useRender();
export const columns: BasicColumn[] = [
  {
    title: '客户端ID',
    dataIndex: 'clientId',
  },
  {
    title: '客户端key',
    dataIndex: 'clientKey',
  },
  {
    title: '客户端秘钥',
    dataIndex: 'clientSecret',
  },
  {
    title: '授权类型',
    dataIndex: 'grantTypeList',
    customRender({ value }) {
      if (!value) {
        return '无';
      }
      return renderDictTags(value, getDict(DictEnum.SYS_GRANT_TYPE));
    },
  },
  {
    title: '设备类型',
    dataIndex: 'deviceType',
    customRender({ value }) {
      return renderDictTag(value, getDict(DictEnum.SYS_DEVICE_TYPE));
    },
  },
  {
    title: 'token活跃时间',
    dataIndex: 'activeTimeout',
    customRender({ value }) {
      return value + '秒';
    },
  },
  {
    title: 'token超时时间',
    dataIndex: 'timeout',
    customRender({ value }) {
      return value + '秒';
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    customRender({ record }) {
      return renderSwitch(record, clientChangeStatus, (newStatusStr) => {
        return `确认${newStatusStr}客户端[${record.clientKey}]吗?`;
      });
    },
  },
];

export const modalSchemas: FormSchema[] = [
  {
    label: 'ID',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '客户端ID',
    field: 'clientId',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
    show: false,
  },
  {
    label: '客户端key',
    field: 'clientKey',
    component: 'Input',
    required: true,
  },
  {
    label: '客户端秘钥',
    field: 'clientSecret',
    component: 'Input',
    required: true,
  },
  {
    label: '授权类型',
    field: 'grantTypeList',
    component: 'Select',
    componentProps: {
      options: getDictOptions(DictEnum.SYS_GRANT_TYPE),
      mode: 'multiple',
      optionFilterProp: 'label',
    },
    required: true,
  },
  {
    label: '设备类型',
    field: 'deviceType',
    component: 'Select',
    componentProps: {
      options: getDictOptions(DictEnum.SYS_DEVICE_TYPE),
    },
    required: true,
  },
  {
    label: 'Token活跃超时时间',
    field: 'activeTimeout',
    defaultValue: 1800,
    component: 'InputNumber',
    helpMessage: '指定时间无操作则过期(单位：秒), 默认30分钟(1800秒)',
    colProps: { span: 12 },
  },
  {
    label: 'Token固定超时时间',
    field: 'timeout',
    defaultValue: 604800,
    component: 'InputNumber',
    helpMessage: '指定时间必定过期(单位：秒)，默认七天(604800秒)',
    colProps: { span: 12 },
  },
  {
    label: '状态',
    field: 'status',
    defaultValue: '0',
    component: 'RadioButtonGroup',
    componentProps: {
      options: getDictOptions(DictEnum.NORMAL_DISABLE),
    },
  },
];
