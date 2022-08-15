<template lang="">
  <div class="header van-hairline--bottom">
    <van-form>
      <van-field
        name="cPosName"
        label="货位"
        id="ele_cPosName"
        ref="ele_cPosName"
        v-model="form.cPosName"
        autocomplete="off"
        placeholder="扫描或录入货位"
        v-show="control.usePos"
        @keyup.enter="queryPos"
      ></van-field>

      <van-field
        name="cBarcode"
        label="条码"
        id="ele_cBarcode"
        ref="ele_cBarcode"
        v-model="form.cBarcode"
        autocomplete="off"
        placeholder="扫描或录入存货条码"
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
        label="单位"
        ref="ele_cComUnitName"
        v-model="form.cComUnitName"
        readonly
        placeholder="单位"
        readonly
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
      <van-field
        name="iStockQuantity"
        label="库存数量"
        ref="ele_iStockQuantity"
        v-model="form.iStockQuantity"
        v-show="showStock"
      ></van-field>
      <van-field
        type="digit"
        name="iNum"
        label="件数"
        ref="ele_iNum"
        v-model="form.iNum"
        v-show="showGroup"
        @keyup.enter="InputNum"
      ></van-field>
      <van-field
        type="digit"
        name="iQuantity"
        label="数量"
        ref="ele_iQuantity"
        v-model="form.iQuantity"
        @keyup.enter="InputQuantity"
      ></van-field>
      <van-field
        name="iChangeRate"
        label="换算比例"
        ref="ele_iChangeRate"
        v-model="form.iChangeRate"
        readonly
      ></van-field>
    </van-form>
  </div>
</template>
<script>
import { getInventory, getPosition, getWarehouse } from '@/api/base'
export default {
  name: 'standerform',
  props: {
    rob: String //红蓝字
  },
  data() {
    return {
      form: {
        cPosCode: '',
        cPosName: '',
        cBarcode: '',
        cInvCode: '',
        cInvName: '',
        cInvStd: '',
        cComUnitCode: '',
        cComUnitName: '',
        cBatch: '',
        iChangeRate: 0,
        iMassDate: '', //质保期时长
        cMasUnit: '', //质保期时长单位 1 年 、2 月、 3 日
        dMdate: '', //生产日期
        dVdata: '', //到期日期
        iNum: 0,

        cSourceBillID: '',
        cSourceBillNo: '',
        cSourceBillEntryID: ''
      },
      cWhCode: '01',
      configList: [],
      curEle: '',
      posList: [
        { cPosCode: '01', cPosName: '手机' },
        { cPosCode: '01-0000005', cPosName: '其他外设' }
      ],
      list: [],
      invInfo: {},

      control: {
        usePos: true,
        useBatch: true,
        useQuality: true,
        groupType: 1
      }
    }
  },
  computed: {
    showStock() {
      return this.$props.rob == '0'
    },
    showBatch() {
      return this.control.useBatch
    },
    showQuality() {
      return this.control.useQuality
    },
    showGroup() {
      return this.control.groupType != 0
    }
  },
  watch: {
    cWhCode(newV, oldV) {
      if (newV != '') {
        getWarehouse({})
          .then(({ Data }) => {
            if (Data.length > 0) {
              const { bWhPos } = Data.filter(f => {
                return f.cWhCode == newV
              })[0]
              this.control.usePos = bWhPos
              this.$nextTick(() => {
                this.curEle = bWhPos ? 'ele_cPosName' : 'ele_cBarcode'
                this.setFocus()
              })
            }
          })
          .catch(err => {})
      }

      // getPosition({ cWhCode: newV }).then(({ Data }) => {
      //   debugger
      // })
    }
  },
  methods: {
    queryPos() {
      if (this.posList.length > 0) {
        const r = this.posList.filter(f => {
          return f.cPosCode == this.form.cPosName
        })
        if (r.length > 0) {
          this.form.cPosCode = this.form.cPosName
          this.form.cPosName = r[0].cPosName
          this.curEle = 'ele_cBarcode'
        } else {
          this.curEle = 'ele_cPosName'
          this.$toast({ type: 'fail', message: '没有查询到货位!' })
        }
      } else {
        this.curEle = 'ele_cPosName'
        this.$toast({ type: 'fail', message: '没有查询到货位!' })
      }
      this.setFocus()
    },
    queryInv() {
      const exist = this.list.filter(f => {
        return f.cInvCode == this.form.cBarcode
      })
      if (exist.length > 0) {
        getInventory({ cBarcode: this.form.cBarcode, cWhCode: this.cWhCode, cPosCode: this.form.cPosCode })
          .then(({ Data }) => {
            if (Data.length > 0) {
              const { bInvBatch, bInvQuanlity } = Data[0]

              this.control.useBatch = bInvBatch //是否批次管理
              this.control.useQuality = bInvQuanlity //是否保质期管理
              this.control.groupType = iGroupType //单位组类别 0 无换算、 1 固定换算、2 浮动换算

              this.form.cSourceBillID = exist[0]['ID'] //源单ID
              this.form.cSourceBillNo = exist[0]['cCode'] //源单单号
              this.form.cSourceBillEntryID = exist[0]['Autoid'] //源单表体ID

              if (this.control.groupType > 0) {
                this.curEle = 'ele_iNum'
              }
            }
          })
          .catch(err => {
            this.curEle = 'ele_cBarcode'
          })
      } else {
        this.curEle = 'ele_cBarcode'
        this.$toast({ type: 'fail', message: '源单上没有发现当前存货!' })
      }
      this.setFocus()
    },
    InputNum() {
      if (this.control.groupType == 0) {
      }
    },
    InpQUantity() {
      //无换算关系
      if (this.control.groupType == 0) {
        //添加到缓存
      }
    },
    setCWhCode(code) {
      this.cWhCode = code
    },
    setFocus() {
      if (this.curEle != '') {
        this.$refs[this.curEle].focus()
        if (window.android) {
          android.HideSoftKeyboard()
        }
        setTimeout(() => {
          if (window.android) {
            android.HideSoftKeyboard()
          }
        }, 50)
      }
    },
    setSoueceList(data) {
      this.list = data
    }
  },
  mounted() {
    this.configList.forEach(ele => {
      this.$set(this.form, ele.prop, '')
    })
    this.$nextTick(() => {
      this.setFocus()
    })
  }
}
</script>
<style lang="scss" scoped></style>
