<template>
  <div>
    <el-form label-width="100px">

      <el-form-item label="SPU名称">
        {{ spu.spuName }}
      </el-form-item>

      <el-form-item label="SKU名称">
        <el-input placeholder="SKU名称" v-model="skuForm.skuName"></el-input>
      </el-form-item>

      <el-form-item label="价格">
        <el-input type="number" placeholder="价格" v-model="skuForm.price"></el-input>
      </el-form-item>

      <el-form-item label="重量">
        <el-input type="number" placeholder="重量" v-model="skuForm.weight"></el-input>
      </el-form-item>

      <el-form-item label="规格描述">
        <el-input type="textarea" placeholder="规格描述" v-model="skuForm.skuDesc"></el-input>
      </el-form-item>

      <el-form-item label="平台属性">
        <el-form :inline="true" label-width="100px">
          <el-form-item :label="attr.attrName" v-for="attr in attrList" :key="attr.id">
            <!-- 收集的数据暂时先存到当前属性身上 -->
            <el-select placeholder="请选择" v-model="attr.attrIdValueId">
              <!-- 属性id+属性值id -->
              <el-option :value="`${attr.id}:${attrValue.id}`" :label="attrValue.valueName"
                v-for="attrValue in attr.attrValueList" :key="attrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-form :inline="true" label-width="100px">
          <el-form-item :label="saleAttr.saleAttrName" v-for="saleAttr in spuSaleAttrList" :key="saleAttr.id">
            <!-- 先暂存到当前销售属性身上 -->
            <el-select placeholder="请选择" v-model="saleAttr.saleAttrIdValueId">
              <!-- 每一个option的value值应该是销售属性id+销售属性值的id -->
              <el-option :value="`${saleAttr.id}:${saleAttrValue.id}`" :label="saleAttrValue.saleAttrValueName"
                v-for="saleAttrValue in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="图片列表">
        <!--selection-change选中状态发生变化后所执行的回调函数  -->
        <el-table :data="spuImageList" border @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="图片">
            <template v-slot="{ row, $index }">
              <el-image style="height: 80px; width: 100px;" :src="row.imgUrl"></el-image>
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="imgName"></el-table-column>
          <el-table-column label="操作">
            <template v-slot="{ row, $index }">
              <!-- 使用isDefault标识数据 '0'不是默认的  '1'是默认图片-->
              <el-button v-if="row.isDefault === '0'" type="primary" size="small"
                @click="setIsDefault(row)">设为默认</el-button>
              <el-tag v-else type="success">默认</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" size="default" @click="save">保存</el-button>
        <el-button size="default" @click="emit('addshow', 1)">取消</el-button>
      </el-form-item>

    </el-form>

  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
export default defineComponent({
  name: 'SkuForm',
})
</script>

<script lang="ts" setup>
import type { SpuData, SpuSaleAttrListData, SpuImageListData, SpuImageData } from '@/api/spu'
import { onMounted, ref } from 'vue'
import { useCategoryStore } from '@/stores/category'
import { storeToRefs } from 'pinia'
import attrApi, { type AttrListData } from '@/api/attr'
import skuApi, { type SkuAttrValueListData, type SkuData, type SkuImageListData, type SkuSaleAttrValueListData } from '@/api/sku'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['addshow'])
const props = defineProps<{
  spu: SpuData
}>()
const categoryStore = useCategoryStore()
const { category1Id, category2Id, category3Id } = storeToRefs(categoryStore)
const attrList = ref<AttrListData>([])
const spuSaleAttrList = ref<SpuSaleAttrListData>([])
const spuImageList = ref<SpuImageListData>([])
// 定义一个sku的初始化数据(之后发送请求的时候带着它)
const skuForm = ref<SkuData>({
  skuName: '',
  skuDesc: '',
  weight: '',
  category3Id: '',
  skuDefaultImg: '',
  isSale: '',
  createTime: '',
  skuImageList: [],
  skuAttrValueList: [],
  skuSaleAttrValueList: [],

})

// 获取添加sku的初始化请求
async function getInitAddSKuRequest() {
  // 获取所有的属性列表  获取spu的销售属性列表  获取spu的图片列表
  try {
    const promise1 = attrApi.attrInfoList(category1Id.value as number, category2Id.value as number, category3Id.value as number)
    const promise2 = skuApi.getSpuSaleAttrList(props.spu.id as number)
    const promise3 = skuApi.getSpuImageList(props.spu.id as number)
    const res = await Promise.all([promise1, promise2, promise3])
    attrList.value = res[0]

    spuSaleAttrList.value = res[1]
    spuImageList.value = res[2]
    // 一上来获取所有的图片增加isDefault属性 所有的一上来都不是默认 '0'
    spuImageList.value.forEach(item => {
      item.isDefault = '0'
    })
  } catch (error) {
    ElMessage.error('获取添加sku的初始化请求失败')
  }
}

// 定义sku图片列表的初始化数据
const skuImageList = ref<SkuImageListData>([])

// 选中状态变化执行的回调函数
function handleSelectionChange(val: SkuImageListData) {
  // val就是选中的图片所组成的一个数组
  // spuImageList.value = val 可不能直接对spuImageList赋值 这样就直接把所有的图片列表赋值了
  skuImageList.value = val
}

// 更改默认
function setIsDefault(row: SpuImageData) {
  // 让所有的图片isDefault为'0'
  spuImageList.value.forEach(item => {
    item.isDefault = '0'
  })
  // 当前点击的图片isDefault为'1'
  row.isDefault = '1'
  // 把默认图片的地址收集起来
  skuForm.value.skuDefaultImg = row.imgUrl
}

onMounted(() => {
  getInitAddSKuRequest()
})


// 保存
async function save() {
  let sku = skuForm.value
  // 直接从props.spu身上去取
  sku.spuId = props.spu.id
  sku.tmId = props.spu.tmId as number
  sku.category3Id = props.spu.category3Id
  // 处理平台属性值
  sku.skuAttrValueList = attrList.value.reduce((prev, item) => {
    if (item.attrIdValueId) { //说明用户选过这个属性值
      let [attrId, valueId] = item.attrIdValueId.split(':')
      // 组成一个sku属性值对象
      let obj = {
        attrId,
        valueId
      }
      prev.push(obj)
    }
    return prev
  }, [] as SkuAttrValueListData)
  // 处理销售属性值
  sku.skuSaleAttrValueList = spuSaleAttrList.value.reduce((prev, item) => {
    if (item.saleAttrIdValueId) { //之前选择中过这一项
      let [saleAttrId, saleAttrValueId] = item.saleAttrIdValueId.split(':')
      // 拼装一个销售属性值对象
      let obj = {
        saleAttrId,
        saleAttrValueId
      }
      prev.push(obj)
    }
    return prev
  }, [] as SkuSaleAttrValueListData)
  // 处理图片列表
  sku.skuImageList = skuImageList.value.map(item => {
    return {
      imgName: item.imgName,
      imgUrl: item.imgUrl,
    }
  })
  // 发送请求
  try {
    await skuApi.saveSkuInfo(sku)
    ElMessage.success('添加成功')
    emit('addshow', 1)
  } catch (error) {
    ElMessage.error('添加失败')
  }
}
</script>

<style scoped></style>