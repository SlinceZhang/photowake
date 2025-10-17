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
        className={`cursor-pointer rounded-lg p-2 h-20 transition-colors ${
          isSelected
            ? 'bg-primary-soft ring-2 ring-primary/60'
            : 'hover:bg-primary-soft/70'
        }`}
        onClick={() => onSelect(type, src)}
      />
    </div>
  )
}
