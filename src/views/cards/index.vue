<template>
  <div class="card-contain border-box" :style="{'min-height': $store.state.bodyH + 'px'}">
    <div class="card-contain-inner">
      <div class="card-brand-list border-box" v-for="(item,index) in cardList" :key="index">
        <div class="card-brand-title">{{ item.brandName }}</div>
        <template v-for="(childItem,ind) in item.cardData">
          <div :class="['card-list-cell border-box', childItem.VOU_TYPE == 'VOU4'? 'discount-cell':'']" v-if="ind < item.showCount"  :key="ind" >
            <div :class="['card-list-cell_top border-box flex', childItem.VOU_TYPE == 'VOU4'? 'discount-cell':''] ">
              <div class="card-list-cell_top_left flex-1">{{ childItem.VOU_TYPE == "VOU4"? '折扣券':'优惠券' }}</div>
              <div class="card-list-cell_top_right flex-1 text-right">{{ childItem.VOUCHERS_NO }}</div>
            </div>
            <div class="card-list-arrow">
              <div :class="['card-list-arrow_left', childItem.VOU_TYPE == 'VOU4'? 'discount-cell':'']"></div>
              <div :class="['card-list-arrow_right', childItem.VOU_TYPE == 'VOU4'? 'discount-cell':'']"></div>
            </div>
            <div class="card-list-cell_body flex flex-align-center flex-pack-center">
              <div :class="['card-list-cell_body_left flex-1 flex flex-align-center flex-pack-center font-30', childItem.VOU_TYPE == 'VOU4'? 'discount-cell':'']">
                <span class="font-15 m-t-10" v-if="childItem.VOU_TYPE == 'VOU5'">¥</span>{{ childItem.VOU_TYPE == "VOU4"? childItem.VOU_DIS+'折' :childItem.AMT_DISCOUNT}}
              </div>
              <div class="card-list-cell_body_right border-box flex-2">
                <div class="cell-body_right_cell"></div>
                <div class="cell-body_right_cell">{{ childItem.START_DATE +'--'+ childItem.VALID_DATE }}</div>
                <div class="cell-body_right_cell"></div>
              </div>
            </div>
          </div>
        </template>
        <div
          v-if="item.cardData.length > 3 && item.cardData.length > item.showCount"
          class="show-all font-14 color-848689"
          @click="showAllData(item)">
          展开剩余{{ item.cardData.length - 3 }}张 <van-icon name="arrow-down" />
        </div>
        <div
          v-if="item.cardData.length > 3 && item.cardData.length == item.showCount"
          class="show-all font-14 color-848689"
          @click="showPartData(item)">
          收起 <van-icon name="arrow-up" />
        </div>
      </div>
    </div>
    <div class="no-card-data no-data-contain" v-if="!cardList.length">
      <img src="../../assets/images/coupon-null-icon.png" alt="card-no-data"/>
      <p class="font-16 color-848689">你还没有卡券哦</p>
    </div>
  </div>
</template>

<script>
import { Icon, Toast } from 'vant';
import { getCardsData } from '@/api/cards.js';
export default {
  name: "cards",
  components: {
    [Icon.name]: Icon
  },
  data() {
    return {
      cardList: [
        /* {
          brandName: 'MATERIAL GIRL',
          showCount: 3, // 默认显示个数
          cardData: [
            {
              BRANDNAME: "童装",
              cardTitle: '感恩节抵扣券',
              VOUCHERS_NO: '23554666773',
              VOU_TYPE: "VOU5",
              AMT_DISCOUNT: "20",
              VOU_DIS: '2',
              START_DATE: "20180220",
              VALID_DATE: "20190219"
            },
            {
              BRANDNAME: "童装",
              cardTitle: '感恩节抵扣券',
              VOUCHERS_NO: '23554666773',
              VOU_TYPE: "VOU4",
              AMT_DISCOUNT: "20",
              VOU_DIS: '2',
              START_DATE: "20180220",
              VALID_DATE: "20190219"
            }
          ]
        } */
      ]
    };
  },

  computed: {

  },

  methods: {
    formatDate(date) {
      let flag = date.match(/^(\d{4})(\d{2})(\d{2})$/);
      /* eslint-disable */
      if (!!flag) {
        return date.replace(/(\d{4})(\d{2})(\d{2})/g,'$1.$2.$3');
      }
      return date;
    },
    /**
     * 显示所有
     */
    showAllData(item) {
      item.showCount = item.cardData.length;
    },

    /**
     * 显示所有
     */
    showPartData(item) {
      // const that = this;
      item.showCount = 3;
    },

    async getCardList() {
      const that = this;
      let params = {
        // CardNo: '',
        // SecretId: '',
        // Timestamp: '',
        // Signature: ''
      }
      let resData = await getCardsData(params);
      if (resData.errorCode == 0) {
        if (!!resData.result && !!resData.result.length) {
          let brandList = [];
          resData.result.forEach(ele => {
            ele.START_DATE = that.formatDate(ele.START_DATE);
            ele.VALID_DATE = that.formatDate(ele.VALID_DATE);
            ele.VOU_DIS = !!ele.VOU_DIS? Number(ele.VOU_DIS*100/10).toFixed(2) : '';
            // 去重
            if (!brandList.includes(ele.BRANDNAME) && ele.IS_VALID == 'Y') {
              brandList.push(ele.BRANDNAME);
            }
          });

          brandList.forEach(ele =>{
            that.cardList.push(
              {
                brandName: ele,
                showCount: 3, // 默认显示个数
                cardData: []
              }
            )
          })

          resData.result.forEach(ele => {
             that.cardList.forEach(item => {
               if (ele.BRANDNAME == item.brandName && ele.IS_VALID == 'Y') {
                 item.cardData.push(ele)
               }
             })
          })
        }
      }else {
        Toast(resData.message);
      }
    }
  },
  mounted(){
    this.getCardList();
  }
};
</script>

