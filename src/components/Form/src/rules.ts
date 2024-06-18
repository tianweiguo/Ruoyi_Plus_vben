// import { Rule, RuleObject } from 'ant-design-vue/lib/form/interface';
import { Rule } from './types/form';

const PHONE_PATTERN = /^1[3,4,5,6,7,8,9][0-9]{9}$/;
const EMIAL_PATTERN = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;

interface RuleItem {
  phone: Rule[];
  email: Rule[];
}

export function useFormRules(
  required = false,
  trigger: 'blur' | 'change' | ['change', 'blur'] = 'change',
): RuleItem {
  const phone: Rule[] = [
    { required, message: '请输入正确的手机号码', pattern: PHONE_PATTERN, trigger },
  ];
  const email: Rule[] = [
    { required, message: '请输入正确的邮箱地址', pattern: EMIAL_PATTERN, trigger },
  ];

  return {
    phone,
    email,
  };
}
