import { defineStore } from 'pinia';
import { ElMessage } from 'element-plus';
import categoryApi, { type CategoryListData } from '@/api/category';
import type { SpuData } from '@/api/spu';
interface CategoryStoreStataData {
  category1Id: number | string;
  category2Id: number | string;
  category3Id: number | string;
  category1List: CategoryListData;
  category2List: CategoryListData;
  category3List: CategoryListData;
  spuPageList1: SpuData;
}

export const useCategoryStore = defineStore('categorys', {
  state: (): CategoryStoreStataData => ({
    category1Id: '', //选中的一级分类id
    category2Id: '', //选中的二级分类id
    category3Id: '', //选中的三级分类id
    category1List: [], //一级分类列表
    category2List: [], //二级分类列表
    category3List: [], //三级分类列表
    // spuPageList1: [],
    spuPageList1: {
      category3Id: '',
      description: '',
      spuName: '',
      spuImageList: [],
      spuSaleAttrList: [],
    }, //spu列表
  }),
  actions: {
    async getCategory1List() {
      try {
        const res = await categoryApi.getCategory1();
        this.category1List = res;
      } catch (error) {
        ElMessage.error('获取一级分类列表失败');
      }
    },
    async getCategory2List(category1Id: number) {
      this.category2Id = '';
      this.category3Id = '';
      this.category3List = [];
      try {
        const res = await categoryApi.getCategory2(category1Id);
        this.category2List = res;
      } catch (error) {
        ElMessage.error('获取二级分类列表失败');
      }
    },
    async getCategory3List(category2Id: number) {
      this.category3Id = '';
      try {
        const res = await categoryApi.getCategory3(category2Id);
        this.category3List = res;
      } catch (error) {
        ElMessage.error('获取三级分类列表失败');
      }
    },
  },
  getters: {},
});
