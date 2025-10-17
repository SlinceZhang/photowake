'use client'

import dynamic from 'next/dynamic'
import { useLocale, useTranslations } from 'next-intl'
import { useRef, useState } from 'react'
import {
  DEFAULT_AVATAR,
  HAIR_COLORS,
  WIDGET_PATHS,
  WIDGET_STYLES,
} from '@/app/constants/avatar-config'
import type { SelectedWidgets } from '@/app/types/avatar'

type JSConfettiInstance = import('js-confetti').default

const TabContent = dynamic(() => import('./tab-content'), {
  ssr: false,
  loading: () => <TabContentFallback />,
})

const ReviewCard = dynamic(() => import('./review-card'), {
  ssr: false,
  loading: () => <ReviewGridSkeleton />,
})

const TABS = [
  'Style',
  'Face',
  'Eyes',
  'Eyebrows',
  'Nose',
  'Mouth',
  'Ears',
  'Hair',
  'Accessories',
] as const

const TERMS_SECTIONS = [
  {
    titleKey: 'Privacy & Security',
    items: [
      'Your data is encrypted and securely stored',
      'We never share your personal information with third parties',
      'You maintain full ownership of your created avatars',
    ],
  },
  {
    titleKey: 'Usage Rights',
    items: [
      'Commercial use allowed with Pro and Enterprise plans',
      'Attribution not required for personal use',
      'Unlimited modifications to your generated avatars',
    ],
  },
  {
    titleKey: 'Service Limitations',
    items: [
      'Fair usage policy applies to all plans',
      'Generation limits based on subscription tier',
      'Service availability subject to maintenance windows',
    ],
  },
  {
    titleKey: 'Account Terms',
    items: [
      'One account per user required',
      'Account sharing is not permitted',
      'Age restriction: 18 years or older',
    ],
  },
] as const

function TabContentFallback() {
  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className='h-20 rounded-lg border border-border/60 bg-surface/60 animate-pulse'
          />
        ))}
      </div>
    </div>
  )
}

function ReviewGridSkeleton() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className='bg-surface border border-border rounded-xl p-6 shadow-md space-y-4 animate-pulse'
        >
          <div className='flex items-center gap-4'>
            <div className='w-12 h-12 rounded-full bg-border/80' />
            <div className='flex-1 space-y-2'>
              <div className='h-3 w-24 rounded bg-border/70' />
              <div className='h-3 w-16 rounded bg-border/50' />
            </div>
          </div>
          <div className='space-y-2'>
            {Array.from({ length: 3 }).map((__, textIndex) => (
              <div key={textIndex} className='h-3 w-full rounded bg-border/60' />
            ))}
          </div>
        </div>
      ))}
    </>
  )
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden
      focusable='false'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      {...props}
    >
      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
    </svg>
  )
}

