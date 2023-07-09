<template>
  <div>
    <el-card style="margin: 20px 0;">
      <el-table :data="skuPageList" border stripe>
        <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
        <el-table-column label="名称" prop="skuName"></el-table-column>
        <el-table-column label="描述" prop="skuDesc"></el-table-column>
        <el-table-column label="默认图片">
          <template v-slot="{ row, $index }">
            <el-image style="width: 100px; " :src="row.skuDefaultImg"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="重量" prop="weight"></el-table-column>
        <el-table-column label="价格" prop="price"></el-table-column>
        <el-table-column label="操作" align="center" width="251px">
          <template v-slot="{ row, $index }">
            <el-button @click="onSale(row)" v-if="row.isSale === 0" type="success" size="small" icon="ele-Top"
              title="上架"></el-button>
            <el-button @click="cancekSale(row)" v-else type="info" size="small" icon="ele-Bottom" title="下架"></el-button>
            <el-button @click="editSku" type="warning" size="small" icon="ele-Edit" title="修改sku"></el-button>
            <el-button @click="lookSkuDetail(row)" type="info" size="small" icon="ele-InfoFilled"
              title="查看sku详情"></el-button>
            <el-button @click="deleteSku(row)" type="danger" size="small" icon="ele-Delete" title="删除sku"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--  @current-change="handleCurrentChange" -->
      <el-pagination v-model:current-page="page" v-model:page-size="limit" :page-sizes="[3, 5, 7, 9]"
        layout="prev, pager, next, jumper" :total="total" @current-change="getPageSkuList" />
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "Sku",
});
</script>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import skuApi, { type SkuListData, type SkuData } from '@/api/sku'
import { ElMessage } from 'element-plus';
const page = ref(1) // 当前页
const limit = ref(8) // 每页总条数
const total = ref(0) // 开始页
const skuPageList = ref<SkuListData>([]) //sku分页列表
// 获取sku分页列表
async function getPageSkuList() {
  let res = await skuApi.pageSkuList(page.value, limit.value)
  skuPageList.value = res.records
  total.value = res.total
  console.log(res.records);
}
onMounted(() => {
  getPageSkuList()
})
// 上架
async function onSale(row: SkuData) {
  console.log(row.id);
  try {
    await skuApi.onSale(row.id as number)
    ElMessage.success('下架成功')
    getPageSkuList()
  } catch (error) {
    ElMessage.error('下架失败')
  }
  // row.isSale = 1
}
// 下架
async function cancekSale(row: SkuData) {
  try {
    await skuApi.cancelSale(row.id as number)
    getPageSkuList()
    ElMessage.success('上架成功')
  } catch (error) {
    ElMessage.error('上架失败')
  }
}
// 修改sku
function editSku() { }
// 查看sku详情
function lookSkuDetail(row: SkuData) { }
// 删除sku
async function deleteSku(row: SkuData) {
  try {
    await skuApi.deleteSku(row.id as number)
    if (skuPageList.value.length === 1) {
      page.value -= 1
    }
    getPageSkuList()
    ElMessage.success('删除成功')
  } catch (error) {
    ElMessage.error('删除失败')
  }
}
</script>

<style scoped></style>
