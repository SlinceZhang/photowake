const Footer = () => {
  return (
    <div className='container mx-auto h-full flex flex-col items-center justify-center gap-2'>
      <div className='flex items-center gap-8 text-foreground-muted'>
        <a
          href='#'
          className='transition-colors hover:text-foreground'
        >
          License
        </a>
        <a
          href='https://github.com/slince-zero/PhotoWake'
          className='flex items-center gap-1 transition-colors hover:text-foreground'
          target='_blank'
        >
          GitHub

            className='w-4 h-4'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
            />
          </svg>
        </a>
      </div>
      <div className='flex flex-col items-center justify-center text-sm text-foreground-muted'>
        <p>Released under the ISC License.</p>
        <p className='mt-2 text-foreground-subtle'>Copyright © 2024 Your Project Contributors</p>
      </div>
    </div>
  )
}

export default Footer
