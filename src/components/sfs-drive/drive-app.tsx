import { useMemo, useRef, useState } from "react"
import { HardDrive, Settings2 } from "lucide-react"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { CreateFolderDialog } from "./create-folder-dialog"
import { DriveToolbar, type DriveViewMode } from "./drive-toolbar"
import { FileGrid } from "./file-grid"
import { FileTable } from "./file-table"
import { formatFileSize, type DriveItem } from "./types"

const initialItems: DriveItem[] = [
  {
    id: "1",
    name: "Project Proposal.pdf",
    type: "file",
    size: 340_000,
    owner: "You",
    updatedAt: "2024-11-18T09:00:00Z",
  },
  {
    id: "2",
    name: "Design assets",
    type: "folder",
    size: 0,
    owner: "Design",
    updatedAt: "2024-10-05T12:00:00Z",
  },
  {
    id: "3",
    name: "Financials.xlsx",
    type: "file",
    size: 2_048_000,
    owner: "Finance",
    updatedAt: "2024-12-01T14:00:00Z",
  },
  {
    id: "4",
    name: "Team photos",
    type: "folder",
    size: 0,
    owner: "Marketing",
    updatedAt: "2024-11-02T08:00:00Z",
  },
  {
    id: "5",
    name: "Roadmap.miro",
    type: "file",
    size: 4_800_000,
    owner: "Product",
    updatedAt: "2024-12-11T10:30:00Z",
  },
]

export function DriveApp() {
  const [items, setItems] = useState<DriveItem[]>(initialItems)
  const [viewMode, setViewMode] = useState<DriveViewMode>("list")
  const [folderDialogOpen, setFolderDialogOpen] = useState(false)
  const [folderName, setFolderName] = useState("")
  const [search, setSearch] = useState("")
  const uploadInputRef = useRef<HTMLInputElement>(null)

  const visibleItems = useMemo(() => {
    const value = search.toLowerCase().trim()
    if (!value) return items
    return items.filter((item) => item.name.toLowerCase().includes(value))
  }, [items, search])

  const handleUploadFiles = (files: FileList | null) => {
    if (!files?.length) return

    const nextItems = Array.from(files).map<DriveItem>((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      type: "file",
      size: file.size,
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

  return (
    <SidebarProvider>
      <div className="bg-muted/40 text-foreground">
        <div className="flex min-h-screen">
          <AppSidebar />
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

            <main className="px-6 py-6">
              <div className="rounded-2xl border bg-card px-6 py-5 shadow-sm">
                <DriveToolbar
                  viewMode={viewMode}
                  onViewChange={setViewMode}
                  onUploadClick={() => uploadInputRef.current?.click()}
                  onCreateFolderClick={() => setFolderDialogOpen(true)}
                  search={search}
                  onSearchChange={setSearch}
                  totalItems={items.length}
                  storageUsed={formatFileSize(totalBytes)}
                />

                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Showing {visibleItems.length} items</span>
                    <span className="font-medium text-foreground">{viewMode === "list" ? "List" : "Grid"} view</span>
                  </div>
                  {viewMode === "list" ? (
                    <div className="overflow-hidden rounded-xl border bg-background">
                      <FileTable items={visibleItems} />
                    </div>
                  ) : (
                    <FileGrid items={visibleItems} />
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
