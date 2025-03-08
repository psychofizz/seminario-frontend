import React from 'react'
import SidebarCurso from './components/sidebar-curso'
import MenuCurso from './components/menu-curso'
import ActividadesProximas from './components/activ-prox'

export default function PageDetalleCurso() {
  return (
    <div className='min-h-screen w-full flex flex-row p-4'>
        <SidebarCurso/>
        <MenuCurso/>
        <ActividadesProximas/>
    </div>
  )
}
