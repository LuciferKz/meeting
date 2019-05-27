<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="月份" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.meeting_date.split('-')[1] }}</span>
        </template>
      </el-table-column>
      <el-table-column v-for="(item, key) of tableHeader" :key="key" :prop="key" :label="item" />
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { fetchList } from '@/api/meeting-record'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'ArticleList',
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
        meeting_id: null,
        page: 1,
        limit: 20
      },
      tableHeader: {
        // month: '月份',
        meeting_date: '会议日期',
        meeting_time: '会议时间',
        meeting_name: '会议主题',
        brands: '品牌',
        meeting_type: '会议类型',
        meeting_founder: '会议创建人',
        meeting_attend_form: '参会形式（科室会/微信散点)',
        meeting_speaker: '讲者姓名',

        director_district: '大区',
        director_region: '地区',
        director_name: '代表姓名',
        director_email: '代表邮箱',

        doctor_open_id: '医生OpenID',
        doctor_province: '省份',
        doctor_city: '城市',
        doctor_hos: '医院',
        doctor_dept: '科室',

        stream_enter_time: '加入时间',
        stream_leave_time: '离开时间',
        stream_duration: '观看时长（分钟）',

        attend_doctor_count: '参会医生数',
        attend_director_count: '参会代表数',
        attend_wechat_doctors_count: '微信散点医生数'
      }
    }
  },
  created() {
    if (this.$route.params.id) {
      this.listQuery.meeting_id = this.$route.params.id
    } else {
      this.$message.warning('请先选择会议')
    }
    this.getList()
  },
  methods: {
    getList(id) {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
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
