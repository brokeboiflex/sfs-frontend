import { useMemo, useRef, useState } from "react"
import { HardDrive, Settings2 } from "lucide-react"

import { AppSidebar, type SidebarFolder } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { CreateFolderDialog } from "./create-folder-dialog"
import { DriveToolbar, type DriveViewMode } from "./drive-toolbar"
import { FileGrid } from "./file-grid"
import { FileTable } from "./file-table"
import { formatFileSize, type DriveItem } from "./types"

const initialItems: DriveItem[] = [
  {
    id: "1",
    name: "Documents",
    type: "folder",
    size: 0,
    owner: "You",
    path: "/Documents",
    updatedAt: "2024-11-15T09:00:00Z",
  },
  {
    id: "2",
    name: "Design assets",
    type: "folder",
    size: 0,
    owner: "Design",
    path: "/Design assets",
    updatedAt: "2024-10-05T12:00:00Z",
  },
  {
    id: "3",
    name: "Financials.xlsx",
    type: "file",
    size: 2_048_000,
    owner: "Finance",
    extension: "xlsx",
    path: "/Documents/Financials.xlsx",
    updatedAt: "2024-12-01T14:00:00Z",
  },
  {
    id: "4",
    name: "Team photos",
    type: "folder",
    size: 0,
    owner: "Marketing",
    path: "/Marketing/Team photos",
    updatedAt: "2024-11-02T08:00:00Z",
  },
  {
    id: "5",
    name: "Roadmap.miro",
    type: "file",
    size: 4_800_000,
    owner: "Product",
    extension: "miro",
    path: "/Documents/Roadmap.miro",
    updatedAt: "2024-12-11T10:30:00Z",
  },
  {
    id: "6",
    name: "Marketing",
    type: "folder",
    size: 0,
    owner: "Marketing",
    path: "/Marketing",
    updatedAt: "2024-11-01T08:00:00Z",
  },
  {
    id: "7",
    name: "Brand guidelines.pdf",
    type: "file",
    size: 780_000,
    owner: "Design",
    extension: "pdf",
    path: "/Design assets/Brand guidelines.pdf",
    updatedAt: "2024-10-12T10:00:00Z",
  },
  {
    id: "8",
    name: "Logo concepts",
    type: "folder",
    size: 0,
    owner: "Design",
    path: "/Design assets/Logo concepts",
    updatedAt: "2024-11-01T10:00:00Z",
  },
  {
    id: "9",
    name: "Logo-final.svg",
    type: "file",
    size: 540_000,
    owner: "Design",
    extension: "svg",
    path: "/Design assets/Logo concepts/Logo-final.svg",
    updatedAt: "2024-11-15T12:30:00Z",
  },
  {
    id: "10",
    name: "Q4-offsite.png",
    type: "file",
    size: 1_200_000,
    owner: "Marketing",
    extension: "png",
    path: "/Marketing/Team photos/Q4-offsite.png",
    updatedAt: "2024-11-02T09:00:00Z",
  },
]

