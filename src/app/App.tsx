import { useEffect, useRef, useState } from "react"
import {
  ArrowDown,
  ArrowRight,
  Bell,
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Compass,
  Flame,
  Flag,
  Gamepad2,
  Gem,
  Grid2X2,
  Heart,
  Hash,
  Menu,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  Smile,
  Star,
  Trophy,
  Type,
  Users,
  X,
  Zap,
} from "lucide-react"

import GameModal, {
  games,
  categories,
  GameArtwork,
  type Game,
} from "./GuessingGame"

const categoryIcons = [Grid2X2, Smile, Type, Hash, Flag]

function readSaved<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

export default function App() {
  const [view, setView] = useState("Jelajahi")
  const [category, setCategory] = useState("Semua")
  const [query, setQuery] = useState("")
  const [saved, setSaved] = useState<string[]>(() =>
    readSaved("playzone-tebak-saved", []),
  )
  const [scores, setScores] = useState<Record<string, number>>(() =>
    readSaved("playzone-tebak-scores", {}),
  )
  const [profile, setProfile] = useState<string>(() =>
    readSaved("playzone-profile", "Player One"),
  )
  const [profileOpen, setProfileOpen] = useState(false)
  const [draftName, setDraftName] = useState(profile)
  const [activeGame, setActiveGame] = useState<Game | null>(null)
  const [heroIndex, setHeroIndex] = useState(0)
  const [notifications, setNotifications] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [help, setHelp] = useState(false)
  const hero = games[heroIndex]
  const filtered = games.filter(
    (game) =>
      (category === "Semua" || game.category === category) &&
      `${game.title} ${game.genre} ${game.description}`
        .toLocaleLowerCase("id-ID")
        .includes(query.trim().toLocaleLowerCase("id-ID")) &&
      (view !== "Koleksi saya" || saved.includes(game.id)),
  )
  const totalScore = Object.values(scores).reduce(
    (total, score) => total + score,
    0,
  )

  useEffect(() => {
    try {
      localStorage.setItem("playzone-tebak-saved", JSON.stringify(saved))
    } catch {}
  }, [saved])
  useEffect(() => {
    try {
      localStorage.setItem("playzone-tebak-scores", JSON.stringify(scores))
    } catch {}
  }, [scores])
  useEffect(() => {
    try {
      localStorage.setItem("playzone-profile", JSON.stringify(profile))
    } catch {}
  }, [profile])

  function toggleSaved(id: string) {
    setSaved((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id],
    )
  }
  function navigate(next: string) {
    setView(next)
    setMobileMenu(false)
    setCategory("Semua")
    setQuery("")
  }
  const navigation = [
    { label: "Jelajahi", icon: Compass },
    { label: "Koleksi saya", icon: Bookmark },
    { label: "Papan peringkat", icon: Trophy },
    { label: "Tantangan", icon: Flame },
  ]

  return (
    <div className="min-h-screen bg-background">
      {mobileMenu && (
        <button
          aria-label="Tutup menu"
          onClick={() => setMobileMenu(false)}
          className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[224px] flex-col border-r border-border/70 bg-[#161719] transition-transform lg:translate-x-0 ${
          mobileMenu ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => navigate("Jelajahi")}
          className="flex h-[88px] items-center gap-2 px-5"
        >
          <Gamepad2
            size={27}
            strokeWidth={2.4}
            className="shrink-0 text-primary"
          />
          <span className="font-display text-[20px] font-extrabold tracking-[0.025em]">
            PLAY<span className="text-primary">ZONE</span>
            <span className="align-top text-[8px] text-primary">®</span>
          </span>
        </button>
        <div className="px-4 pt-7">
          <p className="mb-4 px-3 text-[10px] font-semibold tracking-[0.19em] text-[#686a73]">
            MENU UTAMA
          </p>
          <nav className="space-y-2">
            {navigation.map(({ label, icon: Icon }) => (
              <button
                key={label}
                onClick={() => navigate(label)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-[13px] font-medium transition ${
                  view === label
                    ? "bg-primary/10 text-primary"
                    : "text-[#a1a2aa] hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={19} strokeWidth={1.7} />
                {label}
                {label === "Koleksi saya" && saved.length > 0 && (
                  <span className="ml-auto rounded bg-white/10 px-1.5 text-[10px]">
                    {saved.length}
                  </span>
                )}
                {label === "Tantangan" && (
                  <span className="ml-auto size-1.5 rounded-full bg-primary" />
                )}
              </button>
            ))}
          </nav>
        </div>
        <div className="mx-7 my-7 border-t border-border/80" />
        <div className="px-7">
          <p className="mb-4 text-[10px] font-semibold tracking-[0.19em] text-[#686a73]">
            JELAJAHI KATEGORI
          </p>
          <div className="space-y-5">
            {categories.slice(1).map((item, index) => {
              const Icon = categoryIcons[index + 1]
              return (
                <button
                  key={item}
                  onClick={() => {
                    navigate("Jelajahi")
                    setCategory(item)
                    requestAnimationFrame(() =>
                      document
                        .getElementById("games")
                        ?.scrollIntoView({ block: "start" }),
                    )
                  }}
                  className={`flex w-full items-center gap-3 text-[13px] transition hover:text-primary ${
                    category === item ? "text-primary" : "text-[#92949e]"
                  }`}
                >
                  <Icon size={17} strokeWidth={1.6} />
                  {item}
                  <ChevronRight size={13} className="ml-auto text-[#555760]" />
                </button>
              )
            })}
          </div>
        </div>
        <div className="mt-auto px-4 pt-10 pb-5">
          <div className="relative overflow-hidden rounded-xl border border-primary/15 bg-gradient-to-br from-[#283025] to-[#1b201a] p-4">
            <div className="absolute -top-2 -right-2 rotate-12 text-primary/10">
              <Gamepad2 size={85} />
            </div>
            <Sparkles size={23} className="mb-3 text-primary" />
            <p className="relative font-display text-[15px] font-semibold">
              Sedikit jeda, banyak seru.
            </p>
            <p className="relative mt-2 text-[11px] leading-5 text-[#a8afa0]">
              Game gratis. Tanpa install.
              <br />
              Tinggal klik dan main.
            </p>
            <button
              onClick={() =>
                setActiveGame(games[Math.floor(Math.random() * games.length)])
              }
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-primary py-2.5 text-xs font-bold text-background hover:bg-lime-200"
            >
              Surprise me <ArrowRight size={14} />
            </button>
          </div>
          <button
            onClick={() => setHelp(true)}
            className="mt-6 flex items-center gap-3 px-3 text-xs text-muted-foreground hover:text-white"
          >
            <CircleHelp size={17} /> Bantuan & informasi
          </button>
        </div>
      </aside>

      <div className="lg:ml-[224px]">
        <header className="sticky top-0 z-20 flex h-[80px] items-center gap-4 border-b border-border/70 bg-background/95 px-5 backdrop-blur-xl sm:px-8 xl:px-10">
          <button
            aria-label="Buka menu"
            onClick={() => setMobileMenu(true)}
            className="text-muted-foreground lg:hidden"
          >
            <Menu size={23} />
          </button>
          <span className="hidden text-sm font-medium text-[#c6c6ca] sm:block">
            {view}
          </span>
          <div className="ml-auto flex w-full max-w-[340px] items-center gap-2.5 rounded-lg border border-white/[0.055] bg-[#1c1d20] px-3.5 py-2.5">
            <Search size={16} className="shrink-0 text-[#777982]" />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                if (view !== "Jelajahi" && view !== "Koleksi saya")
                  setView("Jelajahi")
              }}
              placeholder="Cari game favoritmu..."
              aria-label="Cari game"
              className="min-w-0 flex-1 bg-transparent text-xs placeholder:text-[#72747e] focus-visible:ring-0"
            />
            <kbd className="hidden rounded border border-border px-1.5 py-0.5 text-[10px] text-[#777982] sm:block">
              ⌕
            </kbd>
          </div>
          <div className="relative">
            <button
              aria-label="Notifikasi"
              aria-expanded={notifications}
              onClick={() => setNotifications(!notifications)}
              className="relative rounded-full p-2 text-[#b0b1b9] hover:bg-white/5"
            >
              <Bell size={19} />
              <span className="absolute top-1.5 right-2 size-1.5 rounded-full border border-background bg-primary" />
            </button>
            {notifications && (
              <div className="absolute top-12 -right-10 w-72 rounded-xl border border-border bg-muted p-5 shadow-2xl sm:right-0">
                <p className="mb-3 font-semibold">Yang baru di Playzone</p>
                <p className="text-xs leading-6 text-muted-foreground">
                  Tantangan tebak-tebakan sudah siap. Selesaikan Tebak Kata dan
                  pecahkan rekor pribadimu!
                </p>
                <button
                  onClick={() => {
                    setNotifications(false)
                    setActiveGame(games[1])
                  }}
                  className="mt-3 text-xs font-semibold text-primary"
                >
                  Coba tantangannya →
                </button>
              </div>
            )}
          </div>
          <div className="hidden h-6 border-l border-border sm:block" />
          <button
            onClick={() => {
              setDraftName(profile)
              setProfileOpen(true)
            }}
            aria-label="Edit profil"
            className="flex items-center gap-2.5"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[#b395c0]/40 bg-[#53475e] font-display text-sm font-semibold text-[#ead7f3]">
              {profile.slice(0, 2).toUpperCase()}
            </span>
            <span className="hidden text-left xl:block">
              <span className="block text-xs font-semibold">{profile}</span>
              <span className="mt-0.5 block text-[10px] text-muted-foreground">
                Ready to play <span className="text-primary">●</span>
              </span>
            </span>
          </button>
        </header>

        <main className="mx-auto max-w-[1500px] px-5 pt-8 pb-6 sm:px-8 xl:px-10">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="text-primary">✦</span>{" "}
                {view === "Koleksi saya"
                  ? "Semua favoritmu, dalam satu tempat"
                  : view === "Papan peringkat"
                    ? "Setiap permainan adalah kesempatan baru"
                    : "Tempatnya tebak-tebakan yang bikin penasaran"}
              </p>
              <h1 className="font-display text-[27px] leading-tight font-semibold sm:text-[32px]">
                {view === "Jelajahi" ? (
                  <>
                    Asah otak.{" "}
                    <span className="text-primary">Tebak jawabannya.</span>
                  </>
                ) : view === "Koleksi saya" ? (
                  "Koleksi game kamu."
                ) : view === "Papan peringkat" ? (
                  "Rekor terbaikmu."
                ) : (
                  "Tantangan hari ini."
                )}
              </h1>
            </div>
            <span className="hidden items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[10px] text-muted-foreground md:flex">
              <span className="size-1.5 rounded-full bg-primary" /> Semua game
              gratis
            </span>
          </div>

          {view === "Jelajahi" && !query && (
            <>
              <section className="relative isolate overflow-hidden rounded-2xl border border-white/5 bg-[#171c22]">
                <div className="absolute inset-0 -z-20">
                  <GameArtwork game={hero} hero />
                </div>
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#15141c] via-[#15141c]/75 to-transparent md:via-[#15141c]/20" />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="relative p-7 sm:p-9 xl:px-10 xl:py-9">
                  <span className="inline-flex items-center gap-1.5 rounded border border-primary/25 bg-primary/10 px-2.5 py-1.5 text-[9px] font-bold tracking-[0.1em] text-primary">
                    <Star size={11} fill="currentColor" /> GAME PILIHAN MINGGU
                    INI
                  </span>
                  <h2 className="mt-5 max-w-sm font-display text-[53px] leading-[0.98] font-bold sm:text-[65px]">
                    {hero.title.split(" ")[0]}
                    <br />
                    <span className={hero.color}>
                      {hero.title.split(" ")[1]}
                      <span className="text-primary">.</span>
                    </span>
                  </h2>
                  <p className="mt-4 max-w-[305px] text-[12px] leading-[1.85] text-[#c4c7ce]">
                    {hero.description}
                  </p>
                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => setActiveGame(hero)}
                      className="flex items-center gap-2.5 rounded-lg bg-primary px-5 py-3 text-[12px] font-bold text-[#182113] transition hover:-translate-y-0.5 hover:bg-lime-200"
                    >
                      <Play size={15} fill="currentColor" /> Mainkan sekarang{" "}
                      <ArrowRight size={15} className="ml-2" />
                    </button>
                    <button
                      aria-label={
                        saved.includes(hero.id)
                          ? "Hapus dari koleksi"
                          : "Simpan ke koleksi"
                      }
                      onClick={() => toggleSaved(hero.id)}
                      className={`rounded-lg border border-white/20 bg-black/15 p-3 transition hover:border-primary ${
                        saved.includes(hero.id) ? "text-primary" : "text-white"
                      }`}
                    >
                      <Bookmark
                        size={19}
                        fill={saved.includes(hero.id) ? "currentColor" : "none"}
                      />
                    </button>
                  </div>
                  <div className="mt-6 flex max-w-[200px] flex-wrap gap-4 text-[9px] text-[#a8adb7] sm:max-w-none">
                    <span className="flex items-center gap-1.5">
                      <Zap size={12} className="text-primary" /> Langsung main
                    </span>
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck size={12} className="text-primary" /> 100%
                      gratis
                    </span>
                    <span className="flex items-center gap-1.5">
                      <ArrowDown size={12} className="text-primary" /> Tanpa
                      download
                    </span>
                  </div>
                </div>
                <div className="absolute right-6 bottom-6 flex items-center gap-3">
                  <span className="mr-2 hidden font-display text-xs text-white/70 sm:block">
                    <span className="text-white">0{heroIndex + 1}</span>{" "}
                    <span className="mx-1.5 text-white/30">/</span> 03
                  </span>
                  <button
                    aria-label="Game pilihan sebelumnya"
                    onClick={() => setHeroIndex((heroIndex + 2) % 3)}
                    className="rounded-full border border-white/25 bg-black/30 p-2 text-white backdrop-blur-sm hover:bg-white/15"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    aria-label="Game pilihan berikutnya"
                    onClick={() => setHeroIndex((heroIndex + 1) % 3)}
                    className="rounded-full border border-white/25 bg-black/30 p-2 text-white backdrop-blur-sm hover:bg-white/15"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </section>
            </>
          )}

          {(view === "Jelajahi" || view === "Koleksi saya") && (
            <section id="games" className="scroll-mt-24 pt-8">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="flex items-center gap-2.5 font-display text-[21px] font-semibold">
                  {view === "Koleksi saya" ? (
                    <Bookmark size={21} className="text-primary" />
                  ) : (
                    <Flame size={22} className="text-primary" />
                  )}
                  {query
                    ? "Hasil pencarian"
                    : view === "Koleksi saya"
                      ? "Game tersimpan"
                      : "Pilih tantangan tebakmu"}
                </h2>
                <button
                  onClick={() => {
                    setCategory("Semua")
                    setQuery("")
                    document
                      .getElementById("games")
                      ?.scrollIntoView({ block: "start" })
                  }}
                  className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground hover:text-primary"
                >
                  Lihat semua <ArrowRight size={14} />
                </button>
              </div>
              <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
                {categories.map((item, index) => {
                  const Icon = categoryIcons[index]
                  return (
                    <button
                      key={item}
                      onClick={() => setCategory(item)}
                      className={`flex shrink-0 items-center gap-2 rounded-lg border px-4 py-2 text-[11px] font-medium transition ${
                        category === item
                          ? "border-primary/20 bg-primary/10 text-primary"
                          : "border-border bg-[#191a1d] text-[#989aa4] hover:border-white/25 hover:text-white"
                      }`}
                    >
                      <Icon size={13} />
                      {item}
                    </button>
                  )
                })}
              </div>
              <div className="grid grid-cols-1 gap-4 min-[450px]:grid-cols-2 xl:grid-cols-4">
                {filtered.map((game, index) => (
                  <article
                    key={game.id}
                    className="group overflow-hidden rounded-xl border border-border/80 bg-[#1b1c1f] transition duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-lg"
                  >
                    <div className="relative h-[168px] overflow-hidden sm:h-[180px] xl:h-[158px]">
                      <GameArtwork game={game} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/10" />
                      <span
                        className={`absolute top-3 left-3 flex items-center gap-1 rounded px-2 py-1 text-[8px] font-bold tracking-wider ${
                          index === 0
                            ? "bg-primary text-background"
                            : index === 1
                              ? "bg-[#dac6f0] text-[#30223e]"
                              : "bg-black/50 text-white backdrop-blur-sm"
                        }`}
                      >
                        {game.id === "emoji" ? (
                          <>
                            <Flame size={9} /> HOT
                          </>
                        ) : game.id === "words" ? (
                          "PILIHAN EDITOR"
                        ) : game.id === "flags" ? (
                          "KELILING DUNIA"
                        ) : (
                          "UJI LOGIKA"
                        )}
                      </span>
                      <button
                        onClick={() => toggleSaved(game.id)}
                        aria-label={`Simpan ${game.title}`}
                        aria-pressed={saved.includes(game.id)}
                        className={`absolute top-2 right-2 rounded-full bg-black/40 p-2 backdrop-blur-sm hover:bg-black/70 ${
                          saved.includes(game.id)
                            ? "text-primary"
                            : "text-white/90"
                        }`}
                      >
                        <Bookmark
                          size={14}
                          fill={
                            saved.includes(game.id) ? "currentColor" : "none"
                          }
                        />
                      </button>
                      <div className="absolute right-4 bottom-4 left-4">
                        <span
                          className={`block font-display text-[27px] leading-[0.95] font-black tracking-[0.035em] uppercase italic drop-shadow-lg ${game.color}`}
                        >
                          {game.title.split(" ")[0]}
                          <br />
                          <span className="text-white">
                            {game.title.split(" ")[1]}
                          </span>
                        </span>
                      </div>
                      <button
                        onClick={() => setActiveGame(game)}
                        aria-label={`Mainkan ${game.title}`}
                        className="absolute right-4 bottom-4 flex size-10 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur-sm transition hover:bg-primary hover:text-background"
                      >
                        <Play
                          size={16}
                          fill="currentColor"
                          className="ml-0.5"
                        />
                      </button>
                    </div>
                    <div className="p-4">
                      <button
                        onClick={() => setActiveGame(game)}
                        className="font-display text-[16px] font-semibold hover:text-primary"
                      >
                        {game.title}
                      </button>
                      <p className="mt-1 text-[10px] text-muted-foreground">
                        {game.genre}
                      </p>
                      <div className="mt-3.5 flex items-center justify-between border-t border-border pt-3 text-[10px]">
                        <span className="flex items-center gap-1.5 text-[#b4b5bd]">
                          <span
                            className={`size-1.5 rounded-full ${
                              game.difficulty === "Mudah"
                                ? "bg-primary"
                                : "bg-amber-300"
                            }`}
                          />
                          {game.difficulty}
                        </span>
                        <span className="font-semibold text-primary">
                          Gratis{" "}
                          <span className="ml-1.5 text-[#565960]">↗</span>
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              {filtered.length === 0 && (
                <div className="rounded-xl border border-dashed border-border px-6 py-14 text-center">
                  <Search
                    size={32}
                    className="mx-auto mb-4 text-muted-foreground"
                  />
                  <h3 className="font-display text-xl">
                    {view === "Koleksi saya" && !query
                      ? "Belum ada game tersimpan"
                      : "Game belum ditemukan"}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {view === "Koleksi saya" && !query
                      ? "Klik ikon bookmark pada game yang kamu suka."
                      : "Coba kata kunci lain atau pilih kategori Semua."}
                  </p>
                  <button
                    onClick={() => navigate("Jelajahi")}
                    className="mt-5 text-sm text-primary"
                  >
                    Jelajahi semua game →
                  </button>
                </div>
              )}
            </section>
          )}

          {((view === "Jelajahi" && !query) || view === "Tantangan") && (
            <section className="mt-7 grid gap-5 xl:grid-cols-[1.6fr_1fr]">
              <div className="relative isolate flex min-h-[164px] flex-col justify-center overflow-hidden rounded-xl border border-[#514963]/40 bg-[#26212f] px-6 py-6 sm:px-7">
                <div className="absolute top-1/2 right-3 -z-10 -translate-y-1/2 rotate-[-15deg] text-[#b4a0d4]/10">
                  <Trophy size={180} strokeWidth={1} />
                </div>
                <span className="mb-2 flex items-center gap-1.5 text-[9px] font-bold tracking-[0.12em] text-[#baa8d7]">
                  <Zap size={12} /> TANTANGAN TEBAK KATA
                </span>
                <h2 className="font-display text-[23px] font-semibold">
                  Tebakannya sederhana. Yakin tahu?
                </h2>
                <p className="mt-1.5 max-w-[310px] text-[11px] leading-5 text-[#ada6b7]">
                  Jawab 5 teka-teki tanpa menggunakan petunjuk.
                  <br />
                  Bisa kalahkan rekor kamu hari ini?
                </p>
                <button
                  onClick={() => setActiveGame(games[1])}
                  className="mt-4 flex items-center gap-2 self-start text-[11px] font-semibold text-[#ded1f0] hover:text-white"
                >
                  Terima tantangan <ArrowRight size={14} />
                </button>
              </div>
              <div className="rounded-xl border border-border bg-[#191a1d] p-5">
                <div className="flex items-center justify-between">
                  <h2 className="flex items-center gap-2 font-display text-base font-semibold">
                    <Trophy size={16} className="text-primary" /> Rekor
                    pribadimu
                  </h2>
                  <button
                    aria-label="Lihat papan peringkat"
                    onClick={() => navigate("Papan peringkat")}
                    className="text-muted-foreground hover:text-primary"
                  >
                    <ArrowRight size={15} />
                  </button>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-lg border border-primary/15 bg-primary/5">
                    <Gamepad2 size={24} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold">{profile}</p>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      {Object.keys(scores).length} dari {games.length} game dimainkan
                    </p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="font-display text-xl font-semibold text-primary">
                      {totalScore.toLocaleString("id-ID")}
                    </p>
                    <p className="text-[9px] text-muted-foreground">
                      total poin terbaik
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex gap-1.5">
                  {games.map((game) => (
                    <div
                      key={game.id}
                      className={`h-1.5 flex-1 rounded-full ${
                        game.id in scores ? "bg-primary" : "bg-white/10"
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-3 text-[9px] text-muted-foreground">
                  {totalScore
                    ? "Terus main. Rekor baru menantimu!"
                    : "Mainkan game pertamamu dan mulai perjalananmu."}
                </p>
              </div>
            </section>
          )}

          {view === "Papan peringkat" && (
            <section className="overflow-hidden rounded-xl border border-border bg-muted">
              <div className="border-b border-border p-6">
                <h2 className="font-display text-xl font-semibold">
                  Personal best · {profile}
                </h2>
                <p className="mt-2 text-xs text-muted-foreground">
                  Skor terbaik per game tersimpan di perangkat ini. Jawaban benar: 100 poin, dengan
                  petunjuk: 50 poin. Mode bertimer memberi bonus kecepatan hingga 50%.
                </p>
              </div>
              {games.map((game) => (
                <div
                  key={game.id}
                  className="flex items-center gap-4 border-b border-border px-6 py-5 last:border-0"
                >
                  <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-lg">
                    <GameArtwork game={game} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{game.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {game.genre}
                    </p>
                  </div>
                  <span className="ml-auto text-sm font-semibold text-primary">
                    {game.id in scores
                      ? `${scores[game.id].toLocaleString("id-ID")} poin`
                      : "Belum main"}
                  </span>
                  <button
                    onClick={() => setActiveGame(game)}
                    aria-label={`Main ${game.title}`}
                    className="rounded-lg bg-white/5 p-2 hover:bg-primary hover:text-background"
                  >
                    <Play size={16} />
                  </button>
                </div>
              ))}
            </section>
          )}

          <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-5 text-[9px] text-[#686b75]">
            <span>
              © {new Date().getFullYear()} Playzone. Dibuat untuk keseruan.
            </span>
            <div className="flex items-center gap-5">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={12} /> Aman untuk dimainkan
              </span>
              <button
                onClick={() => setHelp(true)}
                className="hover:text-primary"
              >
                Tentang Playzone
              </button>
              <span className="hidden sm:inline">
                Made for the players <span className="text-primary">✦</span>
              </span>
            </div>
          </footer>
        </main>
      </div>
      {activeGame && (
        <GameModal
          game={activeGame}
          onClose={() => setActiveGame(null)}
          onScore={(id, score) =>
            setScores((previous) => ({
              ...previous,
              [id]: Math.max(previous[id] || 0, score),
            }))
          }
        />
      )}
      {profileOpen && (
        <InfoDialog title="Profil pemain" onClose={() => setProfileOpen(false)}>
          <p className="mb-5 text-sm leading-6 text-muted-foreground">
            Buat nama pemainmu. Profil dan skor disimpan hanya di perangkat ini,
            tanpa perlu akun.
          </p>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              if (draftName.trim()) {
                setProfile(draftName.trim().slice(0, 20))
                setProfileOpen(false)
              }
            }}
          >
            <label
              htmlFor="player-name"
              className="mb-2 block text-xs font-medium"
            >
              Nama pemain
            </label>
            <input
              id="player-name"
              required
              maxLength={20}
              value={draftName}
              onChange={(event) => setDraftName(event.target.value)}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm"
            />
            <button
              type="submit"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-bold text-background"
            >
              <Check size={17} /> Simpan profil
            </button>
          </form>
        </InfoDialog>
      )}
      {help && (
        <InfoDialog
          title="Selamat datang di Playzone"
          onClose={() => setHelp(false)}
        >
          <p className="text-sm leading-7 text-muted-foreground">
            Playzone adalah tempatnya game tebak-tebakan gratis. Tebak kata,
            emoji, angka, dan bendera langsung di browser. Pilih tingkat
            kesulitan: santai tanpa timer atau cepat dengan bonus poin!
          </p>
          <div className="mt-5 space-y-4 text-sm">
            <p className="flex gap-3">
              <Bookmark size={18} className="shrink-0 text-primary" />
              Simpan game favorit dengan ikon bookmark.
            </p>
            <p className="flex gap-3">
              <Trophy size={18} className="shrink-0 text-primary" />
              Skor terbaik otomatis tersimpan di perangkat ini.
            </p>
            <p className="flex gap-3">
              <Users size={18} className="shrink-0 text-primary" />
              Ubah nama pemain dengan mengklik profil.
            </p>
          </div>
          <p className="mt-6 text-xs leading-6 text-muted-foreground">
            Soal dan pilihan jawaban diacak setiap permainan. Jawaban benar
            mendapat 100 poin, atau 50 poin jika membuka petunjuk. Mode bertimer
            memberi bonus kecepatan hingga 50%. Skor Tebak Angka bergantung
            pada jumlah tebakan. Tidak ada akun, pembayaran, atau pengumpulan data.
          </p>
        </InfoDialog>
      )}
    </div>
  )
}

function InfoDialog({
  title,
  children,
  onClose,
}: {
  title: string
  children: React.ReactNode
  onClose: () => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const previous = document.activeElement as HTMLElement
    dialogRef.current?.showModal()
    return () => previous?.focus()
  }, [])
  return (
    <dialog
      ref={dialogRef}
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      className="fixed inset-0 m-auto w-[calc(100%-32px)] max-w-md rounded-2xl border border-border bg-muted p-6 text-white shadow-2xl backdrop:bg-black/80 backdrop:backdrop-blur-sm"
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="font-display text-xl font-semibold">{title}</h2>
        <button
          onClick={onClose}
          aria-label="Tutup"
          className="rounded-full p-1 text-muted-foreground hover:text-white"
        >
          <X size={20} />
        </button>
      </div>
      {children}
    </dialog>
  )
}
