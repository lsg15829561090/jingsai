import axios from 'axios';
import { UserInfo } from '@/store/modules/user/types';
// 用户登录
export interface LoginData {
  username: string;
  password: string;
}
// 用户邮箱登录
export interface LoginDataMail {
  mailname: string;
  mailpassword: string;
}
// 用户信息
export interface LoginRes {
  token: string;
  userInfo: UserInfo;
}
// 获取用户数据
export interface UserRes {
  chartData: [];
  tableData: [];
}
// 更新用户数据
export interface UserData {
  sort?: number | undefined;
  startTime?: string;
  endTime?: string;
  filterStatus?: [];
  filterType?: [];
}

// 登录
export function login(data: LoginData) {
  return axios.post<LoginRes>('/api/user/login', data);
}
// 邮件登录
export function loginMail(data: LoginDataMail) {
  return axios.post<LoginRes>('/api/mail/login', data);
}
// 退出登录
export function logout() {
  return axios.post<LoginRes>('/api/user/logout');
}
// 获取用户信息
export function getUserInfo() {
  return axios.get<UserInfo>(`/api/user/userInfo`);
}
// 更新用户信息
export function updateUserInfo(data: UserInfo) {
  return axios.put<UserInfo>(`/api/user/userInfo`, data);
}
// 获取用户数据
export function getUserData(data?: UserData) {
  return axios.post<UserRes>('/api/user/data', data);
}
// 用户注册
export function registerUser(data: LoginData) {
  return axios.post<UserInfo>('/api/user/register', data);
}
// -----------------------------------------------------------------
// 教师登录
export interface TeaLoginData {
  teacherld: string;
  password: string;
}
export function tealogin(data: TeaLoginData) {
  return axios.post<LoginRes>('/teacher/login', data);
}
// 学生登录
export interface StuLoginData {
  studentld: string;
  password: string;
}
export function stulogin(data: StuLoginData) {
  return axios.post<LoginRes>('/student/login', data);
}