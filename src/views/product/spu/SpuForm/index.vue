<template>
  <div>
    <el-form label-width="120px">
      <el-form-item label="spu名称">
        <el-input v-model="spuForm.spuName" />
      </el-form-item>
      <el-form-item label="品牌">
        <el-select v-model="spuForm.tmId" placeholder="选择品牌">
          <el-option :label="item.tmName" :value="(item.id as number)" v-for="item in trademarkList" :key="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="spu描述">
        <el-input v-model="spuForm.description" type="textarea" />
      </el-form-item>
      <el-form-item label="SPU图片" style="font-weight: bolder">
        <el-upload v-model:file-list="spuImageList as any" :action="`${baseUrl}/admin/product/upload`"
          list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove"
          :on-success="handleSuccess">
          <el-icon>
            <Plus />
          </el-icon>
        </el-upload>

        <el-dialog v-model="dialogVisible">
          <img w-full :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性" style="font-weight: bolder">
        <el-select v-model="unSelectIdAndName" :placeholder="`还有${unSelectSaleAttrList.length}个未选择`">
          <el-option v-for="item in unSelectSaleAttrList" :key="item.id" :label="item.name"
            :value="`${item.id}:${item.name}`" />
        </el-select>
        <el-button type="primary" size="default" @click="addSaleAttr">添加销售属性</el-button>
        <el-table border style="width: 100%" :data="spuSaleAttrList">
          <el-table-column label="序号" type="index" align="center" width="80"></el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="180" />
          <el-table-column label="属性值名称列表">
            <template v-slot="{ row, $index }">
              <el-tag v-for="(tag, index) in row.spuSaleAttrValueList" :key="tag" class="mx-1" closable
                :disable-transitions="false" @close="handleClose(row, index)">
                {{ tag.saleAttrValueName }}
              </el-tag>
              <el-input v-if="row.isEdit" ref="InputRef" v-model="row.saleAttrValueName" class="ml-1 w-20" size="small"
                @keyup.enter="handleInputConfirm(row)" @blur="handleInputConfirm(row)" style="width: 80px;" />
              <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput(row)">
                添加
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作">
            <template v-slot="{ row, $index }">
              <el-button type="danger" size="small" icon="ele-Delete" title="删除销售属性"
                @click="deleteSaleAttr($index)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-form-item>
          <el-button type="primary" size="default" @click="addSpuSaleAttr">保存</el-button>
          <el-button size="default" @click="cancel">取消</el-button>
        </el-form-item>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'SpuForm',
});
</script>