export function DriveApp() {
  const [items, setItems] = useState<DriveItem[]>(initialItems)
  const [viewMode, setViewMode] = useState<DriveViewMode>("list")
  const [folderDialogOpen, setFolderDialogOpen] = useState(false)
  const [folderName, setFolderName] = useState("")
  const [currentPath, setCurrentPath] = useState("/")
  const [search, setSearch] = useState("")
  const uploadInputRef = useRef<HTMLInputElement>(null)

  const filteredItems = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim()
    return items
      .filter((item) => getParentPath(item.path) === currentPath)
      .filter((item) =>
        normalizedSearch ? item.name.toLowerCase().includes(normalizedSearch) : true
      )
  }, [currentPath, items, search])

  const folderTree = useMemo<SidebarFolder[]>(() => buildFolderTree(items), [items])

  const handleUploadFiles = (files: FileList | null) => {
    if (!files?.length) return

    const nextItems = Array.from(files).map<DriveItem>((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      type: "file",
      size: file.size,
      path:
        currentPath === "/"
          ? `/${file.name}`
          : `${currentPath.replace(/\/$/, "")}/${file.name}`,
      extension: file.name.split(".").pop() || "",
      updatedAt: new Date().toISOString(),
      owner: "You",
    }))

    setItems((current) => [...nextItems, ...current])
  }

  const handleCreateFolder = () => {
    if (!folderName.trim()) return

    const newFolder: DriveItem = {
      id: crypto.randomUUID(),
      name: folderName.trim(),
      type: "folder",
      size: 0,
      path:
        currentPath === "/"
          ? `/${folderName.trim()}`
          : `${currentPath.replace(/\/$/, "")}/${folderName.trim()}`,
      updatedAt: new Date().toISOString(),
      owner: "You",
    }

    setItems((current) => [newFolder, ...current])
    setFolderName("")
    setFolderDialogOpen(false)
  }

  const totalBytes = useMemo(
    () => items.reduce((total, item) => total + item.size, 0),
    [items]
  )

  const handleFolderSelect = (path: string) => {
    setCurrentPath(path)
    setSearch("")
  }

  return (
    <SidebarProvider>
      <div className="bg-muted/40 text-foreground min-h-screen">
        <div className="flex min-h-screen">
          <AppSidebar
            folders={folderTree}
            currentPath={currentPath}
            onSelectPath={handleFolderSelect}
          />
          <SidebarInset className="bg-background">
            <header className="border-b bg-background/80 backdrop-blur">
              <div className="flex items-center gap-4 px-6 py-4">
                <SidebarTrigger className="md:hidden" />
                <div className="flex items-center gap-3 rounded-full bg-primary/5 px-3 py-2 text-primary">
                  <HardDrive className="size-4" />
                  <span className="text-sm font-semibold">Smart Drive</span>
                </div>
                <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
                  <Settings2 className="size-4" />
                  <span>Sync enabled</span>
                </div>
              </div>
            </header>

            <main className="w-full px-4 py-6 sm:px-6 lg:px-10">
              <div className="rounded-2xl border bg-card px-6 py-5 shadow-sm lg:px-8">
                <DriveToolbar
                  viewMode={viewMode}
                  onViewChange={setViewMode}
                  onUploadClick={() => uploadInputRef.current?.click()}
                  onCreateFolderClick={() => setFolderDialogOpen(true)}
                  search={search}
                  onSearchChange={setSearch}
                  totalItems={filteredItems.length}
                  storageUsed={formatFileSize(totalBytes)}
                />

                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Showing {filteredItems.length} items</span>
                    <span className="font-medium text-foreground">{viewMode === "list" ? "List" : "Grid"} view</span>
                  </div>
                  {viewMode === "list" ? (
                    <div className="overflow-hidden rounded-xl border bg-background">
                      <FileTable items={filteredItems} onFolderOpen={handleFolderSelect} />
                    </div>
                  ) : (
                    <FileGrid items={filteredItems} onFolderOpen={handleFolderSelect} />
                  )}
                </div>
              </div>
            </main>
          </SidebarInset>
        </div>
      </div>

      <input
        ref={uploadInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(event) => {
          handleUploadFiles(event.target.files)
          event.target.value = ""
        }}
      />

      <CreateFolderDialog
        open={folderDialogOpen}
        onOpenChange={setFolderDialogOpen}
        name={folderName}
        onNameChange={setFolderName}
        onSubmit={handleCreateFolder}
      />
    </SidebarProvider>
  )
}

type FolderAccumulator = {
  name: string
  path: string
  children: FolderAccumulator[]
}

function normalizePath(path: string) {
  if (!path) return "/"
  const trimmed = path.trim().replace(/\/+$/, "")
  const prefixed = trimmed.startsWith("/") ? trimmed : `/${trimmed}`
  return prefixed === "" ? "/" : prefixed
}

function getParentPath(path: string) {
  const normalized = normalizePath(path)
  const segments = normalized.split("/").filter(Boolean)
  if (segments.length === 0) return "/"
  segments.pop()
  return segments.length ? `/${segments.join("/")}` : "/"
}

function buildFolderTree(items: DriveItem[]): SidebarFolder[] {
  const folders = items.filter((item) => item.type === "folder")
  const nodes = new Map<string, FolderAccumulator>()

  nodes.set("/", { name: "All files", path: "/", children: [] })

  folders.forEach((folder) => {
    const normalizedPath = normalizePath(folder.path)
    nodes.set(normalizedPath, {
      name: folder.name,
      path: normalizedPath,
      children: [],
    })
  })

  nodes.forEach((node, path) => {
    if (path === "/") return
    const parentPath = getParentPath(path)
    if (!nodes.has(parentPath)) {
      nodes.set(parentPath, {
        name: parentPath.split("/").filter(Boolean).pop() || "All files",
        path: parentPath,
        children: [],
      })
    }
    nodes.get(parentPath)?.children.push(node)
  })

  const sortChildren = (node: FolderAccumulator): SidebarFolder => ({
    name: node.name,
    path: node.path,
    children: node.children
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((child) => sortChildren(child)),
  })

  const root = nodes.get("/") || { name: "All files", path: "/", children: [] }

  return [sortChildren(root)]
}
