<template>
  <div class="container">
    <div class="list0" id="list0">
      <div class="postForm" ref="postForm">
        <van-field
          type="text"
          name="cBarcode"
          label="模具条码"
          ref="ele_cBarcode"
          v-model="form.cBarcode"
          autocomplete="off"
          id="ele_cBarcode"
          placeholder="扫描或录入模具条码"
          @focus="onFocus('ele_cBarcode')"
          @keyup.enter="queryInv"
        ></van-field>
        <van-field
          name="FName"
          label="模具名称"
          ref="ele_FName"
          v-model="form.FName"
          readonly
          placeholder="模具名称"
        ></van-field>
        <van-field
          name="FModel"
          label="规格"
          ref="ele_FModel"
          v-model="form.FModel"
          readonly
          placeholder="规格"
        ></van-field>
        <van-field
          name="FFactoryF"
          label="制造厂商"
          ref="ele_FFactory"
          v-model="form.FFactory"
          readonly
          placeholder="制造厂商"
        ></van-field>
        <van-field
          name="FBuyDate"
          label="购置年月"
          ref="ele_FBuyDate"
          v-model="form.FBuyDate"
          readonly
          placeholder="购置年月"
        ></van-field>
        <van-field
          name="FUseDept"
          label="使用部门"
          ref="ele_FUseDept"
          v-model="form.FUseDept"
          readonly
          placeholder="使用部门"
        ></van-field>
        <van-field
          name="FPerson"
          label="责任人"
          ref="ele_FPerson"
          v-model="form.FPerson"
          readonly
          placeholder="责任人"
        ></van-field>
        <van-field
          name="FEquStatus"
          label="设备状态"
          ref="ele_FEquStatus"
          v-model="form.FEquStatus"
          readonly
          placeholder="设备状态"
        ></van-field>
        <van-field
          name="FStockNo"
          label="库存编号"
          ref="ele_FStockNo"
          v-model="form.FStockNo"
          readonly
          placeholder="库存编号"
        ></van-field>
        <van-field
          name="FToolingNo"
          label="工装编号"
          ref="ele_FToolingNo"
          v-model="form.FToolingNo"
          readonly
          placeholder="工装编号"
        ></van-field>
      </div>

      <div v-for="group in groups" :key="group.FTerminalModel" style="font-size: 15px; padding: 5px">
        <ul>
          <li><strong>端子型号：</strong>{{ group.FTerminalModel }}</li>
        </ul>
        <table width="100%" style="text-align: center" cellspacing="0">
          <tr>
            <td>电路规格</td>
            <td>压接高度</td>
            <td>压接宽度</td>
            <td class="lastCol">拉力</td>
          </tr>
          <tr
            v-for="(row, index) in group.FDetails"
            :key="index"
            :class="{
              lastRow: index == group.FDetails.length - 1
            }"
          >
            <td>{{ row.FCircuitSpec }}</td>
            <td>{{ row.FCrimpHeight }}</td>
            <td>{{ row.FCrimpWidth }}</td>
            <td class="lastCol">
              {{ row.FTraction }}
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
import { getMould } from '@/api/query'
export default {
  name: `mould`,
  data() {
    return {
      form: {
        cBarcode: '',
        FNumber: '',
        FName: '',
        FModel: '',
        FFactory: '',
        FBuyDate: '',
        FUseDept: '',
        FPerson: '',
        FEquStatus: '',
        FStockNo: '',
        FToolingNo: ''
      },
      list: [],
      curEle: ''
    }
  },
  watch: {},
  methods: {
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
      this.curEle = 'ele_cBarcode'
      this.setFocus()
    },
    queryInv() {
      if (this.form.cBarcode == '') {
        return this.$toast({
          type: 'fail',
          message: '请先扫描模具条码',
          onOpened: () => {
            this.form.cBarcode = ''
            this.setFocus()
          }
        })
      }
      this.list = []
      getMould({ FNumber: this.form.cBarcode })
        .then(({ Data }) => {
          this.clearForm()
          if (Data != null) {
            const {
              FNumber,
              FName,
              FModel,
              FFactory,
              FBuyDate,
              FUseDept,
              FPerson,
              FEquStatus,
              FStockNo,
              FToolingNo,
              Entry
            } = Data

            this.form.FName = FName
            this.form.FModel = FModel
            this.form.FFactory = FFactory
            this.form.FBuyDate = FBuyDate
            this.form.FUseDept = FUseDept
            this.form.FPerson = FPerson
            this.form.FEquStatus = FEquStatus
            this.form.FStockNo = FStockNo
            this.form.FToolingNo = FToolingNo
            this.list = Entry
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
      window.localStorage.setItem('curEle', e)
    }
  },
  computed: {
    groups() {
      const groupIds = Array.from(new Set(this.list.map(f => f.FTerminalModel)))
      return groupIds.map(id => {
        const details = this.list.filter(f => {
          return f.FTerminalModel == id
        })
        return {
          FTerminalModel: id,
          FDetails: details
        }
      })
    }
  },
  created() {},
  mounted() {
    this.curEle = 'ele_cBarcode'
    this.setFocus()
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
