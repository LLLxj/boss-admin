// export function isvalidUsername (str) {
//   const reg = /^[a-zA-Z0-9_\-\@\.]+$/
//   const newStr = str.replace(/\s+/g, '')
//   // console.log(newStr)
//   return reg.test(newStr)
// }

/* 合法uri */
export function validateURL (textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母 */
export function validateLowerCase (str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母 */
export function validateUpperCase (str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母 */
export function validatAlphabets (str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * validate email
 * @param email
 * @returns {boolean}
 */
export function validateEmails (s) {
  return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(s)
}

/**
 * 去除两头空格
 * @param {*} s
 */
export function removeBlank (s) {
  return s.replace(/^\s+|\s+$/g, '')
}

/**
 * 电话号码
 * @param {*} s
 */
export function validatePhone (s) {
  return /^1[0-9]{10}$/.test(s)
}

/**
 * 新增用户密码
 * @param {*} s
 */
export function validatePassword (s) {
  return /^\w{6,16}$/.test(s)
}
