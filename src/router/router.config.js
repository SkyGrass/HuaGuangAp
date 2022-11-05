import Home from '@/views/home'
import In from '@/views/in'
import Out from '@/views/out'
import Pin from '@/views/pin'
import So from '@/views/so'
import Stock from '@/views/stock'
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
    path: '/in',
    name: 'in',
    component: In,
    meta: {
      title: '采购进货',
      redblue: true,
      keepAlive: false
    }
  },
  {
    path: '/in_form',
    name: 'in_form',
    component: () => import('@/views/in/form'),
    meta: {
      title: '采购进货',
      keepAlive: false
    }
  },
  {
    path: '/out',
    name: 'out',
    component: Out,
    meta: {
      title: '材料出库',
      redblue: true,
      keepAlive: false
    }
  },
  {
    path: '/out_form',
    name: 'out_form',
    component: () => import('@/views/out/form'),
    meta: {
      title: '材料出库',
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
    path: '/stock',
    name: 'stock',
    component: Stock,
    meta: {
      title: '库存查询',
      redblue: false,
      keepAlive: false
    }
  }
]

export const constantRouterMap = routerMap.concat(dynamicRouterMap)
