<template>
  <div>
    <el-button type="primary" size="default" icon="ele-Plus" @click="addSpu">添加SPU</el-button>
    <el-table :data="spuPageList" border style="margin: 20px 0">
      <el-table-column label="序号" type="index" align="center" width="80"></el-table-column>
      <el-table-column label="SPU名称" prop="spuName"></el-table-column>
      <el-table-column label="SPU描述" prop="description"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="{ row, $index }">
          <el-button @click="addSku(row)" type="success" size="small" icon="ele-Plus" title="添加sku"></el-button>
          <el-button type="warning" size="small" icon="ele-Edit" title="修改spu" @click="editSpu(row)"></el-button>
          <el-button type="info" size="small" icon="ele-InfoFilled" title="查看sku列表"></el-button>
          <el-button type="danger" size="small" icon="ele-Delete" title="删除spu" @click="deleteSpu(row.id)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="page" v-model:page-size="limit" :page-sizes="[3, 5, 7, 9]"
      layout="prev, pager, next, jumper, ->, sizes, total" :total="total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'SpuList',
});
</script>

<script lang="ts" setup>
import { ref, watch, type Ref } from 'vue';
import SpuApi, { type SpuData, type SpuListData } from '@/api/spu';
import { useCategoryStore } from '@/stores/category';
import { storeToRefs } from 'pinia';
import { ElMessage } from 'element-plus';
// const props = defineProps(['addshow']);
const emit = defineEmits(['addshow']);
const categoryStore = useCategoryStore();
const { category3Id, spuPageList1 } = storeToRefs(categoryStore);
const page = ref(1); //当前页码
const limit = ref(3); //每页条数
const total = ref(0); //总数
const spuPageList = ref<SpuListData>([]); //spu列表
// 获取spu列表
async function getSpuPageList() {
  try {
    const res = await SpuApi.pageSpuList(
      page.value,
      limit.value,
      category3Id.value as number
    );
    spuPageList.value = res.records;
    total.value = res.total;
    // (spuPageList1 as Ref).value = res.records;
  } catch (error) {
    ElMessage.error('获取spu列表失败');
  }
}

// 页大小发生变化
function handleSizeChange(val: number) {
  limit.value = val;
  getSpuPageList();
}
// 页码改变
function handleCurrentChange(val: number) {
  page.value = val;
  getSpuPageList();
}
// 删除spu
async function deleteSpu(id: number) {
  try {
    await SpuApi.deleteSpu(id);
    ElMessage.success('删除成功');
    getSpuPageList();
  } catch (error) {
    ElMessage.error('删除失败');
  }
}
// 添加spu
function addSpu() {
  if (!category3Id.value) {
    ElMessage.warning('请选择分类');
    return;
  }
  emit('addshow', 2);
}
// 修改spu
function editSpu(row: SpuData) {
  (spuPageList1 as Ref).value = row;
  emit('addshow', 2, row);
}
function addSku(row: SpuData) {
  emit('addshow', 3, row);
}
watch(
  category3Id,
  () => {
    getSpuPageList();
  },
  { immediate: true }
);
</script>

<style scoped></style>
