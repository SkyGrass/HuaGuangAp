<template>
  <div class="container">
    <div class="list0" id="list0">
      <div class="postForm" ref="postForm">
        <!-- <van-field
          class="item"
          v-model="cWhName"
          readonly
          name="cWhName"
          label="仓库"
          placeholder="请选择仓库"
          is-link
          @click="openWarehouse"
        /> -->
        <!-- <van-field label="启用货位" placeholder="启用货位">
          <template #input>
            <van-checkbox
              checked-color="#008577"
              v-model="control.usePos"
              shape="square"
              size="small"
            ></van-checkbox> </template
        ></van-field> -->
        <van-field
          type="text"
          name="cBarcode"
          label="存货条码"
          ref="ele_cBarcode"
          v-model="form.cBarcode"
          autocomplete="off"
          placeholder="扫描或录入存货条码"
          id="ele_cBarcode"
          @keyup.enter="queryInv"
        ></van-field>
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
          label="计量单位"
          ref="ele_cComUnitName"
          v-model="form.cComUnitName"
          readonly
          placeholder="计量单位"
        ></van-field>
        <van-field
          name="dMdate"
          label="生产日期"
          ref="ele_dMdate"
          v-model="form.dMdate"
          v-show="showQuality"
          placeholder="生产日期"
          readonly
        ></van-field>
        <van-field
          name="dVdate"
          label="到期日期"
          ref="ele_dVdate"
          v-model="form.dVdate"
          v-show="showQuality"
          placeholder="到期日期"
          readonly
        ></van-field>
      </div>
      <div v-for="group in groups" :key="group.cWhCode" style="font-size: 16px; margin-top: 10px; padding: 10px">
        <ul>
          <li><strong>仓库：</strong>{{ group.cWhName }}</li>
        </ul>
        <div v-for="row in group.details" :key="row.cPosName">
          <ul>
            <li v-if="control.usePos"><strong>货位：</strong>{{ row.cPosName }}</li>
            <li>批次： {{ row.cBatch }}</li>
            <li>库存数量： {{ row.iStockQuantity }}</li>
          </ul>
        </div>
      </div>
      <warehouse ref="warehouse" :source="sources.warehouseList" @choose="pickWarehouse" @cancel="cancelPicker" />
    </div>
  </div>
