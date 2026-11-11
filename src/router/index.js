import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Admin from '@/components/Admin'
import Admin2 from '@/components/Admin2'
import New from '@/components/New'
import New2 from '@/components/New2'
import New3 from '@/components/New3'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/new',
      name: 'new',
      component: New
    },
    {
      path: '/admin',
      name: 'Admin',
      component: Admin
    },
    {
      path: '/new2',
      name: 'new2',
      component: New2
    },
    {
      path: '/new3',
      name: 'new3',
      component: New3
    },
    {
      path: '/admin2',
      name: 'Admin2',
      component: Admin2
    }
  ]
})
