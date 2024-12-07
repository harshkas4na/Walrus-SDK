'use client'

import { Bot, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

export function MainNav() {
  return (
    <Sidebar>
      <SidebarHeader className="border-b border-gray-800 p-4">
        <h2 className="text-lg font-semibold text-blue-400">Hello Human</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Bot className="mr-2 h-4 w-4" />
              <span>Agents</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <div className="absolute bottom-4 left-4 right-4">
        <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Plus className="mr-2 h-4 w-4" /> Create Agent
        </Button>
      </div>
    </Sidebar>
  )
}

