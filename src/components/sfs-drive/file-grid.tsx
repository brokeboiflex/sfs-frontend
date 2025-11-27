import { FileIcon, FolderIcon, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate, formatFileSize, type DriveItem } from "./types"

type FileGridProps = {
  items: DriveItem[]
}

export function FileGrid({ items }: FileGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <Card key={item.id} className="hover:border-primary/60 transition">
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div className="flex items-center gap-2">
              {item.type === "folder" ? (
                <FolderIcon className="text-primary size-5" />
              ) : (
                <FileIcon className="text-primary size-5" />
              )}
              <div>
                <CardTitle className="line-clamp-1 text-base">{item.name}</CardTitle>
                <CardDescription className="capitalize">{item.type}</CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="text-muted-foreground size-8">
              <MoreHorizontal className="size-4" />
              <span className="sr-only">Open actions</span>
            </Button>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Owner</span>
              <span className="font-medium text-foreground">{item.owner}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Size</span>
              <span className="font-medium text-foreground">{formatFileSize(item.size)}</span>
            </div>
          </CardContent>
          <CardFooter className="justify-between text-xs text-muted-foreground">
            <span>Updated</span>
            <span className="font-medium text-foreground">{formatDate(item.updatedAt)}</span>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
