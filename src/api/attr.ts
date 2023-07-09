import request from '@/utils/request';
// export type AttrListData = AttrData[];
// export interface AttrData {
//   id?: number;
//   attrName: string;
//   categoryId: number;
//   categoryLevel: number;
//   attrValueList: AttrValueList[];
//   attrId?: number | undefined;
//   attrIdValueId?: [];
// }
// export interface AttrValueList {
//   id?: number;
//   valueName: string;
//   attrId: number | undefined;
//   isEdit?: boolean;
// }
export interface AttrValueData {
  id?: number;
  valueName: string;
  attrId: number | undefined;
  isEdit?: boolean;
}
export type AttrValueListData = AttrValueData[];
export interface AttrData {
  id?: number;
  attrName: string;
  categoryId: number;
  categoryLevel: number;
  attrValueList: AttrValueListData;
  attrIdValueId?: string;
}
export type AttrListData = AttrData[];
export default {
  attrInfoList(category1Id: number, category2Id: number, category3Id: number) {
    return request.get<any, AttrListData>(
      `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`
    );
  },
  deleteAttr(attrId: number) {
    return request.delete<any, null>(`/admin/product/deleteAttr/${attrId}`);
  },
  // 添加和修改
  saveAttrInfo() {
    return request.post<any, AttrData>('/admin/product/saveAttrInfo');
  },
};
// GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
// attrInfoList
// DELETE /admin/product/deleteAttr/{attrId}
// deleteAttr
// GET /admin/product/getAttrValueList/{attrId}
// getAttrValueList
// POST /admin/product/saveAttrInfo
// saveAttrInfo
