'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'
import Image from "next/image";

export default function ActividadesProximas() {
  return (
    <div className='w-1/5 bg-blue-200 p-6'>
        <div className="flex flex-col">
            {[1, 2, 3, 4].map((course) => (
              <Card key={course}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    <Image
                      src="https://campusvirtual.unah.edu.hn/pluginfile.php/1/core_admin/logo/0x200/1738566175/thumbnail_logo-02.png"
                      alt="UNAH Logo"
                      width={140}
                      height={140}
                      className="mx-auto"
                    />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">Período: 2025-1</p>
                  <p className="text-sm text-gray-500">
                    Docente: Nombre del Docente
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
    </div>
  )
}
