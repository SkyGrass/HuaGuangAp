<template>
  <div class="container">
    <div class="header van-hairline--bottom">
      <van-form label-width="70px">
        <van-field
          class="item"
          v-model="headForm.cIWhName"
          readonly
          name="cWhName"
          label="调入仓库"
          placeholder="请选择调入仓库"
          is-link
          @click="openWarehouseIn"
        />
        <van-field
          class="item"
          v-model="headForm.cOWhName"
          readonly
          name="cWhName"
          label="调出仓库"
          placeholder="请选择调出仓库"
          is-link
          @click="openWarehouseOut"
        />
        <van-row>
          <van-col span="12">
            <van-field
              class="item"
              v-model="headForm.cIRdName"
              readonly
              name="cIRdName"
              label="入库方式"
              placeholder="请选择入库方式"
              is-link
              @click="openRdIn"
            />
            <van-field
              class="item"
              v-model="headForm.cORdName"
              readonly
              name="cORdName"
              label="出库方式"
              placeholder="请选择出库方式"
              is-link
              @click="openRdOut"
            />
          </van-col>
          <van-col span="12">
            <van-field
              class="item"
              v-model="headForm.cIDepName"
              readonly
              name="cIDepName"
              label="入库部门"
              placeholder="请选择入库部门"
              is-link
              @click="openDeptpartmentIn"
            />
            <van-field
              class="item"
              v-model="headForm.cODepName"
              readonly
              name="cODepName"
              label="出库部门"
              placeholder="请选择出库部门"
              is-link
              @click="openDeptpartmentOut"
            />
          </van-col>
        </van-row>
        <van-field class="item" v-model="headForm.cMemo" name="cMemo" label="备注" placeholder="备注" />
      </van-form>
    </div>
    <van-tabs v-model="active" color="#008577">
      <van-tab title="扫描页">
        <div class="list0" id="list0">
          <div ref="postForm" class="postForm inputForm">
            <van-field
              type="text"
              name="cIPosName"
              label="调入货位"
              clearable
              ref="ele_cIPosName"
              v-model="form.cIPosName"
              autocomplete="off"
              placeholder="扫描或录入调入货位"
              id="ele_cIPosName"
              :readonly="!control.usePosIn"
              v-show="control.usePosIn"
              @focus="onFocus('ele_cIPosName')"
              @keyup.enter="queryPosIn"
            ></van-field>
            <van-field
              type="text"
              name="cOPosName"
              label="调出货位"
              clearable
              ref="ele_cOPosName"
              v-model="form.cOPosName"
              autocomplete="off"
              placeholder="扫描或录入调出货位"
              :readonly="!control.usePosOut"
              v-show="control.usePosOut"
              id="ele_cOPosName"
              @focus="onFocus('ele_cOPosName')"
              @keyup.enter="queryPosOut"
            ></van-field>

            <van-field
              type="text"
              name="cBarcode"
              label="条码"
              clearable
              ref="ele_cBarcode"
              v-model="form.cBarcode"
              autocomplete="off"
              placeholder="扫描或录入存货条码"
              id="ele_cOPosName"
              @focus="onFocus('ele_cOPosName')"
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
            ></van-field>
            <van-field
              name="cBatch"
              label="批号"
              ref="ele_cBatch"
              v-model="form.cBatch"
              v-show="showBatch"
              readonly
              placeholder="批号"
            ></van-field>
            <van-field
              name="iCommitQuantity"
              label="已扫数量"
              ref="ele_iCommitQuantity"
              v-model="form.iCommitQuantity"
              placeholder="已扫数量"
              readonly
            ></van-field>

            <van-field
              name="iStockQuantity"
              label="库存数量"
              ref="ele_iStockQuantity"
              placeholder="库存数量"
              readonly
              v-model="form.iStockQuantity"
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
            <!-- <van-button
              class="btn"
              size="small"
              color="#008577"
              type="info"
              @click="inputQuantity"
              :disabled="forbiddenSub"
              >确定</van-button
            > -->
          </div>
        </div>
      </van-tab>
      <van-tab title="记录页">
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
              <li style="padding: 2px">存货编码：{{ item.cInvCode }}</li>
              <li style="padding: 2px">存货名称：{{ item.cInvName }}</li>
              <li style="padding: 2px">规格型号：{{ item.cInvStd }}</li>
              <li style="padding: 2px; width: 80%; display: inline-flex; justify-content: space-between">
                <div>批号：{{ item.cBatch }}</div>
                <div>单位：{{ item.cComUnitName }}</div>
              </li>
              <li style="padding: 2px; width: 80%; display: inline-flex; justify-content: space-between">
                <div>调出货位：{{ item.cOPosName }}</div>
                <div>调入货位：{{ item.cIPosName }}</div>
              </li>
              <li style="padding: 2px">数量：{{ item.iQuantity }}</li>
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
    <warehouse ref="warehouseIn" :source="sources.warehouseList" @choose="pickWarehouseIn" @cancel="cancelPicker" />
    <warehouse ref="warehouseOut" :source="sources.warehouseList" @choose="pickWarehouseOut" @cancel="cancelPicker" />
    <deptpartment
      ref="deptpartmentIn"
      :source="sources.departmentList"
      @choose="pickDeptpartmentIn"
      @cancel="cancelPicker"
    />
    <deptpartment
      ref="deptpartmentOut"
      :source="sources.departmentList"
      @choose="pickDeptpartmentOut"
      @cancel="cancelPicker"
    />
    <rd ref="rdIn" :source="sources.rdListIn" @choose="pickRdIn" @cancel="cancelPicker" />
    <rd ref="rdOut" :source="sources.rdListOut" @choose="pickRdOut" @cancel="cancelPicker" />
  </div>
