<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>

      <!-- 2、为 ECharts 准备一个定义了宽高的 DOM -->
      <div id="main" style="width: 600px;height:400px;"></div>

    </el-card>
  </div>
</template>
<script>
// 1 引入
// import echarts from 'echarts'
import * as echarts from 'echarts'
// import _ from 'lodash'

export default {
  data() {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  created() {
    // this.getReportInfo()
  },
  async mounted() {
    // 3、基于准备好的 dom，初始化 echarts 实例
    var myChart = echarts.init(document.getElementById('main'))
    const { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) {
      return this.$message.error(res.meta.msg)
    }
    // 4、指定图表的配置项和数据
    // 这里深拷贝不成功
    // const result = _.merge(res.data, this.optins)
    // 下面两种浅拷贝都没问题
    // const result = Object.assign(this.options, res.data)
    const result = { ...this.options, ...res.data }

    // console.log('_.merge', _.merge)
    console.log('result', result)
    // var
    // option = {
    //   title: {
    //     text: '用户管理'
    //   },
    //   tooltip: {},
    //   legend: {
    //     data: ['销量']
    //   },
    //   xAxis: {
    //     data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
    //   },
    //   yAxis: {},
    //   series: [
    //     {
    //       name: '销量',
    //       type: 'bar',
    //       data: [5, 20, 36, 10, 10, 20]
    //     }
    //   ]
    // }

    // 5、使用刚指定的配置项和数据显示图表。
    myChart.setOption(result)
  }
}
</script>
<style lang="less" scoped>

</style>
