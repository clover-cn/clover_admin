import request from '@/utils/request';
// 基础销售属性
interface BaseSaleAttrData {
  id?: number;
  name: string;
}
// 基础销售属性列表
export type BaseSaleAttrListData = BaseSaleAttrData[];

// spu图片
export interface SpuImageData {
  isDefault?: string;
  id?: number;
  imgName: string;
  imgUrl: string | undefined;
  spuId?: number;
  name?: string;
  url?: string;
  response?: ResponseData;
}
// spu图片列表
export type SpuImageListData = SpuImageData[];
// spu中销售属性值
interface SpuSaleAttrValueData {
  baseSaleAttrId?: number | undefined | string;
  id?: number;
  isChecked?: string;
  saleAttrName?: string;
  spuId?: number;
  saleAttrValueName?: string;
}
// spu中销售属性值列表
type SpuSaleAttrValueListData = SpuSaleAttrValueData[];
// spu销售属性
export interface SpuSaleAttrData {
  baseSaleAttrId?: number | undefined | string;
  id?: number;
  saleAttrName: string;
  spuId?: number;
  spuSaleAttrValueList: SpuSaleAttrValueListData;
  isEdit?: boolean;
  saleAttrValueName?: string;
  saleAttrIdValueId?: [];
}
export interface ResponseData {
  code: number;
  data: string;
  message: string;
  ok: boolean;
}
// spu中销售属性列表
export type SpuSaleAttrListData = SpuSaleAttrData[];
// spu
export type SpuData = {
  category3Id: string | number;
  description: string;
  id?: number;
  tmId?: number | string;
  spuName: string;
  spuImageList: SpuImageListData;
  spuSaleAttrList: SpuSaleAttrListData;
};
// spu列表
export type SpuListData = SpuData[];
// spu的分页列表
type SpuPageListData = {
  records: SpuListData;
  total: number;
  size: number;
  current: number;
  searchCount: boolean;
  pages: number;
};

export default {
  // GET  /admin/product/baseSaleAttrList
  // getBaseSaleAttrList 获取基础销售属性列表  之后咱们完成spu增加销售属性时 需要从基础销售属性中进行选择
  getBaseSaleAttrList() {
    return request.get<any, BaseSaleAttrListData>(
      `/admin/product/baseSaleAttrList`
    );
  },

  // DELETE /admin/product/deleteSpu/{spuId}
  // deleteSpu 删除spu
  deleteSpu(spuId: number) {
    return request.delete<any, null>(`/admin/product/deleteSpu/${spuId}`);
  },

  // POST /admin/product/saveSpuInfo
  // saveSpuInfo
  // POST /admin/product/updateSpuInfo
  // spu的增加和修改时 都需要调用这个接口
  addOrUpdate(spu: SpuData) {
    return request.post<any, null>(
      `/admin/product/${spu.id ? 'updateSpuInfo' : 'saveSpuInfo'}`,
      spu
    );
  },

  // GET /admin/product/{page}/{limit}
  // 获取spu的分页列表  留意要增加category3Id这个参数 是query参数!!!
  pageSpuList(page: number, limit: number, category3Id: number) {
    return request.get<any, SpuPageListData>(
      `/admin/product/${page}/${limit}?category3Id=${category3Id}`
    );
  },
};
