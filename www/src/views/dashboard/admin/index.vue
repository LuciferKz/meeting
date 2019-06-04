<template>
  <div class="dashboard-editor-container">
    <!-- <github-corner class="github-corner" /> -->
    <div class="filter-container">
      <el-select v-if="isAdmin" v-model="listQuery.brandId" placeholder="品牌" clearable style="width: 120px" class="filter-item" @change="getMeetings">
        <el-option v-for="item in brandListOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-date-picker
        v-model="listQuery.year"
        class="picker"
        type="year"
        placeholder="选择年"
        value-format="yyyy"
        style="width: 140px"
      />
      <el-date-picker
        v-model="listQuery.month"
        class="picker"
        type="month"
        placeholder="选择月"
        value-format="MM"
        style="width: 140px"
      />
      <el-select v-model="listQuery.meetingId" placeholder="会议主题" clearable style="width: 180px" class="filter-item">
        <el-option v-for="item in meetingListOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <!-- <el-input v-model="listQuery.attendForm" class="attend-form" placeholder="参会形式" style="width: 140px" /> -->
      <el-select v-model="listQuery.attendForm" placeholder="参会形式" class="filter-item" style="width: 130px">
        <el-option v-for="item in attendForm" :key="item.key" :label="item.name" :value="item.name" />
      </el-select>
      <!-- <el-date-time v-model="listQuery.month" style="width: 140px" class="filter-item" @change="handleFilter"></el-date-time> -->
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
    </div>

    <panel-group :data="chartData" />

    <h4>会议场数</h4>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="chartData.meetings" />
    </el-row>

    <!-- <h4>覆盖医生数</h4>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <bar-chart v-if="showDoctors" :chart-data="chartData.doctors" />
    </el-row>

    <h4>覆盖代表数</h4>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <bar-chart v-if="showDirectors" :chart-data="chartData.directors" />
    </el-row> -->

    <h4>参会总人数</h4>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <bar-chart v-if="showTotal" :chart-data="chartData.total" />
    </el-row>

    <h4>大区参会情况</h4>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <bar-chart v-if="showDistrictGroup" :chart-data="chartData.district" />
    </el-row>

    <h4>省份参会情况</h4>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <bar-chart v-if="showProvinceGroup" :chart-data="chartData.province" />
    </el-row>

    <h4>城市参会情况</h4>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <bar-chart v-if="showCityGroup" :chart-data="chartData.city" />
    </el-row>

    <h4>科室分布</h4>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <pie-chart v-if="showDeptGroup" :chart-data="chartData.dept" />
    </el-row>
    <!-- <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row> -->

    <!-- <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row> -->

    <!-- <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <transaction-table />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <todo-list />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <box-card />
      </el-col>
    </el-row> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import GithubCorner from '@/components/GithubCorner'
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import { fetchData } from '@/api/dashboard'
import { deepClone } from '@/utils'
import { fetchBrandList } from '@/api/brand'
import { fetchList as fetchMeetingList } from '@/api/meeting'
// import TransactionTable from './components/TransactionTable'
// import TodoList from './components/TodoList'
// import BoxCard from './components/BoxCard'

const months = new Array(12).fill('').map((v, i) => i + 1 + '月')

const getSeries = function(name, option = {}) {
  const series = {
    name,
    type: 'bar',
    barWidth: option.barWidth || '60%',
    data: [],
    animationDuration: 3000,
    itemStyle: {
      normal: {
        label: {
          show: true
        }
      }
    }
  }
  if (option.stack) series.stack = option.stack
  return series
}

const getPieSeries = function(name) {
  return [
    {
      name,
      type: 'pie',
      roseType: 'radius',
      radius: [15, 95],
      center: ['50%', '38%'],
      data: [],
      animationEasing: 'cubicInOut',
      animationDuration: 2600,
      label: {
        normal: {
          formatter: '{b} {d}%  '
        }
      }
    }
  ]
}

