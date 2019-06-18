<template>
  <div class="index-contain">
    <section :class="[!userData.cardFlag ? 'm-b-15': '']">
      <div class="clique-logo">
        <img src="../../assets/images/logo.png" alt="logo" />
      </div>
    </section>
    <section v-show="!!userData.cardFlag">
      <div class="clique-qrcode">
        <svg id="barcode"></svg>
        <p class="font-13 color-232326">{{ userData.phoneNumber }}</p>
      </div>
    </section>
    <section v-if="!!userData.cardFlag">
      <div class="clique-menu flex">
        <div class="flex-1 flex flex-column clique-menu-cell" @click="changeRoute('point')">
          <p class="color-232326 font-20 font-w-500">{{ userData.accumulatPoints }}</p>
          <p class="color-848689 font-14 m-t-6">可用积分</p>
        </div>
        <div class="flex-1 flex flex-column clique-menu-cell border-left-1" @click="changeRoute('records')">
          <p class="color-232326 font-20 font-w-500">{{ userData.orderCount }}</p>
          <p class="color-848689 font-14 m-t-6">消费记录</p>
        </div>
        <div class="flex-1 flex flex-column clique-menu-cell border-left-1" @click="changeRoute('cards')">
          <p class="color-232326 font-20"><i class="font-20 font_family icon-qiaquan-"></i></p>
          <p class="color-848689 font-14 m-t-6">卡券</p>
        </div>
        <div class="flex-1 flex flex-column clique-menu-cell border-left-1" @click="toPointMall">
          <p class="color-232326 font-20"><i class="font-20 font_family icon-jifenshangcheng-"></i></p>
          <p class="color-848689 font-14 m-t-6">积分商城</p>
        </div>
      </div>
    </section>
    <section>
      <div class="clique-swiper">
        <van-swipe class="goods-swipe" :autoplay="3000"  indicator-color="#232326">
          <van-swipe-item v-for="(item, index) in banners" :key="'banner'+index">
            <img :src="item.banner" alt="img" style="width: 100%;" @click="toUrl(item.url)"/>
          </van-swipe-item>
        </van-swipe>
      </div>
    </section>
    <section>
      <div class="clique-brand">
        <template v-for="(item,index) in brandList">
          <div
            :class="['clique-brand-logo', 'border-box',!userData.cardFlag? (index%2 == 0?'b-l-1 half':' half') : (index%3 == 0?'b-l-1':'')]"
            :key="index+item.src">
            <a class="clique-brand-logo_a" @click="showDialog(item)">
              <img :src="item.src" alt="logo" />
            </a>
          </div>
        </template>
      </div>
    </section>
    <p class="font-12 color-848689 p-tips border-box"><a href="" class="font-12 color-848689 ">让每个人尽享时尚圈的乐趣~</a></p>
    <div class="qrcode-dialog_confirm" id="dialog" v-if="qrcodeVisable">
      <div class="qrcode-mask" @click="closeDialog"></div>
      <div class="qrcode-dialog" :style="{'top': $store.state.bodyH/2 + 'px'}">
          <span class="qrcode-dialog-close" @click="closeDialog"><van-icon name="cross" /></span>
          <div class="qrcode-dialog_hd">
            <img :src="dialogData.logo" alt="log0"/>
          </div>
          <div class="qrcode-dialog_bd">
            <div class="qrcode-outer border-box"><img :src="dialogData.qrcode" alt="qrcode"/></div>
            <p class="font-12 color-666 text-center triangle-p"><i class="triangle-up"></i></p>
            <p class="font-12 color-666 text-center">长 按 二 维 码 关 注 我 们</p>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Swipe, SwipeItem, Icon, Toast } from 'vant';
import JsBarcode from 'jsbarcode';
import publicMethod from '@/assets/js/public.js';
import { getIndexData, getIndexUrl } from '@/api/index.js';

