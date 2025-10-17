export interface AvatarWidgets {
  face: string
  eyes: string
  eyebrows: string
  nose: string
  mouth: string
  ears: string
  hair: string
}

export interface AvatarEntity {
  id: string
  displayName: string
  style: string
  accentColor: string
  previewUrl: string
  description: string
  createdAt: string
  widgets: AvatarWidgets
}
