<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @row-click="handleRowClick"
    >
      <el-table-column align="center" label="会议日期" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.meeting_date }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="150px" label="会议时间">
        <template slot-scope="scope">
          <span>{{ scope.row.meeting_time }}</span>
        </template>
      </el-table-column>

      <el-table-column width="280px" align="center" label="主题">
        <template slot-scope="scope">
          <span>{{ scope.row.theme }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="品牌">
        <template slot-scope="scope">
          <span>{{ scope.row.brand_name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="150px" label="会议类型">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="150px" class-name="status-col" label="会议创建人">
        <template slot-scope="scope">
          <span>{{ scope.row.founder }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Actions" width="150px">
        <template slot-scope="scope">
          <router-link :to="`/meeting/${scope.row.id}/meeting-records`">
            <el-button type="primary" size="small" icon="el-icon-edit">
              查看会议记录
            </el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { fetchList } from '@/api/meeting'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'MeetingList',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleRowClick(row, column, event) {
      this.$router.push(`/meeting/${row.id}/meeting-records`)
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
