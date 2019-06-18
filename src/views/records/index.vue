<template>
  <div class="recorde-contian bg-f4f5f6" :style="{'min-height': $store.state.bodyH + 'px'}">
    <div class="list-contian">
      <van-list
        v-if="!!list.length"
        v-model="loading"
        :finished="finished"
        finished-text=" "
        @load="onLoad">
        <div class="recorde-list-cell bg-fff border-box" v-for="(item,index) in list" :key="index+item.storeName">
          <div
            class="recorde-list-cell_title flex flex-align-center font-12 border-bottom-1 padding-lr-12 border-box">
            <div class="recorde-list-cell_txt w-0 flex-1"><van-icon name="shop-o" class="m-r-4" />{{ item.storeName }}</div>
          </div>
          <div class="recorde-list-cell_list" v-for="(childItem,key) in item.list" :key="key">
            <div class="flex border-box padding-lr-12 p-t-10">
              <div class="recorde-list-cell_left flex-1">
                <div class="list-cell_left_name font-12 color-232326">{{ childItem.productName }}</div>
              </div>
              <div class="recorde-list-cell_right flex-1 text-right">
                <div class="list-cell_right_num font-13 color-232326 ">{{ childItem.payPrice }}</div>
                <div class="list-cell_right_num font-13 color-848689 "><s>{{ childItem.unitPrice }}</s></div>
              </div>
            </div>
            <div class="recorde-list-cell_sku flex flex-align-center border-bottom-1 border-box padding-lr-12">
              <div class="flex-1 font-12 color-848689">
                <span v-for="(attrItem,attrIndex) in childItem.attrColorSize" :key="attrIndex" :class="[attrIndex>0? 'p-l-8': '']">{{ attrItem.key }}: {{ attrItem.value }} </span>
              </div>
              <div class="flex-1 font-12 color-848689 text-right"><van-icon name="cross"></van-icon>{{ childItem.number}}</div>
            </div>
          </div>
          <div class="recorde-list-cell_sub flex flex-align-center border-box padding-lr-12">
            <div class="list-cell_sub_date flex-1 font-12 color-232326">{{ item.receiptsDate }} 购买</div>
            <div class="list-cell_sub_all flex-1 font-12 color-232326 text-right">共{{ item.itemNum }}件商品 实付款: {{ item.paidAmount }}</div>
          </div>
        </div>
      </van-list>
    </div>
    <div class="no-recorde-data no-data-contain" v-if="!list.length">
      <img src="../../assets/images/store-record-null-icon.png" alt="record-no-data"/>
      <p class="font-16 color-848689">暂无消费记录</p>
    </div>
  </div>
</template>

<script>
import { List, Icon  } from 'vant';
import publicMethod from '@/assets/js/public.js';
import { getRecordData } from '@/api/record.js';
export default {
  name: "record",
  components: {
    [List.name]: List,
    [Icon.name]: Icon
  },

  data() {
    return {
      currentPage: 1,
      pageSize: 5,
      totalCount: 0,
      totalPage: 0,
      list: [
         /* {
          storeName: 'MG江苏南京秦淮区大洋百货新街口店(MATERIAL GIRL)333333',
          receiptsDate: '2018-12-06',
          itemNum: '1',
          paidAmount: '12345.90',
          list: [
            {
              productName: '哥斯拉加厚白色鸭绒羽绒服女中长款2018冬装新款绿连帽外套太平鸟333333',
              payPrice: '1059.99',
              unitPrice: '1899.00',
              number: '1',
              attrColorSize: [
                {
                  key: '尺码',
                  value: '元气绿',
                },
                {
                  key: '颜色',
                  value: 'M',
                },
              ]
            },
            {
              productName: '哥斯拉加厚白色鸭绒羽绒服女中长款2018冬装新款绿连帽外套太平鸟333333',
              payPrice: '1059.99',
              unitPrice: '1899.00',
              number: '1',
              attrColorSize: [
                {
                  key: '尺码',
                  value: '元气绿',
                },
                {
                  key: '颜色',
                  value: 'M',
                },
              ]
            }
          ]
        },
        {
          storeName: 'MG江苏南京秦淮区大洋百货新街口店(MATERIAL GIRL)333333',
          receiptsDate: '2018-12-06',
          itemNum: '1',
          paidAmount: '12345.90',
          list: [
            {
              productName: '哥斯拉加厚白色鸭绒羽绒服女中长款2018冬装新款绿连帽外套太平鸟333333',
              payPrice: '1059.99',
              unitPrice: '1899.00',
              number: '1',
              attrColorSize: [
                {
                  key: '尺码',
                  value: '元气绿',
                },
                {
                  key: '颜色',
                  value: 'M',
                },
              ]
            },
            {
              productName: '哥斯拉加厚白色鸭绒羽绒服女中长款2018冬装新款绿连帽外套太平鸟333333',
              payPrice: '1059.99',
              unitPrice: '1899.00',
              number: '1',
              attrColorSize: [
                {
                  key: '尺码',
                  value: '元气绿',
                },
                {
                  key: '颜色',
                  value: 'M',
                },
              ]
            }
          ]
        } */
      ],
      loading: false,
      finished: false
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
     * 获取消费记录数据
     */
    async getData() {
      const that = this;
      let param = {
        // memberId: that.$store.state.memberId,
        currentPage: that.currentPage,
        pageSize: that.pageSize
      }
      let resData = await getRecordData(param);
      if (resData.errorCode == 0) {
        resData.result.page.result.forEach(ele => {
          ele.receiptsDate = publicMethod.timeToDateTime(ele.receiptsDate);
        });
        that.list = resData.result.page.result || [];
        that.totalPage = resData.result.page.totalPage;
        that.currentPage = resData.result.page.currentPage;
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

.recorde-list-cell {
  &+.recorde-list-cell {
    margin-top: 10px;
  }
}
.recorde-list-cell_title {
  width: 100%;
  height: 42px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;

  .van-icon-shop-o {
    vertical-align: -1px;
  }

  .recorde-list-cell_txt {

    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}

.recorde-list-cell_sub {
  height: 42px;
}

.recorde-list-cell_left {
  min-width: 70%;
  .list-cell_left_name {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    box-orient: vertical;
    word-break: break-all;
    overflow: hidden;
  }
}

.recorde-list-cell_sku {
  height: 42px;
}

.van-icon-cross {
  vertical-align: -2px;
}

</style>
