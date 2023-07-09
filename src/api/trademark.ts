import request from '@/utils/request';

export interface TradeMarkData {
  id?: number;
  logoUrl: string;
  tmName: string;
}
interface TradeMarkPageListData {
  records: TradeMarkData[];
  total: number;
  size: number;
  current: number;
  searchCount: boolean;
  pages: number;
}
export default {
  // 获取品牌列表
  deleteTm(id: number) {
    return request.delete<any, null>(
      `/admin/product/baseTrademark/remove/${id}`
    );
  },
  // 添加/修改品牌
  addOrUpdate(trademark: TradeMarkData) {
    if (trademark.id) {
      request.put<any, null>(`/admin/product/baseTrademark/update`, trademark);
    } else {
      request.post<any, null>(`/admin/product/baseTrademark/save`, trademark);
    }
  },
  // 获取页码
  getPageList(page: number, limit: number) {
    return request.get<any, TradeMarkPageListData>(
      `/admin/product/baseTrademark/${page}/${limit}`
    );
  },
  // getTrademarkList 获取所有的品牌列表
  getAllTrademarkList() {
    return request.get<any, TradeMarkData[]>(
      `/admin/product/baseTrademark/getTrademarkList`
    );
  },
};
