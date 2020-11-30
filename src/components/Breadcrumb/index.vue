<template>
<el-breadcrumb class="app-breadcrumb" separator="/">
  <transition-group name="breadcrumb">
    <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path" :to="item.path">
      <!-- {{item.meta.title}} -->
      <div class="item" v-if="item.meta.title" style="padding: 0 5px">
        <span v-if="item.redirect==='noredirect'||index==levelList.length-1" class="no-redirect">{{item.meta.title}}</span>
        <router-link v-else :to="item.redirect||item.path">{{item.meta.title}}</router-link>
      </div>
    </el-breadcrumb-item>
  </transition-group>
</el-breadcrumb>
</template>

<script>
export default {
  created () {
    this.getBreadcrumb()
  },
  data () {
    return {
      levelList: null
    }
  },
  watch: {
    $route () {
      this.getBreadcrumb()
    }
  },
  methods: {
    getBreadcrumb () {
      let matched = this.$route.matched.filter(item => item.name)
      const first = matched[0]
      if (first && first.name !== 'dashboard') {
        // matched = [{ path: '/dashboard', meta: { title: '首页' } }].concat(matched)
        matched = [].concat(matched)
      }
      this.levelList = matched
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-breadcrumb{
  line-height: 50px;
  font-size: 14px;
  margin-left: 10px;
  display: flex;
  .el-breadcrumb {
    .item{
      height: 50px;
      line-height: 50px;
    }
    .no-redirect {
      color: #97a8be;
      cursor: text;
    }
    // display: inline-block;
  }
}
</style>
