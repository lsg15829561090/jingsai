// 从'vue-router'导入RouteRecordRaw类型，用于类型检查和智能提示
import type { RouteRecordRaw } from 'vue-router';

// 使用import.meta.globEager来静态地导入所有匹配'./modules/*.ts'模式的模块。
// 这会在构建时解析，并包含在最终的JavaScript包中。
const modules = import.meta.globEager('./modules/*.ts');

// 初始化一个空数组，用于存储应用的所有路由配置
const appRoutes: RouteRecordRaw[] = [];

// 遍历modules对象的所有键（文件路径）
Object.keys(modules).forEach((key) => {
  // 获取每个模块的默认导出
  const defaultModule = modules[key].default;
  // 如果模块没有默认导出，则跳过当前迭代
  if (!defaultModule) return;
  // 判断模块的默认导出是否为数组，以支持单个路由配置或路由配置数组的导出
  const moduleList = Array.isArray(defaultModule)
    ? [...defaultModule] // 如果是数组，则直接使用
    : [defaultModule]; // 如果不是数组，将其转换为数组
  // 将处理后的路由配置数组合并到appRoutes中
  appRoutes.push(...moduleList);
});

// 导出appRoutes数组，包含项目中所有通过模块动态导入的路由配置
export default appRoutes;
