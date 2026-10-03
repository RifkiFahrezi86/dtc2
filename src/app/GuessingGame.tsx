import { useEffect, useRef, useState } from "react"
import {
  ArrowRight,
  Check,
  Lightbulb,
  Play,
  RotateCcw,
  Timer,
  Trophy,
  X,
} from "lucide-react"

import { levels, roundScore, timeBudget } from "./score"

type Mode = "emoji" | "words" | "numbers" | "flags"
export type Game = {
  id: string
  title: string
  category: string
  genre: string
  mode: Mode
  difficulty: string
  description: string
  color: string
  backdrop: string
  glyphs: string[]
}
type Question = {
  prompt: string
  visual?: string
  choices: string[]
  answer: string
  hint: string
}
export const games: Game[] = [
  {
    id: "emoji",
    title: "Tebak Emoji",
    category: "Emoji",
    genre: "Emoji · Tebak frasa",
    mode: "emoji",
    difficulty: "Mudah",
    description:
      "Dua emoji, satu jawaban. Gabungkan petunjuk gambarnya dan temukan kata yang tersembunyi. Kelihatannya gampang… yakin?",
    color: "text-[#bba4f0]",
    backdrop: "from-[#443266] via-[#302440] to-[#211a2e]",
    glyphs: ["👁️", "☀️"],
  },
  {
    id: "words",
    title: "Tebak Kata",
    category: "Kata",
    genre: "Kata · Teka-teki",
    mode: "words",
    difficulty: "Menengah",
    description:
      "Punya gigi, tapi tidak bisa menggigit. Apa hayo? Baca teka-tekinya, pikirkan jawabannya, dan buktikan kecerdikanmu!",
    color: "text-[#a4dfe6]",
    backdrop: "from-[#245460] via-[#203941] to-[#18292e]",
    glyphs: ["A", "?", "Z"],
  },
  {
    id: "numbers",
    title: "Tebak Angka",
    category: "Angka",
    genre: "Angka · Logika",
    mode: "numbers",
    difficulty: "Menengah",
    description:
      "Ada satu angka rahasia antara 1 dan 100. Kamu punya 7 kesempatan. Gunakan petunjuk lebih besar atau lebih kecil untuk menemukannya!",
    color: "text-[#f1c486]",
    backdrop: "from-[#66432e] via-[#463022] to-[#30221b]",
    glyphs: ["4", "?", "7"],
  },
  {
    id: "flags",
    title: "Tebak Bendera",
    category: "Bendera",
    genre: "Bendera · Pengetahuan",
    mode: "flags",
    difficulty: "Mudah",
    description:
      "Keliling dunia tanpa beranjak dari kursi. Kenali benderanya dan tebak negaranya. Seberapa luas pengetahuanmu?",
    color: "text-[#b7db97]",
    backdrop: "from-[#3c5332] via-[#2b3e26] to-[#1d2a1d]",
    glyphs: ["🇯🇵", "🇧🇷"],
  },
]
export const categories = ["Semua", "Emoji", "Kata", "Angka", "Bendera"]
export const questionBanks: Partial<Record<Mode, Question[]>> = {
  emoji: [
    {
      prompt: "Gabungkan dua emoji ini menjadi sebuah kata.",
      visual: "👁️ + ☀️",
      choices: ["Matahari", "Pelangi", "Kacamata", "Bintang"],
      answer: "Matahari",
      hint: "Benda ini menerangi bumi pada siang hari.",
    },
    {
      prompt: "Olahraga apa yang digambarkan emoji ini?",
      visual: "🦶 + ⚽",
      choices: ["Bola basket", "Sepak bola", "Bulu tangkis", "Bola voli"],
      answer: "Sepak bola",
      hint: "Satu tim biasanya terdiri dari sebelas pemain.",
    },
    {
      prompt: "Tebak nama tempat dari gabungan emoji ini.",
      visual: "🏠 + 🤒",
      choices: ["Rumah makan", "Rumah sakit", "Sekolah", "Kantor polisi"],
      answer: "Rumah sakit",
      hint: "Dokter dan perawat bekerja di sini.",
    },
    {
      prompt: "Tebak nama cairan dari gabungan emoji ini.",
      visual: "💧 + 👁️",
      choices: ["Air mata", "Matahari", "Air terjun", "Kacamata"],
      answer: "Air mata",
      hint: "Biasanya keluar saat kamu menangis.",
    },
    {
      prompt: "Tebak nama benda langit dari emoji ini.",
      visual: "⭐ + 🌠",
      choices: ["Bintang jatuh", "Bulan sabit", "Matahari", "Planet"],
      answer: "Bintang jatuh",
      hint: "Tampak seperti garis cahaya yang melintas di langit malam.",
    },
    {
      prompt: "Tebak nama tempat dari emoji ini.",
      visual: "🏠 + 🍽️",
      choices: ["Rumah sakit", "Rumah makan", "Sekolah", "Perpustakaan"],
      answer: "Rumah makan",
      hint: "Kamu bisa memesan makanan di sini.",
    },
    {
      prompt: "Makanan apa yang digambarkan oleh emoji ini?",
      visual: "🍌 + 🍳",
      choices: ["Pisang goreng", "Nasi goreng", "Telur dadar", "Roti bakar"],
      answer: "Pisang goreng",
      hint: "Buah kuning yang dimasak dengan minyak panas.",
    },
    {
      prompt: "Tebak kegiatan dari emoji ini.",
      visual: "🎣 + 🐟",
      choices: ["Berenang", "Memancing", "Menyelam", "Memasak"],
      answer: "Memancing",
      hint: "Butuh umpan dan kail.",
    },
    {
      prompt: "Tebak makanan dari gabungan emoji ini.",
      visual: "🍞 + 🔥",
      choices: ["Roti bakar", "Nasi goreng", "Kue ulang tahun", "Pisang goreng"],
      answer: "Roti bakar",
      hint: "Roti yang dipanaskan hingga kecokelatan.",
    },
    {
      prompt: "Tebak peristiwa alam dari emoji ini.",
      visual: "🌧️ + 🌈",
      choices: ["Badai", "Pelangi", "Kabut", "Gerhana"],
      answer: "Pelangi",
      hint: "Lengkungan warna-warni yang sering muncul setelah hujan.",
    },
    {
      prompt: "Tebak tempat dari gabungan emoji ini.",
      visual: "📚 + 🏠",
      choices: ["Toko buku", "Perpustakaan", "Sekolah", "Museum"],
      answer: "Perpustakaan",
      hint: "Tempat meminjam dan membaca buku.",
    },
    {
      prompt: "Tebak minuman dari emoji ini.",
      visual: "🍵 + 🧊",
      choices: ["Es teh", "Kopi susu", "Jus jeruk", "Air putih"],
      answer: "Es teh",
      hint: "Seduhan daun teh yang disajikan dingin.",
    },
    {
      prompt: "Tebak benda dari gabungan emoji ini.",
      visual: "🦷 + 🪥",
      choices: ["Pasta gigi", "Sikat gigi", "Sisir", "Sabun"],
      answer: "Sikat gigi",
      hint: "Dipakai untuk membersihkan gigi setiap hari.",
    },
    {
      prompt: "Tebak tempat dari gabungan emoji ini.",
      visual: "✈️ + 🏢",
      choices: ["Stasiun", "Bandara", "Pelabuhan", "Terminal"],
      answer: "Bandara",
      hint: "Tempat pesawat lepas landas dan mendarat.",
    },
    {
      prompt: "Tebak kegiatan dari emoji ini.",
      visual: "🚲 + 🏞️",
      choices: ["Berkemah", "Bersepeda", "Mendaki", "Berenang"],
      answer: "Bersepeda",
      hint: "Kegiatan mengayuh kendaraan beroda dua.",
    },
    {
      prompt: "Tebak benda dari gabungan emoji ini.",
      visual: "🌧️ + ☂️",
      choices: ["Jas hujan", "Payung", "Topi", "Kipas"],
      answer: "Payung",
      hint: "Dibuka untuk melindungi diri dari hujan.",
    },
    {
      prompt: "Tebak makanan dari gabungan emoji ini.",
      visual: "🍚 + 🍳",
      choices: ["Nasi goreng", "Bubur ayam", "Roti bakar", "Mi kuah"],
      answer: "Nasi goreng",
      hint: "Nasi yang dimasak kembali di wajan.",
    },
    {
      prompt: "Tebak kegiatan dari emoji ini.",
      visual: "🎤 + 🎵",
      choices: ["Menari", "Menyanyi", "Melukis", "Membaca"],
      answer: "Menyanyi",
      hint: "Mengeluarkan suara mengikuti melodi lagu.",
    },
    {
      prompt: "Tebak benda dari gabungan emoji ini.",
      visual: "📱 + 🔋",
      choices: ["Televisi", "Ponsel", "Radio", "Kamera"],
      answer: "Ponsel",
      hint: "Perangkat genggam yang perlu diisi daya.",
    },
    {
      prompt: "Tebak tempat dari gabungan emoji ini.",
      visual: "🐘 + 🦒",
      choices: ["Hutan", "Kebun binatang", "Peternakan", "Akuarium"],
      answer: "Kebun binatang",
      hint: "Tempat melihat berbagai satwa dari dekat.",
    },
  ],
  words: [
    {
      prompt: "Aku punya banyak gigi, tetapi tidak bisa menggigit. Apakah aku?",
      choices: ["Sisir", "Sendok", "Pulpen", "Topi"],
      answer: "Sisir",
      hint: "Kamu memakainya untuk merapikan rambut.",
    },
    {
      prompt: "Semakin banyak diambil dariku, semakin besar aku. Apakah aku?",
      choices: ["Gunung", "Lubang", "Balon", "Laut"],
      answer: "Lubang",
      hint: "Biasanya dibuat dengan menggali tanah.",
    },
    {
      prompt:
        "Aku punya banyak kunci, tetapi tidak bisa membuka pintu. Apakah aku?",
      choices: ["Gembok", "Lemari", "Piano", "Tas"],
      answer: "Piano",
      hint: "Kunci yang dimaksud adalah tuts alat musik.",
    },
    {
      prompt:
        "Aku selalu datang, tetapi tidak pernah menjadi hari ini. Apakah aku?",
      choices: ["Kemarin", "Besok", "Malam", "Pagi"],
      answer: "Besok",
      hint: "Saat ia tiba, namanya berubah menjadi hari ini.",
    },
    {
      prompt: "Aku memiliki leher, tetapi tidak memiliki kepala. Apakah aku?",
      choices: ["Botol", "Kursi", "Meja", "Sepatu"],
      answer: "Botol",
      hint: "Aku bisa diisi air dan ditutup dengan tutup.",
    },
    {
      prompt:
        "Aku semakin pendek setiap kali digunakan untuk menulis. Apakah aku?",
      choices: ["Pulpen", "Pensil", "Kertas", "Penghapus"],
      answer: "Pensil",
      hint: "Ujungku dapat diraut.",
    },
    {
      prompt: "Apa yang menjadi basah saat mengeringkan sesuatu?",
      choices: ["Kipas", "Setrika", "Handuk", "Matahari"],
      answer: "Handuk",
      hint: "Kamu memakainya setelah mandi.",
    },
    {
      prompt: "Punya jarum, tetapi tidak bisa menjahit. Apakah aku?",
      choices: ["Jam", "Benang", "Kain", "Gunting"],
      answer: "Jam",
      hint: "Aku menunjukkan waktu.",
    },
    {
      prompt: "Aku punya kota dan jalan, tetapi tak punya rumah atau kendaraan. Apakah aku?",
      choices: ["Peta", "Buku", "Jendela", "Jam"],
      answer: "Peta",
      hint: "Aku membantu orang mencari arah.",
    },
    {
      prompt: "Aku penuh lubang, tetapi tetap bisa menahan air. Apakah aku?",
      choices: ["Spons", "Keranjang", "Payung", "Kertas"],
      answer: "Spons",
      hint: "Aku menyerap air saat dipakai mencuci.",
    },
    {
      prompt: "Aku memiliki satu mata, tetapi tidak bisa melihat. Apakah aku?",
      choices: ["Jarum", "Kacamata", "Kamera", "Lampu"],
      answer: "Jarum",
      hint: "Benang dimasukkan melalui mataku.",
    },
    {
      prompt: "Apa yang bisa pecah tanpa disentuh?",
      choices: ["Janji", "Batu", "Gelas", "Telur"],
      answer: "Janji",
      hint: "Dilanggar saat seseorang tidak menepati ucapannya.",
    },
    {
      prompt: "Aku bisa terbang tanpa sayap dan menangis tanpa mata. Apakah aku?",
      choices: ["Awan", "Burung", "Pesawat", "Layang-layang"],
      answer: "Awan",
      hint: "Tangisanku turun sebagai hujan.",
    },
    {
      prompt: "Aku punya kaki, tetapi tidak bisa berjalan. Apakah aku?",
      choices: ["Meja", "Sepeda", "Kucing", "Sepatu"],
      answer: "Meja",
      hint: "Kakiku menopang permukaan tempat kamu menaruh barang.",
    },
    {
      prompt: "Aku naik terus, tetapi tidak pernah turun. Apakah aku?",
      choices: ["Umur", "Tangga", "Balon", "Suhu"],
      answer: "Umur",
      hint: "Jumlah tahun sejak kamu lahir.",
    },
    {
      prompt: "Aku punya tangan, tetapi tidak bisa bertepuk. Apakah aku?",
      choices: ["Jam dinding", "Boneka", "Pohon", "Kursi"],
      answer: "Jam dinding",
      hint: "Tanganku menunjuk angka dan waktu.",
    },
    {
      prompt: "Aku selalu di depanmu, tetapi tidak bisa kamu lihat. Apakah aku?",
      choices: ["Masa depan", "Cermin", "Bayangan", "Masa lalu"],
      answer: "Masa depan",
      hint: "Aku belum terjadi.",
    },
    {
      prompt: "Apa yang memiliki banyak halaman, tetapi bukan rumah?",
      choices: ["Buku", "Lemari", "Peta", "Kalender"],
      answer: "Buku",
      hint: "Kamu membalik halamanku saat membaca.",
    },
    {
      prompt: "Aku bisa dibuka, tetapi bukan pintu; aku melindungimu dari hujan. Apakah aku?",
      choices: ["Payung", "Jendela", "Topi", "Jas"],
      answer: "Payung",
      hint: "Saat tidak dipakai, aku dilipat.",
    },
    {
      prompt: "Apa yang mengelilingi rumah tanpa pernah masuk?",
      choices: ["Pagar", "Sepeda", "Kucing", "Angin"],
      answer: "Pagar",
      hint: "Aku menjadi pembatas halaman rumah.",
    },
  ],
  flags: [
    {
      prompt: "Bendera negara manakah ini?",
      visual: "🇯🇵",
      choices: ["Jepang", "Korea Selatan", "Tiongkok", "Bangladesh"],
      answer: "Jepang",
      hint: "Negara ini dikenal sebagai Negeri Matahari Terbit.",
    },
    {
      prompt: "Bendera negara manakah ini?",
      visual: "🇧🇷",
      choices: ["Argentina", "Brasil", "Portugal", "Meksiko"],
      answer: "Brasil",
      hint: "Negara terbesar di Amerika Selatan.",
    },
    {
      prompt: "Bendera negara manakah ini?",
      visual: "🇨🇦",
      choices: ["Amerika Serikat", "Kanada", "Inggris", "Swiss"],
      answer: "Kanada",
      hint: "Daun maple adalah simbol negara ini.",
    },
    {
      prompt: "Bendera negara manakah ini?",
      visual: "🇰🇷",
      choices: ["Jepang", "Korea Utara", "Korea Selatan", "Vietnam"],
      answer: "Korea Selatan",
      hint: "Negara asal K-pop dan kimchi.",
    },
    {
      prompt: "Bendera negara manakah ini?",
      visual: "🇦🇺",
      choices: ["Selandia Baru", "Inggris", "Australia", "Amerika Serikat"],
      answer: "Australia",
      hint: "Kanguru dan koala berasal dari sini.",
    },
    {
      prompt: "Bendera negara manakah ini?",
      visual: "🇨🇭",
      choices: ["Denmark", "Swiss", "Swedia", "Norwegia"],
      answer: "Swiss",
      hint: "Terkenal dengan cokelat, jam tangan, dan Pegunungan Alpen.",
    },
    {
      prompt: "Bendera negara manakah ini?",
      visual: "🇬🇧",
      choices: ["Prancis", "Britania Raya", "Italia", "Belanda"],
      answer: "Britania Raya",
      hint: "Negara gabungan yang mencakup Inggris, Skotlandia, Wales, dan Irlandia Utara.",
    },
    {
      prompt: "Bendera negara manakah ini?",
      visual: "🇮🇳",
      choices: ["Irlandia", "India", "Italia", "Iran"],
      answer: "India",
      hint: "Taj Mahal berada di negara ini.",
    },
    {
      prompt: "Bendera negara manakah ini?",
      visual: "🇮🇩",
      choices: ["Indonesia", "Monako", "Singapura", "Polandia"],
      answer: "Indonesia",
      hint: "Negara kepulauan dengan ibu kota Jakarta.",
    },
    {
      prompt: "Bendera negara manakah ini?",
      visual: "🇫🇷",
      choices: ["Belanda", "Prancis", "Italia", "Rusia"],
      answer: "Prancis",
      hint: "Menara Eiffel ada di ibu kotanya.",
    },
    {
      prompt: "Bendera negara manakah ini?",
      visual: "🇩🇪",
      choices: ["Belgia", "Jerman", "Austria", "Spanyol"],
      answer: "Jerman",
      hint: "Berlin adalah ibu kotanya.",
    },
    {
      prompt: "Bendera negara manakah ini?",
      visual: "🇮🇹",
      choices: ["Irlandia", "Meksiko", "Italia", "Hungaria"],
      answer: "Italia",
      hint: "Roma dan Menara Pisa berada di negara ini.",
    },
    {
      prompt: "Bendera negara manakah ini?",
      visual: "🇺🇸",
      choices: ["Amerika Serikat", "Liberia", "Malaysia", "Britania Raya"],
      answer: "Amerika Serikat",
      hint: "Benderanya memiliki 50 bintang.",
    },
    {
      prompt: "Bendera negara manakah ini?",
      visual: "🇲🇾",
      choices: ["Singapura", "Malaysia", "Indonesia", "Thailand"],
      answer: "Malaysia",
      hint: "Menara Kembar Petronas berada di negara ini.",
    },
    {
      prompt: "Bendera negara manakah ini?",
      visual: "🇸🇬",
      choices: ["Monako", "Singapura", "Indonesia", "Vietnam"],
      answer: "Singapura",
      hint: "Negara kota ini dikenal dengan patung Merlion.",
    },
    {
      prompt: "Bendera negara manakah ini?",
      visual: "🇹🇭",
      choices: ["Thailand", "Kamboja", "Laos", "Myanmar"],
      answer: "Thailand",
      hint: "Bangkok adalah ibu kotanya.",
    },
    {
      prompt: "Bendera negara manakah ini?",
      visual: "🇻🇳",
      choices: ["Tiongkok", "Vietnam", "Maroko", "Turki"],
      answer: "Vietnam",
      hint: "Bendera merahnya memiliki satu bintang kuning besar.",
    },
    {
      prompt: "Bendera negara manakah ini?",
      visual: "🇳🇿",
      choices: ["Australia", "Selandia Baru", "Britania Raya", "Fiji"],
      answer: "Selandia Baru",
      hint: "Burung kiwi menjadi simbol negara ini.",
    },
    {
      prompt: "Bendera negara manakah ini?",
      visual: "🇿🇦",
      choices: ["Afrika Selatan", "Kenya", "Nigeria", "Ghana"],
      answer: "Afrika Selatan",
      hint: "Cape Town adalah salah satu ibu kotanya.",
    },
    {
      prompt: "Bendera negara manakah ini?",
      visual: "🇪🇬",
      choices: ["Mesir", "Irak", "Yaman", "Suriah"],
      answer: "Mesir",
      hint: "Piramida Giza berada di negara ini.",
    },
  ],
}

