import LandingBody from '@/app/components/main/landing-body'
import HeaderBar from '@/app/components/header/header-bar'
import Footer from '@/app/components/footer/footer'
export default function Home() {
  return (
    <div className='w-full flex flex-col px-4'>
      <header className='sticky top-0 z-50 bg-surface border-b border-border'>
        <HeaderBar />
      </header>
      <main className='mx-auto mt-24'>
        <LandingBody />
      </main>
      <footer className='my-10'>
        <Footer />
      </footer>
    </div>
  )
}
