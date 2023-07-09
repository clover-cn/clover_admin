<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelector></CategorySelector>
    </el-card>
    <el-card>
      <SpuList v-if="showState === 1" @addshow="addshow"></SpuList>
      <SpuForm v-else-if="showState === 2" @addshow="addshow" :spu="spu"></SpuForm>
      <SkuForm v-else :spu="spu" @addshow="addshow"></SkuForm>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'Spu',
});
</script>

<script lang="ts" setup>
import { ref } from 'vue';
import SpuList from './SpuList/index.vue';
import SpuForm from './SpuForm/index.vue';
import SkuForm from './SkuForm/index.vue';
import type { SpuData } from '@/api/spu';
const showState = ref(1);
const spu = ref<SpuData>({
  category3Id: '',
  description: '',
  tmId: '',
  spuName: '',
  spuImageList: [],
  spuSaleAttrList: [],
});
function addshow(num: number, row: SpuData) {
  showState.value = num;
  if (row) {
    spu.value = row;
  } else {
    spu.value = {
      category3Id: '',
      description: '',
      tmId: '',
      spuName: '',
      spuImageList: [],
      spuSaleAttrList: [],
    };
  }
}
</script>

<style scoped></style>
