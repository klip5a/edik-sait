export function App() {
  return (
    <main class="min-h-dvh overflow-clip bg-ivory text-ink">
      <section class="relative grid min-h-dvh place-items-center overflow-clip px-6 py-12 text-center">
        <div
          class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.9),transparent_45%),linear-gradient(145deg,#fbf8f1,#eee2cf)]"
          aria-hidden="true"
        />
        <div class="relative z-10 mx-auto flex max-w-xl flex-col items-center">
          <p class="mb-7 text-sm tracking-[0.2em] text-ink/75 uppercase">
            Приглашение на свадьбу
          </p>
          <h1 class="font-script text-[clamp(4rem,16vw,8rem)] leading-[0.82] text-balance">
            <span class="block">Анастасия</span>
            <span class="my-4 block font-serif text-3xl text-gold" aria-hidden="true">
              ♡
            </span>
            <span class="block">Эдуард</span>
          </h1>
          <p class="mt-9 font-serif text-2xl tracking-wide text-gold-deep">
            15 августа 2026
          </p>
          <p class="mt-8 max-w-md font-serif text-lg leading-relaxed text-pretty text-ink/80">
            Новый каркас готов. Следующим этапом здесь появятся девять экранов утверждённого
            приглашения.
          </p>
        </div>
      </section>
    </main>
  )
}
