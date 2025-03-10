import React from 'react'
import { Tabs, TabsList, TabsTrigger } from './ui/tabs'
import Link from 'next/link'

export default function Navegacion() {
  return (
    <div>
        <div className="md:col-span-9">
            <Tabs defaultValue="cursos" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="inicio" className="flex items-center">
                  <Link className="hover:underline" href="/perfil">Area Personal</Link>
                </TabsTrigger>
                <TabsTrigger value="MisCursos" className="flex items-center">
                  Mis Cursos
                </TabsTrigger>
                <TabsTrigger value="curso" className="flex items-center">
                  <Link className="hover:underline" href="/cursos">Curso</Link>
                </TabsTrigger>
                <TabsTrigger value="unidad1" className="flex items-center">
                  <Link className="hover:underline" href="/unidad1">Unidad 1</Link>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
    </div>
  )
}
