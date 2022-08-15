import Home from '@/views/home'
import In from '@/views/in'
import Pin from '@/views/pin'
import So from '@/views/so'
import Trans from '@/views/trans'
import Stock from '@/views/stock'
import Mould from '@/views/mould'
/**
 * 基础路由
 * @type { *[] }
 */
const routerMap = [
  {
    path: '/',
    component: Home,
    redirect: '/home',
    meta: { title: '主页', keepAlive: false }
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { title: '主页', keepAlive: false }
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  }
]

const dynamicRouterMap = [
  {
    path: '/pap',
    name: 'pap',
    component: () => import('@/views/pap'),
    meta: {
      title: '入库标签打印',
      keepAlive: false,
      scrollTop: 0
    }
  },
  {
    path: '/pap_form',
    name: 'pap_form',
    component: () => import('@/views/pap/form'),
    meta: {
      title: '入库标签打印',
      keepAlive: false
    }
  },
  {
    path: '/in',
    name: 'in',
    component: In,
    meta: {
      title: '采购入库',
      redblue: true,
      keepAlive: false
    }
  },
  {
    path: '/in_form',
    name: 'in_form',
    component: () => import('@/views/in/form'),
    meta: {
      title: '采购入库',
      keepAlive: false
    }
  },
  {
    path: '/pin',
    name: 'pin',
    component: Pin,
    meta: {
      title: '产成品入库',
      redblue: true,
      keepAlive: false
    }
  },
  {
    path: '/pin_form',
    name: 'pin_form',
    component: () => import('@/views/pin/form'),
    meta: {
      title: '产成品入库',
      redblue: true,
      keepAlive: false
    }
  },
  {
    path: '/so',
    name: 'so',
    component: So,
    meta: {
      title: '销售出库',
      redblue: true,
      keepAlive: false
    }
  },
  {
    path: '/so_form',
    name: 'so_form',
    component: () => import('@/views/so/form'),
    meta: {
      title: '销售出库',
      redblue: false,
      keepAlive: false
    }
  },
  {
    path: '/trans',
    name: 'trans',
    component: Trans,
    meta: {
      title: '仓库调拨[参照申请]',
      redblue: false,
      keepAlive: false
    }
  },
  {
    path: '/trans_form',
    name: 'trans_form',
    component: () => import('@/views/trans/form'),
    meta: {
      title: '仓库调拨[参照申请]',
      redblue: false,
      keepAlive: false
    }
  },
  {
    path: '/trans_n',
    name: 'tran_n',
    component: () => import('@/views/trans/form_n'),
    meta: {
      title: '仓库调拨',
      redblue: false,
      keepAlive: false
    }
  },
  {
    path: '/box_form',
    name: 'box_form',
    component: () => import('@/views/box/form'),
    meta: {
      title: '拆箱',
      redblue: false,
      keepAlive: false
    }
  },
  {
    path: '/stock',
    name: 'stock',
    component: Stock,
    meta: {
      title: '库存查询',
      redblue: false,
      keepAlive: false
    }
  },
  {
    path: '/mould',
    name: 'mould',
    component: Mould,
    meta: {
      title: '模具查询',
      redblue: false,
      keepAlive: false
    }
  }
]

export const constantRouterMap = routerMap.concat(dynamicRouterMap)