const chartData = {
  meetings: {
    xAxis: {
      data: months,
      boundaryGap: false,
      axisTick: {
        show: false
      }
    },
    series: [{
      name: '会议场数',
      itemStyle: {
        normal: {
          color: '#32e1ed',
          lineStyle: {
            color: '#32e1ed',
            width: 2
          },
          label: {
            show: true
          }
        }
      },
      smooth: true,
      type: 'line',
      data: [],
      animationDuration: 2800,
      animationEasing: 'cubicInOut'
    }],
    legend: {
      data: ['会议场数']
    }
  },
  doctors: {
    xAxis: [{
      type: 'category',
      data: months,
      axisTick: {
        alignWithLabel: true
      }
    }],
    series: [],
    legend: {
      data: ['参会医生数', '微信散点医生数']
    }
  },
  directors: {
    xAxis: [{
      type: 'category',
      data: months,
      axisTick: {
        alignWithLabel: true
      }
    }],
    series: [],
    legend: {
      data: ['参会代表数']
    }
  },
  total: {
    xAxis: [{
      type: 'category',
      data: months,
      axisTick: {
        alignWithLabel: true
      }
    }],
    series: [],
    legend: {
      data: ['参会医生数', '微信散点医生数', '参会代表数']
    }
  },
  avgStreamDuration: 0,
  countHospital: 0,
  countDoctors: 0,
  countDirectors: 0,
  sumDoctor: 0,
  sumDirector: 0,
  district: {
    xAxis: [{
      type: 'category',
      data: months,
      axisTick: {
        alignWithLabel: true
      }
    }],
    legend: {
      data: ['参会医生数', '微信散点医生数', '参会代表数']
    }
  },
  province: {
    xAxis: [{
      type: 'category',
      data: months,
      axisTick: {
        alignWithLabel: true
      }
    }],
    legend: {
      data: ['参会医生数', '微信散点医生数', '参会代表数']
    }
  },
  city: {
    xAxis: [{
      type: 'category',
      data: [],
      axisTick: {
        alignWithLabel: true
      }
    }],
    legend: {
      data: ['参会医生数', '微信散点医生数', '参会代表数']
    }
  },
  dept: {
    xAxis: [{
      type: 'category',
      data: [],
      axisTick: {
        alignWithLabel: true
      }
    }],
    legend: {
      data: ['参会总人数']
    }
  }
}

