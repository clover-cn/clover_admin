import request from '@/utils/request';

export type CategoryListData = CategoryData[];

interface CategoryData {
  id: number;
  name: string;
  category1Id?: number;
  category2Id?: number;
}
export default {
  getCategory1() {
    return request.get<any, CategoryListData>('/admin/product/getCategory1');
  },
  getCategory2(category1Id: number) {
    return request.get<any, CategoryListData>(
      `/admin/product/getCategory2/${category1Id}`
    );
  },
  getCategory3(category2Id: number) {
    return request.get<any, CategoryListData>(
      `/admin/product/getCategory3/${category2Id}`
    );
  },
};
// GET  /admin/product/getCategory1
// GET /admin/product/getCategory2/{category1Id}
// GET /admin/product/getCategory3/{category2Id}
