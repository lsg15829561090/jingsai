// 从vue-router库中导入useRouter钩子，用于程序化地进行路由导航
import { useRouter } from 'vue-router';
// 从vue-i18n库中导入useI18n钩子，用于支持国际化
import { useI18n } from 'vue-i18n';
// 导入@opentiny/vue库中的Modal组件，用于显示消息提示框
import { Modal } from '@opentiny/vue';
// 从Vuex存储中导入useUserStore，用于访问和操作用户状态
import { useUserStore } from '@/store';

// 定义并导出useUser自定义钩子
export default function useUser() {
  // 使用useI18n钩子获取t函数，用于翻译文本
  const { t } = useI18n();
  // 使用useRouter钩子获取router实例，用于导航控制
  const router = useRouter();
  // 获取用户状态存储实例
  const userStore = useUserStore();

  // 定义logout函数，用于处理用户登出逻辑
  const logout = async (logoutTo?: string) => {
    // 调用userStore的logout方法执行登出操作
    await userStore.logout();
    // 获取当前路由信息
    const currentRoute = router.currentRoute.value;
    // 使用Modal组件显示登出成功的消息
    Modal.message({
      message: t('setting.loginout'), // 使用t函数翻译消息内容
      status: 'success', // 设置消息状态为成功
    });
    // 导航到登出后的目标页面，如果没有指定，则导航到登录页面
    router.push({
      name: logoutTo && typeof logoutTo === 'string' ? logoutTo : 'login',
      // 保持当前路由的查询参数，并添加redirect参数指向当前路由名称
      query: {
        ...currentRoute.query,
        redirect: currentRoute.name as string,
      },
    });
  };
  
  // 返回logout函数，使其在组件中可用
  return {
    logout,
  };
}