function shuffled<T>(items: T[]): T[] {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[randomIndex]] = [result[randomIndex], result[index]]
  }
  return result
}

export function GameArtwork({
  game,
  hero = false,
}: {
  game: Game
  hero?: boolean
}) {
  return (
    <div
      aria-hidden="true"
      className={
        "absolute inset-0 overflow-hidden bg-gradient-to-br " + game.backdrop
      }
    >
      <span className="absolute -top-8 -right-4 size-52 rounded-full border border-white/10" />
      <span className="absolute -right-20 bottom-0 size-72 rounded-full border border-white/5" />
      <span className="absolute top-4 left-5 text-3xl font-bold text-white/10">
        ✦
      </span>
      <div
        className={
          hero
            ? "absolute inset-y-0 right-6 hidden w-[48%] flex-col items-center justify-center gap-7 md:flex"
            : "absolute inset-x-0 top-6 flex items-center justify-center gap-3 transition duration-500 group-hover:-translate-y-1"
        }
      >
        {hero && (
          <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[10px] font-semibold tracking-[0.15em] text-white/60">
            SATU PETUNJUK. BANYAK PENASARAN.
          </span>
        )}
        <div className="flex items-center gap-3 sm:gap-5">
          {game.glyphs.map((glyph, index) => (
            <span
              key={index}
              className={
                (hero
                  ? "flex size-24 items-center justify-center rounded-2xl border border-white/20 bg-white/10 font-display text-6xl shadow-2xl backdrop-blur-md xl:size-32 xl:text-7xl "
                  : "flex size-14 items-center justify-center rounded-xl border border-white/15 bg-white/10 font-display text-4xl shadow-lg ") +
                (index % 2 ? "rotate-6" : "-rotate-6")
              }
            >
              {glyph}
            </span>
          ))}
        </div>
        {hero && (
          <>
            <span className="font-display text-xl font-semibold text-white/85">
              Kira-kira, apa jawabannya?
            </span>
            <span className="text-xs text-white/45">
              Coba tebak. Buktikan kalau kamu tahu.
            </span>
          </>
        )}
      </div>
    </div>
  )
}

