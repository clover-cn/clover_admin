import request from '@/utils/request';
// sku销售属性值类型
interface SkuSaleAttrValueData {
  id?: number;
  skuId?: number;
  spuId?: number;
  saleAttrValueId?: number;
  saleAttrId?: number;
  saleAttrName?: string;
  saleAttrValueName?: string;
  spuSaleAttrValueList?: [];
}

// sku销售属性值列表的类型
export type SkuSaleAttrValueListData = SkuSaleAttrValueData[];

// sku平台属性值类型
interface SkuAttrValue {
  id?: number;
  attrId?: number | string;
  valueId?: number | string;
  skuId?: number;
  attrName?: string;
  valueName?: string;
}

// sku平台属性值列表类型
export type SkuAttrValueListData = SkuAttrValue[];

// sku图片类型
interface SkuImageData {
  id?: number;
  skuId?: number;
  imgName: string;
  imgUrl: string;
  spuImgId?: number;
  isDefault?: string;
}

// sku图片列表类型
export type SkuImageListData = SkuImageData[];

// sku类型
export interface SkuData {
  id?: number;
  spuId?: number;
  price?: number | string;
  skuName: string;
  skuDesc: string;
  weight: string;
  tmId?: number;
  category3Id: number | string;
  skuDefaultImg: string | undefined;
  isSale: number | string;
  createTime: string;
  skuImageList: SkuImageListData;
  skuAttrValueList: SkuAttrValueListData;
  skuSaleAttrValueList: SkuSaleAttrValueListData;
}

// sku列表类型
export type SkuListData = SkuData[];

// sku分页列表的类型
interface SkuPageListData {
  records: SkuListData;
  total: number;
  size: number;
  current: number;
  searchCount: boolean;
  pages: number;
}
export default {
  // GET  /admin/product/cancelSale/{skuId}
  // cancelSale 下架
  cancelSale(skuId: number) {
    return request.get<any, null>(`/admin/product/cancelSale/${skuId}`);
  },
  // GET /admin/product/onSale/{skuId}
  // onSale 上架
  onSale(skuId: number) {
    return request.get<any, null>(`/admin/product/onSale/${skuId}`);
  },
  // DELETE /admin/product/deleteSku/{skuId}
  // deleteSku 删除sku
  deleteSku(skuId: number) {
    return request.delete<any, null>(`/admin/product/deleteSku/${skuId}`);
  },
  // GET /admin/product/findBySpuId/{spuId}
  // findBySpuId 通过spuid获取sku的列表
  findBySpuId(spuId: number) {
    return request.get<any, SkuListData>(`/admin/product/findBySpuId/${spuId}`);
  },
  // GET /admin/product/getSkuById/{skuId}
  // getById 根据sku的id获取sku的详情
  getById(skuId: number) {
    return request.get<any, SkuData>(`/admin/product/getSkuById/${skuId}`);
  },
  // GET /admin/product/list/{page}/{limit}
  // index 获取sku的分页列表
  pageSkuList(page: number, limit: number) {
    return request.get<any, SkuPageListData>(
      `/admin/product/list/${page}/${limit}`
    );
  },
  // POST /admin/product/saveSkuInfo
  // saveSkuInfo 添加sku
  saveSkuInfo(sku: SkuData) {
    return request.post<any, null>(`/admin/product/saveSkuInfo`);
  },
  // GET /admin/product/spuImageList/{spuId}
  // getSpuImageList 获取spu的图片列表
  getSpuImageList(spuId: number) {
    return request.get<any, SkuImageListData>(
      `/admin/product/spuImageList/${spuId}`
    );
  },
  // GET /admin/product/spuSaleAttrList/{spuId}
  // getSpuSaleAttrList  获取spu销售属性列表
  getSpuSaleAttrList(spuId: number) {
    return request.get<any, SkuSaleAttrValueListData>(
      `/admin/product/spuSaleAttrList/${spuId}`
    );
  },
};
