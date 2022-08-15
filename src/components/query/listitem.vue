<template>
  <ul style="padding: 5px; font-size: 14px" class="van-hairline--bottom">
    <li style="padding: 2px">{{ source.date }}</li>
    <li style="padding: 2px">单号：{{ source.billNo }}</li>
    <li style="padding: 2px">供应商：{{ source.supplierCode }}||{{ source.supplierName }}</li>
  </ul>
</template>
<script>
export default {
  name: `listitem`,
  props: {
    source: {
      type: Object
    }
  }
}
</script>
<style lang=""></style>
