// 从'vue-router'导入Router类型，这是为了类型检查和智能提示
import type { Router } from 'vue-router';
// 导入工具函数setRouteEmitter，用于在路由变化时发出事件
import { setRouteEmitter } from '@/utils/route-listener';
// 导入setupPermissionGuard函数，用于设置路由权限守卫
import setupPermissionGuard from './permission';

// 设置页面守卫，接收一个router实例作为参数
function setupPageGuard(router: Router) {
  // 在路由跳转之前，为每个路由添加一个前置守卫
  router.beforeEach(async (to) => {
    // 调用setRouteEmitter函数，并将即将跳转的路由对象作为参数传递
    // 这里的目的是在路由发生变化时，通过某种机制（如EventBus或VueX）通知应用其他部分
    setRouteEmitter(to);
  });
}

// 创建并设置路由守卫
export default function createRouteGuard(router: Router) {
  // 调用setupPageGuard函数，传入router实例来设置页面守卫
  setupPageGuard(router);
  // 判断环境变量中是否启用了MOCK（模拟数据）
  // 如果启用了MOCK，那么将额外设置权限守卫
  if(import.meta.env.VITE_USE_MOCK) setupPermissionGuard(router);
}
