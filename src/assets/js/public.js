/**
 * 手机号格式化
 * import formatPhone from '@/assets/js/public.js';
 * formatPhone.formatPhone(12345678900)
 * @param {String} phone
 */
const formatPhone = (phone) => {
  phone = phone.toString();
  return phone.substr(0, 3) + '****' + phone.substr(7, 11);
};

/**
 * 千分位格式化
 * @param {数字} val
 */
const toThousands = (val) => {
  let num = (val || 0).toString(),
    result = '';
  while (num.length > 3) {
    result = ',' + num.slice(-3) + result;
    num = num.slice(0, num.length - 3);
  }
  if (num) {
    result = num + result;
  }
  return result;
};

/**
 * 时间戳转换年-月 日
 * @param timestamp,
 */
function timeToDateTime(timestamp, sym) {
  // 格式化 timestamp 返回年月日
  function formatNumber(n) {
    //对于小于 10 的数字返回 0[1-9]
    n = n.toString();
    return n[1] ? n : '0' + n;
  }
  if (timestamp != null) {
    let date = new Date(timestamp);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return [year, month, day].map(formatNumber).join(sym || '-');
  }
  return '--';
}

/**
 * 时间戳转换年-月 日
 * @param timestamp,
 */
function timeToDate(timestamp, sym) {
  // 格式化 timestamp 返回年月日
  function formatNumber(n) {
    //对于小于 10 的数字返回 0[1-9]
    n = n.toString();
    return n[1] ? n : '0' + n;
  }
  if (timestamp != null) {
    let date = new Date(timestamp);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();
    return [year, month, day].map(formatNumber).join(sym || '-') +' '+[h, m, s].map(formatNumber).join(':');
  }
  return '--';
}

export default {
  formatPhone,
  toThousands,
  timeToDateTime,
  timeToDate
}
