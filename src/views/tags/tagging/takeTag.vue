<template>
  <div>
    <!-- 通用头部 -->
    <div v-if="isComplete && !isSkip" style="font-size: 20px;padding: 50px;">数据已处理完毕！</div>
    <div class="make_tag_box" v-else>
      <div class="make_tag_left">
        <div class="tag_right_title">报告文本</div>
        <div class="tag_content">
          {{content}}
        </div>
        <div class="tag_right_title">标记标签-文本标记</div>
        <div class="tag_content1" id="tag">
          <p
            v-for="(item,index) in content"
            :key="index"
            :id='"li"+index'
            style="position: relative;display: inline-block;height: 30px;line-height: 30px"
          >{{item}}</p>
        </div>
        <!--显示全部标签按钮-->
        <el-button type="primary" class="save_tag_btn" @click="showAllLabel">显示全部标签</el-button>
        <!--用table的形式来展示标签分数表格-->
        <div class="currency_table nanual_table" style="border: 1px solid red">
          <table class="cont_border" style="background: transparent;border: 1px solid #ddd;" cellspacing="0" cellpadding="0" >
            <tbody>
              <td>序号</td>
              <td width="60%" style="text-align: left;padding-left: 10px;">结节标签</td>
              <td v-for="(item,index) in scoreList" :key="index">{{item.featureName}}</td>
            </tbody>
            <!--临时打标的标签-->
            <tr style="background: #cccccc;" v-if="templateArr.length > 0">
              <td>未打分标签</td>
              <td  style="text-align: left;padding-left: 10px;" @click="showTemplateTag">
                <span v-for="(item,index) in templateArr" :key="index" > {{item.tagName + '  '}} &nbsp; </span>
                <span @click="deleteTemplate" style="text-decoration:underline">删除</span>
              </td>
              <td v-for="(scoreItem, index) in scoreList" :key="index">
                <span> 无 </span>
              </td>
            </tr>
            <tr v-for="(item,index) in noduleList" :key="index" @click="showPartLabel(item,index)" :class="{'selectedColor': whichList === index}"  >
              <td>{{index + 1}}</td>
              <td style="text-align: left;padding-left: 10px;" v-if="item.indexList && item.indexList.length > 0 ">
                <span v-for="(items, index) in item.indexList" :key="index"> {{items.tagName + '  '}} &nbsp; </span>
              </td>
              <td width="60%"  style="text-align: left;padding-left: 10px;" v-else @click.stop>
                <span @click="deleteScore(index)" style="text-decoration:underline">删除</span>
              </td>
              <td v-for="(scoreItem, index) in scoreList" :key="index">
                <span v-for="(scoreItem2, index) in item.result" :key="index">
                  <span v-if="scoreItem.featureName === scoreItem2.name">{{scoreItem2.score}}</span>
                </span>
              </td>
            </tr>
          </table>
        </div>
        <p style="width: 100%;text-align: center">
          <el-button type="primary" class="save_tag_btn" v-if="isSave" @click="submit">提交</el-button>
          <el-button type="primary" class="save_tag_btn" v-if="isUpdate" @click="submit">提交</el-button>
          <el-button type="primary" class="save_tag_btn" v-if="isAduit" @click="submit">提交</el-button>
          <el-button type="primary" class="save_tag_btn" v-if="isSee" @click="getback">返回</el-button>
        </p>
      </div>
      <div class="make_tag_right">
        <div class="tag_right">
          <p class="tag_right_title">打标签</p>
          <div v-for="item in featureList" :key="item.id">
            <p class="tag_right_title_inner">{{item.featureName}}</p>
            <el-radio-group v-model="item.featuresModel">
              <el-radio :label="itemLabel.cnName+'_'+itemLabel.enName" v-for="itemLabel in item.labelList" :key="itemLabel.id">{{itemLabel.cnName}}</el-radio>
            </el-radio-group>
          </div>
          <el-button type="primary" v-if="!isSee" class="save_tag_btn" @click="featuresBut">保存</el-button>
          <el-button type="primary" v-if="isSee" class="save_tag_btn" disabled >保存</el-button>
        </div>
        <div class="tag_right" style="margin-top: 50px;margin-bottom: 30px;">
          <p class="tag_right_title">打分</p>
          <div v-for="item in scoreList" :key="item.id">
            <p class="tag_right_title_inner">{{item.featureName}}</p>
            <el-radio-group v-model="item.scoreModel">
              <el-radio :label="itemLabel.label" v-for="itemLabel in item.labelList" :key="itemLabel.id">{{itemLabel.label}}</el-radio>
            </el-radio-group>
          </div>
          <el-button type="primary" v-if="!isSee" class="save_tag_btn" @click="scoringBut">保存</el-button>
          <el-button type="primary" v-if="isSee" class="save_tag_btn" disabled >保存</el-button>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import $ from 'jquery'
