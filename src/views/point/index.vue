<template>
  <div class="point-contain">
    <div class="point-header border-box">
      <p class="font-13 color-cfa972">可用积分</p>
      <div class="point-number font-50 color-cfa972">{{ accumulatPoints }}</div>
    </div>
    <div class="point-body" :style="{'min-height': $store.state.bodyH - 113 + 'px'}">
      <van-list
        v-if="!!list.length"
        v-model="loading"
        :finished="finished"
        finished-text=" "
        @load="onLoad">
        <div class="point-list-cell border-box flex border-bottom-1" v-for="(item,index) in list" :key="index+item.memberIntegralName">
          <div class="point-list-cell_left flex-1">
            <div class="list-cell_left_name font-15 color-232326">{{ item.memberIntegralName }}</div>
            <div class="list-cell_left_brand font-12 m-t-6 color-232326">{{ item.brandName }}</div>
            <div class="list-cell_left_date font-12 m-t-8 color-848689">{{ item.createTime }}</div>
          </div>
          <div class="point-list-cell_right flex-1 text-right">
            <div class="list-cell_right_num font-18 color-000">{{ item.intervalHistory }}</div>
          </div>
        </div>
      </van-list>
      <div class="no-recorde-data no-data-contain" v-if="!list.length">
        <img src="../../assets/images/data-null-icon.png" alt="card-no-data"/>
        <p class="font-16 color-848689">暂无积分明细</p>
      </div>
    </div>
  </div>
</template>

<script>
import { List  } from 'vant';
import publicMethod from '@/assets/js/public.js';
import { getPointData } from '@/api/point.js';
export default {
  name: "point",
  components: {
    [List.name]:List
  },

  data() {
    return {
      accumulatPoints: '0',
      list: [
        /* {
          memberIntegralName: '今日签到',
          brandName: '[MATERIAL GIRL]',
          createTime: '2018-12-06 10:32',
          intervalHistory: '5'
        } */
      ],
      loading: false,
      finished: false,
      currentPage: 1,
      pageSize: 5,
      totalCount: 0,
      totalPage: 0
    };
  },

  computed: {

  },

  methods: {

    /**
     * sleep
     */
    wait(ms) {
      return new Promise(r => setTimeout(r, ms));
    },

    async onLoad() {
      const that = this;
      // 异步更新数据
      await that.wait(1000);
      if (that.currentPage >= that.totalPage) {
        // 加载状态结束
        that.loading = false;
        that.finished = true;
        return false;
      }
      that.currentPage = that.currentPage + 1;
      await that.getData();

      // 加载状态结束
      that.loading = false;
      // 数据全部加载完成
      if (that.list.length >= that.totalCount) {
        that.finished = true;
      }
    },

    /**
     * 获取积分数据
     */
    async getData() {
      const that = this;
      let param = {
        // memberId: that.$store.state.memberId,
        currentPage: that.currentPage,
        pageSize: that.pageSize
      }
      let resData = await getPointData(param);
      if (resData.errorCode == 0) {
        that.accumulatPoints = String(resData.result.accumulatPoints).length < 4?  resData.result.accumulatPoints: publicMethod.toThousands(resData.result.accumulatPoints);
        resData.result.page.result.forEach(ele => {
          ele.intervalHistory = Number.parseInt(ele.intervalHistory)>0? '+'+ Number.parseInt(ele.intervalHistory): ele.intervalHistory;
          ele.createTime = publicMethod.timeToDate(ele.createTime);
          that.list.push(ele);
        });
        that.currentPage = resData.result.page.currentPage;
        that.totalPage = resData.result.page.totalPage;
        that.totalCount =  resData.result.page.totalCount;
      }
    }
  },
  mounted() {
    let that = this;
    that.getData();
  }
};
</script>

<style lang="less" scoped>
@import '../../assets/css/fonts.css';
.point-header {
  width: 100%;
  padding: 15px 0 15px 31px;
  background: url('../../assets/images/banner_bg.png') no-repeat center center;
  background-size: 100%;
  font-family: 'DINPro';
}

.point-body {
  position: relative;

}
.point-list-cell {
  width: 100%;
  padding: 15px;
}
</style>