<script lang="ts" setup>
import { nextTick, reactive, onMounted, type Ref, watch, computed } from 'vue';
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import type { ElInput, UploadFile, UploadFiles, UploadProps, UploadUserFile } from 'element-plus';
import tmApi, { type TradeMarkData } from '@/api/trademark';
import spuApi, {
  type SpuData,
  type SpuImageListData,
  type BaseSaleAttrListData,
  type SpuSaleAttrListData,
  type SpuSaleAttrData,
  type ResponseData,
} from '@/api/spu';
import skuApi from '@/api/sku';
import { useCategoryStore } from '@/stores/category';
import { storeToRefs } from 'pinia'; // 用于将store中的数据转换为ref
const categoryStore = useCategoryStore();
// let test = categoryStore.spuPageList1;
const { spuPageList1 } = storeToRefs(categoryStore);
const fileList = ref<UploadUserFile[]>([]);
const inputValue = ref('');
const props = defineProps<{
  spu: SpuData;
}>();
const spuForm = props.spu;
const InputRef = ref<InstanceType<typeof ElInput>>();
const trademarkList = ref<TradeMarkData[]>([]);
const spuImageList = ref<SpuImageListData>([]); // spu图片
const spuImageList1 = ref<SpuImageListData>([]);
const baseSaleAttrList = ref<BaseSaleAttrListData>([]);
const spuSaleAttrList = ref<SpuSaleAttrListData>([])
const dialogImageUrl = ref('');
const dialogVisible = ref(false);
const arrw = ref<SpuImageListData>([]);
const { category3Id } = storeToRefs(categoryStore)
// 上传图片成功
const handleSuccess: UploadProps['onSuccess'] = (response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  spuImageList.value = uploadFiles as any

}
// 点击图片移除
const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles);
};
// 点击图片放大
const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!;
  dialogVisible.value = true;
};
// const spuList = ref(spuPageList1.value);
const emit = defineEmits(['addshow']);
const baseUrl = import.meta.env.VITE_API_URL;
function cancel() {
  emit('addshow', 1);
}
const handleClose = (row: SpuSaleAttrData, index: number) => {
  row.spuSaleAttrValueList.splice(index, 1)
};
const deleteSaleAttr = (index: number) => {
  spuSaleAttrList.value.splice(index, 1)
}
const showInput = (row: SpuSaleAttrData) => {
  row.isEdit = true;
  nextTick(() => {
    InputRef.value!.input!.focus(); // 通过ref获取到input组件的实例，然后调用input组件的focus方法
  });
  inputValue.value = row.saleAttrName;
};
//属性值名称输入框失去焦点
const handleInputConfirm = (row: SpuSaleAttrData) => {
  if (!row.saleAttrValueName) {
    ElMessage.error('属性值名称不能为空');
    row.isEdit = false;
    return;
  }
  // 判断是否输入空格
  if (row.saleAttrValueName.includes(' ')) {
    ElMessage.error('属性值名称不能包含空格');
    row.isEdit = false;
    return;
  }
  // let saleAttrValueName = row.saleAttrValueName
  let obj = {
    baseSaleAttrId: row.baseSaleAttrId,
    saleAttrValueName: row.saleAttrValueName,
  }
  row.spuSaleAttrValueList.push(obj)
  row.isEdit = false;
  row.saleAttrValueName = '';
  ElMessage.success('添加成功');
};
// 获取所有的品牌列表 获取所有的基础销售属性列表
async function initAddSpu() {
  const res = await tmApi.getAllTrademarkList();
  const res1 = await spuApi.getBaseSaleAttrList();
  trademarkList.value = res;
  baseSaleAttrList.value = res1;
}
async function initEditSpu() {
  const promise1 = await tmApi.getAllTrademarkList();
  const promise2 = await spuApi.getBaseSaleAttrList();
  const promise3 = await skuApi.getSpuImageList(spuForm.id as number);
  const promise4 = await skuApi.getSpuSaleAttrList(spuForm.id as number);
  const res = await Promise.all([promise1, promise2, promise3, promise4]);
  promise3.forEach((item) => {
    spuImageList.value.push({
      imgName: item.imgName,
      imgUrl: item.imgUrl,
      name: item.imgName,
      url: item.imgUrl,
    });
  });
  trademarkList.value = res[0]
  baseSaleAttrList.value = res[1]
  spuSaleAttrList.value = res[3]
  spuImageList1.value = res[2]
}
onMounted(() => {
  if (spuForm.id) { //修改
    initEditSpu()
  } else { //添加
    initAddSpu()
  }
});
// watch(fileList, () => {
//   console.log(fileList);
// });
const unSelectIdAndName = ref('')
function addSaleAttr() {
  let [baseSaleAttrId, saleAttrName] = unSelectIdAndName.value.split(':')
  let obj = {
    baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList: [],
  }
  spuSaleAttrList.value.push(obj)
  unSelectIdAndName.value = ''

}
const unSelectSaleAttrList = computed(() => {
  return baseSaleAttrList.value.filter((item) => {
    return !spuSaleAttrList.value.some((item1) => {
      return item.id === item1.baseSaleAttrId
    })

  })
})
// const booleanValue = computed(() => {
//   if (row1.value.baseSaleAttrId === rowid.value + 1) {
//     return row1.value.baseSaleAttrId === rowid.value
//   }
// })
// 保存
async function addSpuSaleAttr() {
  let spu = spuForm
  spuForm.category3Id = category3Id.value
  spuForm.spuImageList = spuImageList.value.map((item) => {
    return {
      imgName: item.name as string,
      imgUrl: item.imgUrl || (item.response as ResponseData).data
    }
  })
  spuSaleAttrList.value.forEach(item => {
    delete item.isEdit
    delete item.saleAttrValueName
  })
  spuForm.spuSaleAttrList = spuSaleAttrList.value
  console.log(spuForm);
  try {
    await spuApi.addOrUpdate(spuForm)
    ElMessage.success('保存成功')
    emit('addshow', 1)
  } catch (error) {
    ElMessage.error('保存失败')
  }

}
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