export default function GameModal({
  game,
  onClose,
  onScore,
}: {
  game: Game
  onClose: () => void
  onScore: (id: string, score: number) => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [phase, setPhase] = useState("idle")
  const [levelIndex, setLevelIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const deadlineRef = useRef(0)
  const scoreRef = useRef(0)
  const [questions, setQuestions] = useState<Question[]>([])
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [awarded, setAwarded] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [hintUsed, setHintUsed] = useState(false)
  const [secret, setSecret] = useState(0)
  const [guess, setGuess] = useState("")
  const [guesses, setGuesses] = useState<number[]>([])
  const [range, setRange] = useState([1, 100])
  const [feedback, setFeedback] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const question = questions[round]
  const isNumber = game.mode === "numbers"
  const budget = timeBudget(levels[levelIndex].seconds, isNumber)

  useEffect(() => {
    if (phase !== "playing" || !budget || (!isNumber && selected !== null))
      return
    const interval = window.setInterval(() => {
      const remaining = Math.max(
        0,
        Math.ceil((deadlineRef.current - Date.now()) / 1000),
      )
      setTimeLeft(remaining)
      if (remaining === 0) {
        window.clearInterval(interval)
        if (isNumber) {
          setPhase("lost")
          onScore(game.id, scoreRef.current)
        } else {
          setSelected("")
        }
      }
    }, 250)
    return () => window.clearInterval(interval)
  }, [phase, round, selected, budget, isNumber, game.id, onScore])

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement
    dialogRef.current?.showModal()
    return () => previousFocus?.focus()
  }, [])

  function startGame() {
    setRound(0)
    setScore(0)
    scoreRef.current = 0
    setAwarded(0)
    setCorrectCount(0)
    setSelected(null)
    setHintUsed(false)
    setGuesses([])
    setGuess("")
    setFeedback("")
    setRange([1, 100])
    setTimeLeft(budget)
    if (budget) deadlineRef.current = Date.now() + budget * 1000
    if (isNumber) setSecret(Math.floor(Math.random() * 100) + 1)
    else
      setQuestions(
        shuffled(questionBanks[game.mode] || [])
          .slice(0, 5)
          .map((item) => ({ ...item, choices: shuffled(item.choices) })),
      )
    setPhase("playing")
    if (isNumber) requestAnimationFrame(() => inputRef.current?.focus())
  }

  function chooseAnswer(answer: string) {
    if (selected !== null || (budget && Date.now() >= deadlineRef.current))
      return
    setSelected(answer)
    if (answer === question.answer) {
      const remaining = budget
        ? Math.max(0, (deadlineRef.current - Date.now()) / 1000)
        : 0
      const points = roundScore(hintUsed ? 50 : 100, remaining, budget)
      setAwarded(points)
      scoreRef.current += points
      setScore(scoreRef.current)
      setCorrectCount((previous) => previous + 1)
    }
  }

  function nextQuestion() {
    if (round === questions.length - 1) {
      setPhase("done")
      onScore(game.id, scoreRef.current)
    } else {
      setRound((previous) => previous + 1)
      setSelected(null)
      setAwarded(0)
      setHintUsed(false)
      if (budget) {
        setTimeLeft(budget)
        deadlineRef.current = Date.now() + budget * 1000
      }
    }
  }

  function submitGuess(event: React.FormEvent) {
    event.preventDefault()
    if (phase !== "playing" || (budget && Date.now() >= deadlineRef.current))
      return
    const value = Number(guess)
    if (!guess.trim() || !Number.isInteger(value) || value < 1 || value > 100) {
      setFeedback("Masukkan bilangan bulat dari 1 sampai 100.")
      return
    }
    if (guesses.includes(value)) {
      setFeedback("Angka ini sudah kamu tebak. Coba angka lain!")
      return
    }
    if (value < range[0] || value > range[1]) {
      setFeedback(`Pilih angka antara ${range[0]} dan ${range[1]}.`)
      return
    }
    const history = [...guesses, value]
    setGuesses(history)
    setGuess("")
    if (value === secret) {
      const remaining = budget
        ? Math.max(0, (deadlineRef.current - Date.now()) / 1000)
        : 0
      const points = roundScore((8 - history.length) * 100, remaining, budget)
      scoreRef.current = points
      setScore(points)
      setPhase("done")
      onScore(game.id, points)
    } else if (history.length === 7) {
      scoreRef.current = 0
      setScore(0)
      setPhase("lost")
      onScore(game.id, 0)
    } else {
      if (value < secret) {
        setFeedback("Masih terlalu kecil! Coba angka yang lebih besar. ↑")
        setRange((previous) => [Math.max(previous[0], value + 1), previous[1]])
      } else {
        setFeedback("Masih terlalu besar! Coba angka yang lebih kecil. ↓")
        setRange((previous) => [previous[0], Math.min(previous[1], value - 1)])
      }
      inputRef.current?.focus()
    }
  }

  return (
    <dialog
      ref={dialogRef}
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      className="fixed inset-0 m-auto max-h-[92dvh] w-[calc(100%-32px)] max-w-2xl overflow-y-auto rounded-2xl border border-border bg-[#191a1e] p-0 text-foreground shadow-2xl backdrop:bg-black/80 backdrop:backdrop-blur-sm"
    >
      <div className="flex items-center justify-between border-b border-border px-6 py-5">
        <div>
          <span className="text-[10px] font-bold tracking-[0.18em] text-primary">
            TEBAK-TEBAKAN PLAYZONE
          </span>
          <h2 className="mt-1 font-display text-2xl font-semibold">
            {game.title}
          </h2>
        </div>
        <button
          onClick={onClose}
          aria-label="Tutup permainan"
          className="rounded-full bg-white/5 p-2 transition hover:bg-white/10"
        >
          <X size={20} />
        </button>
      </div>
      <div className="p-6 sm:p-8">
        {phase === "idle" && (
          <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-border bg-background p-6 text-center">
            <span className="mb-5 text-6xl">{game.glyphs[0]}</span>
            <h3 className="font-display text-2xl font-semibold">
              Seberapa jago tebakanmu?
            </h3>
            <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
              {game.description}
            </p>
            <span className="mt-4 text-xs text-primary">
              {isNumber
                ? "1 angka rahasia · 7 kesempatan"
                : "5 soal acak · 100 poin per jawaban"}
            </span>
            <fieldset className="mt-6 w-full max-w-sm">
              <legend className="mb-3 text-xs font-semibold text-muted-foreground">
                Pilih tingkat kesulitan
              </legend>
              <div className="grid grid-cols-3 gap-2">
                {levels.map((level, index) => (
                  <label
                    key={level.label}
                    className={`cursor-pointer rounded-lg border px-2 py-3 text-xs transition focus-within:ring-2 focus-within:ring-primary ${
                      levelIndex === index
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-white/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="difficulty"
                      value={index}
                      checked={levelIndex === index}
                      onChange={() => setLevelIndex(index)}
                      className="sr-only"
                    />
                    <span className="block font-semibold">{level.label}</span>
                    <span className="mt-1 block text-[10px]">
                      {level.seconds
                        ? `${timeBudget(level.seconds, isNumber)} detik ${isNumber ? "total" : "per soal"}`
                        : "Tanpa timer"}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <button
              onClick={startGame}
              className="mt-6 flex items-center gap-2 rounded-lg bg-primary px-7 py-3 font-bold text-background hover:bg-lime-200"
            >
              <Play size={17} fill="currentColor" /> Mulai menebak
            </button>
          </div>
        )}
        {phase === "playing" && !isNumber && question && (
          <>
            <div className="mb-5 flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Soal {round + 1} dari {questions.length}
              </span>
              <span className="flex items-center gap-3 font-semibold text-primary">
                {budget > 0 && (
                  <span
                    role="timer"
                    aria-label={`${timeLeft} detik tersisa`}
                    className={
                      timeLeft <= 5
                        ? "flex items-center gap-1 text-red-300"
                        : "flex items-center gap-1 text-amber-200"
                    }
                  >
                    <Timer size={14} /> {timeLeft}s
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Trophy size={14} /> {score} poin
                </span>
              </span>
            </div>
            <div className="mb-6 flex gap-1.5">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={
                    "h-1 flex-1 rounded-full " +
                    (index <= round ? "bg-primary" : "bg-white/10")
                  }
                />
              ))}
            </div>
            <div
              className={
                "flex min-h-40 flex-col items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br px-5 py-7 text-center " +
                game.backdrop
              }
            >
              {question.visual && (
                <span
                  role="img"
                  aria-label={
                    game.mode === "flags"
                      ? "Bendera negara yang harus ditebak"
                      : "Petunjuk emoji: " + question.visual
                  }
                  className={
                    game.mode === "flags"
                      ? "mb-5 text-8xl"
                      : "mb-5 text-5xl sm:text-6xl"
                  }
                >
                  {question.visual}
                </span>
              )}
              <h3 className="max-w-md font-display text-xl leading-8 font-medium">
                {question.prompt}
              </h3>
            </div>
            <p className="mt-5 mb-3 text-xs text-muted-foreground">
              Pilih jawabanmu:
            </p>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {question.choices.map((choice, index) => (
                <button
                  key={choice}
                  disabled={selected !== null}
                  onClick={() => chooseAnswer(choice)}
                  className={
                    "flex items-center gap-3 rounded-lg border p-3.5 text-left text-sm font-medium transition " +
                    (selected !== null && choice === question.answer
                      ? "border-primary/60 bg-primary/10 text-primary"
                      : selected === choice
                        ? "border-red-400/50 bg-red-500/10 text-red-300"
                        : "border-border bg-white/[0.025] hover:border-primary/50 hover:bg-white/5")
                  }
                >
                  <span className="flex size-6 shrink-0 items-center justify-center rounded bg-white/5 text-[10px] text-muted-foreground">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {choice}
                  {selected !== null && choice === question.answer && (
                    <Check size={16} className="ml-auto shrink-0" />
                  )}
                </button>
              ))}
            </div>
            {selected === null && (
              <button
                onClick={() => setHintUsed(true)}
                disabled={hintUsed}
                className="mt-5 flex items-center gap-2 text-xs text-amber-200 hover:text-amber-100"
              >
                <Lightbulb size={15} />
                {hintUsed
                  ? budget
                    ? "Petunjuk dibuka · 50 poin dasar + bonus kecepatan"
                    : "Petunjuk dibuka · jawaban benar bernilai 50 poin"
                  : budget
                    ? "Butuh petunjuk? (poin dasar berkurang 50)"
                    : "Butuh petunjuk? (−50 poin jika benar)"}
              </button>
            )}
            {hintUsed && (
              <p className="mt-3 rounded-lg border border-amber-200/15 bg-amber-200/5 p-3 text-sm leading-6 text-amber-100">
                {question.hint}
              </p>
            )}
            {selected !== null && (
              <div className="mt-5" aria-live="polite">
                <p
                  className={
                    "text-sm font-semibold " +
                    (selected === question.answer
                      ? "text-primary"
                      : "text-red-300")
                  }
                >
                  {selected === question.answer
                    ? `Benar! Kamu jago juga. +${awarded} poin`
                    : selected === ""
                      ? `Waktu habis! Jawabannya: ${question.answer}.`
                      : `Belum tepat. Jawabannya: ${question.answer}.`}
                </p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {question.hint}
                </p>
                <button
                  onClick={nextQuestion}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-bold text-background hover:bg-lime-200"
                >
                  {round === questions.length - 1
                    ? "Lihat hasil"
                    : "Soal berikutnya"}
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
        {phase === "playing" && isNumber && (
          <>
            <div className="mb-5 flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Kesempatan tersisa:{" "}
                <strong className="text-primary">{7 - guesses.length}</strong>
              </span>
              <span className="flex items-center gap-2">
                {budget > 0 && (
                  <span
                    role="timer"
                    aria-label={`${timeLeft} detik tersisa`}
                    className={
                      timeLeft <= 10
                        ? "flex items-center gap-1 text-red-300"
                        : "flex items-center gap-1 text-amber-200"
                    }
                  >
                    <Timer size={14} /> {timeLeft}s
                  </span>
                )}
                Angka 1–100
              </span>
            </div>
            <div className="rounded-xl border border-white/10 bg-gradient-to-br from-[#4c3525] to-[#241e19] p-8 text-center">
              <span className="font-display text-8xl font-bold text-amber-200">
                ?
              </span>
              <h3 className="mt-3 font-display text-xl">
                Berapa angka rahasiaku?
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Petunjuk saat ini: antara{" "}
                <span className="text-amber-200">
                  {range[0]} dan {range[1]}
                </span>
              </p>
            </div>
            <form onSubmit={submitGuess} className="mt-5">
              <label
                htmlFor="number-guess"
                className="mb-2 block text-xs text-muted-foreground"
              >
                Masukkan tebakanmu
              </label>
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  id="number-guess"
                  type="number"
                  required
                  min={range[0]}
                  max={range[1]}
                  step={1}
                  value={guess}
                  onChange={(event) => setGuess(event.target.value)}
                  placeholder="1 sampai 100"
                  className="min-w-0 flex-1 rounded-lg border border-border bg-background px-4 py-3 text-sm"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-primary px-5 py-3 text-sm font-bold text-background hover:bg-lime-200"
                >
                  Tebak <span aria-hidden="true">→</span>
                </button>
              </div>
            </form>
            <p
              aria-live="polite"
              className="mt-4 min-h-10 text-sm leading-6 text-amber-200"
            >
              {feedback || "Tips: mulai dari 50, lalu persempit rentangnya."}
            </p>
            {guesses.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {guesses.map((value) => (
                  <span
                    key={value}
                    className="rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground"
                  >
                    {value} {value < secret ? "↑" : "↓"}
                  </span>
                ))}
              </div>
            )}
          </>
        )}
        {["done", "lost"].includes(phase) && (
          <>
            <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-primary/20 bg-primary/5 p-7 text-center">
              <span className="mb-4 text-5xl">
                {phase === "lost" ? "💡" : score > 0 ? "🏆" : "🌱"}
              </span>
              <h3 className="font-display text-2xl font-semibold">
                {phase === "lost"
                  ? budget > 0 && timeLeft === 0
                    ? "Waktu habis. Coba lagi, yuk!"
                    : "Kesempatan habis. Coba lagi, yuk!"
                  : isNumber
                    ? "Angkanya ketemu!"
                    : correctCount === 5
                      ? "Sempurna! Semua tebakan benar."
                      : "Tebakanmu sudah selesai!"}
              </h3>
              {isNumber && (
                <p className="mt-3 text-sm text-muted-foreground">
                  Angka rahasianya{" "}
                  <strong className="text-white">{secret}</strong>.{" "}
                  {phase === "done"
                    ? "Ketemu dalam " + guesses.length + " tebakan."
                    : "Gunakan petunjuk untuk mempersempit pilihan."}
                </p>
              )}
              <p className="mt-4 font-display text-4xl font-bold text-primary">
                {score} <span className="text-lg font-medium">poin</span>
              </p>
              {!isNumber && (
                <p className="mt-3 text-sm text-muted-foreground">
                  {correctCount} dari 5 jawaban benar
                </p>
              )}
              <p className="mt-3 text-xs text-muted-foreground">
                Skor terbaik tersimpan di perangkat ini.
              </p>
            </div>
            <button
              onClick={startGame}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-bold text-background hover:bg-lime-200"
            >
              <RotateCcw size={17} /> Tebak lagi
            </button>
          </>
        )}
      </div>
    </dialog>
  )
}
