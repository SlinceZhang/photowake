import WidgetSelector from './widget-selector'
import { Button } from '@/app/components/ui/button'
import { WIDGET_PATHS, STYLE_OPTIONS, ACCESSORIES_OPTIONS } from '@/app/constants/avatar-config'
import { SelectedWidgets } from '@/app/types/avatar'

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
        <div className='grid grid-cols-2 gap-4 sm:grid-cols-3'>
          {STYLE_OPTIONS.map((style) => (
            <Button
              key={style}
              type='button'
              intent='tint'
              size='sm'
              className='w-full justify-center'
            >
              {style}
            </Button>
          ))}
        </div>
      </div>
    )
  }

  if (activeTab === 'Accessories') {
    return (
      <div className='space-y-6'>
        <div className='space-y-2'>
          <label className='text-sm text-gray-600 dark:text-gray-400'>
            Glasses
          </label>
          <div className='grid grid-cols-2 gap-2'>
            {ACCESSORIES_OPTIONS.glasses.map((type) => (
              <Button
                key={type}
                type='button'
                intent='tint'
                size='sm'
                className='w-full justify-center'
              >
                {type}
              </Button>
            ))}
          </div>
        </div>
        <div className='space-y-2'>
          <label className='text-sm text-gray-600 dark:text-gray-400'>
            Other
          </label>
          <div className='grid grid-cols-2 gap-2'>
            {ACCESSORIES_OPTIONS.other.map((item) => (
              <Button
                key={item}
                type='button'
                intent='tint'
                size='sm'
                className='w-full justify-center'
              >
                {item}
              </Button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Handle widget tabs (Face, Eyes, Eyebrows, etc.)
  const widgetPaths = WIDGET_PATHS[activeTab.toLowerCase() as keyof typeof WIDGET_PATHS]
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