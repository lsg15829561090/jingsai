// 从Vue中导入生命周期钩子函数
import { onMounted, onBeforeMount, onBeforeUnmount } from 'vue';
// 从@vueuse/core中导入useDebounceFn，用于创建防抖函数
import { useDebounceFn } from '@vueuse/core';
// 从Vuex存储中导入useAppStore，用于访问和操作全局状态
import { useAppStore } from '@/store';
// 导入事件监听器的添加和移除工具函数
import { addEventListen, removeEventListen } from '@/utils/event';

// 定义一个宽度常量，用于判断设备类型
const WIDTH = 992;

// queryDevice函数用于检测当前设备是否为移动设备，基于窗口宽度
function queryDevice() {
  // 获取文档体的宽度
  const rect = document.body.getBoundingClientRect();
  // 如果宽度小于WIDTH，则认为是移动设备
  return rect.width - 1 < WIDTH;
}

// 定义并导出useResponsive自定义钩子
export default function useResponsive(immediate?: boolean) {
  // 获取应用的全局状态存储实例
  const appStore = useAppStore();

  // resizeHandler函数在窗口尺寸变化时被调用
  function resizeHandler() {
    // 如果文档未隐藏，即处于激活状态
    if (!document.hidden) {
      // 判断当前是否为移动设备
      const isMobile = queryDevice();
      // 根据设备类型更新Vuex状态
      appStore.toggleDevice(isMobile ? 'mobile' : 'desktop');
      // 根据是否为移动设备，调整菜单的展示或隐藏
      appStore.toggleMenu(isMobile);
    }
  }

  // 使用useDebounceFn创建一个防抖函数，延迟100毫秒执行
  const debounceFn = useDebounceFn(resizeHandler, 100);

  // 在组件挂载后，如果immediate参数为真，则立即执行一次resizeHandler
  onMounted(() => {
    if (immediate) debounceFn();
  });

  // 在组件挂载前，为窗口的resize事件添加监听，使用防抖后的处理函数
  onBeforeMount(() => {
    addEventListen(window, 'resize', debounceFn);
  });

  // 在组件卸载前，移除窗口的resize事件监听
  onBeforeUnmount(() => {
    removeEventListen(window, 'resize', debounceFn);
  });
}
