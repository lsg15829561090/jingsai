// 导入Vue Router的类型定义，用于类型注解
import { RouteLocationNormalized, RouteRecordRaw } from 'vue-router';
// 从Vuex存储中导入useUserStore，用于访问和操作用户状态
import { useUserStore } from '@/store';

// 定义并导出自定义钩子usePermission
export default function usePermission() {
  // 使用useUserStore获取用户状态存储实例
  const userStore = useUserStore();
  
  // 返回包含权限检查方法的对象
  return {
    // 检查当前用户是否有权限访问给定路由
    accessRouter(route: RouteLocationNormalized | RouteRecordRaw) {
      return (
        // 检查路由是否不要求认证，或不指定角色，或对所有角色开放，或包含用户角色
        !route.meta?.requiresAuth ||
        !route.meta?.roles ||
        route.meta?.roles?.includes('*') ||
        route.meta?.roles?.includes(userStore.role)
      );
    },
    // 找到用户有权限访问的第一个路由
    findFirstPermissionRoute(_routers: any, role = 'admin') {
      // 创建路由数组的副本
      const cloneRouters = [..._routers];
      // 循环遍历路由数组
      while (cloneRouters.length) {
        const firstElement = cloneRouters.shift();
        // 检查当前路由的roles是否包含用户角色或'*'
        if (
          firstElement?.meta?.roles?.find((el: string[]) => {
            return el.includes('*') || el.includes(role);
          })
        )
          // 如果找到符合条件的路由，返回该路由的名称
          return { name: firstElement.name };
        // 如果当前路由有子路由，将子路由加入遍历列表
        if (firstElement?.children) {
          cloneRouters.push(...firstElement.children);
        }
      }
      // 如果没有找到符合条件的路由，返回null
      return null;
    },
    // 待添加
  };
}
