import type { RouteLocationNormalized } from 'vue-router'; // 导入 Vue Router 相关类型
import { defineStore } from 'pinia'; // 导入 Pinia 的 defineStore 函数
import { TabBarState, TagProps } from './types'; // 导入类型定义

// 格式化标签函数，用于将路由信息格式化为标签对象
const formatTag = (route: RouteLocationNormalized): TagProps => {
  const { name, meta, fullPath, query } = route;
  return {
    title: meta.locale || '', // 标题，可根据需要修改
    name: String(name), // 路由名称转换为字符串类型
    fullPath, // 完整路径
    query, // 查询参数
  };
};

// 定义标签栏状态存储库
const useAppStore = defineStore('tabBar', {
  // 定义状态
  state: (): TabBarState => ({
    cacheTabList: new Set(), // 缓存的标签列表
    tagList: [
      // 初始化标签列表，可根据需要设置初始值
      {
        title: 'menu.dashboard.workplace', // 标签标题，可根据需要修改
        name: 'Workplace', // 标签名称，可根据需要修改
        fullPath: '/dashboard/workplace', // 完整路径，可根据需要修改
      },
    ],
  }),

  // 定义 getters
  getters: {
    // 获取标签列表
    getTabList(): TagProps[] {
      return this.tagList;
    },
    // 获取缓存的标签列表
    getCacheList(): string[] {
      return Array.from(this.cacheTabList);
    },
  },

  // 定义 actions
  actions: {
    // 更新标签列表
    updateTabList(route: RouteLocationNormalized) {
      this.tagList.push(formatTag(route)); // 添加新的标签对象到标签列表
      if (!route.meta.ignoreCache) {
        this.cacheTabList.add(route.name as string); // 如果路由没有设置 ignoreCache，则将其名称添加到缓存列表中
      }
    },
    // 删除标签
    deleteTag(idx: number, tag: TagProps) {
      this.tagList.splice(idx, 1); // 从标签列表中删除指定索引位置的标签
      this.cacheTabList.delete(tag.name); // 从缓存列表中删除指定名称的标签
    },
  },
});

export default useAppStore; // 导出标签栏状态存储库
