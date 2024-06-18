/**
 * Pinia Persist Plugin
 * Pinia 持久化插件
 * @link https://prazdevs.github.io/pinia-plugin-persistedstate/zh/guide/
 *
 */
import type { Pinia } from 'pinia';
import { createPersistedState } from 'pinia-plugin-persistedstate';
import type { PersistedStateFactoryOptions } from 'pinia-plugin-persistedstate';
import { getCommonStoragePrefix } from '@/utils/env';

export const PERSIST_KEY_PREFIX = getCommonStoragePrefix();

// TODO customSerializer

/**
 * Register Pinia Persist Plugin
 * 注册 Pinia 持久化插件
 *
 * @param pinia Pinia instance Pinia 实例
 */
export function registerPiniaPersistPlugin(pinia: Pinia) {
  pinia.use(createPersistedState(createPersistedStateOptions()));
}

/**
 * Create Persisted State Options
 * 创建持久化状态选项
 *
 * @param keyPrefix prefix for storage key 储存键前缀
 * @returns persisted state factory options
 */
export function createPersistedStateOptions(): PersistedStateFactoryOptions {
  return {
    storage: localStorage,
    /**
     * 这里有bug导致不会持久化 主要是${keyPrefix} 原因未知
     * 使用固定key前缀或者不使用能正常工作
     */
    // key: (id) => `${keyPrefix}__${id}`,
  };
}
