import Image from 'next/image'

interface WidgetSelectorProps {
  src: string
  alt: string
  type: string
  selectedPath?: string
  onSelect: (type: string, path: string) => void
  onClear: (type: string) => void
}

export default function WidgetSelector({
  src,
  alt,
  type,
  selectedPath,
  onSelect,
}: WidgetSelectorProps) {
  const isSelected = selectedPath === src

  return (
    <div className='relative group'>
      <Image
        src={src}
        alt={alt}
        width={100}
        height={100}
        className={`h-20 cursor-pointer rounded-lg bg-surface p-2 transition-colors ${
          isSelected
            ? 'ring-2 ring-primary'
            : 'hover:bg-surface-muted'
        }`}
        onClick={() => onSelect(type, src)}
      />
    </div>
  )
}
