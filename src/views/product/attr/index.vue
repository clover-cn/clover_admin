<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelector></CategorySelector>
    </el-card>
    <el-card>
      <!-- 属性列表的结构 -->
      <div v-show="islist">
        <el-button
          type="primary"
          size="default"
          icon="ele-Plus"
          @click="showAddAttr"
          >添加属性</el-button
        >
        <el-table :data="attrList" border>
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80"
          ></el-table-column>
          <el-table-column
            label="属性名称"
            width="150"
            prop="attrName"
          ></el-table-column>
          <el-table-column label="属性值名称列表">
            <!-- row是某一个属性对象  -->
            <template v-slot="{ row, $index }">
              <el-tag
                type="success"
                v-for="attrValue in row.attrValueList"
                :key="row.id"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template v-slot="{ row, $index }">
              <el-button
                type="warning"
                size="small"
                title="修改属性"
                icon="ele-Edit"
                @click="showUpdateAttr(row)"
              ></el-button>
              <el-button
                type="danger"
                size="small"
                title="删除属性"
                icon="ele-Delete"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 这是添加属性的结构 -->
      <div v-show="!islist">
        <el-form :inline="true">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrForm.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" size="default" @click="addAttrValue"
          >添加属性值</el-button
        >
        <el-button size="default" @click="islist = true">取消</el-button>
        <el-table
          :data="attrForm.attrValueList"
          border
          stripe
          style="margin-top: 20px"
        >
          <el-table-column
            label="序号"
            align="center"
            type="index"
            width="80"
          ></el-table-column>
          <el-table-column label="属性值名称">
            <!-- row是属性值对象 -->
            <template v-slot="{ row, $index }">
              <el-input v-if="row.isEdit" v-model="row.valueName"></el-input>
              <span v-else>{{ row.valueName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作"></el-table-column>
        </el-table>
        <el-button type="primary" size="default">保存</el-button>
        <el-button size="default" @click="islist = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'Attr',
});
</script>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import attrApi, { type AttrListData, type AttrData } from '@/api/attr';
// 将pinia的数据映射到vue的数据（模板）
import { useCategoryStore } from '@/stores/category';
import { storeToRefs } from 'pinia';
const categoryStore = useCategoryStore();
const { category1Id, category2Id, category3Id } = storeToRefs(categoryStore);
const attrList = ref<AttrListData>([]); //属性列表
const islist = ref(true);
const attrForm = ref<AttrData>({
  attrName: '',
  categoryId: 0,
  categoryLevel: 0,
  attrValueList: [],
});
async function getAttrList() {
  const res = await attrApi.attrInfoList(
    category1Id.value as number,
    category2Id.value as number,
    category3Id.value as number
  );
  attrList.value = res;
}
watch(
  category3Id,
  (newVal) => {
    if (newVal) {
      getAttrList();
    } else {
      attrList.value = [];
    }
  },
  { immediate: true } // immediate: true 表示在侦听的时候立即执行一次回调
);
function showAddAttr() {
  islist.value = false;
  attrForm.value = {
    attrName: '',
    categoryId: category3Id.value as number,
    categoryLevel: 3,
    attrValueList: [],
  };
}
function showUpdateAttr(row: AttrData) {
  islist.value = false;
  console.log(attrForm.value, row);
  attrForm.value = row;
  attrForm.value.attrValueList.forEach((item) => {
    item.isEdit = false;
  });
}
function addAttrValue() {
  attrForm.value.attrValueList.push({
    valueName: '',
    attrId: attrForm.value.attrId,
    isEdit: true,
  });
}
</script>

<style scoped></style>
