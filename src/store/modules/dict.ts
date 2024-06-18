import { defineStore } from 'pinia';
import { DictData } from '@/api/system/dict/dictData.model';
import { reactive } from 'vue';
import { store } from '/@/store';

export type Option = { label: string; value: string; disabled?: boolean };

export function dictToOptions(data: DictData[]): Option[] {
  return data.map((item) => ({
    label: item.dictLabel,
    value: item.dictValue,
  }));
}

interface DictState {
  dictMap: Map<string, DictData[]>;
}

export const useDictStore = defineStore('dict', {
  state: (): DictState => ({
    dictMap: reactive(new Map()),
  }),
  getters: {
    getDictMap(state) {
      return state.dictMap;
    },
  },
  actions: {
    getDict(dictName: string): DictData[] {
      if (!dictName) {
        return [];
      }
      return this.dictMap.get(dictName) ?? [];
    },
    setDict(dictName: string, dictValue: DictData[]): void {
      this.dictMap.set(dictName, dictValue);
    },
    // select组件用
    getDictOptions(dictName: string): Option[] {
      const dict = this.getDict(dictName);
      return dictToOptions(dict);
    },
    resetCache() {
      this.dictMap.clear();
    },
  },
});

export function useDictStoreWithOut() {
  return useDictStore(store);
}
