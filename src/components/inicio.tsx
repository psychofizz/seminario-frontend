"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { LogIn } from "lucide-react";

export default function Inicio() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white bg-opacity-90 shadow-md">
        <div className="container mx-auto flex justify-between items-center p-4">
          <div className="text-lg font-bold">Campus Virtual</div>
          <Link href="/login">
            <button className="bg-sky-800 text-white px-4 py-2 rounded hover:bg-sky-900 transition duration-300 cursor-pointer">
              <div className="flex flex-row">
                <div className="px-3">
                Acceder
                </div>
                <LogIn />
              </div>
            </button>
          </Link>
        </div>
      </nav>

      <div className="min-h-max justify-center items-center bg-cover bg-gray-900 bg-opacity-50 p-10 bg-center bg-[url('https://campusvirtual.unah.edu.hn/pluginfile.php/1/theme_space/heroimg/1738566175/frontpage-bg.jpg')]">
        <div className="text-center">
          <div className="">
            <Image
              src="https://campusvirtual.unah.edu.hn/pluginfile.php/1/core_admin/logo/0x200/1738566175/thumbnail_logo-02.png"
              alt="UNAH Logo"
              width={190}
              height={190}
              className="mx-auto text-white bg-white p-6 border border-r-2 rounded-sm"
            />
          </div>
          <div className="pt-10">
            <div>
              <h5 className="text-white font-medium text-lg">
                Universidad Nacional Autónoma de Honduras
              </h5>
            </div>
            <div className="pt-4">
              <h1 className="text-white font-simibold text-5xl ">
                Bienvenido(a) al Campus Virtual
              </h1>
            </div>
          </div>

          <div className="pt-16 flex justify-center flex-col">
          <Link href="/login">
          <div>
              <Button className="w-80 h-16" variant="yellow">
                <p className="font-medium text-lg">ACCEDER AL CAMPUS VIRTUAL</p>
                <LogIn />
              </Button>
            </div>
          </Link>  
            <div className="pt-4">
              <Button className="my-2 mr-2 ml-2 hover:bg-amber-50 cursor-pointer" variant="outline">
                <p className="text-sm font-medium">ACCEDER CAMPUS HISTÓRICO</p>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
