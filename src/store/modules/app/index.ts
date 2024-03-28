import { defineStore } from 'pinia';
import defaultSettings from '@/config/settings.json'; // 导入默认设置
import { AppState } from './types'; // 导入类型定义

// 定义应用状态存储库
const useAppStore = defineStore('app', {
  // 定义状态
  state: (): AppState => ({ ...defaultSettings }), // 初始状态为默认设置

  // 定义 getters
  getters: {
    // 获取当前应用设置
    appCurrentSetting(state: AppState): AppState {
      return { ...state };
    },
    // 获取当前设备类型
    appDevice(state: AppState) {
      return state.device;
    },
  },

  // 定义 actions
  actions: {
    // 更新应用设置
    updateSettings(partial: Partial<AppState>) {
      // @ts-ignore-next-line
      this.$patch(partial);
    },

    // 更新步骤
    updateStep(step: number) {
      this.step = step;
    },

    // 切换设备类型
    toggleDevice(device: string) {
      this.device = device;
    },

    // 切换菜单显示状态
    toggleMenu(value: boolean) {
      this.hideMenu = value;
    },

    // 设置主题轻色调颜色
    setthemeLightColors(themeLightColors: any) {
      this.themeLightColors = themeLightColors;
    }
  },
});

export default useAppStore;