</template>
<script>
import warehouse from '@/components/warehouse'
import { getCurrentStock, getPostionStock } from '@/api/query'
import { getWarehouse } from '@/api/base'
export default {
  name: `stock`,
  components: { warehouse },
  data() {
    return {
      cWhCode: '',
      cWhName: '',
      form: {
        cBarcode: '',

        cInvCode: '',
        cInvName: '',
        cInvStd: '',
        cComUnitCode: '',
        cComUnitName: '',
        cBatch: '',
        iMassDate: '', //质保期时长
        cMassUnit: '', //质保期时长单位 1 年 、2 月、 3 日
        dMdate: '', //生产日期
        dVdate: '', //到期日期
        iChangRate: 0,
        iNum: 0
      },
      sources: {
        warehouseList: []
      },
      control: {
        usePos: false,
        useBatch: false,
        useQuality: false,
        groupType: 1
      },
      list: [],
      curEle: ''
    }
  },
  watch: {
    'control.usePos': {
      handler(newV, oldV) {
        this.clearForm()
      },
      immediate: true
    }
  },
  methods: {
    openWarehouse() {
      if (this.forbidden) {
        return this.$toast({ type: 'fail', message: '已经有扫描记录,禁止操作!' })
      }
      this.$refs.warehouse.open()
    },
    pickWarehouse({ cWhCode, cWhName, bWhPos }) {
      this.cWhName = cWhName
      this.cWhCode = cWhCode
      this.control.usePos = bWhPos
      this.$nextTick(() => {
        this.curEle = 'ele_cBarcode'
        this.setFocus()
      })
    },
    cancelPicker() {
      this.setFocus()
    },
    doClear() {
      this.clearForm()
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
    clearForm() {
      for (const key in this.form) {
        this.form[key] = ''
      }
      this.list = []
      this.control.useBatch = false
      this.control.useQuality = false
      this.control.groupType = 1
      this.curEle = 'ele_cBarcode'
      this.setFocus()
    },
    queryInv() {
      if (this.form.cBarcode == '') {
        return this.$toast({
          type: 'fail',
          message: '请先扫描存货条码',
          onOpened: () => {
            this.form.cBarcode = ''
            this.setFocus()
          }
        })
      }
      this.list = []
      const method = this.control.usePos ? getPostionStock : getCurrentStock
      method({ cBarcode: this.form.cBarcode, cWhCode: '' })
        .then(({ Data }) => {
          this.clearForm()
          if (Data.length > 0) {
            const {
              bInvBatch,
              bInvQuality,
              cInvCode,
              cInvName,
              cInvStd,
              cComUnitCode,
              cComUnitName,
              cBatch,
              iMassDate,
              cMassUnit,
              iChangRate,
              dMdate,
              iGroupType
            } = Data[0]
            this.list = Data

            this.control.useBatch = bInvBatch //是否批次管理
            this.control.useQuality = bInvQuality //是否保质期管理
            this.control.groupType = iGroupType //单位组类别 0 无换算、 1 固定换算、2 浮动换算

            this.form.cInvCode = cInvCode
            this.form.cInvName = cInvName
            this.form.cInvStd = cInvStd
            this.form.cComUnitCode = cComUnitCode
            this.form.cComUnitName = cComUnitName
            this.form.cBatch = cBatch

            //计算保质期
            if (bInvQuality) {
              this.form.iMassDate = iMassDate
              this.form.cMassUnit = cMassUnit

              this.form.dMdate = dMdate
              if (cMassUnit == '1') {
                this.form.dVdate = new dayjs(dMdate).add(iMassDate, 'year').format('YYYY-MM-DD')
              } else if (cMassUnit == '2') {
                this.form.dVdate = new dayjs(dMdate).add(iMassDate, 'month').format('YYYY-MM-DD')
              } else if (cMassUnit == '3') {
                this.form.dVdate = new dayjs(dMdate).add(iMassDate, 'day').format('YYYY-MM-DD')
              }
            }

            this.form.iChangRate = iChangRate

            this.form.cBarcode = ''
            this.curEle = 'ele_cBarcode'
          } else {
            this.clearForm()
          }
        })
        .catch(err => {
          this.clearForm()
          this.form.cBarcode = ''
          this.curEle = 'ele_cBarcode'
        })
        .finally(() => {
          this.setFocus()
        })
    },
    onFocus(e) {
      var dom = document.activeElement.id
      this.curEle = dom
      const domTarget = document.querySelector('#' + dom)
      if (domTarget != void 0) {
        setTimeout(function () {
          domTarget.scrollIntoView(false)
        }, 300)
      }
      window.localStorage.setItem('curEle', dom)
    }
  },
  computed: {
    showQuality() {
      return this.control.useQuality
    },
    showGroup() {
      return this.control.groupType != 0
    },
    groups() {
      const groupIds = Array.from(new Set(this.list.map(f => f.cWhCode)))
      return groupIds.map(id => {
        const details = this.list.filter(f => {
          return f.cWhCode == id
        })
        return {
          cWhCode: id,
          cWhName: details[0].cWhName,
          details: details.map(m => {
            return {
              cBatch: m.cBatch,
              iStockQuantity: m.iQuantity,
              cPosName: m.cPosName
            }
          })
        }
      })
    },
    defWhCode() {
      return this.$store.getters.defWhCode || ''
    }
  },
  created() {},
  mounted() {
    setTimeout(() => {
      getWarehouse({})
        .then(({ Data }) => {
          this.sources.warehouseList = Data

          if (Data.length > 0) { 
            const f = Data.filter(f => {
              return f.cWhCode == this.defWhCode
            })
            const { cWhCode, cWhName, bWhPos } = f.length > 0 ? f[0] : { cWhCode: '', cWhName: '', bWhPos: false }
            this.cWhCode = cWhCode
            this.cWhName = cWhName

            this.control.usePos = bWhPos
            this.$nextTick(() => {
              this.curEle = 'ele_cBarcode'
              this.setFocus()
            })
          }
        })
        .catch(err => {})
    }, 50)

    this.curEle = 'ele_cBarcode'
    this.setFocus()

    window.keyboardChange = state => {
      if (state) {
        if (this.activeElement != '') {
          this.onFocus()
        } else {
        }
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    delete window.keyboardChange
    next()
  }
}
</script>
<style lang="scss" scoped>
.container {
  height: 100vh;
  .list0 .btns {
    display: flex;
    margin-top: 3px;
    margin-bottom: 20px;
    justify-content: space-around;
    .btn {
      width: 30%;
    }
  }
  .list0,
  .list {
    height: calc(100vh);
    overflow: scroll;
  }
  .list1 {
    height: calc(100vh);
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
  table {
    border: 1px solid #333;
  }
  table td {
    border-top: 0;
    border-bottom: 1px solid #333;
    border-right: 1px solid #333;
    border-left: 0;
  }
  table tr.lastRow td {
    border-bottom: 0;
  }
  table tr td.lastCol {
    border-right: 0;
  }
}
</style>