export default {
  name: 'DashboardAdmin',
  components: {
    GithubCorner,
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart
    // TransactionTable,
    // TodoList,
    // BoxCard
  },
  data() {
    return {
      chartData,
      showDoctors: false,
      showDirectors: false,
      showTotal: false,
      showDistrictGroup: false,
      showProvinceGroup: false,
      showCityGroup: false,
      showDeptGroup: false,
      listQuery: {
        brandId: null,
        meetingId: null,
        year: new Date().getFullYear().toString(),
        month: (new Date().getMonth() + 1).toString(),
        attendForm: null
      },
      brandListOptions: [],
      meetingListOptions: [],
      isAdmin: false,
      attendForm: [
        { name: '散点' },
        { name: '科室会' },
        { name: '微信端' }
      ]
    }
  },
  created() {
    fetchBrandList()
      .then(res => {
        this.brandListOptions = res.data.items.map(brand => {
          return {
            value: brand.id,
            label: brand.name
          }
        })
      })
    this.getMeetings()
    this.getData()
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  mounted() {
    console.log(this.listQuery)
    this.isAdmin = this.roles.includes('admin')
  },
  methods: {
    handleSetChartData(type) {
      this.chartData = chartData[type]
    },

    getMeetings() {
      fetchMeetingList({ page: 1, limit: 100, brandId: this.listQuery.brandId })
        .then(res => {
          this.meetingListOptions = res.data.items.map(m => {
            return {
              value: m.id,
              label: m.theme
            }
          })
        })
    },

    getData() {
      this.showDoctors = false
      this.showDirectors = false
      this.showTotal = false
      this.showDistrictGroup = false
      this.showProvinceGroup = false
      this.showCityGroup = false
      this.showDeptGroup = false
      fetchData(this.listQuery)
        .then((res) => {
          const data = res.data
          const meetingsData = chartData.meetings.series[0].data = []
          const attendDoctorCount = getSeries('参会医生数', { stack: 'count' })
          const attendWechatDoctorCount = getSeries('微信散点医生数', { stack: 'count' })
          const attendDirectorCount = getSeries('参会代表数', { stack: 'count' })

          let meetingCount = 0
          data.countMeeting.forEach(d => {
            meetingCount += d.meetingCount
            console.log(meetingCount)
            const index = d.month - 1
            this.$set(meetingsData, index, meetingCount)
          })
          chartData.countDoctors = 0
          chartData.countDirectors = 0
          data.bar.forEach(d => {
            const index = d.month - 1
            chartData.countDoctors += d.doctorCount + d.wechatDoctorCount
            chartData.countDirectors += d.directorCount
            this.$set(attendDoctorCount.data, index, d.doctorCount)
            this.$set(attendWechatDoctorCount.data, index, d.wechatDoctorCount)
            this.$set(attendDirectorCount.data, index, d.directorCount)
          })

          chartData.sumDoctor = data.sumDoctor + data.sumWechatDoctor
          chartData.sumDirector = data.sumDirector

          attendDoctorCount.itemStyle.normal.label.position = 'insideTop'
          attendWechatDoctorCount.itemStyle.normal.label.position = 'insideTop'
          attendDirectorCount.itemStyle.normal.label.position = 'insideTop'
          attendDoctorCount.itemStyle.normal.color = '#6f90e9'
          attendWechatDoctorCount.itemStyle.normal.color = '#7fd2f5'
          attendDirectorCount.itemStyle.normal.color = '#e1c39e'

          const dictDoctorCount = getSeries('参会医生数', { barWidth: '25%' })
          const dictWechatDoctorCount = getSeries('微信散点医生数', { barWidth: '25%' })
          const dictDirectorCount = getSeries('参会代表数', { barWidth: '25%' })
          dictDoctorCount.itemStyle.normal.label.position = 'top'
          dictWechatDoctorCount.itemStyle.normal.label.position = 'top'
          dictDirectorCount.itemStyle.normal.label.position = 'top'
          const districts = []
          data.group.district.forEach(d => {
            dictDoctorCount.data.push(d.attendDoctorCount)
            dictWechatDoctorCount.data.push(d.attendWechatDoctorsCount)
            dictDirectorCount.data.push(d.attendDirectorCount)
            districts.push(d.director_district === null ? '其他' : d.director_district)
          })

          const povDoctorCount = getSeries('参会医生数', { stack: null, barWidth: '25%' })
          const povWechatDoctorCount = getSeries('微信散点医生数', { stack: null, barWidth: '25%' })
          const povDirectorCount = getSeries('参会代表数', { stack: null, barWidth: '25%' })
          povDoctorCount.itemStyle.normal.label.position = 'top'
          povWechatDoctorCount.itemStyle.normal.label.position = 'top'
          povDirectorCount.itemStyle.normal.label.position = 'top'
          const provinces = []
          data.group.province.forEach(d => {
            povDoctorCount.data.push(d.attendDoctorCount)
            povWechatDoctorCount.data.push(d.attendWechatDoctorsCount)
            povDirectorCount.data.push(d.attendDirectorCount)
            provinces.push(d.doctor_province === null ? '其他' : d.doctor_province)
          })

          const cityDoctorCount = getSeries('参会医生数', { stack: null, barWidth: '25%' })
          const cityWechatDoctorCount = getSeries('微信散点医生数', { stack: null, barWidth: '25%' })
          const cityDirectorCount = getSeries('参会代表数', { stack: null, barWidth: '25%' })
          cityDoctorCount.itemStyle.normal.label.position = 'top'
          cityWechatDoctorCount.itemStyle.normal.label.position = 'top'
          cityDirectorCount.itemStyle.normal.label.position = 'top'
          const cities = []
          data.group.city.forEach(d => {
            cityDoctorCount.data.push(d.attendDoctorCount)
            cityWechatDoctorCount.data.push(d.attendWechatDoctorsCount)
            cityDirectorCount.data.push(d.attendDirectorCount)
            cities.push(d.doctor_city === null ? '其他' : d.doctor_city)
          })

          const deptAttendCount = getPieSeries('参会总人数', { stack: null, barWidth: '25%' })
          const depts = []

          data.group.dept.forEach(d => {
            // deptAttendCount.data.push(d.deptAttendCount)
            // depts.push(d.doctor_dept === null ? '其他' : d.doctor_dept)
            deptAttendCount[0].data.push({
              value: d.deptAttendCount,
              name: d.doctor_dept === null ? '其他' : d.doctor_dept
            })
            // depts.push( d.doctor_dept === null ? '其他' : d.doctor_dept + '({d}%)')
          })

          // 参会医生
          chartData.doctors.series = [attendDoctorCount, attendWechatDoctorCount]
          // 参会带保镖
          chartData.directors.series = [attendDirectorCount]
          // 参会总人数
          chartData.total.series = [attendDoctorCount, attendWechatDoctorCount, attendDirectorCount]
          // 医院总数
          chartData.countHospital = data.countHospital
          // 平均观看时长
          chartData.avgStreamDuration = data.avgStreamDuration
          // 各个大区参会人数
          chartData.district.series = [dictDoctorCount, dictWechatDoctorCount, dictDirectorCount]
          chartData.district.xAxis[0].data = districts
          console.log(chartData.district)
          // 各个省份参会人数
          chartData.province.series = [povDoctorCount, povWechatDoctorCount, povDirectorCount]
          chartData.province.xAxis[0].data = provinces
          // 各个城市参会人数
          chartData.city.series = [cityDoctorCount, cityWechatDoctorCount, cityDirectorCount]
          chartData.city.xAxis[0].data = cities
          // 科室分布
          chartData.dept.series = deptAttendCount
          // chartData.dept.xAxis[0].data = depts
          // chartData.dept.legend = depts

          this.showDoctors = true
          this.showDirectors = true
          this.showTotal = true
          this.showDistrictGroup = true
          this.showProvinceGroup = true
          this.showCityGroup = true
          this.showDeptGroup = true
        })
    },

    handleFilter() {
      this.getData()
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
  h4{font-size: 26px;}
  .picker{
    vertical-align: top;
  }
  .attend-form {
    vertical-align: top;
  }
}
</style>
