<template lang="">
  <div class="container">
    <van-form @submit="onSubmit" label-width="30px">
      <div class="top">
        <van-field
          clearable
          v-model="keyword"
          name="keyword"
          label="条件"
          ref="keyword"
          :readonly="readonly"
          placeholder="扫描或输入关键词回车查询"
          @focus="stopKeyboard"
        />
      </div>
      <div class="bottom">
        <van-row>
          <van-col span="12">
            <van-field
              label="开始"
              name="startDate"
              is-link
              placeholder="请选择开始时间"
              :value="startDate"
              input-align="right"
              @click="show1 = true"
              readonly
            />
          </van-col>
          <van-col span="12">
            <van-field
              label="结束"
              name="endDate"
              is-link
              placeholder="请选择结束时间"
              :value="endDate"
              input-align="right"
              @click="show2 = true"
              readonly
            />
          </van-col>
        </van-row>
        <div class="list">
          <van-list v-model="loading" :finished="finished" @load="onLoad">
            <!-- <van-cell v-for="item in list" :key="item" :title="item" /> -->
            <listitem v-for="(item, index) in list" :key="index" :source="item" />
          </van-list>
        </div>
      </div>
    </van-form>
    <van-calendar v-model="show1" @confirm="onConfirm1" />
    <van-calendar v-model="show2" @confirm="onConfirm2" />
  </div>
</template>
<script>
import dayjs from 'dayjs'
import listitem from './listitem'
export default {
  name: `query`,
  components: { listitem },
  data() {
    return {
      keyword: '',
      startDate: '',
      endDate: '',
      show1: false,
      show2: false,
      list: [],
      loading: false,
      finished: false,
      readonly: false
    }
  },
  methods: {
    open() {},
    onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push({
            date: new Date() * 1,
            billNo: `billNo_` + this.list.length + 1,
            supplierCode: 'Sup' + this.list.length + 1,
            supplierName: `SupName` + this.list.length + 1
          })
        }

        // 加载状态结束
        this.loading = false

        // 数据全部加载完成
        if (this.list.length >= 40) {
          this.finished = true
        }
      }, 1000)
    },
    onSubmit() {
      console.log(1)
    },
    formatDate(date) {
      return dayjs(date).format('YYYY-MM-DD')
    },
    onConfirm1(date) {
      this.show1 = false
      this.startDate = this.formatDate(date)
    },
    onConfirm2(date) {
      this.show2 = false
      this.endDate = this.formatDate(date)
    },
    stopKeyboard() {}
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.keyword.focus()
      if (window.android) {
        android.HideSoftKeyboard()
      }
      setTimeout(() => {
        if (window.android) {
          android.HideSoftKeyboard()
          console.log(document.cookie)
        }
      }, 100)
    })
  }
}
</script>
<style lang="scss">
.container {
  height: 100vh;
  .bottom {
    .list {
      height: calc(100vh - 90px);
      overflow: scroll;
    }
  }
}
</style>
