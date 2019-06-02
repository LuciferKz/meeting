<template>
  <div class="app-container">
    <upload-excel-component :on-success="handleSuccess" :on-submit="handleSubmit" :before-upload="beforeUpload" />
    <!-- <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
      <el-table-column v-for="(item, key) of tableHeader" :key="key" :prop="key" :label="item" />
    </el-table> -->
  </div>
</template>

<script>
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import { uploadMeeting } from '@/api/meeting'

export default {
  name: 'MeetingUpload',
  components: { UploadExcelComponent },
  data() {
    return {
      tableData: [],
      tableHeader: {
        month: '月份',
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
  methods: {
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1

      if (isLt1M) {
        return true
      }

      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },
    handleSuccess({ body, header }) {
      this.tableData = body
      // this.tableHeader = header
    },
    handleSubmit(rawFile) {
      return this
        .$confirm('是否确认上传?', 'Warning', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          const formData = new FormData()
          formData.append('file', rawFile)
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)',
            target: document.querySelector('.div1')
          });
          uploadMeeting(formData)
            .then(res => {
              loading.close()
              this.$message.success('上传成功')
              res.data.forEach(row => {
                row.month = parseInt(row.meeting_date.split('-')[1]) + '月份'
              })
              this.tableData = res.data
            })
        })
        .catch(err => { console.error(err) })
    }
  }
}
</script>
