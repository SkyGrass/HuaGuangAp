<template>
  <div class="container">
    <van-tabs v-model="active" color="#008577">
      <van-tab title="源单页">
        <div class="list">
          <van-list v-model="loading" :finished="finished" @load="onLoad">
            <ul
              v-for="(item, index) in list"
              :key="index"
              style="padding: 5px; font-size: 14px"
              class="van-hairline--bottom"
              @click="onChoose(item)"
            >
              <li style="padding: 2px">行号：{{ item.iVouchRowno }}</li>
              <li style="padding: 2px">存货编码：{{ item.cInvCode }}</li>
              <li style="padding: 2px">存货名称：{{ item.cInvName }}</li>
              <li style="padding: 2px">规格型号：{{ item.cInvStd }}</li>
              <li style="padding: 2px">单位：{{ item.cComUnitName }}</li>
              <li style="padding: 2px; width: 80%; display: inline-flex; justify-content: space-between">
                <div>批号：{{ item.cBatch }}</div>
                <div>数量：{{ item.iQuantity2 }}</div>
              </li>
            </ul>
          </van-list>
        </div>
      </van-tab>
      <van-tab title="列表页"
        ><div class="list1">
          <van-empty class="custom-image" description="没有记录" v-if="cacheList.length <= 0" />
          <van-list v-model="loading" :finished="finished" @load="onLoad">
            <ul
              v-for="(item, index) in cacheList"
              :key="index"
              style="padding: 5px; font-size: 14px"
              class="van-hairline--bottom"
              @click="onDelete(index)"
            >
              <li style="padding: 2px">行号：{{ item.iVouchRowno }}</li>
              <li style="padding: 2px">存货编码：{{ item.cInvCode }}</li>
              <li style="padding: 2px">存货名称：{{ item.cInvName }}</li>
              <li style="padding: 2px">规格型号：{{ item.cInvStd }}</li>
              <li style="padding: 2px">单位：{{ item.cComUnitName }}</li>
              <li style="padding: 2px; width: 80%; display: inline-flex; justify-content: space-between">
                <div>批号：{{ item.cBatch }}</div>
                <div>数量：{{ item.iQuantity2 }}</div>
              </li>
              <li style="padding: 2px; width: 80%; display: inline-flex; justify-content: space-between">
                <div>最小包装数：{{ item.iQty }}</div>
                <div>打印份数：{{ item.iPrintCopies }}</div>
              </li>
            </ul>
            <van-submit-bar
              style="background-color: #e6e6e6"
              button-color="#008577"
              :disabled="cacheList.length <= 0"
              button-text="提交"
              @submit="onSave"
              :loading="submitLoading"
            />
          </van-list>
        </div>
      </van-tab>
    </van-tabs>
    <van-popup v-model="show" close-on-popstate :close-on-click-overlay="false" class="form" safe-area-inset-bottom>
      <van-form>
        <h3 style="text-align: center"></h3>
        <van-field name="iQty" label="最小包装数">
          <template #input>
            <van-stepper input-width="120px" v-model="form.iQty" integer />
          </template>
        </van-field>
        <van-field name="iQty" label="打印份数">
          <template #input>
            <van-stepper input-width="120px" v-model="form.iPrintCopies" />
          </template>
        </van-field>
        <div style="margin: 5px; text-align: right">
          <van-button style="margin-right: 20px" @click="show = false">清空</van-button>
          <van-button color="#008577" type="info" @click="onSubmit">确定</van-button>
        </div>
      </van-form>
    </van-popup>
  </div>
</template>
<script>
import { getPuArrival, savePuArrival } from '@/api/pap'
import { newGuid } from '@/utils'
import { Toast } from 'vant'
export default {
  name: `pap_form`,
  data() {
    this.confirm = 0
    return {
      active: 0,
      queryForm: {},
      form: { iQty: 0, iPrintCopies: 1 },
      list: [],
      loading: false,
      finished: false,
      show: false,
      curRow: {},
      cacheList: [],
      submitLoading: false
    }
  },
  created() {
    this.queryForm = Object.assign({}, this.$route.query)
  },
  methods: {
    onLoad() {
      this.list = []
      getPuArrival({ cFilter: this.queryForm.ID, FROB: 1 })
        .then(({ Data }) => {
          this.list = Data
        })
        .catch(err => {})
      this.loading = false
      this.finished = true
    },
    onChoose(row) {
      this.curRow = row
      this.show = true
    },
    onDelete(index) {
      this.$dialog
        .confirm({
          title: '提示',
          message: '确定要移除当前记录吗?'
        })
        .then(() => {
          this.cacheList.splice(index, 1)
        })
        .catch(() => {
          // on cancel
        })
    },
    onSubmit() {
      if (this.cacheList.length <= 0) this.cacheList.push(Object.assign({}, this.curRow, this.form))
      else {
        const position = this.cacheList.findIndex(f => f.Autoid == this.curRow.Autoid)
        if (position > -1) {
          let r = this.cacheList[position]
          this.$set(this.cacheList, position, Object.assign({}, r, this.form))
        } else {
          this.cacheList.push(Object.assign({}, this.curRow, this.form))
        }
      }

      this.form.iQty = 1
      this.form.iPrintCopies = 1

      this.show = false
    },
    onSave() {
      this.$dialog
        .confirm({
          title: '提示',
          message: '确定要提交记录吗?'
        })
        .then(() => {
          this.submitLoading = true
          const list = this.cacheList.map(m => {
            return {
              cSourceBillID: m.ID,
              cSourceBillEntryID: m.Autoid,
              iQty: m.iQty,
              iPrintCopies: m.iPrintCopies
            }
          })

          savePuArrival({ cSign: newGuid(), Entry: list })
            .then(({ Data, Message }) => {
              Toast.success({
                message: '提交成功!',
                onClose: () => {
                  this.submitLoading = false
                  this.onLoad()
                  this.cacheList = []
                  this.active = 0
                }
              })
            })
            .catch(({ Message }) => {
              this.submitLoading = false
            })
        })
        .catch(e => {})
    }
  },
  mounted() {},
  beforeRouteLeave(to, from, next) {
    console.log(this.confirm)
    if (this.confirm != 0) {
      next(false)
    }
    if (this.cacheList.length <= 0) {
      next()
    } else {
      setTimeout(() => {
        this.confirm = this.$dialog
          .confirm({
            title: '提示',
            message: '您确定要退出当前功能吗?'
          })
          .then(() => {
            next()
          })
          .catch(() => {
            next(false)
          })
      }, 200)
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  height: 100vh;
  .list {
    height: calc(100vh - 50px);
    overflow: scroll;
  }
  .list1 {
    height: calc(100vh - 100px);
    overflow: scroll;
  }
  .form {
    width: 94vw;
  }
}
</style>
