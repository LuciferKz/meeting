<template>
  <div class="dashboard-editor-container">
    <!-- <github-corner class="github-corner" /> -->

    <panel-group :data="chartData" />

    <h4>会议场数</h4>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="chartData.meetings" />
    </el-row>

    <h4>覆盖医生数</h4>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <bar-chart v-if="showDoctors" :chart-data="chartData.doctors"/>
    </el-row>

    <h4>覆盖代表数</h4>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <bar-chart v-if="showDirectors" :chart-data="chartData.directors"/>
    </el-row>

    <h4>参会总人数</h4>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <bar-chart v-if="showTotal" :chart-data="chartData.total"/>
    </el-row>

    <h4>大区参会人数</h4>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <bar-chart v-if="showDistrictGroup" :chart-data="chartData.district"/>
    </el-row>

    <h4>省份参会人数</h4>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <bar-chart v-if="showProvinceGroup" :chart-data="chartData.province"/>
    </el-row>

    <h4>城市参会人数</h4>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <bar-chart v-if="showCityGroup" :chart-data="chartData.city"/>
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
import GithubCorner from '@/components/GithubCorner'
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import { fetchData } from '@/api/dashboard'
import { deepClone } from '@/utils'
// import TransactionTable from './components/TransactionTable'
// import TodoList from './components/TodoList'
// import BoxCard from './components/BoxCard'

const months = new Array(12).fill('').map((v, i) => i + 1 + '月')

const getSeries = function (name, option = {}) {
  let series = {
    name,
    type: 'bar',
    barWidth: option.barWidth || '60%',
    data: [],
    animationDuration: 3000
  }
  if (option.stack) series.stack = option.stack
  return series
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
          color: '#FF005A',
          lineStyle: {
            color: '#FF005A',
            width: 2
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
      showCityGroup: false
    }
  },
  created() {
    this.getData()
  },
  methods: {
    handleSetChartData(type) {
      this.chartData = chartData[type]
    },

    getData() {
      fetchData()
        .then((res) => {
          console.log(res)
          let data = res.data
          let meetingsData = chartData.meetings.series[0].data
          let attendDoctorCount = getSeries('参会医生数', { stack: 'count' })
          let attendWechatDoctorCount = getSeries('微信散点医生数', { stack: 'count' })
          let attendDirectorCount = getSeries('参会代表数', { stack: 'count' })

          let meetingCount = 0
          data.bar.forEach(d => {
            meetingCount += d.meetingCount
            let index = d.month - 1
            this.$set(meetingsData, index, meetingCount)
            this.$set(attendDoctorCount.data, index, d.doctorCount)
            this.$set(attendWechatDoctorCount.data, index, d.wechatDoctorCount)
            this.$set(attendDirectorCount.data, index, d.directorCount)
          })

          let dictDoctorCount = getSeries('参会医生数', { barWidth: '25%' })
          let dictWechatDoctorCount = getSeries('微信散点医生数', { barWidth: '25%' })
          let dictDirectorCount = getSeries('参会代表数', { barWidth: '25%' })
          let districts = []
          data.group.district.forEach(d => {
            dictDoctorCount.data.push(d.attendDoctorCount)
            dictWechatDoctorCount.data.push(d.attendWechatDoctorsCount)
            dictDirectorCount.data.push(d.attendDirectorCount)
            districts.push(d.director_district)
          })

          let povDoctorCount = getSeries('参会医生数', { stack: null, barWidth: '25%' })
          let povWechatDoctorCount = getSeries('微信散点医生数', { stack: null, barWidth: '25%' })
          let povDirectorCount = getSeries('参会代表数', { stack: null, barWidth: '25%' })
          let provinces = []
          data.group.province.forEach(d => {
            povDoctorCount.data.push(d.attendDoctorCount)
            povWechatDoctorCount.data.push(d.attendWechatDoctorsCount)
            povDirectorCount.data.push(d.attendDirectorCount)
            provinces.push(d.doctor_province)
          })

          let cityDoctorCount = getSeries('参会医生数', { stack: null, barWidth: '25%' })
          let cityWechatDoctorCount = getSeries('微信散点医生数', { stack: null, barWidth: '25%' })
          let cityDirectorCount = getSeries('参会代表数', { stack: null, barWidth: '25%' })
          let cities = []
          data.group.city.forEach(d => {
            cityDoctorCount.data.push(d.attendDoctorCount)
            cityWechatDoctorCount.data.push(d.attendWechatDoctorsCount)
            cityDirectorCount.data.push(d.attendDirectorCount)
            cities.push(d.doctor_city)
          })
          console.log(cities)

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
          // 各个省份参会人数
          chartData.province.series = [povDoctorCount, povWechatDoctorCount, povDirectorCount]
          chartData.province.xAxis[0].data = provinces
          // 各个城市参会人数
          chartData.city.series = [cityDoctorCount, cityWechatDoctorCount, cityDirectorCount]
          chartData.city.xAxis[0].data = cities

          this.showDoctors = true
          this.showDirectors = true
          this.showTotal = true
          this.showDistrictGroup = true
          this.showProvinceGroup = true
          this.showCityGroup = true
        })
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
}
</style>
