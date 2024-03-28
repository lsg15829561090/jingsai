// 从Vue库中导入computed函数，用于创建响应式计算属性
import { computed } from 'vue';
// 从echarts中导入EChartsOption类型，用于类型注解和智能提示
import { EChartsOption } from 'echarts';
// 从VueX存储中导入useAppStore，用于访问和操作全局状态
import { useAppStore } from '@/store';

// 定义一个类型optionsFn，它是一个函数类型，接受一个布尔值参数并返回任意类型
interface optionsFn {
  (isDark: boolean): any;
}

// 定义并导出useChartOption函数，该函数接收一个函数参数sourceOption
export default function useChartOption(sourceOption: optionsFn) {
  // 获取应用的全局状态
  const appStore = useAppStore();
  // 使用computed创建一个响应式计算属性isDark，用于判断当前主题是否为暗黑模式
  const isDark = computed(() => {
    return appStore.theme === 'dark';
  });

  // 使用computed创建另一个响应式计算属性chartOption
  // 它依赖于isDark的值，调用sourceOption函数生成对应主题的ECharts图表配置
  const chartOption = computed<EChartsOption>(() => {
    return sourceOption(isDark.value);
  });
  
  // 返回一个包含chartOption的对象
  return {
    chartOption,
  };
}
