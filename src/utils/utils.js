import { parse } from 'querystring';

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

//递归处理函数
export const setArray = (arr) => {
  let len = arr.length;
  // 当数组大于等于2个的时候
  if (len >= 2) {
    // 第一个数组的长度
    let len1 = arr[0].length;
    // 第二个数组的长度
    let len2 = arr[1].length;
    // 2个数组产生的组合数
    let lenBoth = len1 * len2;
    //  申明一个新数组,做数据暂存
    let items = new Array(lenBoth);
    // 申明新数组的索引
    let index = 0;
    // 2层嵌套循环,将组合放到新数组中
    for (let i = 0; i < len1; i++) {
      for (let j = 0; j < len2; j++) {
        items[index] = arr[0][i] + '卐' + arr[1][j];
        index++;
      }
    }
    // 将新组合的数组并到原数组中
    let newArr = new Array(len - 1);
    for (let i = 2; i < arr.length; i++) {
      newArr[i - 1] = arr[i];
    }
    newArr[0] = items;
    // 执行回调
    return setArray(newArr);
  } else {
    return arr[0];
  }
}

//减法函数
export const accSub = (arg1, arg2) => {
  var r1, r2, m, n;
  try {
    r1 = arg1.toString().split(".")[1].length;
  }
  catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  }
  catch (e) {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2));
  //last modify by deeka
  //动态控制精度长度
  n = (r1 >= r2) ? r1 : r2;
  return ((arg1 * m - arg2 * m) / m).toFixed(n);
}

// 乘法计算
export const accMul = (arg1, arg2) => {
  var m = 0, s1 = arg1 ? arg1.toString() : '0', s2 = arg2 ? arg2.toString() : '0';
  try { m += s1.split(".")[1].length } catch (e) { }
  try { m += s2.split(".")[1].length } catch (e) { }
  return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
}

// 加法计算
export const accAdd = (arg1, arg2) => {
  var r1, r2, m;
  try {
    r1 = arg1.toString().split(".")[1].length;
  }
  catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  }
  catch (e) {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2));
  return (arg1 * m + arg2 * m) / m;
}