// 导入Vue Router的Router类型和LocationQueryRaw类型，用于类型检查
import type { Router, LocationQueryRaw } from 'vue-router';
// 导入NProgress，一个轻量级的进度条插件
import NProgress from 'nprogress';

// 导入自定义的usePermission钩子，用于权限检查
import usePermission from '@/hooks/permission';
// 从Vuex存储中导入useUserStore，用于访问和操作用户状态
import { useUserStore } from '@/store';
// 导入isLogin工具函数，用于检查用户是否登录
import { isLogin } from '@/utils/auth';
// 导入应用的路由配置
import appRoutes from '../routes';

// 定义并导出setupPermissionGuard函数，用于设置权限守卫
export default function setupPermissionGuard(router: Router) {
  // 在路由跳转之前，为每个路由添加一个前置守卫
  router.beforeEach(async (to, from, next) => {
    // 开始显示进度条
    NProgress.start();
    // 获取用户状态存储
    const userStore = useUserStore();

    // 定义一个内部函数crossroads，用于根据权限控制路由跳转
    async function crossroads() {
      // 使用usePermission钩子获取权限检查逻辑
      const Permission = usePermission();
      // 检查用户是否有权限访问目标路由
      if (Permission.accessRouter(to)) next();
      else {
        // 如果没有权限，寻找用户有权限访问的第一个路由作为跳转目标
        const destination = Permission.findFirstPermissionRoute(
          appRoutes,
          userStore.role
        ) || {
            name: 'notFound',
          } || {
            name: 'preview',
          };
        // 执行跳转到有权限的路由或者预览/404页面
        next(destination);
      }
      // 完成进度条
      NProgress.done();
    }

    // 检查用户是否已登录
    if (isLogin()) {
      if (userStore.role) {
        // 如果用户已登录且角色已定义，进行权限检查和路由跳转
        crossroads();
      } else {
        // 如果用户角色未定义，尝试获取用户信息
        try {
          await userStore.info();
          crossroads();
        } catch (error) {
          // 获取用户信息失败，重定向到登录页面
          next({
            name: 'login',
            query: {
              redirect: to.name,
              ...to.query,
            } as LocationQueryRaw,
          });
          NProgress.done();
        }
      }
    } else {
      // 用户未登录，直接跳转到登录页面或者预览页面
      if (to.name === 'login' || to.name === 'preview') {
        next();
        NProgress.done();
        return;
      }
      next({
        name: 'login',
        query: {
          redirect: to.name,
          ...to.query,
        } as LocationQueryRaw,
      });
      NProgress.done();
    }
  });
}