<style lang="less" scoped>
.card-contain {
  position: relative;
  width: 100%;
  padding: 10px;
  background: #f4f5f6;

  .card-contain-inner {
    width: 100%;

    .card-brand-list {
      width: 100%;
      padding: 0 8px 8px 8px;
      background: #fff;
      border-radius: 5px;
      &+.card-brand-list{
        margin-top: 10px;
      }
      .card-brand-title {
        width: 100%;
        height: 45px;
        line-height: 45px;
        font-size: 14px;
        color: #232326;
      }
      .card-list-cell {
        width: 100%;
        height: 100px;
        background-image: url(../../assets/images/coupon_bg.png);
        background-size: 100%;
        background-repeat: no-repeat;
        border-radius: 5px;
        background-color: rgba(234,51,51, 0.06);
        border: 1px solid rgba(234,51,51, 0.16);
        font-size: 11px;
        color: #333;
        &.discount-cell {
          background-color: rgba(230,160,22, 0.06);
          border-color: rgba(230,160,22, 0.16)
        }
        &+.card-list-cell {
          margin-top: 10px;
        }
        .card-list-cell_top {
          width: 100%;
          height: 35px;
          line-height: 35px;
          padding: 0 12px;
          border-bottom: 1px dashed rgba(234,51,51, 0.16);
          &.discount-cell {
            border-color: rgba(230,160,22, 0.16)
          }
        }

        .card-list-arrow {
          position: relative;
          &_left {
            position: absolute;
            left: -6px;
            top: -6px;
            width: 10px;
            height: 10px;
            -webkit-transform: rotate(45deg);
            -moz-transform: rotate(45deg);
            transform: rotate(45deg);
            background-color: #fff;
            border-right: 1px solid rgba(234,51,51, 0.3);
            border-top: 1px solid rgba(234,51,51, 0.3);
            &.discount-cell {
              border-color: rgba(230,160,22, 0.3)
            }
          }
          &_right {
            position: absolute;
            right: -6px;
            top: -6px;
            width: 10px;
            height: 10px;
            -webkit-transform: rotate(45deg);
            -moz-transform: rotate(45deg);
            transform: rotate(45deg);
            background-color: #fff;
            border-left: 1px solid rgba(234,51,51, 0.3);
            border-bottom: 1px solid rgba(234,51,51, 0.3);
            &.discount-cell {
              border-color: rgba(230,160,22, 0.3)
            }
          }
        }

        .card-list-cell_body {
          width: 100%;
          height: 65px;

          &_left {
            position: relative;
            height: 100%;
            border-right: 1px dashed rgba(234,51,51, 0.16);
            -webkit-transform: translate(0,-1px);
            -moz-transform: translate(0,-1px);
            transform: translate(0,-1px);
            &.discount-cell {
              border-color: rgba(230,160,22, 0.16)
            }
          }

          &_right {
            padding-left: 15px;
          }
        }
      }
      .show-all {
        width: 100%;
        height: 32px;
        line-height: 40px;
        text-align: center;

        .van-icon-arrow-down {
          vertical-align: middle;
        }

        .van-icon-arrow-up {
          vertical-align: middle;
        }
      }
    }
  }
}
</style>
