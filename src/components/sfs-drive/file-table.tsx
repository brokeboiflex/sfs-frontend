import { FileIcon, FolderIcon } from "lucide-react"

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDate, formatFileSize, type DriveItem } from "./types"

type FileTableProps = {
  items: DriveItem[]
  onFolderOpen?: (path: string) => void
}

export function FileTable({ items, onFolderOpen }: FileTableProps) {
  return (
    <Table>
      <TableCaption>Your latest files and folders</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Size</TableHead>
          <TableHead className="text-right">Modified</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow
            key={item.id}
            className={item.type === "folder" && onFolderOpen ? "cursor-pointer" : undefined}
            onClick={() => {
              if (item.type === "folder" && onFolderOpen) {
                onFolderOpen(item.path)
              }
            }}
          >
            <TableCell className="font-medium">
              <span className="flex items-center gap-2">
                {item.type === "folder" ? (
                  <FolderIcon className="text-muted-foreground size-4" />
                ) : (
                  <FileIcon className="text-muted-foreground size-4" />
                )}
                {item.name}
              </span>
            </TableCell>
            <TableCell className="capitalize text-muted-foreground">{item.type}</TableCell>
            <TableCell className="text-right tabular-nums">{formatFileSize(item.size)}</TableCell>
            <TableCell className="text-right text-muted-foreground">{formatDate(item.updatedAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
