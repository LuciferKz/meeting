<template>
  <div class="dashboard-editor-container">
    <!-- <github-corner class="github-corner" /> -->

    <!-- <panel-group @handleSetLineChartData="handleSetLineChartData" /> -->

    <h4>会议场数</h4>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="chartData.meetings" />
    </el-row>

    <h4>覆盖医生数</h4>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <bar-chart v-if="showDoctors" :chart-data="chartData.doctors"/>
    </el-row>

    <!-- <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
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
// import TransactionTable from './components/TransactionTable'
// import TodoList from './components/TodoList'
// import BoxCard from './components/BoxCard'

const months = new Array(12).fill('').map((v, i) => i + 1 + '月')

const animationDuration = 6000

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
    series: [{
      name: '参会医生数',
      type: 'bar',
      stack: 'vistors',
      barWidth: '60%',
      data: [],
      animationDuration
    }, {
      name: '微信散点医生数',
      type: 'bar',
      stack: 'vistors',
      barWidth: '60%',
      data: [],
      animationDuration
    }],
    legend: {
      data: ['参会医生数', '微信散点医生数']
    }
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
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
      showDoctors: false
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
          const meetingsData = chartData.meetings.series[0].data
          const doctorsData = chartData.doctors.series
          let meetingCount = 0
          res.data.meetings.forEach(d => {
            meetingCount += d.total
            this.$set(meetingsData, d.month - 1, meetingCount)
          })

          let doctorCount = chartData.doctors.series[0].data
          let wechatDoctorCount = chartData.doctors.series[1].data
          res.data.doctors.forEach(d => {
            this.$set(doctorCount, d.month - 1, d.doctorCount)
            this.$set(wechatDoctorCount, d.month - 1, d.wechatDoctorCount)
          })
          this.showDoctors = true
          console.log(doctorCount, wechatDoctorCount)
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
