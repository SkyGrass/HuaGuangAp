<template>
  <div class="container">
    <van-tabs v-model="active" color="#008577">
      <van-tab title="扫描页">
        <div class="list0" id="list0">
          <div ref="postForm" class="postForm inputForm">
            <van-field
              type="text"
              name="cBarcode"
              label="条码"
              ref="ele_cBarcode"
              v-model="form.cBarcode"
              autocomplete="off"
              placeholder="扫描或录入箱号条码"
              id="ele_cBarcode"
              @focus="onFocus('ele_cBarcode')"
              @keyup.enter="queryInv"
            >
            </van-field>
            <van-field
              name="cInvCode"
              label="存货编码"
              ref="ele_cInvCode"
              v-model="form.cInvCode"
              readonly
              placeholder="存货编码"
            ></van-field>
            <van-field
              name="cInvName"
              label="存货名称"
              ref="ele_cInvName"
              v-model="form.cInvName"
              readonly
              placeholder="存货名称"
            ></van-field>
            <van-field
              name="cInvStd"
              label="规格型号"
              ref="ele_cInvStd"
              v-model="form.cInvStd"
              readonly
              placeholder="规格型号"
            ></van-field>
            <van-field
              name="cComUnitName"
              label="单位"
              ref="ele_cComUnitName"
              v-model="form.cComUnitName"
              readonly
              placeholder="单位"
            ></van-field>
            <van-field
              name="cBatch"
              label="批号"
              ref="ele_cBatch"
              v-model="form.cBatch"
              readonly
              placeholder="批号"
            ></van-field>

            <van-field
              type="number"
              name="iQuantity"
              label="数量"
              ref="ele_iQuantity"
              v-model="form.iQuantity"
              id="ele_iQuantity"
              @focus="onFocus1('ele_iQuantity')"
              @blur="onBlur"
              @keyup.enter="inputQuantity"
            ></van-field>
          </div>

          <div class="btns">
            <van-button class="btn" size="small" @click="doClear">清空</van-button>
            <!-- <van-button class="btn" size="small" color="#008577" type="info" @click="onSubmit" :disabled="forbiddenSub"
              >确定</van-button
            > -->
          </div>
        </div>
      </van-tab>
      <van-tab title="列表页">
        <div class="list1">
          <van-empty class="custom-image" description="没有记录" v-if="cacheList.length <= 0" />
          <van-list>
            <ul
              v-for="(item, index) in cacheList"
              :key="index"
              style="padding: 5px; font-size: 14px"
              class="van-hairline--bottom"
              @click="onDelete(index)"
            >
              <li style="padding: 2px">箱号：{{ item.cBoxNO }}</li>
              <li style="padding: 2px">存货编码：{{ item.cInvCode }}</li>
              <li style="padding: 2px">存货名称：{{ item.cInvName }}</li>
              <li style="padding: 2px">规格型号：{{ item.cInvStd }}</li>
              <li style="padding: 2px">单位：{{ item.cComUnitName }}</li>
              <li style="padding: 2px; width: 80%; display: inline-flex; justify-content: space-between">
                <div>批号：{{ item.cBatch }}</div>
                <div>数量：{{ item.iQuantity }}</div>
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
  </div>
