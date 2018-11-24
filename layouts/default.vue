<template>
  <div class="app">
    <AppHeader fixed>
      <SidebarToggler 
        class="d-lg-none" 
        display="md" 
        mobile />
      <b-link 
        class="navbar-brand" 
        to="/">
        <img 
          class="navbar-brand-full" 
          src="@/static/img/logo.png" 
          width="89" 
          height="25" 
          alt="Asimilación Ing. Sistemas">
        <img 
          class="navbar-brand-minimized" 
          src="@/static/img/logo-symbol.png" 
          width="30" 
          height="30" 
          alt="Asimilación Ing. Sistemas">
      </b-link>
      <SidebarToggler 
        class="d-md-down-none" 
        display="lg" />
      <b-navbar-nav class="ml-auto">
        
        <DefaultHeaderDropdownAccnt/>
      </b-navbar-nav>
      
      <!--<AsideToggler class="d-lg-none" mobile />-->
    </AppHeader>
    <div class="app-body">
      <AppSidebar fixed>
        <SidebarHeader/>
        <SidebarForm/>
        <SidebarNav :navItems="nav"/>
        <SidebarFooter/>
        <SidebarMinimizer/>
      </AppSidebar>
      <main class="main">
        <Breadcrumb :list="list"/>
        <div class="container-fluid">
          <nuxt/>
        </div>
      </main>
      <AppAside fixed>
        <!--aside-->
        <DefaultAside/>
      </AppAside>
    </div>
    <TheFooter>
      <!--footer-->
      <div>
        <a href="https://github.com/williamsantc">William santos</a>
        <span class="ml-1">&copy; 2018.</span>
      </div>
      <div class="ml-auto">
        <span class="mr-1">Powered by</span>
        <a href="https://coreui.io">CoreUI for Vue</a>
      </div>
    </TheFooter>
  </div>
</template>

<script>
import nav from '@/_nav'
import { Header as AppHeader, SidebarToggler, Sidebar as AppSidebar, SidebarFooter, SidebarForm, SidebarHeader, SidebarMinimizer, SidebarNav, Aside as AppAside, AsideToggler, Footer as TheFooter, Breadcrumb } from '@coreui/vue'
import DefaultAside from '@/components/default/DefaultAside'
import DefaultHeaderDropdownAccnt from '@/components/default/DefaultHeaderDropdownAccnt'

export default {
  name: 'full',
  components: {
    AsideToggler,
    AppHeader,
    AppSidebar,
    AppAside,
    TheFooter,
    Breadcrumb,
    DefaultAside,
    DefaultHeaderDropdownAccnt,
    SidebarForm,
    SidebarFooter,
    SidebarToggler,
    SidebarHeader,
    SidebarNav,
    SidebarMinimizer
  },
  data () {
    return {
      nav: nav.items
    }
  },
  computed: {
    name () {
      return this.$route.name
    },
    list () {
      return this.$route.matched.filter(route => route.name || route.meta.label )
    }
  }
}
</script>
