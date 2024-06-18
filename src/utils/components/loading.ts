import { useLoading as useLodingComponent } from '/@/components/Loading';
/**
 * todo 可能要重构
 * @param tip
 * @returns
 */
export function useLoading(tip = '加载中...') {
  return useLodingComponent({
    target: document.body,
    props: {
      tip,
    },
  });
}