export default function LandingBody() {
  const confettiRef = useRef<HTMLCanvasElement>(null)
  const confettiInstanceRef = useRef<JSConfettiInstance | null>(null)
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>('Style')
  const [selectedWidgets, setSelectedWidgets] =
    useState<SelectedWidgets>(DEFAULT_AVATAR)
  const [hairColor, setHairColor] = useState(HAIR_COLORS[0].value)
  const t = useTranslations('LandingBody')
  const locale = useLocale()

  const handleWidgetSelect = (type: keyof SelectedWidgets, path: string) => {
    setSelectedWidgets((prev) => ({
      ...prev,
      [type]: path === prev[type] ? undefined : path,
    }))
  }

  const handleClearWidget = (type: keyof SelectedWidgets) => {
    setSelectedWidgets((prev) => ({
      ...prev,
      [type]: undefined,
    }))
  }

  const handleCreateAvatar = async () => {
    if (!confettiRef.current) {
      return
    }

    if (!confettiInstanceRef.current) {
      const { default: JSConfetti } = await import('js-confetti')

      if (!confettiRef.current) {
        return
      }

      confettiInstanceRef.current = new JSConfetti({
        canvas: confettiRef.current,
      })
    }

    confettiInstanceRef.current.addConfetti({
      confettiColors: [
        '#ff0000',
        '#ffa500',
        '#ffff00',
        '#008000',
        '#0000ff',
        '#4b0082',
        '#ee82ee',
      ],
      confettiNumber: 100,
    })
  }

  const handleRandomAvatar = () => {
    const randomPick = <T,>(arr: readonly T[]): T =>
      arr[Math.floor(Math.random() * arr.length)]

    setSelectedWidgets({
      face: randomPick(WIDGET_PATHS.face),
      eyes: randomPick(WIDGET_PATHS.eyes),
      eyebrows: randomPick(WIDGET_PATHS.eyebrows),
      nose: randomPick(WIDGET_PATHS.nose),
      mouth: randomPick(WIDGET_PATHS.mouth),
      ears: randomPick(WIDGET_PATHS.ears),
      hair: randomPick(WIDGET_PATHS.hair),
    })

    setHairColor(randomPick(HAIR_COLORS).value)
  }

  return (
    <>
      <section className='flex flex-col items-center gap-8 py-12 px-4'>
        <div className='flex flex-wrap gap-4 items-center justify-center'>
          <h1 className='text-5xl min-h-[70px] md:text-6xl font-bold text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'>
            {t('Create Your Unique')}
          </h1>
          <span
            className={`text-4xl md:min-h-[70px] max-h-[60px] md:text-6xl font-bold text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent inline-block overflow-hidden w-0 animate-typing whitespace-nowrap border-r-4 border-r-primary pb-2 leading-tight ${
              locale === 'zh'
                ? '[--typing-width:6.4ch]'
                : '[--typing-width:10.4ch]'
            }`}
          >
            {t('Digital Avatar')}
          </span>
        </div>

        <p className='text-xl text-center max-w-2xl bg-gradient-to-r from-primary/80 to-secondary/80 bg-clip-text text-transparent font-medium'>
          {t('Design your personalized')}
          {t('Add vibrant colors')}
        </p>

        <div className='grid grid-cols-1 max-w-6xl md:grid-cols-2 gap-8 mt-12'>
          <div className='group bg-surface p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-border hover:border-primary/30'>
            <div className='flex items-center gap-4 mb-6'>
              <div className='p-3 bg-gradient-to-br from-primary-soft to-secondary-soft rounded-xl'>
                <svg
                  className='w-6 h-6 text-primary'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              </div>
              <h2 className='text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'>
                {t('Generate Avatar')}
              </h2>
            </div>
            <p className='text-muted leading-relaxed'>
              {t('Create your unique digital')}
            </p>
          </div>

          <div className='group bg-surface p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-border hover:border-primary/30'>
            <div className='flex items-center gap-4 mb-6'>
              <div className='p-3 bg-gradient-to-br from-primary-soft to-secondary-soft rounded-xl'>
                <svg
                  className='w-6 h-6 text-primary'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01'
                  />
                </svg>
              </div>
              <h2 className='text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'>
                {t('Personalized Coloring')}
              </h2>
            </div>
            <p className='text-muted leading-relaxed'>
              {t('Express your creativity')}
            </p>
          </div>
        </div>

        <button className='mt-8 px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-full text-xl font-semibold hover:opacity-90 transition-opacity'>
          {t('Start Creating')}
        </button>
      </section>

      <section className='flex flex-col items-center gap-8 py-12 px-4 bg-gradient-to-b from-primary-soft to-secondary-soft rounded-2xl'>
        <h2 className='text-4xl font-bold text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent pb-[1px]'>
          {t('Magical Avatar')}
        </h2>

        <div className='w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 my-8'>
          <div className='relative h-[500px]'>
            <canvas
              ref={confettiRef}
              className='absolute inset-0 w-full h-full pointer-events-none z-50'
            />
            <div className='flex flex-col justify-center items-center bg-surface rounded-2xl p-8 shadow-lg border border-border h-full'>
              <div className='w-[240px] h-[240px] mx-auto rounded-xl relative'>
                <svg
                  viewBox='0 0 240 240'
                  className='w-full h-full'
                  style={{ overflow: 'visible' }}
                >
                  {Object.entries(selectedWidgets)
                    .sort(([a], [b]) => {
                      const styleA =
                        WIDGET_STYLES[a as keyof typeof WIDGET_STYLES]
                      const styleB =
                        WIDGET_STYLES[b as keyof typeof WIDGET_STYLES]
                      return styleA.zIndex - styleB.zIndex
                    })
                    .map(([type, path]) => {
                      if (!path) return null
                      const style =
                        WIDGET_STYLES[type as keyof typeof WIDGET_STYLES]
                      const isHair = type === 'hair'
                      return (
                        <g
                          key={type}
                          style={{
                            transform:
                              type === 'face'
                                ? 'translate(120px, 120px)'
                                : type === 'eyes'
                                  ? path.includes('eye_1.svg')
                                    ? 'translate(120px, 102px)'
                                    : path.includes('eye_2.svg')
                                      ? 'translate(120px, 102px) scale(1.2)'
                                      : path.includes('eye_3.svg')
                                        ? 'translate(120px, 102px) scale(1.2)'
                                        : 'translate(120px, 102px)'
                                  : type === 'nose'
                                    ? path.includes('nose_1.svg')
                                      ? 'translate(120px, 120px) scale(1.5)'
                                      : path.includes('nose_2.svg')
                                        ? 'translate(120px, 120px) scale(1.5)'
                                        : path.includes('nose_3.svg')
                                          ? 'translate(120px, 120px)'
                                          : 'translate(120px, 120px)'
                                    : type === 'eyebrows'
                                      ? path.includes('eyebrow_1.svg')
                                        ? 'translate(120px, 80px)'
                                        : path.includes('eyebrow_2.svg')
                                          ? 'translate(120px, 80px) scale(1.5)'
                                          : path.includes('eyebrow_3.svg')
                                            ? 'translate(120px, 80px) scale(1.2)'
                                            : 'translate(120px, 80px)'
                                      : type === 'ears'
                                        ? 'translate(120px, 120px)'
                                        : type === 'mouth'
                                          ? path.includes('mouth_2.svg')
                                            ? 'translate(132px, 155px)'
                                            : 'translate(120px, 153px)'
                                          : type === 'hair'
                                            ? path.includes('hair_1.svg')
                                              ? 'translate(106px, 0px)'
                                              : path.includes('hair_2.svg')
                                                ? 'translate(116px, 25px) scale(0.8)'
                                                : path.includes('hair_3.svg')
                                                  ? 'translate(112px, 60px)'
                                                  : 'translate(120px, 40px)'
                                            : '',
                            zIndex: style.zIndex,
                          }}
                        >
                          {isHair ? (
                            <foreignObject
                              x={-(style.width / 2)}
                              y={-(style.height / 2)}
                              width='100%'
                              height='100%'
                            >
                              <div
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  backgroundColor: hairColor,
                                  WebkitMaskImage: `url(${path})`,
                                  WebkitMaskSize: 'contain',
                                  WebkitMaskRepeat: 'no-repeat',
                                  WebkitMaskPosition: 'center',
                                  maskImage: `url(${path})`,
                                  maskSize: 'contain',
                                  maskRepeat: 'no-repeat',
                                  maskPosition: 'center',
                                }}
                              />
                            </foreignObject>
                          ) : (
                            <image
                              href={path}
                              x={-(style.width / 2)}
                              y={-(style.height / 2)}
                              width={style.width}
                              height={style.height}
                              style={{
                                transformOrigin: 'center',
                              }}
                            />
                          )}
                        </g>
                      )
                    })}
                </svg>
              </div>
              <button
                onClick={handleRandomAvatar}
                className='mt-6 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium hover:opacity-90 transition-opacity'
              >
                {t('Random Generate')}
              </button>
            </div>
          </div>

          <div className='bg-surface rounded-2xl p-8 shadow-lg border border-border h-[500px]'>
            <div className='flex flex-col h-full'>
              <div className='flex space-x-4 border-b border-border/70 mb-6 scrollbar-hide overflow-x-scroll overflow-y-hidden'>
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap -mb-[2px] ${
                      activeTab === tab
                        ? 'text-primary border-primary'
                        : 'text-muted border-transparent hover:text-primary hover:border-primary/40'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className='flex-1 overflow-y-auto'>
                <TabContent
                  activeTab={activeTab}
                  selectedWidgets={selectedWidgets}
                  onWidgetSelect={handleWidgetSelect}
                  onWidgetClear={handleClearWidget}
                />

                {activeTab === 'Hair' && selectedWidgets.hair && (
                  <div className='mt-4 p-4 bg-surface rounded-lg border border-border'>
                    <h3 className='text-sm font-medium mb-3 text-foreground'>
                      {t('Hair Color')}
                    </h3>
                    <div className='flex flex-wrap gap-2'>
                      {HAIR_COLORS.map((color) => (
                        <button
                          key={color.value}
                          className={`w-8 h-8 rounded-full border-2 transition-transform ${
                            hairColor === color.value
                              ? 'border-primary scale-110'
                              : 'border-transparent hover:scale-105'
                          }`}
                          style={{
                            backgroundColor: color.value,
                            boxShadow:
                              hairColor === color.value
                                ? '0 0 0 2px rgb(var(--color-primary) / 0.3)'
                                : 'none',
                          }}
                          onClick={() => setHairColor(color.value)}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className='pt-6'>
                <button
                  className='w-full py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity'
                  onClick={handleCreateAvatar}
                >
                  {t('Create Avatar')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='flex flex-col items-center gap-8 py-12 px-4'>
        <h2 className='text-4xl font-bold text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent pb-[1px]'>
          {t('User Reviews')}
        </h2>

        <div className='w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          <ReviewCard />
        </div>
      </section>

      <section className='flex flex-col items-center gap-8 py-12 px-4'>
        <h2 className='text-4xl font-bold text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent pb-[1px]'>
          {t('Terms of Service')}
        </h2>

        <div className='w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6'>
          {TERMS_SECTIONS.map((section) => (
            <div
              key={section.titleKey}
              className='bg-surface p-6 rounded-xl shadow-md border border-border'
            >
              <h3 className='text-xl font-semibold text-primary mb-4'>
                {t(section.titleKey)}
              </h3>
              <ul className='space-y-3 text-muted'>
                {section.items.map((item) => (
                  <li key={item} className='flex items-start gap-2'>
                    <CheckIcon className='w-5 h-5 text-primary mt-1 flex-shrink-0' />
                    <span>{t(item)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