export default {
  components: {
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [Icon.name]: Icon
  },

  data() {
    return {
      userData: {
        cardNum: '123456', // 集团卡号
        phoneNumber: '', // 手机号码
        accumulatPoints: '0', // 可用积分
        orderCount: 0, // 订单数量
        memberId: '', // 会员id
        cardFlag: false, // 是否有集团卡
        enterpriseId: '' // 企业 id
      },
      banners: [
        {
          banner: require('../../assets/images/leding.jpg'),
          url: 'https://m.ezrpro.cn/home/139'
        },
        {
          banner: require('../../assets/images/man.png'),
          url: ''
        },
        {
          banner: require('../../assets/images/woman.jpg'),
          url: ''
        },
        {
          banner: require('../../assets/images/child.jpg'),
          url: ''
        },
        {
          banner: require('../../assets/images/mg.jpg'),
          url: ''
        },
      ],

      brandList: [
        {
          enterpriseId: 'ff8080816709b37401671a727e9c5a26',
          src: require('../../assets/images/logo01.png'),
          imgSrc: require('../../assets/images/logo01_248_124.png'),
          qrcode: require('../../assets/images/001.png'),
        },
        {
          enterpriseId: 'ff8080816709b37401671b05c040215a',
          src: require('../../assets/images/logo02.png'),
          imgSrc: require('../../assets/images/logo02_248_124.png'),
          qrcode: require('../../assets/images/002.png'),
        },
        {
          enterpriseId: 'ff8080816709b3a3016715fd29e21852',
          src: require('../../assets/images/logo03.png'),
          imgSrc: require('../../assets/images/logo03_248_124.png'),
          qrcode: require('../../assets/images/003.png'),
        },
        {
          enterpriseId: 'ff80808166d50d470167068380025146',
          src: require('../../assets/images/logo04.png'),
          imgSrc: require('../../assets/images/logo04_248_124.png'),
          qrcode: require('../../assets/images/004.png'),
        },
        {
          enterpriseId: 'ff8080816709b30d01671b0876b01eb9',
          src: require('../../assets/images/logo05.png'),
          imgSrc: require('../../assets/images/logo05_248_124.png'),
          qrcode: require('../../assets/images/005.png'),
        },
        {
          enterpriseId: '',
          src: require('../../assets/images/logo06.png'),
          qrcode: '',
        }
      ],
      qrcodeVisable: false,
      dialogData: {
        logo: require('../../assets/images/logo01_248_124.png'),
        qrcode: require('../../assets/images/001.png')
      }
    };
  },

  methods: {
    changeRoute(path) {
      this.$router.push(path);
    },

    /**
     * 跳转第三方积分商城
     */
    async toPointMall() {
      let that = this;
      Toast('敬请期待');
      return false;
      let resData = await getIndexUrl();
      if (resData.errorCode == 0 && !!resData.result.url) {
        window.open(resData.result.url)
      }
    },

    /**
     * banner 跳转
     */
    toUrl(url) {
      // let that = this;
      if (!!url) {
        window.open(url);
      }
    },

    /**
     * 显示公众号二维码弹窗
     */
    showDialog(item) {
      let that = this;
      if (!item.qrcode) {
        return;
      }
      if (item.enterpriseId == that.userData.enterpriseId) {
        // 如果是乐町，跳转 EZR 会员中心（H5）
        if (item.enterpriseId == 'ff8080816709b3a3016715fd29e21852') {
          window.open('https://m.ezrpro.cn/home/139')
        }
        // 男装是跳转至互道的会员中心
        if (item.enterpriseId == 'ff8080816709b37401671b05c040215a') {
          window.open('https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf5123c7dcd0c3b73&redirect_uri=http%3A%2F%2Ftest-auth.nexttao.com%2Fw_server%2Fredirect_tenant.html%3Fpage%3Dhttps%3A%2F%2Fpb-demo-member-web.nexttao.com%2Findex.html%26component_appid%3Dwxed2cf9dfac8d1dbd%26shop_id%3D1677&response_type=code&scope=snsapi_base&state=authorize&component_appid=wxed2cf9dfac8d1dbd#wechat_redirect')
        }

        // MG 是显示小程序码
        if (item.enterpriseId == 'ff80808166d50d470167068380025146') {
          that.dialogData = {
            logo: item.imgSrc,
            qrcode: require('../../assets/images/mg.png')
          }
          that.qrcodeVisable = true;
          document.body.style.overflow = 'hidden';
          document.body.classList.add("fixed");
        }

        // 童装
        if (item.enterpriseId == 'ff8080816709b30d01671b0876b01eb9') {
          return false;
        }
        // 女装
        if (item.enterpriseId == 'ff8080816709b37401671a727e9c5a26') {
          return false;
        }

        return false;
      } else {
        that.dialogData = {
          logo: item.imgSrc,
          qrcode: item.qrcode
        }
        that.qrcodeVisable = true;
        document.body.style.overflow = 'hidden';
        document.body.classList.add("fixed");
      }
    },

    /**
     * 关闭二维码弹窗
     */
    closeDialog() {
      const that = this;
      that.qrcodeVisable = false;
      document.body.style.overflow = 'unset';
      document.body.classList.remove("fixed");
      document.body.removeAttribute("class");
    },

    /**
     * 生成条形码
     */
    barcode(code) {
      JsBarcode("#barcode", code, {
        format: 'CODE128',
        displayValue: false,
        background: "#ffffff",
        height: '60'
      })
    },

    /**
     * 获取数据
     */
    async getData() {
      const that = this;
      let param = {
        // memberId: 'ff80808163a6ab7a0163a6abd0710000',
        // enterpriseId: 'ff808081593917d90159398ec6340012'
      }
      let resData = await getIndexData(param);
      if (resData.errorCode == 0) {
        resData.result.accumulatPoints = String(resData.result.accumulatPoints).length < 4?  resData.result.accumulatPoints: publicMethod.toThousands(resData.result.accumulatPoints);
        that.userData = resData.result;
        that.barcode(that.userData.cardNum);
      }
    },

    /**
     * 设置memberId
     */
    setMemberId() {
      let that = this;
      that.$store.dispatch('modifyMemberId','444')
    }
  },
  mounted() {
    let that = this;
    that.getData();
    that.barcode('123456789766');
  }
};
</script>

