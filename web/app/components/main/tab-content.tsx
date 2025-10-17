import WidgetSelector from './widget-selector'
import {
  WIDGET_PATHS,
  STYLE_OPTIONS,
  ACCESSORIES_OPTIONS,
} from '@/app/constants/avatar-config'
import type { SelectedWidgets } from '@/app/types/avatar'

interface TabContentProps {
  activeTab: string
  selectedWidgets: SelectedWidgets
  onWidgetSelect: (type: string, path: string) => void
  onWidgetClear: (type: string) => void
}

export default function TabContent({
  activeTab,
  selectedWidgets,
  onWidgetSelect,
  onWidgetClear,
}: TabContentProps) {
  if (activeTab === 'Style') {
    return (
      <div className='space-y-6'>
        <div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
          {STYLE_OPTIONS.map((style) => (
            <button
              key={style}
              type='button'
              className='px-4 py-2 rounded-lg bg-primary-soft text-primary transition-colors hover:bg-primary/20'
            >
              {style}
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (activeTab === 'Accessories') {
    return (
      <div className='space-y-6'>
        <div className='space-y-2'>
          <label className='text-sm text-muted'>Glasses</label>
          <div className='grid grid-cols-2 gap-2'>
            {ACCESSORIES_OPTIONS.glasses.map((type) => (
              <button
                key={type}
                type='button'
                className='px-3 py-2 text-sm rounded-lg bg-primary-soft text-primary transition-colors hover:bg-primary/20'
              >
                {type}
              </button>
            ))}
          </div>
        </div>
        <div className='space-y-2'>
          <label className='text-sm text-muted'>Other</label>
          <div className='grid grid-cols-2 gap-2'>
            {ACCESSORIES_OPTIONS.other.map((item) => (
              <button
                key={item}
                type='button'
                className='px-3 py-2 text-sm rounded-lg bg-primary-soft text-primary transition-colors hover:bg-primary/20'
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const widgetPaths =
    WIDGET_PATHS[activeTab.toLowerCase() as keyof typeof WIDGET_PATHS]
  if (!widgetPaths) return null

  const paths = Array.isArray(widgetPaths) ? widgetPaths : [widgetPaths]

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
        {paths.map((path) => (
          <WidgetSelector
            key={path}
            src={path}
            alt={activeTab}
            type={activeTab.toLowerCase()}
            selectedPath={selectedWidgets[activeTab.toLowerCase()]}
            onSelect={onWidgetSelect}
            onClear={onWidgetClear}
          />
        ))}
      </div>
    </div>
  )
}
