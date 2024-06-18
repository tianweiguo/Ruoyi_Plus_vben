import { VNode, h } from 'vue';
import { Tag, Button, Tooltip, Switch } from 'ant-design-vue';
import { JsonPreview } from '/@/components/CodeEditor';
import Icon from '/@/components/Icon/Icon.vue';
import { DictTag } from '/@/components/Dict';
import { DictData } from '/@/api/system/dict/dictData.model';
import { formatToDate, formatToDateTime } from '/@/utils/dateUtil';
import { useGo } from '/@/hooks/web/usePage';
import { TooltipPlacement } from 'ant-design-vue/lib/tooltip';
import { getDict } from '@/utils/dict';
import { useMessage } from '@/hooks/web/useMessage';

function renderTag(text: string, color?: string) {
  return h(Tag, { color }, () => text);
}

/**
 *
 * @param tags 标签list
 * @param wrap 是否换行显示
 * @returns
 */
function renderTags(tags: string[], wrap = false) {
  const tagList: VNode[] = [];
  tags.forEach((item) => {
    tagList.push(renderTag(item));
    if (wrap) {
      tagList.push(h('br'));
    }
  });
  return h('span', tagList);
}

/**
 *
 * @param json json对象 接受object/string类型
 * @returns json预览
 */
function renderJsonPriview(json: any) {
  if (typeof json !== 'object' && typeof json !== 'string') {
    return json;
  }
  if (typeof json === 'object') {
    return h(JsonPreview, { data: json });
  }
  try {
    const obj = JSON.parse(json);
    // 基本数据类型可以被转为json
    if (typeof obj !== 'object') {
      return obj;
    }
    return h(JsonPreview, { data: obj });
  } catch (e) {
    return json;
  }
}

// 图标
function renderIcon(icon: string) {
  return h(Icon, { icon });
}

// httpMethod
function renderHttpMethodTag(type: string) {
  const method = type.toUpperCase();
  let color = 'default';
  const title = method + '请求';
  switch (method) {
    case 'GET':
      color = 'green';
      break;
    case 'POST':
      color = 'blue';
      break;
    case 'PUT':
      color = 'orange';
      break;
    case 'DELETE':
      color = 'red';
      break;
  }
  return h(Tag, { color }, () => title);
}

function renderDictTag(value: string, dicts: DictData[]) {
  return h(DictTag, { dicts, value });
}

/**
 * render多个dictTag
 * @param value key数组 string[]类型
 * @param dicts 字典数组
 * @param wrap 是否需要换行显示
 * @returns render
 */
function renderDictTags(value: string[], dicts: DictData[], wrap = true) {
  const tagList: VNode[] = [];
  if (Array.isArray(value)) {
    value.forEach((item) => {
      tagList.push(renderDictTag(item, dicts));
      if (wrap) {
        tagList.push(h('br'));
      }
    });
  }
  return h('span', tagList);
}

/**
 * @param value 值
 * @param dictName dictName
 * @returns tag
 */
function renderDict(value: string, dictName: string) {
  const dictInfo = getDict(dictName);
  return renderDictTag(value, dictInfo);
}

/**
 * 加粗文字
 * @param value 文字
 * @param colorCss 颜色 使用windicss类名 如text-red-500
 * @returns
 */
function renderBoldText(value: string, colorCss?: string) {
  return h('span', { class: ['font-bold', colorCss] }, value);
}

function renderIconSpan(icon: string, value: string, marginLeft = '2px') {
  return h(
    'span',
    {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
    [renderIcon(icon), ' ', h('span', { style: { marginLeft } }, value)],
  );
}

function renderDate(date: string) {
  return formatToDate(date);
}

function renderDateTime(date: string) {
  return formatToDateTime(date);
}

function renderHref(value: string, path: string) {
  const go = useGo();
  return h(
    Button,
    {
      type: 'link',
      onClick() {
        go(path);
      },
    },
    () => value,
  );
}

function renderTooltip(value: string, placement: TooltipPlacement = 'top') {
  return h(Tooltip, { placement, title: value }, () => value);
}

const { createConfirm } = useMessage();
/**
 * feat 目前无法处理reload
 * 封装switch 用于表格内状态的切换
 * @param record record(reactive)
 * @param api 切换状态的api  默认传参是record
 * @param customContent 自定义内容 回调参数为新状态的str
 * @returns
 */
function renderSwitch(
  record: Recordable,
  api: (...data: any) => Promise<any>,
  customContent?: (newStatusStr: string) => string,
) {
  return h(Switch, {
    checked: record.status,
    'checked-children': '启用',
    'un-checked-children': '禁用',
    checkedValue: '0',
    unCheckedValue: '1',
    onChange: (newStatus) => {
      const lastStatus = record.status;
      const newStatusStr = newStatus === '0' ? '启用' : '禁用';
      // 切换状态
      record.status = newStatus;
      // 自定义内容
      const defaultContent = `确认${newStatusStr}吗?`;
      const content = customContent ? customContent(newStatusStr) : defaultContent;
      createConfirm({
        title: '提示',
        iconType: 'warning',
        content,
        async onOk() {
          try {
            await api(record);
          } catch (e) {
            record.status = lastStatus;
          }
        },
        onCancel() {
          record.status = lastStatus;
        },
      });
    },
  });
}

export function useRender() {
  return {
    renderTag,
    renderTags,
    renderJsonPriview,
    renderIcon,
    renderHttpMethodTag,
    renderDictTag,
    renderDictTags,
    renderDict,
    renderBoldText,
    renderIconSpan,
    renderDate,
    renderDateTime,
    renderHref,
    renderTooltip,
    renderSwitch,
  };
}
