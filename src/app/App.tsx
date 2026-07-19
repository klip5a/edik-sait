import { WeddingSlider } from './WeddingSlider'
import { AdminApp } from '../admin/AdminApp'

export function App() {
  if (window.location.pathname.startsWith('/admin')) return <AdminApp />

  return (
    <main id="content" class="min-h-dvh overflow-clip bg-ivory text-ink">
      <WeddingSlider />
    </main>
  )
}
