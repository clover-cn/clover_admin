import { defineStore } from 'pinia';
import { getToken, removeToken, setToken } from '../utils/token-utils';
import type { UserInfoState } from './interface';
import { ElMessage } from 'element-plus';
import { staticRoutes } from '@/router/routes';
import type { LoginParamsData, UserInfoData } from '@/api/user';
import userApi from '@/api/user';
import trademarkApi from '@/api/trademark';
import type { RouteRecordRaw } from 'vue-router';
interface UserInfoStoreStataeData {
  token: string;
  userInfo: UserInfoData;
  menuRoutes: RouteRecordRaw[];
}
function initUserInfo() {
  return {
    routes: [],
    buttons: [],
    roles: [],
    name: '',
    avatar: '',
  };
}
export const useUserInfoStore = defineStore('userInfo', {
  state: (): UserInfoStoreStataeData => ({
    token: localStorage.getItem('token') || '', //token
    menuRoutes: staticRoutes,
    userInfo: initUserInfo(),
  }),

  actions: {
    // 登录
    async login(loginParams: LoginParamsData) {
      try {
        const res = await userApi.login(loginParams);
        this.token = res.token;
        localStorage.setItem('token', res.token);
        return 'ok';
      } catch (error) {
        return Promise.reject('fail');
      }
    },
    // 获取用户信息
    async getInfo() {
      try {
        const res = await userApi.info();
        this.userInfo = res;
        return 'ok';
      } catch (error) {
        return Promise.reject('fail');
      }
    },

    reset() {
      // 删除local中保存的token
      removeToken();
      // 提交重置用户信息的mutation
      this.token = '';
      localStorage.removeItem('token');
      this.userInfo = Object.assign(this.userInfo, initUserInfo());
    },
    async logout() {
      try {
        await userApi.logout();
        this.reset();
      } catch (error) {
        return Promise.reject('fail');
      }
    },
  },
});
