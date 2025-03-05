"use client";

// import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Lock, User } from "lucide-react";
import Image from 'next/image';

export default function LoginPage() {

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-row">
      <div className="hidden md:flex w-1/2 bg-slate-200">
            <Image
            src="https://campusvirtual.unah.edu.hn/pluginfile.php/1/theme_space/loginbg/1738566175/login_bg.jpg"
            alt="UNAH Logo"
            width={2000}
            height={2000}
            className="mx-auto"
          />         
      </div>

      <div className="md:w-1/2 w-full pt-12 flex justify-center items-center relative">
        <div className="w-full max-w-[400px] space-y-6">
          {/* Logo y nav */}
          <div className="text-center space-y-2">
            <Image
            src="https://campusvirtual.unah.edu.hn/pluginfile.php/1/core_admin/logo/0x200/1738566175/thumbnail_logo-02.png"
            alt="UNAH Logo"
            width={140}
            height={140}
            className="mx-auto"
          />
          </div>

          {/* Formulario*/}
          <Card className="p-6 shadow-lg">
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="account" className="text-sm font-medium">
                  Nombre de usuario
                </Label>
                <div className="relative">
                  <Input
                    id="account"
                    type="text"
                    className="pl-10"
                    placeholder="Ingrese su cuenta"
                    required
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    className="pl-10"
                    placeholder="Ingrese su contraseña"
                    required
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#003366] hover:bg-[#002347]"
              >
                Acceder
              </Button>
            </form>

            <div className="mt-4 text-center">
              <a href="#" className="text-sm text-blue-600 hover:underline">
                ¿Olvidó su nombre de usuario o contraseña?
              </a>
            </div>
          </Card>

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Para acceder al campus virtual utilice su cuenta institucional
            </p>
            <a href="#" className="text-sm text-blue-600 hover:underline block">
              ¿Necesita ayuda?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
