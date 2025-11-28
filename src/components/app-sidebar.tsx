import * as React from "react"
import { ChevronRight, Folder } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarRail,
} from "@/components/ui/sidebar"

export type SidebarFolder = {
  name: string
  path: string
  children?: SidebarFolder[]
}

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  folders: SidebarFolder[]
  currentPath: string
  onSelectPath: (path: string) => void
}

export function AppSidebar({ folders, currentPath, onSelectPath, ...props }: AppSidebarProps) {
  return (
    <Sidebar {...props}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Files</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {folders.map((folder) => (
                <Tree
                  key={folder.path}
                  item={folder}
                  currentPath={currentPath}
                  onSelectPath={onSelectPath}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

function Tree({
  item,
  currentPath,
  onSelectPath,
}: {
  item: SidebarFolder
  currentPath: string
  onSelectPath: (path: string) => void
}) {
  const hasChildren = !!item.children?.length

  if (!hasChildren) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={item.path === currentPath}
          className="data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-foreground"
          onClick={() => onSelectPath(item.path)}
        >
          <Folder />
          {item.name}
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  return (
    <SidebarMenuItem>
      <Collapsible
        className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
        defaultOpen={currentPath.startsWith(item.path)}
      >
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            isActive={item.path === currentPath}
            className="data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-foreground"
            onClick={() => onSelectPath(item.path)}
          >
            <ChevronRight className="transition-transform" />
            <Folder />
            {item.name}
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.children?.map((subItem) => (
              <Tree
                key={subItem.path}
                item={subItem}
                currentPath={currentPath}
                onSelectPath={onSelectPath}
              />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  )
}