</template>
<script>
import { newGuid, floatAdd, floatSub } from '@/utils'
import { getBox } from '@/api/base'
import { saveBox } from '@/api/box'
export default {
  name: `box_form`,
  data() {
    this.confirm = 0
    return {
      active: 0,
      queryForm: {},
      cacheList: [],
      submitLoading: false,

      cSign: newGuid(),
      form: {
        cBoxNO: '',
        cBarcode: '',
        cInvCode: '',
        cInvName: '',
        cInvStd: '',
        cComUnitCode: '',
        cComUnitName: '',
        cBatch: '',
        iStockQuantity: '0',
        iQuantity: ''
      },
      curEle: ''
    }
  },
  watch: {
    active(newV, oldV) {
      if (newV == 0) {
        this.setFocus()
      }
    }
  },
  methods: {
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
    doClear() {
      this.clearForm()
    },
    onSubmit() {
      if (floatSub(this.form.iStockQuantity, this.form.iQuantity) < 0) {
        this.form.iQuantity = ''
        this.curEle = 'ele_iQuantity'
        return this.$toast({
          type: 'fail',
          message: '数量不得超过' + this.form.iStockQuantity,
          onOpened: () => {
            this.setFocus(true)
          }
        })
      } else {
        this.cacheList.push(Object.assign({}, this.form))
      }

      this.clearForm()
    },
    onSave() {
      this.$dialog
        .confirm({
          title: '提示',
          message: '确定要提交记录吗?'
        })
        .then(() => {
          this.submitLoading = true
          const { accountId } = this.$store.getters
          const form = Object.assign(
            {},
            {
              cSign: this.cSign,
              cAcc_Id: accountId
            }
          )
          saveBox(
            Object.assign({}, form, {
              Entry: this.cacheList.map(m => {
                return {
                  FBoxNo: m.cBoxNO,
                  FQty: m.iQuantity
                }
              })
            })
          )
            .then(({ Data, Message }) => {
              this.$toast({
                type: 'success',
                message: '提交成功!',
                onClose: () => {
                  this.submitLoading = false
                  this.cacheList = []
                  this.active = 0
                  this.cSign = newGuid()
                }
              })
            })
            .catch(({ Message }) => {
              this.submitLoading = false
            })
        })
        .catch(e => {})
    },
    setFocus(flag) {
      if (this.curEle != '') {
        setTimeout(() => {
          this.$refs[this.curEle].focus()
          // if (window.android) {
          //   if (this.curEle != 'ele_iQuantity' || flag) {
          //     android.HideSoftKeyboard()
          //   }
          // }
          // setTimeout(() => {
          //   if (window.android) {
          //     if (this.curEle != 'ele_iQuantity') {
          //       android.HideSoftKeyboard()
          //     }
          //   }
          // }, 50)
        }, 10)
      }
    },
    queryInv() {
      if (this.form.cBarcode == '') {
        return this.$toast({
          type: 'fail',
          message: '请先扫描箱号条码',
          onOpened: () => {
            this.form.cBarcode = ''
            this.setFocus()
          }
        })
      }

      const exist = this.cacheList.filter(f => {
        return f.cBoxNO == this.form.cBarcode
      })
      if (exist.length > 0) {
        return this.$toast({
          type: 'fail',
          message: '当前箱号已扫描!',
          onOpened: () => {
            this.form.cBarcode = ''
            this.setFocus()
          }
        })
      }

      getBox({ FBoxNo: this.form.cBarcode, cWhCode: this.cWhCode, cType: '0' })
        .then(({ Data }) => {
          if (Data.length > 0) {
            const { cInvCode, cInvName, cInvStd, cComUnitCode, cComUnitName, cBatch, iQuantity } = Data[0]

            this.form.cInvCode = cInvCode
            this.form.cInvName = cInvName
            this.form.cInvStd = cInvStd
            this.form.cComUnitCode = cComUnitCode
            this.form.cComUnitName = cComUnitName
            this.form.cBatch = cBatch
            this.form.iQuantity = iQuantity
            this.form.cBoxNO = this.form.cBarcode
            this.form.iStockQuantity = iQuantity
            //todo 多计量计算
            this.form.cBarcode = ''
            this.curEle = 'ele_iQuantity'
          }
        })
        .catch(err => {
          this.form.cBarcode = ''
          this.curEle = 'ele_cBarcode'
        })
        .finally(() => {
          this.setFocus()
        })
    },
    inputQuantity() {
      if (this.form.cBoxNO == '') {
        this.form.iQuantity = ''
        this.form.cBarcode = ''
        this.curEle = 'ele_cBarcode'
        return this.$toast({
          type: 'fail',
          message: '请先录入或者扫描箱号条码',
          onOpened: () => {
            this.setFocus(true)
          }
        })
      }

      if (this.form.iQuantity == '') {
        this.form.iQuantity = ''
        this.curEle = 'ele_iQuantity'
        return this.$toast({
          type: 'fail',
          message: '请先录入数量',
          onOpened: () => {
            this.setFocus(true)
          }
        })
      }

      this.onSubmit()
    },
    clearForm() {
      for (const key in this.form) {
        this.form[key] = ''
      }
      this.curEle = 'ele_cBarcode'
      this.setFocus()
    },
    onFocus1(e) {
      window.localStorage.setItem('curEle', e)
      const container = document.querySelector('.app-container')
      container.style.paddingBottom = '70px'
      const dom = document.querySelector('.inputForm')
      dom.style.height = '280px'
      dom.style.overflow = 'auto'
      const domTarget = document.querySelector('#ele_iQuantity')
      if (domTarget != void 0) {
        domTarget.scrollIntoView(true)
      }
    },
    onBlur() {
      const dom = document.querySelector('.inputForm')
      dom.style.height = ''
      dom.style.overflow = ''

      const container = document.querySelector('.app-container')
      container.style.paddingBottom = ''

      setTimeout(() => {
        var fdom = window.localStorage.getItem('curEle')
        const domTarget = document.querySelector('#' + fdom)
        if (domTarget != void 0) {
          domTarget.scrollIntoView(true)
        }
      }, 100)
    },
    onFocus(e) {
      window.localStorage.setItem('curEle', e)
    },
    checkStock() {
      const l1 = this.cacheList
        .filter(f => {
          return f.cInvCode == this.form.cInvCode && f.cBatch == this.form.cBatch
        })
        .map(m => m.iQuantity)

      const total = floatAdd(
        l1.reduce((sum, item) => {
          return floatAdd(sum, item)
        }, 0),
        this.form.iQuantity
      )

      return floatSub(this.form.iStockQuantity, total) >= 0
    }
  },
  computed: {
    forbidden() {
      return this.cacheList.length > 0
    },
    forbiddenSub() {
      return this.form.cBoxNO == '' || this.form.iQuantity == '' || this.form.iQuantity == 0
    }
  },
  created() {
    this.queryForm = Object.assign({}, this.$route.query)
  },
  mounted() {
    if (window.iQuantityFocus == void 0) {
      window.iQuantityFocus = () => {
        this.onFocus1('ele_iQuantity')
      }
    }

    if (window.iQuantityBlure == void 0) {
      window.iQuantityBlure = () => {
        this.onBlur()
      }
    }

    this.curEle = 'ele_cBarcode'
    this.setFocus()
  },
  beforeRouteLeave(to, from, next) {
    if (this.confirm != 0) {
      next(false)
    }
    if (this.cacheList.length <= 0) {
      delete window.iQuantityFocus
      delete window.iQuantityBlure
      next()
    } else {
      setTimeout(() => {
        this.$dialog
          .confirm({
            title: '提示',
            message: '您确定要退出当前功能吗?'
          })
          .then(() => {
            delete window.iQuantityFocus
            delete window.iQuantityBlure
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
  .list0 .btns {
    display: flex;
    margin-top: 3px;
    justify-content: space-around;
    .btn {
      width: 50%;
    }
  }
  .postForm {
    .van-cell {
      padding: 8px 10px;
      ::v-deep .van-cell__title {
        font-size: 15px;
        color: #333;
        width: 70px;
      }
    }
  }
  .list0,
  .list {
    height: calc(100vh - 210px);
    overflow: scroll;
  }
  .list1 {
    height: calc(100vh - 260px);
    overflow: scroll;
  }
  .form {
    width: 94vw;
  }
  .header {
    .item {
      padding: 8px 10px;
    }
  }
}
</style>