<style lang="less">
@import url(../../assets/css/index.css);
.index-contain {
  position: relative;
}

/* 弹窗 */
.qrcode-dialog_confirm {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.qrcode-dialog {
  position: relative;
  padding: 30px 0;
  min-height: 270px;

  .qrcode-dialog-close {
    position: absolute;
    top: 18px;
    right: 14px;
    display: block;
    width: 28px;
    height: 28px;
    line-height: 28px;
    .van-icon-cross {
      font-size: 14px;
      color: #848689;
    }
    // -webkit-transform: rotate(45deg);
    // -moz-transform: rotate(45deg);
    // transform: rotate(45deg);
  }

  .qrcode-dialog_hd {
    width: 100%;
    text-align: center;
    img {
      width: 124px;
    }
  }

  .qrcode-dialog_bd {
    width: 160px;
    margin: 0 auto;
    .qrcode-outer {
      position: relative;
      width: 150px;
      height: 160px;
      margin: 0 auto;
      margin-left: -3px;
      border-bottom: 10px solid rgba(0,0,0,0.15);
      border-left: 10px solid rgba(0,0,0,0.15);
      &::before {
        content: '';
        position: absolute;
        left: -11px;
        top: -1px;
        width: 11px;
        height: 11px;
        background: #FAFAFC;
      }
      img {
        display: inline-block;
        vertical-align: bottom;
        width: 150px;
      }
    }

    p {
      position: relative;

      &.triangle-p {
        width: 100%;
        height: 22px;
        // padding-top: 8px;
        i {
          top: 40%
        }
      }
    }
  }
}
</style>