</template>
<script>
import { saveTrans } from '@/api/trans'
import { newGuid, floatAdd, floatSub } from '@/utils'
import { getWarehouse, getDepartment, getRdStyle, getPosition, getInventory } from '@/api/base'
import warehouse from '@/components/warehouse'
import deptpartment from '@/components/deptpartment'
import rd from '@/components/rd'
import dayjs from 'dayjs'
export default {
  name: `trans_form`,
  components: { warehouse, deptpartment, rd },
  data() {
    this.confirm = 0
    return {
      active: 0,
      headForm: {
        cIWhName: '',
        cIWhCode: '',
        cOWhName: '',
        cOWhCode: '',

        cIRdCode: '',
        cIRdName: '',
        cORdCode: '',
        cORdName: '',

        cIDepCode: '',
        cIDepName: '',
        cODepCode: '',
        cODepName: '',

        cMemo: ''
      },
      queryForm: {},
      loading: false,
      finished: false,
      curRow: {},
      cacheList: [],
      submitLoading: false,
      sources: {
        warehouseList: [],
        departmentList: [],
        rdListIn: [],
        rdListOut: []
      },
      control: {
        usePosIn: false,
        usePosOut: false,
        useBatch: false,
        useQuality: false,
        groupType: 1
      },
      cSign: newGuid(),
      form: {
        cIPosCode: '',
        cIPosName: '',

        cOPosCode: '',
        cOPosName: '',

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

        iCommitQuantity: '', //完成量
        iQuantity: '', //调拨量
        iStockQuantity: '',

        iChangRate: 0,
        iNum: 0
      },
      curEle: ''
    }
  },
  watch: {
    active(newV, oldV) {
      if (newV == 0) {
        if (this.control.usePosIn && this.form.cIPosCode == '') {
          this.curEle = 'ele_cIPosName'
        } else if (this.control.usePosOut && this.form.cOPosCode == '') {
          this.curEle = 'ele_cOPosName'
        } else if (this.form.cBarcode == '') {
          this.curEle = 'ele_cBarcode'
        }
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
    pickWarehouseIn({ cWhCode, cWhName, bWhPos }) {
      this.headForm.cIWhName = cWhName
      this.headForm.cIWhCode = cWhCode
      this.control.usePosIn = bWhPos
      this.form.cIPosCode = ''
      this.form.cIPosName = ''
      this.$nextTick(() => {
        this.curEle = bWhPos ? 'ele_cIPosName' : this.control.usePosOut ? 'ele_cOPosName' : 'ele_cBarcode'
        this.setFocus()
      })
    },
    pickWarehouseOut({ cWhCode, cWhName, bWhPos }) {
      this.headForm.cOWhName = cWhName
      this.headForm.cOWhCode = cWhCode
      this.control.usePosOut = bWhPos
      this.form.cIPosCode = ''
      this.form.cIPosName = ''
      this.$nextTick(() => {
        this.curEle = this.form.cIPosCode != '' ? (bWhPos ? 'ele_cOPosName' : 'ele_cBarcode') : 'ele_cIPosName'
        this.setFocus()
      })
    },
    pickDeptpartmentIn({ cDepCode, cDepName }) {
      this.headForm.cIDepName = cDepName
      this.headForm.cIDepCode = cDepCode
    },
    pickDeptpartmentOut({ cDepCode, cDepName }) {
      this.headForm.cODepName = cDepName
      this.headForm.cODepCode = cDepCode
    },
    pickRdIn({ cRdCode, cRdName }) {
      this.headForm.cIRdCode = cRdCode
      this.headForm.cIRdName = cRdName
    },
    pickRdOut({ cRdCode, cRdName }) {
      this.headForm.cORdCode = cRdCode
      this.headForm.cORdName = cRdName
    },
    cancelPicker() {
      this.setFocus()
    },
    openWarehouseOut() {
      if (this.forbidden) {
        return this.$toast({ type: 'fail', message: '已经有扫描记录,禁止操作!' })
      }
      this.$refs.warehouseOut.open()
    },
    openWarehouseIn() {
      if (this.forbidden) {
        return this.$toast({ type: 'fail', message: '已经有扫描记录,禁止操作!' })
      }
      this.$refs.warehouseIn.open()
    },
    openDeptpartmentIn() {
      this.$refs.deptpartmentIn.open()
    },
    openDeptpartmentOut() {
      this.$refs.deptpartmentOut.open()
    },
    openRdIn() {
      this.$refs.rdIn.open()
    },
    openRdOut() {
      this.$refs.rdOut.open('0')
    },
    onSubmit() {
      if (this.checkStock()) {
        this.form.iQuantity = ''
        this.curEle = 'ele_iQuantity'
        return this.$toast({
          type: 'fail',
          message: '当前库存量不够!',
          onOpened: () => {
            this.setFocus(true)
          }
        })
      }
      const position = this.cacheList.findIndex(f => {
        return (
          f.cInvCode == this.form.cInvCode &&
          f.cBatch == this.form.cBatch &&
          f.cOPosCode == this.form.cOPosCode &&
          f.cIPosCode == this.form.cIPosCode
        )
      })
      if (position > -1) {
        let r = this.cacheList[position]
        r.iQuantity = floatAdd(r.iQuantity, this.form.iQuantity)
        this.$set(this.cacheList, position, Object.assign({}, r))
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
          const form = Object.assign({}, this.headForm, {
            cSign: this.cSign,
            cAcc_Id: accountId
          })
          saveTrans(
            Object.assign(
              {},
              [form].map(m => {
                return {
                  cSign: m.cSign,

                  cAcc_Id: m.cAcc_Id,

                  cIWhCode: m.cIWhCode,
                  cIWhName: m.cIWhName,

                  cOWhCode: m.cOWhCode,
                  cOWhName: m.cOWhName,

                  cIRdCode: m.cIRdCode,
                  cORdCode: m.cORdCode,

                  cIDepCode: m.cIDepCode,
                  cODepCode: m.cODepCode,

                  cMemo: m.cMemo
                }
              })[0],
              {
                Entry: this.cacheList.map(m => {
                  return {
                    cSourceBillID: '',
                    cSourceBillNo: '',
                    cSourceBillEntryID: '',

                    cIPosCode: m.cIPosCode,
                    cOPosCode: m.cOPosCode,

                    cInvCode: m.cInvCode,
                    cBatch: m.cBatch,
                    iMassDate: m.iMassDate,
                    cMassUnit: m.cMassUnit,
                    dMdate: m.dMdate,
                    dVdate: m.dVdate,
                    iQuantity: m.iQuantity,
                    iChangRate: m.iChangRate,
                    iNum: m.iNum
                  }
                })
              }
            )
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
          const dom = this.$refs[this.curEle]
          if (dom != void 0) {
            dom.focus()
          }
          if (window.android) {
            if (this.curEle != 'ele_iQuantity' || flag) {
              android.HideSoftKeyboard()
            }
          }
          setTimeout(() => {
            if (window.android) {
              if (this.curEle != 'ele_iQuantity') {
                android.HideSoftKeyboard()
              }
            }
          }, 50)
        }, 10)
      }
    },
    queryPosIn() {
      if (this.control.usePosIn && this.form.cIPosName == '') {
        return this.$toast({
          type: 'fail',
          message: '请先扫描货位',
          onOpened: () => {
            this.form.cIPosName = ''
            this.setFocus()
          }
        })
      }
      getPosition({ cWhCode: this.headForm.cIWhCode, cPosCode: this.form.cIPosName })
        .then(({ Data }) => {
          if (Data.length > 0) {
            this.form.cIPosCode = this.form.cIPosName
            this.form.cIPosName = Data[0].cPosName
            this.curEle = this.control.usePosOut ? 'ele_cOPosName' : 'ele_cBarcode'
          } else {
            this.form.cIPosName = ''
            this.curEle = 'ele_cIPosName'
            this.$toast({ type: 'fail', message: '没有查询到货位!' })
          }
        })
        .catch(err => {
          this.form.cIPosName = ''
          this.curEle = 'ele_cIPosName'
        })
        .finally(() => {
          this.setFocus()
        })
    },
    queryPosOut() {
      if (this.control.usePosOut && this.form.cOPosName == '') {
        return this.$toast({
          type: 'fail',
          message: '请先扫描货位',
          onOpened: () => {
            this.form.cOPosName = ''
            this.setFocus()
          }
        })
      }
      getPosition({ cWhCode: this.headForm.cOWhCode, cPosCode: this.form.cOPosName })
        .then(({ Data }) => {
          if (Data.length > 0) {
            this.form.cOPosCode = this.form.cOPosName
            this.form.cOPosName = Data[0].cPosName
            this.curEle = 'ele_cBarcode'
          } else {
            this.form.cOPosName = ''
            this.curEle = 'ele_cOPosName'
            this.$toast({ type: 'fail', message: '没有查询到货位!' })
          }
        })
        .catch(err => {
          this.form.cOPosName = ''
          this.curEle = 'ele_cOPosName'
        })
        .finally(() => {
          this.setFocus()
        })
    },
    queryInv() {
      if (
        (this.control.usePosIn && this.form.cIPosCode == '') ||
        (this.control.usePosOut && this.form.cOPosCode == '')
      ) {
        return this.$toast({
          type: 'fail',
          message: '请先扫描货位',
          onOpened: () => {
            this.form.cBarcode = ''
            this.setFocus()
          }
        })
      }
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
      if (this.headForm.cIPosCode == this.headForm.cOPosCode && this.headForm.cIWhCode == this.headForm.cOWhCode) {
        this.form.cBarcode = ''
        this.form.cOPosName = ''
        this.curEle = 'ele_cOPosName'
        return this.$toast({
          type: 'fail',
          message: '调入调出货位不可一致!',
          onOpened: () => {
            this.setFocus(true)
          }
        })
      }
      getInventory({ cBarcode: this.form.cBarcode, cWhCode: this.headForm.cOWhCode, cPosCode: this.form.cOPosCode })
        .then(({ Data }) => {
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
              iStockQuantity,
              iGroupType
            } = Data[0]

            this.control.useBatch = bInvBatch //是否批次管理
            this.control.useQuality = bInvQuality //是否保质期管理
            this.control.groupType = iGroupType //单位组类别 0 无换算、 1 固定换算、2 浮动换算

            this.form.cInvCode = cInvCode
            this.form.cInvName = cInvName
            this.form.cInvStd = cInvStd
            this.form.cComUnitCode = cComUnitCode
            this.form.cComUnitName = cComUnitName
            this.form.cBatch = cBatch
            this.form.iStockQuantity = iStockQuantity

            this.form.iChangRate = iChangRate

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

            //todo 多计量计算
            this.form.iNum = 0
            const rows = this.cacheList.filter(f => {
              return f.cInvCode == cInvCode
            })
            const total = rows
              .map(f => f.iQuantity)
              .reduce((sum, item) => {
                return floatAdd(sum, item)
              }, 0)

            this.form.iCommitQuantity = total
            this.form.iQuantity = ''

            this.form.cBarcode = ''
            this.curEle = 'ele_iQuantity'
          } else {
            this.form.cBarcode = ''
            this.curEle = 'ele_cBarcode'
            return this.$toast({
              type: 'fail',
              message: '未能查询到存货信息!',
              onOpened: () => {
                this.setFocus(true)
              }
            })
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
      if (
        (this.control.usePosIn && this.form.cIPosCode == '') ||
        (this.control.usePosOut && this.form.cOPosCode == '')
      ) {
        return this.$toast({
          type: 'fail',
          message: '请按流程进行扫描!',
          onOpened: () => {
            this.curEle = 'ele_cPosName'
            this.setFocus()
          }
        })
      }

      this.onSubmit()
    },
    clearForm() {
      for (const key in this.form) {
        if (this.$store.getters.numProps.includes(key)) {
          this.form[key] = 0
        } else {
          this.form[key] = ''
        }
      }
      this.control.useBatch = false
      this.control.useQuality = false
      this.control.groupType = 1
      if (this.control.usePosIn && this.form.cIPosCode == '') {
        this.curEle = 'ele_cIPosName'
      } else if (this.control.usePosOut && this.form.cOPosCode == '') {
        this.curEle = 'ele_cOPosName'
      } else if (this.form.cBarcode == '') {
        this.curEle = 'ele_cBarcode'
      }
      this.setFocus()
    },
    onFocus1(e) {
      window.localStorage.setItem('curEle', e)
      const container = document.querySelector('.app-container')
      container.style.paddingBottom = '80px'
      const dom = document.querySelector('.inputForm')
      dom.style.height = '100px'
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
          return (
            f.cInvCode == this.form.cInvCode &&
            f.cBatch == this.form.cBatch &&
            f.cOWhCode == this.queryForm.cOWhCode &&
            f.cOPosCode == this.form.cOPosCode
          )
        })
        .map(m => m.iQuantity)

      const total = floatAdd(
        l1.reduce((sum, item) => {
          return floatAdd(sum, item)
        }, 0),
        this.form.iQuantity
      )

      return floatSub(this.form.iStockQuantity, total) < 0
    }
  },
  computed: {
    showStock() {
      return this.queryForm.bRob == '0'
    },
    showBatch() {
      return this.control.useBatch
    },
    showQuality() {
      return this.control.useQuality
    },
    showGroup() {
      return this.control.groupType != 0
    },
    forbidden() {
      return this.cacheList.length > 0
    },
    forbiddenSub() {
      return this.form.cSourceBillID == '' || this.form.iQuantity == '' || this.form.iQuantity == 0
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

    setTimeout(() => {
      getWarehouse({})
        .then(({ Data }) => {
          if (Data.length > 0) {
            this.sources.warehouseList = Data
            const d1 = Data[0]
            this.control.usePosIn = d1.bWhPos
            this.headForm.cIWhName = d1.cWhName
            this.headForm.cIWhCode = d1.cWhCode

            const d2 = Data[0]
            this.control.usePosOut = d2.bWhPos
            this.headForm.cOWhName = d2.cWhName
            this.headForm.cOWhCode = d2.cWhCode

            this.$nextTick(() => {
              this.curEle = d1.bWhPos ? 'ele_cIPosName' : d2.bWhPos ? 'ele_cOPosName' : 'ele_cBarcode'
              this.setFocus()
            })
          }
        })
        .catch(err => {})
    }, 50)
    setTimeout(() => {
      getDepartment({})
        .then(({ Data }) => {
          this.sources.departmentList = Data
          if (Data.length > 0) {
            const { cDepCode, cDepName } = Data[0]
            this.headForm.cIDepCode = cDepCode
            this.headForm.cIDepName = cDepName

            this.headForm.cODepCode = cDepCode
            this.headForm.cODepName = cDepName
          }
        })
        .catch(err => {})
    }, 100)

    setTimeout(() => {
      getRdStyle({ cFilter: 'bRdFlag=1' })
        .then(({ Data }) => {
          this.sources.rdListIn = Data
          if (Data.length > 0) {
            const { cRdCode, cRdName } = Data.filter(f => f.cRdCode == '14')[0]
            this.headForm.cIRdCode = cRdCode
            this.headForm.cIRdName = cRdName
          }
        })
        .catch(err => {})
    }, 150)

    setTimeout(() => {
      getRdStyle({ cFilter: 'bRdFlag=0' })
        .then(({ Data }) => {
          this.sources.rdListOut = Data
          if (Data.length > 0) {
            const { cRdCode, cRdName } = Data.filter(f => f.cRdCode == '24')[0]

            this.headForm.cORdCode = cRdCode
            this.headForm.cORdName = cRdName
          }
        })
        .catch(err => {})
    }, 200)
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
    margin-bottom: 20px;
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
    height: calc(100vh - 250px);
    overflow: scroll;
  }
  .sourceList {
    height: calc(100vh - 50px);
    overflow: scroll;
  }
  .list1 {
    height: calc(100vh - 250px);
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
