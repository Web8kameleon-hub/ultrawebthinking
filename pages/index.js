import HeroSection from '@/components/HeroSection'
import SearchFlow from '@/components/SearchFlow'
import SystemStatus from '@/components/SystemStatus'

export default function Home({ status }) {
  return (
    <main>
      {/* Seksioni Hero për prezantimin e sistemit AGI */}
      <HeroSection />

      {/* Komponenti për ndërveprim me AGI */}
      <SearchFlow />

      {/* Seksioni për shfaqjen e statusit të sistemit */}
      <SystemStatus status={status} />
    </main>
  )
}

export async function getServerSideProps() {
  // Simuloni marrjen e statusit të sistemit AGI
  const status = 'Sistemi AGI është aktiv dhe gati për përdorim!'

  return {
    props: {
      status,
    },
  }
}
