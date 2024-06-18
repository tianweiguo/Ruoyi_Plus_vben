import { useDictStoreWithOut, Option, dictToOptions } from '@/store/modules/dict';
import { dictDataInfo } from '/@/api/system/dict/dictData';
import { DictData } from '/@/api/system/dict/dictData.model';
import { reactive } from 'vue';

export function getDict(dictName: string): DictData[] {
  const { getDict, setDict } = useDictStoreWithOut();
  const dict: DictData[] = reactive([]);
  const ret = getDict(dictName);
  if (ret && ret.length > 0) {
    dict.push(...ret);
  } else {
    // 从后端获取
    dictDataInfo(dictName).then((resp) => {
      console.log(resp);
      // store设置
      setDict(dictName, resp);
      dict.push(...resp);
    });
  }
  return dict;
}

export function getDictOptions(dictName: string): Option[] {
  const { getDictOptions, setDict } = useDictStoreWithOut();
  const dict: Option[] = reactive([]);
  const ret = getDictOptions(dictName);
  if (ret && ret.length > 0) {
    dict.push(...ret);
  } else {
    // 从后端获取
    dictDataInfo(dictName).then((resp) => {
      // store设置
      setDict(dictName, resp);
      const option = dictToOptions(resp);
      dict.push(...option);
    });
  }
  return dict;
}
