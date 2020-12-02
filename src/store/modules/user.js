import System from '@/api/login'
import { getToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    userInfo: {},
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    // SET_NAME: (state, name) => {
    //   state.name = name
    // },
    // SET_AVATAR: (state, avatar) => {
    //   state.avatar = avatar
    // },
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 登录
    Login ({ commit }, token) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', token)
        // System.login(username, userInfo.password).then(response => {
        //   console.log(response)
        //   const data = response.data
        //   setToken(data.token)
        //   commit('SET_TOKEN', data.token)
        //   resolve()
        // }).catch(error => {
        //   reject(error)
        // })
      })
    },

    // 获取用户信息
    GetInfo ({ commit }) {
      const token = user.state.token
      return new Promise((resolve, reject) => {
        // commit('SET_NAME', name)
        System.info({ token: token }).then(response => {
          const { code, data, desc } = response.data
          if (code === '0000') {
            if (data.permissionList && data.permissionList.length > 0) { // 验证返回的roles是否是一个非空数组
              commit('SET_ROLES', data.permissionList)
            }
            commit('SET_USERINFO', data.userInfo)
            resolve(response)
          } else {
            this.$messge.error(desc)
          }
        }).catch(error => {
          console.log('ceshierror')
          reject(error)
        })
      })
    },

    // 登出
    LogOut ({ commit, state }) {
      return new Promise((resolve, reject) => {
        System.logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut ({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
