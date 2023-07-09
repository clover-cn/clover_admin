import request from '@/utils/request';
export interface LoginParamsData {
  username: string;
  password: string;
}
interface TokenData {
  token: string;
}
export interface UserInfoData {
  routes: string[];
  buttons: string[];
  roles: string[];
  name: string;
  avatar: string;
}

export default {
  info() {
    return request.get<any, UserInfoData>('/admin/acl/index/info');
  },
  login(loginParams: LoginParamsData) {
    return request.post<any, TokenData>('/admin/acl/index/login', loginParams);
  },
  logout() {
    return request.post<any, null>('/admin/acl/index/logout');
  },
};
