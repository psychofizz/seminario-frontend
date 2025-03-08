'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

export default function ActividadesProximas() {
  return (
    <div className='w-1/5 bg-blue-200 p-6'>
        <div className="flex flex-col justify-center gap-4">
            {[1, 2, 3, 4].map((course) => (
              <Card key={course}>
                <CardHeader>
                  <CardTitle className="text-lg">
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">Período: 2025-1</p>
                </CardContent>
              </Card>
            ))}
          </div>
    </div>
  )
}
