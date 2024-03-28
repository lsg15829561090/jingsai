// 从Vue库中导入ref（用于创建响应式变量）和UnwrapRef（用于类型推导）
import { ref, UnwrapRef } from 'vue';
// 从axios库中导入AxiosResponse类型，用于类型注解HTTP响应
import { AxiosResponse } from 'axios';
// 导入HttpResponse类型，它应该是你自定义的接口，用来描述HTTP响应的通用结构
import { HttpResponse } from '@/api/interceptor';
// 导入useLoading自定义钩子，用于管理加载状态
import useLoading from './loading';

/**
 * 自定义钩子useRequest用于发起HTTP请求并处理响应。
 * 
 * @param api 一个返回Promise的函数，通常是对axios请求的封装。
 * @param defaultValue 请求结果的默认值，用于初始化响应数据。
 * @param isLoading 初始化时是否显示加载状态，默认为true。
 * @returns 返回loading状态和响应数据。
 * 
 * 注意：不要在async函数中直接使用此钩子，因为它内部使用了.then链式调用来处理Promise。
 * 如果需要传递参数给api函数，使用Function.prototype.bind来预设参数值。
 */
export default function useRequest<T>(
  api: () => Promise<AxiosResponse<HttpResponse>>, // API函数，返回一个Promise
  defaultValue = [] as unknown as T, // 默认值，强制转型为泛型T
  isLoading = true // 初始加载状态
) {
  // 使用useLoading钩子来管理加载状态
  const { loading, setLoading } = useLoading(isLoading);
  // 创建一个响应式变量response，用于存储请求结果
  const response = ref<T>(defaultValue);

  // 调用API函数，处理响应结果
  api()
    .then((res) => {
      // 将响应数据赋值给response
      response.value = res.data as unknown as UnwrapRef<T>;
    })
    .finally(() => {
      // 不论请求成功还是失败，最终都会关闭加载状态
      setLoading(false);
    });

  // 返回加载状态和响应数据
  return { loading, response };
}
