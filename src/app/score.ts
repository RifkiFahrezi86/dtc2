// ponytail: Tingkat kesulitan mengubah waktu saja; pisahkan bank soal saat konten bertingkat tersedia.
export const levels = [
  { label: "Mudah", seconds: 0 },
  { label: "Menengah", seconds: 20 },
  { label: "Sulit", seconds: 10 },
]

/** Total detik yang tersedia: per soal untuk pilihan ganda, total untuk Tebak Angka. */
export function timeBudget(seconds: number, isNumber: boolean) {
  return isNumber ? seconds * 7 : seconds
}

/** Poin satu soal: nilai dasar plus bonus kecepatan hingga +50% saat timer aktif. */
export function roundScore(base: number, timeLeft: number, budget: number) {
  if (!budget) return base
  const clamped = Math.min(Math.max(timeLeft, 0), budget)
  return base + Math.round((clamped / budget) * base * 0.5)
}
