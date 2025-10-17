import { Button } from '@/app/components/ui/button'
import { Card } from '@/app/components/ui/card'
import { cn } from '@/app/utils/cn'
import { useLanguageStore } from '@/app/store/useLanguageStore'
import { useRouter, usePathname } from 'next/navigation'

// 定义支持的语言列表
const SUPPORTED_LANGUAGES = ['en', 'zh'] as const
type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

export default function Dropdown({ currentLang }: { currentLang: string }) {
  const setCurrentLang = useLanguageStore((state) => state.setCurrentLang)
  const router = useRouter()
  const pathname = usePathname()

  // 验证当前语言是否支持，如果不支持则使用 'en'
  const validLang = SUPPORTED_LANGUAGES.includes(
    currentLang as SupportedLanguage
  )
    ? currentLang
    : 'en'

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setCurrentLang(lang)
    // 获取当前路径并替换语言部分
    const newPathname = pathname.replace(/^\/[^\/]+/, `/${lang}`)
    router.push(newPathname)
  }

  return (
    <Card
      intent='surface'
      size='sm'
      className='absolute left-0 mt-2 flex w-28 flex-col gap-2 p-2 text-sm shadow-lg'
    >
      <ul role='listbox' aria-label='Select language' className='grid gap-1'>
        <li>
          <Button
            type='button'
            role='option'
            aria-selected={validLang === 'zh'}
            intent='ghost'
            size='sm'
            className={cn(
              'w-full justify-between px-2',
              validLang === 'zh'
                ? 'bg-purple-50 font-semibold text-purple-600 dark:bg-purple-900/40 dark:text-purple-200'
                : undefined
            )}
            onClick={() => handleLanguageChange('zh')}
          >
            <span>zh</span>
            {validLang === 'zh' && <span>✓</span>}
          </Button>
        </li>
        <li>
          <Button
            type='button'
            role='option'
            aria-selected={validLang === 'en'}
            intent='ghost'
            size='sm'
            className={cn(
              'w-full justify-between px-2',
              validLang === 'en'
                ? 'bg-purple-50 font-semibold text-purple-600 dark:bg-purple-900/40 dark:text-purple-200'
                : undefined
            )}
            onClick={() => handleLanguageChange('en')}
          >
            <span>en</span>
            {validLang === 'en' && <span>✓</span>}
          </Button>
        </li>
      </ul>
    </Card>
  )
}
