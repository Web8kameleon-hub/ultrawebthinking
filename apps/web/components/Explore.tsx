// components/Explore.tsx
export function Explore() {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Eksploro Dimensione të Reja</h2>
      <p className={styles.subtitle}>
        Me Ultrawebthinking, ti nuk shfleton thjesht uebin – ti eksploron një mendje kolektive.
      </p>
      <div className={styles.wrapper}>
        <a href="#" className={styles.card}>
          <h3 className={styles.cardTitle}>Navigim AGI</h3>
          <p className={styles.cardText}>
            Zbulim i zgjuar i përmbajtjes përmes analitikës dhe inteligjencës kolektive.
          </p>
        </a>
        <a href="#" className={styles.card}>
          <h3 className={styles.cardTitle}>Botë Paralele</h3>
          <p className={styles.cardText}>
            Qasje në shtresa të ndryshme informacioni për çdo realitet virtual ose fizik.
          </p>
        </a>
      </div>
    </section>
  );
}

const styles = {
  section: "py-20 px-6 bg-white text-center",
  heading: "text-4xl font-bold text-blue-800 mb-4",
  subtitle: "text-lg text-gray-600 max-w-700 mx-auto mb-10",
  wrapper: "flex flex-col md:flex-row gap-8 justify-center flex-wrap",
  card: "bg-blue-50 p-6 rounded-xl w-full md:w-5/12 text-left transition-transform duration-300 ease-out hover:scale-103 hover:shadow-xl",
  cardTitle: "text-xl font-semibold text-blue-700 mb-2",
  cardText: "text-base text-gray-700",
};

