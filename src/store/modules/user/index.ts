// 导入vuex定义函数
import { defineStore } from 'pinia';
import {
  // 导入需要的 API 函数
  // 用户登录
  login as userLogin,
  // 教师登录
  tealogin,
  // 学生登录
  stulogin,
  // 邮件登录
  loginMail as userLoginMail,
  // 获取用户信息
  getUserInfo,
  // 更新用户信息
  updateUserInfo,
  // 用户数据
  LoginData,
  // 用户邮件数据
  LoginDataMail,
  StuLoginData,
  TeaLoginData
} from '@/api/user';
// 导入token相关内容
import { setToken, clearToken } from '@/utils/auth';
import { removeRouteListener } from '@/utils/route-listener';
import { UserState, UserInfo } from './types';

// 定义用户存储库
const useUserStore = defineStore('user', {
  // 定义状态
  state: (): UserState => ({
    // 用户信息的初始状态
    userId: '10000',
    username: 'admin',
    department: 'Tiny-Vue-Pro',
    employeeType: 'social recruitment',
    job: 'Front end',
    probationStart: '2021-04-19',
    probationEnd: '2021-10-15',
    probationDuration: '180',
    protocolStart: '2021-04-19',
    protocolEnd: '2024-04-19',
    address: '',
    status: '',
    role: '',
    sort: 1,
    startTime: '',
    endTime: '',
    filterStatus: [],
    filterType: [],
    submit: false,
    reset: false,
  }),

  // 定义 getters
  getters: {
    // 获取用户信息
    userInfo(state: UserState): UserState {
      return { ...state };
    },
  },

  // 定义 actions
  actions: {
    // 切换用户角色
    switchRoles() {
      return new Promise((resolve) => {
        this.role = this.role === 'user' ? 'admin' : 'user';
        resolve(this.role);
      });
    },

    // 设置用户信息
    setInfo(partial: Partial<UserState>) {
      this.$patch(partial);
    },

    // 重置用户信息
    resetInfo() {
      this.$reset();
    },

    // 重置筛选信息
    resetFilterInfo() {
      this.startTime = '';
      this.endTime = '';
      this.filterStatus = [];
      this.filterType = [];
    },

    // 获取用户信息
    async info() {
      const res = await getUserInfo();
      this.setInfo(res.data);
    },

    // 更新用户信息
    async updateInfo(data: UserInfo) {
      const res = await updateUserInfo(data);
      this.setInfo(res.data);
    },

    // 用户登录
    async login(loginForm: LoginData) {
      try {
        const res = await userLogin(loginForm);
        const { token, userInfo } = res.data;
        setToken(token);
        this.setInfo(userInfo);
      } catch (err) {
        clearToken();
        throw err;
      }
    },
    // 学生登录
    async stulogin(loginForm: StuLoginData) {
      try {
        const res = await stulogin(loginForm);
        const { token, userInfo } = res.data;
        setToken(token);
        this.setInfo(userInfo);
      } catch (err) {
        clearToken();
        throw err;
            }
          },
      // 教师登录
      async tealogin(loginForm: TeaLoginData) {
        try {
          const res = await tealogin(loginForm);
          const { token, userInfo } = res.data;
          setToken(token);
          this.setInfo(userInfo);
        } catch (err) {
          clearToken();
          throw err;
        }
      },
          // 通过邮件登录
    async loginMail(loginForm: LoginDataMail) {
      try {
        const res = await userLoginMail(loginForm);
        setToken(res.data.token);
      } catch (err) {
        clearToken();
        throw err;
      }
    },

    // 用户登出
    async logout() {
      this.resetInfo();
      clearToken();
      removeRouteListener();
    },
  },
});

export default useUserStore;
