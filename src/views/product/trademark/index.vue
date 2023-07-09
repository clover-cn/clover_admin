<template>
  <div>
    <el-card class="box-card" style="margin-top: 20px">
      <template #header>
        <el-button
          type="primary"
          size="default"
          :icon="Plus"
          @click="showAddTrademark"
          >添加</el-button
        >
      </template>
      <!-- 在html中表格按行走 现在element-plus中表格按列走 -->
      <!-- border表格具备边框 stripe斑马色 -->
      <!-- 作用:展示数据 -->
      <!-- data表格要渲染的数据 -->
      <el-table :data="trademarkList" border stripe style="margin-bottom: 20px">
        <!-- label 列标题 -->
        <!-- width 列宽度 单位是px 但是不需要你加 如果没写列宽度平分天下 -->
        <!-- align 对齐方式 center居中 -->
        <!-- type  列的类型 index代表此列是序号列 默认序号就会从1开始 -->
        <!-- 列暗含遍历 -->
        <!-- prop属性指明这一列要展示的数据 -->
        <el-table-column
          label="序号"
          width="80"
          align="center"
          type="index"
        ></el-table-column>
        <el-table-column label="品牌名称" prop="tmName"></el-table-column>
        <!-- 如果咱们某一列要去展示数据 指定prop属性 -->
        <!-- 如果咱们某一列不展示数据而是要显示结构 使用作用域插槽 -->
        <el-table-column label="品牌LOGO">
          <!-- row数组当中某一项 -->
          <template v-slot="{ row, $index }">
            <el-image
              :src="row.logoUrl"
              style="width: 100px; height: 60px"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row, $index }">
            <el-button
              type="warning"
              size="small"
              :icon="Edit"
              @click="updateTrademark(row)"
              >修改</el-button
            >
            <el-button
              type="danger"
              size="small"
              :icon="Delete"
              @click="deleteTrademark(row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="page"
        v-model:page-size="limit"
        :page-sizes="[3, 5, 7, 9]"
        layout="prev, pager, next, jumper, ->, sizes, total"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>

    <!-- dialogFormVisible他在控制对话框的显示和隐藏  title对话框标题-->
    <el-dialog
      v-model="dialogFormVisible"
      :title="`${tmForm.id ? '修改' : '添加'}品牌`"
    >
      <!-- table 展示数据  form 收集数据-->
      <el-form ref="formEl" :model="tmForm" style="width: 80%" :rules="rules">
        <!-- label控制表单项的文本 label-width控制表单先文本的宽度 加单位 -->
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="tmForm.tmName" />
        </el-form-item>

        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- action属性就是后端的服务器地址 -->
          <el-upload
            class="avatar-uploader"
            :action="`${baseUrl}/admin/product/upload`"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            <template #tip>
              <div class="el-upload__tip">上传的图片必须是jpg且不能大于2M</div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="addOrUpdateTm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'Trademark',
});
</script>

<script lang="ts" setup>
import { Plus, Edit, Delete } from '@element-plus/icons-vue';
import { ref, onMounted, reactive, nextTick } from 'vue';
import tradeMarkApi from '@/api/trademark';
import type { TradeMarkData } from '@/api/trademark';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormRules, UploadProps } from 'element-plus';
const page = ref(1); //当前页码
const limit = ref(3); //每页大小
const total = ref(0);
const trademarkList = ref<TradeMarkData[]>([]);
const dialogFormVisible = ref(false); //控制对话款显示和隐藏的
// 读取环境文件中路径请求前缀
const baseUrl = import.meta.env.VITE_API_URL;

// 封装方法来去发送请求获取品牌分页列表
async function getTrademarkPageList() {
  try {
    const res = await tradeMarkApi.getPageList(page.value, limit.value);
    total.value = res.total;
    trademarkList.value = res.records;
  } catch (error) {
    ElMessage.error('获取品牌列表失败');
  }
}

// 页大小发生变化自动执行的回调函数
function handleSizeChange(num: number) {
  // 更改页大小 获取最新列表
  limit.value = num;
  getTrademarkPageList();
}

// 当前页发生变化所执行的回调函数
function handleCurrentChange(num: number) {
  // 更改当前页 获取最新列表
  page.value = num;
  getTrademarkPageList();
}

// 点击添加
const tmForm = ref<TradeMarkData>({
  tmName: '',
  logoUrl: '',
});

// 点击添加品牌
function showAddTrademark() {
  // 显示对话框
  dialogFormVisible.value = true;
  tmForm.value = {
    tmName: '',
    logoUrl: '',
  };
  nextTick(() => {
    formEl.value.resetFields();
  });
}

function updateTrademark(tm: TradeMarkData) {
  // 显示对话框
  dialogFormVisible.value = true;
  tmForm.value = { ...tm };
  nextTick(() => {
    formEl.value.clearValidate('logoUrl');
  });
}

// 添加或者修改的请求逻辑
async function addOrUpdateTm() {
  try {
    await formEl.value.validate();
    let trademark = tmForm.value;
    try {
      await tradeMarkApi.addOrUpdate(trademark);
      dialogFormVisible.value = false;
      ElMessage.success(`${trademark.id ? '修改' : '添加'}品牌成功`);
      if (!trademark.id) {
        //添加
        page.value = 1;
      }
      getTrademarkPageList();
    } catch (error) {
      // 5.请求失败
      ElMessage.error(`${trademark.id ? '修改' : '添加'}品牌失败`);
    }
  } catch (error) {}
}

// 点击删除品牌的逻辑
function deleteTrademark(row: TradeMarkData) {
  ElMessageBox.confirm(`确定要删除 ${row.tmName} 这个品牌吗?`, '警告', {
    confirmButtonText: '确定', //确定按钮文本
    cancelButtonText: '取消', //取消按钮文本
    type: 'warning',
  })
    .then(async () => {
      try {
        await tradeMarkApi.deleteTm(row.id as number);
        ElMessage.success('删除品牌成功');
        if (trademarkList.value.length === 1) {
          page.value -= 1;
        }
        getTrademarkPageList();
      } catch (error) {
        ElMessage.error(`删除品牌失败`);
      }
    })
    .catch(() => {
      ElMessage.info('取消删除');
    });
}

// 获取form组件实例
const formEl = ref();

// 自定义品牌名称的验证规则
function validateTmLength(rule: any, value: any, callback: any) {
  if (value.length < 2 || value.length > 10) {
    //不合法
    callback('请输入长度为2-10之间');
  } else {
    //合法
    callback();
  }
}

// 规则验证
const rules = reactive<FormRules>({
  tmName: [
    // required必填的  message错误信息  trigger验证的触发方式(blur失去焦点 change变化后就触发)
    { required: true, message: '品牌名称必须填写', trigger: 'blur' },
    { validator: validateTmLength, trigger: 'change' },
  ],
  // 因为咱们upload不是表单项 所以在这里的验证(单个验证)是触发不了了 完整验证可以触发
  logoUrl: [
    {
      required: true,
      message: '品牌LOGO必须上传',
      trigger: 'change',
    },
  ],
});

// 上传成功执行的回调函数
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  tmForm.value.logoUrl = response.data;
  formEl.value.validateField('logoUrl');
};
// 上传之前执行的回调函数
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('上传图片必须是jpg格式!!');
    return false;
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('上传图片的大小不能超过2MB!!');
    return false;
  }
  return true;
};

onMounted(() => {
  getTrademarkPageList();
});
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
