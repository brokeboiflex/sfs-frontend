import { UploadIcon, FolderPlus, ListOrdered, LayoutGrid } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export type DriveViewMode = "list" | "grid"

type DriveToolbarProps = {
  viewMode: DriveViewMode
  onViewChange: (mode: DriveViewMode) => void
  onUploadClick: () => void
  onCreateFolderClick: () => void
  search: string
  onSearchChange: (value: string) => void
  totalItems: number
  storageUsed: string
}

export function DriveToolbar({
  viewMode,
  onViewChange,
  onUploadClick,
  onCreateFolderClick,
  search,
  onSearchChange,
  totalItems,
  storageUsed,
}: DriveToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex flex-1 flex-col gap-1">
        <h1 className="text-2xl font-semibold">My Drive</h1>
        <p className="text-muted-foreground text-sm">
          {totalItems} items · {storageUsed} used
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 rounded-full bg-muted p-1">
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon"
            className="rounded-full"
            onClick={() => onViewChange("list")}
          >
            <ListOrdered className="size-4" />
            <span className="sr-only">List view</span>
          </Button>
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            className="rounded-full"
            onClick={() => onViewChange("grid")}
          >
            <LayoutGrid className="size-4" />
            <span className="sr-only">Grid view</span>
          </Button>
        </div>
        <Button variant="outline" className="gap-2" onClick={onCreateFolderClick}>
          <FolderPlus className="size-4" />
          New Folder
        </Button>
        <Button className="gap-2" onClick={onUploadClick}>
          <UploadIcon className="size-4" />
          Upload
        </Button>
      </div>
      <div className="basis-full sm:basis-auto sm:flex-1">
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search files"
          className="w-full"
        />
      </div>
    </div>
  )
}
