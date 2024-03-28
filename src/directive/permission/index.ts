// 引入Vue的DirectiveBinding类型和Vuex中的useUserStore函数
import { DirectiveBinding } from 'vue';
import { useUserStore } from '@/store';

// 定义一个检查权限的函数，它将根据绑定值（用户角色数组）来决定是否移除元素
function checkPermission(el: HTMLElement, binding: DirectiveBinding) {
  // 从binding中解构出value，即v-permission指令绑定的值
  const { value } = binding;
  // 使用useUserStore来访问Vuex中的用户状态
  const userStore = useUserStore();
  // 从userStore中获取当前用户的角色
  const { role } = userStore;

  // 检查绑定值是否为数组类型
  if (Array.isArray(value)) {
    // 如果数组不为空
    if (value.length > 0) {
      // 获取指令绑定的权限值数组
      const permissionValues = value;

      // 检查当前用户的角色是否在权限数组中
      const hasPermission = permissionValues.includes(role);
      // 如果用户没有权限且元素有父节点，则从DOM中移除该元素
      if (!hasPermission && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    }
  } else {
    // 如果绑定的值不是数组，抛出错误提示需要指定角色数组
    throw new Error(`need roles! Like v-permission="['admin','user']"`);
  }
}

export default {
  // 自定义指令挂载时调用检查权限的函数
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    checkPermission(el, binding);
  },
  // 自定义指令更新时调用检查权限的函数
  updated(el: HTMLElement, binding: DirectiveBinding) {
    checkPermission(el, binding);
  },
};
