export type SfsFile = {
  id: string
  name: string
  extension: string
  hash: string
  size: number
  type: "file"
  last_modified: number
  path: string
  [key: string]: any
}

export type SfsFolder = {
  path: string
  last_modified: number
}

export type DriveItem = {
  id: string
  name: string
  type: "file" | "folder"
  size: number
  updatedAt: string | number
  owner: string
  path: string
  extension?: string
}

export function formatFileSize(bytes: number) {
  if (!bytes) return "-"
  const units = ["B", "KB", "MB", "GB", "TB"]
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const size = bytes / Math.pow(1024, exponent)
  return `${size.toFixed(size >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`
}

export function formatDate(date: string | number) {
  const formatter = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return formatter.format(new Date(date))
}
