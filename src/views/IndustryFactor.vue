<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 基础表格
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="el-icon-lx-add" @click="handleAddEntity">
          添加
        </el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column prop="entity_code" label="主体 ID"></el-table-column>
        <el-table-column prop="factor" label="系数"></el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button
              type="text" icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
              type="text" icon="el-icon-delete" class="red"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background layout="total, prev, pager, next"
          :current-page="query.pageIndex"
          :page-size="query.pageSize"
          :total="pageTotal" @current-change="handlePageChange"></el-pagination>
      </div>
    </div>

    <el-dialog title="新增行业因子" v-model="addVisible" width="30%">
      <el-form label-width="70px">
        <el-form-item label="主体列表">
          <el-input
            type="textarea"
            :autosize="{minRows: 3, maxRows: 20}"
            placeholder="用换行符分割多条记录"
            v-model="form.entity"
          />
        </el-form-item>
      </el-form>
      <el-form label-width="70px">
        <el-form-item label="系数">
          <el-input v-model="form.factor"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addVisible = false">取 消</el-button>
          <el-button type="primary" @click="addNewEntity">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 编辑弹出框 -->
    <el-dialog title="修改行业因子" v-model="editVisible" width="30%">
      <el-form label-width="70px">
        <el-form-item label="系数">
          <el-input v-model="form.factor"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveEdit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { fetchData } from "../api/adsconf";
import {editFactor, deleteEntity, addEntity} from "../api/industry_factor"

export default {
  name: "industryfactor",
  setup() {
    const query = reactive({
      entity_code: "",
      pageIndex: 1,
      pageSize: 10,
    });
    const tableData = ref([]);
    const pageTotal = ref(0);

    let ads_conf = {}

    function reloadTable() {
      tableData.value = [];
      pageTotal.value = 0;

      ads_conf.industry_factors.forEach(function(factor) {
        factor.entity_codes.forEach(function(entity) {
          var obj = {};
          obj.factor = factor.factor;
          obj.entity_code = entity;

          /* pageTotal.value += 1; */
          tableData.value.push(obj);
        });
      });

      pageTotal.value = tableData.value.length;
    }

    // 获取表格数据
    const getData = () => {
      fetchData(query).then((res) => {
        ads_conf = res;
        reloadTable();
      });
    };
    getData();

    // 查询操作
    const handleSearch = () => {
      query.pageIndex = 1;
      getData();
    };

    // 分页导航
    const handlePageChange = (val) => {
      query.pageIndex = val;
      getData();
    };

    // 删除操作
    const handleDelete = (index) => {
      // 二次确认删除
      ElMessageBox.confirm("确定要删除吗？", "提示", {
        type: "warning",
      }).then(() => {
        const entity = tableData.value[index].entity_code;
        deleteEntity(ads_conf, entity);
        tableData.value.splice(index, 1);
        ElMessage.success("Delete successfully!");
      }).catch(() => {});
    };

    // 表格编辑时弹窗和保存
    const editVisible = ref(false);
    let form = reactive({
      entity: "",
      factor: "",
    });

    let idx = -1;
    const handleEdit = (index, row) => {
      idx = index;
      Object.keys(form).forEach((item) => {
        form[item] = row[item];
      });
      editVisible.value = true;
    };

    const addVisible = ref(false);
    const handleAddEntity = () => {
      addVisible.value = true;
    };

    const addNewEntity = () => {
      addVisible.value = false;
      console.log(form);
      if (!addEntity(ads_conf, form.entity, form.factor)) {
        return;
      }
      reloadTable();
    };

    const saveEdit = () => {
      editVisible.value = false;

      let row = tableData.value[idx];
      let factor = parseFloat(form.factor);
      if (row.factor !== form.factor && factor !== NaN) {
        editFactor(ads_conf, row.entity_code, factor);
      }
      /* console.log(row); */
      console.log(ads_conf);

      Object.keys(form).forEach((item) => {
        tableData.value[idx][item] = form[item];
      });

      ElMessage.success(`修改第 ${idx + 1} 行成功`);
    };

    return {
      query,
      tableData,
      pageTotal,
      editVisible,
      addVisible,
      form,
      handleSearch,
      handlePageChange,
      handleDelete,
      handleEdit,
      handleAddEntity,
      addNewEntity,
      saveEdit,
    };
  },
};
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #ff0000;
}
.mr10 {
  margin-right: 10px;
}
.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}
</style>
