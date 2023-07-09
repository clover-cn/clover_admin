<template>
  <div>
    <el-form :inline="true">
      <el-form-item label="一级分类">
        <el-select v-model="category1Id" @change="handleCategory1">
          <el-option
            :label="c1.name"
            :value="c1.id"
            v-for="c1 in category1List"
            :key="c1.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="二级分类">
        <el-select v-model="category2Id" @change="handleCategory2">
          <el-option
            :label="c2.name"
            :value="c2.id"
            v-for="c2 in category2List"
            :key="c2.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="三级分类">
        <el-select v-model="category3Id">
          <el-option
            :label="c3.name"
            :value="c3.id"
            v-for="c3 in category3List"
            :key="c3.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: '',
});
</script>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useCategoryStore } from '@/stores/category';
import { storeToRefs } from 'pinia';
const categoryStore = useCategoryStore();
const {
  category1List,
  category1Id,
  category2List,
  category2Id,
  category3List,
  category3Id,
} = storeToRefs(categoryStore);
function handleCategory1(category1Id: number) {
  categoryStore.getCategory2List(category1Id);
}
function handleCategory2(category2Id: number) {
  categoryStore.getCategory3List(category2Id);
}
onMounted(() => {
  categoryStore.getCategory1List();
});
</script>

<style scoped></style>
