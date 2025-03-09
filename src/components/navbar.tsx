"use client";

import { PanelRightOpen, Bell, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

export default function Navbar({ isMenuOpen, toggleMenu }: NavbarProps) {
  return (
    <header
      className={`bg-[#003366] text-white transition-all duration-300 fixed z-40 ${
        isMenuOpen ? "ml-64 w-[calc(100%-16rem)]" : "ml-0 w-full"
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="">
              <Button
                variant="ghost"
                size="icon"
                className="cursor-pointer"
                onClick={toggleMenu}
              >
                <PanelRightOpen className={`h-5 w-5 transition-colors`} />
              </Button>
            </div>
            <h1 className="text-xl font-bold hidden md:block">Campus Virtual</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-[#002347] rounded-full" title="Notificaciones">
              <Bell className="h-5 w-5" />
            </button>
            <button className="p-2 hover:bg-[#002347] rounded-full" title="Mensajes">
              <MessageSquare className="h-5 w-5" />
            </button>
            <Avatar className="h-8 w-8">
              <AvatarImage src="" />
              <AvatarFallback>UN</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}