import Tagging from '@/api/tag/tagging'
export default {
  name: 'makeTag',
  data () {
    return {
      isAllTag: true, // 是否显示全部标签
      whichList: '-1', // 点击的是第几个list
      isNew: false, // 是否为新打的标签,默认为false
      resultData: [], // 打过标签的数据
      tagindexList: [], // 每次打标后存储数据，在打分完成后清空
      isTag: false, // 打分之前是否打标
      proDataRelId: this.$route.query.id, // 数据id
      type: this.$route.query.type, // 1是处理，2是修改，3是审核，4是查看审核
      diseaseCode: this.$route.query.diseaseCode,
      dataDetail: { }, // 数据详情
      content: '', // 打标内容
      featureList: [], // 特征列表
      scoreList: [], // 打分列表
      noduleList: [], // 打标提交列表
      templateArr: [], // 未打分标签数组
      isTemplate: false, // 是否点击临时标签
      proId: this.$route.query.proId, // 项目id
      batch: this.$route.query.batch, // 项目批次
      id: '', // 数据id
      currentPage: 1, // 当前页
      pageSize: 1, // 每页数据默认为1
      totalPage: '', // 数据总页数
      isComplete: false,
      isSkip: false,
      repeatFlag: false, // 是否重复打标文本
      isLast: false, // 是否为最后一条数据
      isSave: false, // 是否有保存的权限
      isUpdate: false, // 是否有修改的权限
      isAduit: false, // 是否为审核
      isSee: false // 是否为查看审核
    }
  },
  created () {
    const self = this
    window.deleteLi = self.deleteLi
    window.deleteLi2 = self.deleteLi2
    this.getDetail()
  },
  mounted () {
    this.getApiAccess()
    this.getfeaturelabellist()
    this.getDetail()
  },
  watch: {
    '$route' (to, from) {
      this.$router.go(0)
    }
  },
  methods: {
    // 获取用户操作按钮权限
    getApiAccess () {
      if (this.type === 2) {
        if (this.$util.getapiAccess('prodata/update')) { // 修改权限
          this.isUpdate = true
        }
      }
      if (this.type === 1) {
        if (this.$util.getapiAccess('prodata/submit')) { // 提交权限
          this.isSave = true
        }
      }
      if (this.type === 3) { // 审核
        this.isAduit = true
      }
      if (this.type === 4) { // 查看审核
        this.isSee = true
      }
    },
    // 审核查看返回
    getback () {
      this.$router.push({ path: '/aduitList', query: { id: this.proId, diseaseCode: this.diseaseCode } })
    },
    // 删除所有的临时标签
    deleteTemplate () {
      const that = this
      that.templateArr = []
      that.tagindexList = []
    },
    // 是否显示全部标签
    switchAll (e) {
      const that = this
      that.isAllTag = e
      if (that.isAllTag === false) { // 全部不显示
        if (that.whichList > -1 || that.isTemplate === true) { // 如果点击的是某一项，不清除标签
        } else {
          that.clearTag()
        }
      } else { // 全部显示
        that.showAllLabel()
        // 显示临时打标的数据
        that.templateArr.forEach((item, index) => {
          const begin = parseInt(item.index.split(',')[0])
          const endIndex = parseInt(item.index.split(',')[1])
          // 显示高亮文本
          for (let t = begin; t < endIndex; t++) {
            const itemName = 'li' + t
            document.getElementById(itemName).classList.add('tagStyle')
          }
          // 显示打过的标签
          var bw = item.content.length * 20// 下面标记文本的宽度
          var tw = item.tagName.length * 14// 上面标签的宽度
          var topheight = -20 // top的值
          var height = 20
          if (tw > 150) {
            tw = 150
            topheight = -40
            height = 40
          }
          var width = tw
          var lw = -(bw + tw) / 2 + 'px' // margin-left的宽度
          var thisTagName = item.tagName
          if (item.tagName.length > 20) {
            thisTagName = item.tagName.split('')
            thisTagName.length = 20
            thisTagName = thisTagName.join('') + '...'
          }
          var tableContent = `<p id="aaa${endIndex}" style='min-width: 50px;width: ${width}px;color: rgb(253, 221, 155);font-size: 12px;position: absolute;top: ${topheight}px; left:50%;margin-left: ${lw} ;background: #334452;line-height: 20px;height:${height}px;border-radius: 5px;text-after-overflow:hidden;text-align: center;'>${thisTagName}
          <i onclick='deleteLi(this)' class='smallDelete'>${item.index}</i>
          </p>`
          if (endIndex === that.content.length) { // 标记最后一个
            $('#li' + (endIndex - 1)).append(tableContent)
          } else {
            $('#li' + endIndex).append(tableContent)
          }
        })
      }
    },
    // 清除所有标记
    clearTag () {
      const that = this
      for (let i = 0; i < that.content.split('').length; i++) {
        $('#aaa' + i).remove()
        const itemName = 'li' + i
        document.getElementById(itemName).classList.remove('tagStyle')
        document.getElementById(itemName).classList.remove('tagStyle1')
      }
    },
    // 根据id获取详情
    getDetail () {
      const that = this
      const params = {
        proDataRelId: that.proDataRelId,
        status: that.type
      }
      Tagging.info(params).then(res => {
        if (res.data.code === '0000') {
          that.dataDetail = res.data.data
          that.id = res.data.data.id
          that.content = that.dataDetail.content
          // .replace(/[\r\n]/g,"")
          that.$nextTick(() => {
            that.showResuleTag()
          })
        } else {
          that.$alert(res.data.desc)
        }
      })
    },
    // 遍历显示打过的标签
    showTaggers (arr) {
      const that = this
      arr.forEach((item, index) => {
        const begin = parseInt(item.index.split(',')[0])
        const endIndex = parseInt(item.index.split(',')[1])
        // 显示高亮文本
        for (let t = begin; t < endIndex; t++) {
          const itemName = 'li' + t
          document.getElementById(itemName).classList.add('tagStyle1')
        }
        // 显示打过的标签
        var bw = item.content.length * 20// 下面标记文本的宽度
        var tw = item.tagName.length * 14// 上面标签的宽度
        var topheight = -20 // top的值
        var height = 20
        if (tw > 150) {
          tw = 150
          topheight = -40
          height = 40
        }
        var width = tw
        var lw = -(bw + tw) / 2 + 'px' // margin-left的宽度
        var thisTagName = item.tagName
        if (item.tagName.length > 20) {
          thisTagName = item.tagName.split('')
          thisTagName.length = 20
          thisTagName = thisTagName.join('') + '...'
        }
        var tableContent = `<p id="aaa${begin}" style='min-width: 50px;width: ${width}px;color: rgb(253, 221, 155);font-size: 12px;position: absolute;top: ${topheight}px; left:50%;margin-left: ${lw} ;background: #aaaaaa;line-height: 20px;height:${height}px;border-radius: 5px;text-after-overflow:hidden;text-align: center;'>${thisTagName}</p>`
        if (endIndex === that.content.length) { // 标记最后一个
          $('#li' + (endIndex - 1)).append(tableContent)
        } else {
          $('#li' + endIndex).append(tableContent)
        }
      })
    },
    // 显示全部标签
    showAllLabel () {
      const that = this
      that.repeatFlag = false
      that.whichList = -1
      that.tagindexList = []
      that.isTemplate = false
      that.showLabelAll()
      // 显示临时标签
      that.templateArr.forEach((item, index) => {
        const begin = parseInt(item.index.split(',')[0])
        const endIndex = parseInt(item.index.split(',')[1])
        // 显示高亮文本
        for (let t = begin; t < endIndex; t++) {
          const itemName = 'li' + t
          document.getElementById(itemName).classList.add('tagStyle')
        }
        // 显示打过的标签
        var bw = item.content.length * 20// 下面标记文本的宽度
        var tw = item.tagName.length * 14// 上面标签的宽度
        var topheight = -20 // top的值
        var height = 20
        if (tw > 150) {
          tw = 150
          topheight = -40
          height = 40
        }
        var width = tw
        var lw = -(bw + tw) / 2 + 'px' // margin-left的宽度
        var thisTagName = item.tagName
        if (item.tagName.length > 20) {
          thisTagName = item.tagName.split('')
          thisTagName.length = 20
          thisTagName = thisTagName.join('') + '...'
        }
        var tableContent = `<p id="aaa${endIndex}" style='min-width: 50px;width: ${width}px;color: rgb(253, 221, 155);font-size: 12px;position: absolute;top: ${topheight}px; left:50%;margin-left: ${lw} ;background: #334452;line-height: 20px;height:${height}px;border-radius: 5px;text-after-overflow:hidden;text-align: center;'>${thisTagName}
          <i onclick='deleteLi(this)' class='smallDelete'>${item.index}</i>
          </p>`
        if (endIndex === that.content.length) { // 标记最后一个
          $('#li' + (endIndex - 1)).append(tableContent)
        } else {
          $('#li' + endIndex).append(tableContent)
        }
      })
    },
    // 显示标签
    showLabelAll () {
      const that = this
      // 先清空所有的标签以及文本
      that.clearTag()
      // 先判断是否有重复的标签，如果有，重复标签只渲染一次
      let showList = []
      that.noduleList.forEach((item, index) => {
        if (item.indexList) {
          item.indexList.forEach((item1, index1) => {
            showList.push(item1)
          })
        }
      })
      showList = that.unique(showList)
      that.showTaggers(showList)
    },
    // 点击显示部分标签
    showPartLabel (item, index) {
      const that = this
      that.whichList = index
      that.repeatFlag = false
      that.tagindexList = []
      that.isTemplate = false
      that.showLabelPart(item, index)
    },
    // 显示当前列标签
    showLabelPart (item, index) {
      const that = this
      that.whichList = index
      if (item.indexList) {
        item.indexList.forEach((item2, index) => {
          that.tagindexList.push(item2)
        })
      }
      /*
          先清空所有的标签
          再显示点击的项有的标签和文本
        */
      that.clearTag()
      if (item.indexList) {
        item.indexList.forEach((item1, index1) => {
          const begin = parseInt(item1.index.split(',')[0])
          const endIndex = parseInt(item1.index.split(',')[1])
          // 显示高亮文本
          for (let t = begin; t < endIndex; t++) {
            const itemName = 'li' + t
            document.getElementById(itemName).classList.add('tagStyle')
          }
          // 显示打过的标签
          var bw = item1.content.length * 20// 下面标记文本的宽度
          var tw = item1.tagName.length * 14// 上面标签的宽度
          var topheight = -20 // top的值
          var height = 20
          if (tw > 150) {
            tw = 150
            topheight = -40
            height = 40
          }
          var width = tw
          var lw = -(bw + tw) / 2 + 'px' // margin-left的宽度
          var thisTagName = item1.tagName
          if (item1.tagName.length > 20) {
            thisTagName = item1.tagName.split('')
            thisTagName.length = 20
            thisTagName = thisTagName.join('') + '...'
          }
          var tableContent = `<p id="aaa${endIndex}" style='min-width: 50px;width: ${width}px;color: rgb(253, 221, 155);font-size: 12px;position: absolute;top: ${topheight}px; left:50%;margin-left: ${lw} ;background: #334452;line-height: 20px;height:${height}px;border-radius: 5px;text-after-overflow:hidden;text-align: center;'>${thisTagName}
          <i onclick='deleteLi(this)' class='smallDelete'>${item1.index}</i>
          </p>`
          if (endIndex === that.content.length) { // 标记最后一个
            $('#li' + (endIndex - 1)).append(tableContent)
          } else {
            $('#li' + endIndex).append(tableContent)
          }
        })
      }
    },
    // 对象数组去重
    unique (arr1) {
      const res = new Map()
      return arr1.filter((a) => !res.has(a.index) && res.set(a.index, 1))
    },
    // 标签回显
    showResuleTag () {
      const that = this
      // 先清空所有的标签以及文本
      that.clearTag()
      if (that.dataDetail.result) { // 已经打过标签
        // 标签回显
        that.resultData = JSON.parse(that.dataDetail.result).noduleList
        that.noduleList = that.resultData
        console.log(that.noduleList)
        // 先判断是否有重复的标签，如果有，重复标签只渲染一次
        let showList = []
        that.resultData.forEach((item, index) => {
          if (item.indexList) {
            item.indexList.forEach((item1, index1) => {
              showList.push(item1)
            })
          }
        })
        showList = that.unique(showList)
        that.showTaggers(showList)
      }
    },
    // 显示临时标签
    showTemplateTag () {
      const that = this
      that.isNew = true
      that.isTemplate = true
      that.tagindexList = []
      that.whichList = -1
      /*
          先清除所有的标签
          然后显示临时标签
          删除的方法和之前不一样，删除的是临时标签列表里面的标签
        */
      // 先清空所有的标签以及文本
      that.clearTag()
      console.log(that.templateArr)
      // that.showTaggers(that.templateArr)
      that.templateArr.forEach((item, index) => {
        const begin = parseInt(item.index.split(',')[0])
        const endIndex = parseInt(item.index.split(',')[1])
        // 显示高亮文本
        for (let t = begin; t < endIndex; t++) {
          const itemName = 'li' + t
          document.getElementById(itemName).classList.add('tagStyle')
        }
        // 显示打过的标签
        var bw = item.content.length * 20// 下面标记文本的宽度
        var tw = item.tagName.length * 14// 上面标签的宽度
        var topheight = -20 // top的值
        var height = 20
        if (tw > 150) {
          tw = 150
          topheight = -40
          height = 40
        }
        var width = tw
        var lw = -(bw + tw) / 2 + 'px' // margin-left的宽度
        var thisTagName = item.tagName
        if (item.tagName.length > 20) {
          thisTagName = item.tagName.split('')
          thisTagName.length = 20
          thisTagName = thisTagName.join('') + '...'
        }
        var tableContent = `<p id="aaa${endIndex}" style='min-width: 50px;width: ${width}px;color: rgb(253, 221, 155);font-size: 12px;position: absolute;top: ${topheight}px; left:50%;margin-left: ${lw} ;background: #334452;line-height: 20px;height:${height}px;border-radius: 5px;text-after-overflow:hidden;text-align: center;'>${thisTagName}
          <i onclick='deleteLi(this)' class='smallDelete'>${item.index}</i>
          </p>`
        if (endIndex === that.content.length) { // 标记最后一个
          $('#li' + (endIndex - 1)).append(tableContent)
        } else {
          $('#li' + endIndex).append(tableContent)
        }
      })
    },
    // 查询打标特征
    getfeaturelabellist () {
      const that = this
      const params = {
        proId: that.proId
      }
      Tagging.labelList(params).then(res => {
        if (res.data.code === '0000') {
          that.featureList = res.data.data.featureList
          that.scoreList = res.data.data.scoreList
          console.log(that.scoreList)
        } else {
          that.$alert(res.data.desc)
        }
      })
    },

    // 保存打标签
    featuresBut () {
      const that = this
      that.repeatFlag = false // 进来时重置为可打标状态
      var selecter = window.getSelection().toString() // 被标记文本
      var endIndex
      // 位置
      var begin = parseInt(window.getSelection().anchorOffset)
      var endin = parseInt(window.getSelection().focusOffset)
      if (begin > 1 && begin > endin) {
        begin = endin
      }
      endIndex = parseInt(selecter.length + begin)
      begin = parseInt(begin - 9) // 开始下标
      endIndex = parseInt(endIndex - 9) // 结束下标
      // begin = parseInt(begin) //开始下标
      // endIndex = parseInt(endIndex) //结束下标
      // console.log("endIndex",endIndex)
      // console.log("begin",begin)
      // console.log("selecter",selecter)
      // 判断是否选中标记文本
      if (parseInt(begin) < 0 || parseInt(endIndex) < 0 || selecter === '') {
        that.$alert('请先选择需要标记的文本')
        return false
      }
      // 先把标签拼接
      var featuresLetter = ''
      var index = '' + begin + ',' + endIndex + ''
      // var paramsObj = new Object()
      var paramsObj = {}
      var paramsObj1 = '' // 用于显示打的标签
      var paramsObj2 = ''// 用于分数显示下表格内的标签显示
      // 拼接特征英文
      console.log(that.featureList)
      for (var i = 0; i < that.featureList.length; i++) {
        if (that.featureList[i].featuresModel !== undefined) {
          if (featuresLetter === '') {
            paramsObj1 += that.featureList[i].featuresModel.substring(0, that.featureList[i].featuresModel.lastIndexOf('_'))
            if (that.featureList[i].featuresModel.substring(0, that.featureList[i].featuresModel.lastIndexOf('_'))) {
              paramsObj2 += that.featureList[i].featuresModel.substring(0, that.featureList[i].featuresModel.lastIndexOf('_'))
            }
            that.featureList[i].featuresModel = that.featureList[i].featuresModel.substring(that.featureList[i].featuresModel.lastIndexOf('_') + 1, that.featureList[i].featuresModel.length)
          } else {
            paramsObj1 += that.featureList[i].featuresModel.substring(0, that.featureList[i].featuresModel.lastIndexOf('_'))
            if (that.featureList[i].featuresModel.substring(0, that.featureList[i].featuresModel.lastIndexOf('_'))) {
              paramsObj2 += that.featureList[i].featuresModel.substring(0, that.featureList[i].featuresModel.lastIndexOf('_'))
            }
            that.featureList[i].featuresModel = that.featureList[i].featuresModel.substring(that.featureList[i].featuresModel.lastIndexOf('_') + 1, that.featureList[i].featuresModel.length)
          }
          if (that.featureList[i].featuresModel !== '') {
            featuresLetter += that.featureList[i].featuresModel + '_'
          }
        }
      }
      featuresLetter = featuresLetter.substr(0, featuresLetter.length - 1)
      console.log(featuresLetter)
      // 判断是否重复标记
      /*
          分两步判断：
          1.判断本批次打标内部有没有重复
          2.判断之前打标内容里有没有重复
        */
      // 1.判断本批次打标内部有没有重复
      // 未打分的时候，不能重复打标
      if (that.tagindexList.length > 0 || that.noduleList.length > 0) {
        if (that.tagindexList.length > 0) {
          try {
            that.tagindexList.forEach((item) => {
              if (item.index) {
                const b1 = item.index.split(',')[0]
                const e1 = item.index.split(',')[1]
                if (endIndex < b1 || begin > e1 || endIndex === b1 || begin === e1) {
                  that.repeatFlag = false
                } else {
                  that.repeatFlag = true
                  throw new Error('重复打标') // 报错跳出循环
                }
              }
            })
          } catch (e) {
            if (e.message === '重复打标') {
              that.repeatFlag = true
              that.$alert('不能重复标记！')
              // 清除标签特征
              for (let i = 0; i < that.featureList.length; i++) {
                if (that.featureList[i].featuresModel) {
                  that.featureList[i].featuresModel = ''
                }
              }
            } else {
              console.log(e.message)
            }
          }
        }
        // 2.判断之前打标内容里有没有重复
        if (that.noduleList.length > 0 && that.repeatFlag === false) {
          try {
            that.noduleList.forEach((item, index) => {
              if (item.indexList) {
                item.indexList.forEach((item1, index) => {
                  const b1 = item1.index.split(',')[0]
                  const e1 = item1.index.split(',')[1]
                  /*
                     已打分的情况下，加一层判断
                     若找到开始下标相同的下标，判断结束下标是否相同
                     若都相同，判断这条数据的打标的标签数据是否完全一致
                     若都完全一致，允许打标，若不是，不允许打标
                     */
                  if (b1 === begin) {
                    if (e1 === endIndex) {
                      if (item1.tagName === paramsObj2) {
                        that.repeatFlag = false
                      } else {
                        if (endIndex < b1 || begin > e1 || endIndex === b1 || begin === e1) {
                          that.repeatFlag = false
                        } else {
                          that.repeatFlag = true
                          throw new Error('重复打标') // 报错跳出循环
                        }
                      }
                    } else {
                      if (endIndex < b1 || begin > e1 || endIndex === b1 || begin === e1) {
                        that.repeatFlag = false
                      } else {
                        that.repeatFlag = true
                        throw new Error('重复打标') // 报错跳出循环
                      }
                    }
                  } else {
                    if (endIndex < b1 || begin > e1 || endIndex === b1 || begin === e1) {
                      that.repeatFlag = false
                    } else {
                      that.repeatFlag = true
                      throw new Error('重复打标') // 报错跳出循环
                    }
                  }
                })
              }
            })
          } catch (e) {
            if (e.message === '重复打标') {
              that.repeatFlag = true
              that.$alert('不能重复标记！')
              // 清除标签特征
              for (let i = 0; i < that.featureList.length; i++) {
                if (that.featureList[i].featuresModel) {
                  that.featureList[i].featuresModel = ''
                }
              }
            } else {
              console.log(e.message)
            }
          }
        }
      }
      // 若没有重复标记，开始打标
      if (that.repeatFlag === false) {
        if (featuresLetter === '') {
          that.$alert('至少需选择一项特征！')
          return false
        }
        paramsObj.index = index
        paramsObj.content = selecter // 标记文本
        paramsObj.tagName = paramsObj2 // 标记内容，用于表格内展示
        paramsObj.code = featuresLetter
        if (that.whichList < 0) { // 没有选中某一列
          that.tagindexList.push(paramsObj)
          that.templateArr.push(paramsObj)
          console.log(that.templateArr)
        } else { // 选中了某一列，这时候，需要在列表中实时显示
          that.tagindexList.push(paramsObj)
          that.noduleList[that.whichList].indexList = that.tagindexList
        }
        // var IntemIndex = begin - 1
        // var itemInner=document.getElementById("li"+ IntemIndex);// 获取id为tb的元素(tables)
        // console.log("qqqqqqqqqqqqqqqqqqqqq",itemInner.innerHTML);
        // var lastContent = itemInner.innerHTML
        // if(lastContent === '。'){
        //   endIndex = endIndex + 1
        // }
        // 显示高亮文本
        for (let t = begin; t < endIndex; t++) {
          const itemName = 'li' + t
          document.getElementById(itemName).classList.add('tagStyle')
        }
        // 若标记文字大于24个，截取前24位
        // var paramsObj2 = paramsObj1.split('')
        paramsObj2 = paramsObj1.split('')
        if (paramsObj2.length > 20) {
          paramsObj2.length = 20
          paramsObj1 = paramsObj2.join('') + '...'
        }
        var bw = selecter.length * 20// 下面标记文本的宽度
        var tw = paramsObj1.length * 14// 上面标签的宽度
        var topheight = -20 // top的值
        var height = 20
        if (tw > 150) {
          tw = 150
          topheight = -40
          height = 40
        }
        var width = tw
        var lw = -(bw + tw) / 2 + 'px' // margin-left的宽度
        // 显示已打标的标签
        var tableContent = `<p id="aaa${endIndex}" style='min-width: 50px;width: ${width}px;color: rgb(253, 221, 155);font-size: 12px;position: absolute;top:${topheight}px;left:50%;margin-left: ${lw} ;background: #334452;line-height: 20px;height: ${height}px;border-radius: 5px;text-after-overflow:hidden;text-align: center;'>${paramsObj1}
          <i onclick='deleteLi(this)' class='smallDelete'>${paramsObj.index}</i></p>`
        if (endIndex === that.content.length) { // 标记最后一个
          $('#li' + (endIndex - 1)).append(tableContent)
        } else {
          $('#li' + endIndex).append(tableContent)
        }
        // 清空选中的文本下标以及特征
        begin = 0
        endIndex = 0
        for (let i = 0; i < that.featureList.length; i++) {
          if (that.featureList[i].featuresModel) {
            that.featureList[i].featuresModel = ''
          }
        }
        that.isTag = true // 已打标
        that.$message({
          showClose: true,
          message: '打标成功！',
          type: 'success'
        })
        // 清除打分选中项
        for (var clear = 0; clear < that.scoreList.length; clear++) {
          if (that.scoreList[clear].scoreModel) {
            that.scoreList[clear].scoreModel = ''
          }
        }
      }
    },
    /**
       * 打分
       */
    scoringBut () {
      const that = this
      console.log(that.whichList)
      var scoreLetter = []
      for (var i = 0; i < that.scoreList.length; i++) {
        if (that.scoreList[i].scoreModel !== undefined) {
          scoreLetter.push({
            name: that.scoreList[i].featureName,
            score: that.scoreList[i].scoreModel
          })
        }
      }
      if (scoreLetter.length === 0) {
        that.$alert('至少需选择一个打分项！')
        return false
      }
      if (that.whichList < 0) { // 未选中任何列，增加一行
        if (that.isTemplate === true) { // 选中的是临时项
          if (that.templateArr) {
            that.noduleList.push({
              indexList: that.templateArr,
              result: scoreLetter
            })
          }
          that.templateArr = []
        } else { // 整体打分情况
          that.templateArr = []
          if (that.isTag === false) { // 只打分，没有打标签时
            that.noduleList.push({
              result: scoreLetter
            })
          } else { // 打分以及打标
            that.noduleList.push({
              indexList: that.tagindexList,
              result: scoreLetter
            })
          }
        }
      } else { // 点击的是 whichList 这一列
        that.noduleList[that.whichList] = {
          indexList: that.tagindexList,
          result: scoreLetter
        }
      }
      that.isTag = false
      that.$message({
        showClose: true,
        message: '打分成功！',
        type: 'success'
      })
      console.log(that.noduleList)
      // 清除打分选中项
      for (var clear = 0; clear < that.scoreList.length; clear++) {
        if (that.scoreList[clear].scoreModel) {
          that.scoreList[clear].scoreModel = ''
        }
      }
      // 清除标签特征
      for (let i = 0; i < that.featureList.length; i++) {
        if (that.featureList[i].featuresModel) {
          that.featureList[i].featuresModel = ''
        }
      }
      that.tagindexList = []
      /*
          打分之后，已打的标签灰色显示，无删除按钮
          清除之前的标记，重新渲染
          这时候只需要遍历 noduleList
          （1）遍历整个文本，把标记和文本显示全部清除
          （2）遍历noduleList，灰色显示标记过的标签
          （3）去掉删除按钮
        */
      that.clearTag()
      // 先判断是否有重复的标签，如果有，重复标签只渲染一次
      let showList = []
      that.noduleList.forEach((item, index) => {
        if (item.indexList) {
          item.indexList.forEach((item1, index1) => {
            showList.push(item1)
          })
        }
      })
      showList = that.unique(showList)
      that.whichList = -1
      if (that.isAllTag === true) {
        that.showTaggers(showList)
      }
    },
    // 提交
    submit () {
      const that = this
      if (that.noduleList.length === 0) {
        that.$message({
          showClose: true,
          message: '请完成打标！',
          type: 'error'
        })
        return false
      }
      let params
      if (that.type === 1) {
        params = { // 初次打标
          id: that.id,
          noduleList: that.noduleList
        }
      } else if (that.type === 2 || that.type === 3) { // 修改或者审核
        params = {
          id: that.proDataRelId,
          noduleList: that.noduleList
        }
      }
      console.log(params)
      that.$confirm('是否确认提交？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (that.type === 2) { // 已打过标签，修改
          that.$api.prodataupdate(params).then(res => {
            if (res.data.code === '0000') {
              // 跳过之后，剩余最后一个
              if (that.currentPage === 1 && that.totalPage === 1) {
                that.isComplete = true
                that.isSkip = false
                return false
              }
              if (that.currentPage === that.totalPage) {
                that.isComplete = true
              }
              that.$message({
                showClose: true,
                message: '提交成功！',
                type: 'success'
              })
              that.$router.push({ path: '/receiveList', query: { id: that.proId, batch: that.batch } })
            } else {
              that.$alert(res.data.desc)
            }
          })
        } else if (that.type === 3) { // 审核
          that.$api.auditprodata(params).then(res => {
            console.log(res)
            if (res.data.code === '0000') {
              if (res.data.data) {
                if (res.data.data.proDataRelId) {
                  that.$router.push({ path: '/makeTag', query: { id: res.data.data.proDataRelId, type: that.type, batch: that.batch, proId: that.proId, diseaseCode: that.diseaseCode } })
                }
              } else {
                that.$router.push({ path: '/aduitList', query: { id: that.proId, diseaseCode: that.diseaseCode } })
              }
            } else {
              that.$alert(res.data.desc)
            }
          })
        } else { // 初次打标
          that.$api.prodatasubmit(params).then(res => {
            if (res.data.code === '0000') {
              // 跳过之后，剩余最后一个
              if (that.currentPage === 1 && that.totalPage === 1) {
                that.isComplete = true
                that.isSkip = false
                return false
              }
              if (that.currentPage === that.totalPage) {
                that.isComplete = true
              }
              that.$message({
                showClose: true,
                message: '提交成功！',
                type: 'success'
              })
              that.$router.push({ path: '/receiveList', query: { id: that.proId, batch: that.batch } })
            } else {
              that.$alert(res.data.desc)
            }
          })
        }
      })
    },
    // 删除标记
    deleteLi: function (e) {
      const that = this
      let aaIndex = ''
      let begin = 0
      let end = 0
      /*
        分两种情况
        若是已经打分，则遍历 tagindexList 以及 noduleList
        先遍历 tagindexList ，若有，则删除 tagindexList 里面当前项
        若没有，则遍历 noduleList，找到后删除 noduleList对应的 indexList 里面的项
        若 noduleList 里面的 indexList 只有当前需要删除的一项，则把对应的 result 也一起删除
        若是没有打过分，则只遍历 tagindexList
        */
      // 如果是点击了临时标签那一行
      if (that.isTemplate) { // 如果点击了临时标签
        that.templateArr.forEach((item, index) => {
          if (e.innerText === item.index) {
            aaIndex = item.index
            that.isNew = true // 是新打的标签
            that.templateArr.splice(index, 1)
          }
        })
        that.tagindexList.forEach((item, index) => {
          if (e.innerText === item.index) {
            aaIndex = item.index
            that.isNew = true // 是新打的标签
            that.tagindexList.splice(index, 1)
          }
        })
        if (aaIndex) { // 找到下标
          begin = parseInt(aaIndex.split(',')[0])
          end = parseInt(aaIndex.split(',')[1])
          $('#aaa' + end).remove()
          for (let m = begin; m < end; m++) {
            const itemName = 'li' + m
            document.getElementById(itemName).classList.remove('tagStyle')
          }
          that.repeatFlag = false
        }
      } else {
        if (that.whichList < 0) { // 未选中某一项
          if (that.tagindexList) {
            // 删除tagindexList数组
            that.tagindexList.forEach((item, index) => {
              if (e.innerText === item.index) {
                aaIndex = item.index
                that.isNew = true // 是新打的标签
                that.tagindexList.splice(index, 1)
              }
            })
          }
          if (that.templateArr) {
            // 删除templateArr数组
            that.templateArr.forEach((item, index) => {
              if (e.innerText === item.index) {
                aaIndex = item.index
                that.isNew = true // 是新打的标签
                that.templateArr.splice(index, 1)
              }
            })
          }
          if (aaIndex === '') { // 删除项不在 tagindexList 里
            // 遍历 noduleList
            /*
                先遍历是否为重复的文本标签
                若为重复打标的标签，找到是哪个index
                删除对应index下的标签
                把标签和对应的文本标记移除
              */
            that.noduleList.forEach((item, index) => {
              if (item.indexList) {
                item.indexList.forEach((innerItem, index2) => {
                  if (e.innerText === innerItem.index) {
                    aaIndex = innerItem.index // 找到开始及结束下标
                    that.isNew = false // 不是新打的标签
                    if (item.indexList.length === 1) { // 若只有一项
                      that.noduleList.splice(index, 1)
                    } else {
                      item.indexList.splice(index2, 1)
                    }
                  }
                })
              }
            })
          }
          if (aaIndex) { // 找到下标
            begin = parseInt(aaIndex.split(',')[0])
            end = parseInt(aaIndex.split(',')[1])
            if (that.isNew === true) { // 新打的，未打分的标签
              $('#aaa' + end).remove()
            } else { // 已经打分过的标签
              $('#aaa' + begin).remove()
            }
            for (let m = begin; m < end; m++) {
              const itemName = 'li' + m
              document.getElementById(itemName).classList.remove('tagStyle')
            }
            that.repeatFlag = false
          }
        } else { // 选中了某一项
          that.tagindexList.forEach((item, index) => {
            if (e.innerText === item.index) {
              aaIndex = item.index
            }
          })
          if (aaIndex) { // 找到下标
            begin = parseInt(aaIndex.split(',')[0])
            end = parseInt(aaIndex.split(',')[1])
            $('#aaa' + end).remove()
            that.noduleList[that.whichList].indexList.forEach((item, index) => {
              if (aaIndex === item.index) { // 找到这个下标，删除这一项
                that.noduleList[that.whichList].indexList.splice(index, 1)
              }
            })
            that.tagindexList.forEach((item, index) => {
              if (aaIndex === item.index) {
                that.tagindexList.splice(index, 1)
              }
            })
            that.$forceUpdate()
            if (that.noduleList[that.whichList].indexList.length === 0) { // 当全部删除之后，删除此项
              that.noduleList.splice(that.whichList, 1)
              that.whichList = -1
            }
            for (let m = begin; m < end; m++) {
              const itemName = 'li' + m
              document.getElementById(itemName).classList.remove('tagStyle')
            }
          }
        }
      }
    },
    // 当仅打分，未打标时，删除分数
    deleteScore (listindex) {
      const that = this
      that.noduleList.splice(this.noduleList.findIndex((item, index) => listindex === index), 1)
      // 删除之后，此时设置为全部，不在某一列
      that.whichList = -1
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@/assets/css/tag.scss";
</style>
