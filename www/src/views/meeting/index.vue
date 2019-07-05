<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column align="center" label="会议日期">
        <template slot-scope="scope">
          <span>{{ scope.row.meeting_date }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="会议时间">
        <template slot-scope="scope">
          <span>{{ scope.row.meeting_time }}</span>
        </template>
      </el-table-column>

      <el-table-column width="280px" align="center" label="主题">
        <template slot-scope="scope">
          <span>{{ scope.row.theme }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="品牌">
        <template slot-scope="scope">
          <span>{{ scope.row.brands }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="会议类型">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" class-name="status-col" label="会议创建人">
        <template slot-scope="scope">
          <span>{{ scope.row.founder }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Actions" width="150" >
        <template slot-scope="scope">
          <router-link :to="`/meeting/${scope.row.id}/meeting-records`">
            <el-button type="text" size="small" icon="el-icon-edit-outline">查看</el-button>
          </router-link>
          <el-button type="text" size="small" icon="el-icon-download" @click="downLoadClick(scope.row.id)">下载</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { fetchList as fetchRecords } from '@/api/meeting-record'
import { fetchList } from '@/api/meeting'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import XLSX from "xlsx"


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
      },
      brandId: null
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
    },
    downLoadClick(mid) {
      this.listLoading = true
      fetchRecords({
        meeting_id: mid,
        page: 1,
        limit: 999
      }).then(response => {
        // this.list = response.data.items
        // this.total = response.data.total
        if (response.code==20000) {
          console.log(response.data.items)
          var aoa =[['月份','会议日期','会议时间','会议主题','品牌','会议类型','会议创建人','参会形式','讲者姓名','大区','地区','代表姓名','代表邮箱','医生openID','省份','城市','医院','科室','加入时间','离开时间','观看时长(分钟)','参会医生数','参会代表数','微信散点医生数']]
          var arr = []
          var item = response.data.items
          item.forEach(item => {
            arr= [
              item.meeting_date.split('-')[1]
              ,item.meeting_date
              ,item.meeting_time
              ,item.meeting_name
              ,item.brands
              ,item.meeting_type
              ,item.meeting_founder
              ,item.meeting_attend_form
              ,item.meeting_speaker
              ,item.director_district
              ,item.director_region
              ,item.director_name
              ,item.director_email
              ,item.doctor_open_id
              ,item.doctor_province
              ,item.doctor_city
              ,item.doctor_hos
              ,item.doctor_dept
              ,item.stream_enter_time
              ,item.stream_leave_time
              ,item.stream_duration
              ,item.attend_doctor_count
              ,item.attend_director_count
              ,item.attend_wechat_doctors_count
            ]
            aoa.push(arr)
          })
          var sheet = XLSX.utils.aoa_to_sheet(aoa)
          this.openDownloadDialog(this.sheet2blob(sheet), `${aoa[1][3]}.xlsx`);
          this.listLoading = false
        }
      })
    },
    csv2sheet(csv) {
      var sheet = {}; // 将要生成的sheet
      csv = csv.split('\n');
      csv.forEach(function(row, i) {
          row = row.split(',');
          if(i == 0) sheet['!ref'] = 'A1:'+String.fromCharCode(65+row.length-1)+(csv.length-1);
          row.forEach(function(col, j) {
              sheet[String.fromCharCode(65+j)+(i+1)] = {v: col};
          });
      });
      return sheet;
    },
    sheet2blob(sheet, sheetName) {
      sheetName = sheetName || 'sheet1';
      var workbook = {
          SheetNames: [sheetName],
          Sheets: {}
      };
      workbook.Sheets[sheetName] = sheet;
      // 生成excel的配置项
      var wopts = {
          bookType: 'xlsx', // 要生成的文件类型
          bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
          type: 'binary'
      };
      var wbout = XLSX.write(workbook, wopts);
      var blob = new Blob([s2ab(wbout)], {type:"application/octet-stream"});
      // 字符串转ArrayBuffer
      function s2ab(s) {
          var buf = new ArrayBuffer(s.length);
          var view = new Uint8Array(buf);
          for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
          return buf;
      }
      return blob;
    },
    openDownloadDialog(url, saveName){
        if(typeof url == 'object' && url instanceof Blob)
        {
            url = URL.createObjectURL(url); // 创建blob地址
        }
        var aLink = document.createElement('a');
        aLink.href = url;
        aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
        var event;
        if(window.MouseEvent) event = new MouseEvent('click');
        else
        {
            event = document.createEvent('MouseEvents');
            event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        }
        aLink.dispatchEvent(event);
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
button {
  margin-right: 10px;
}
</style>
