import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { runInNewContext } from "node:vm"
import ts from "typescript"

const source = readFileSync(new URL("./GuessingGame.tsx", import.meta.url), "utf8")
const bankSource = source.slice(source.indexOf("export const questionBanks"), source.indexOf("function shuffled"))
const script = ts.transpileModule(bankSource.replace("export const questionBanks", "const questionBanks"), {
  compilerOptions: { target: ts.ScriptTarget.ES2022 },
}).outputText
const questionBanks = runInNewContext(`${script}\nquestionBanks`) as Record<string, {
  prompt: string
  visual?: string
  choices: string[]
  answer: string
  hint: string
}[]>

for (const mode of ["emoji", "words", "flags"] as const) {
  const questions = questionBanks[mode] ?? []
  assert.ok(questions.length >= 20, `${mode}: butuh minimal 20 soal`)
  assert.equal(new Set(questions.map((question) => question.prompt + question.visual)).size, questions.length, `${mode}: soal duplikat`)
  for (const question of questions) {
    assert.equal(question.choices.length, 4, `${mode}: pilihan harus 4`)
    assert.equal(new Set(question.choices).size, 4, `${mode}: pilihan duplikat`)
    assert.ok(question.choices.includes(question.answer), `${mode}: jawaban tidak ada dalam pilihan`)
    assert.ok(question.hint.trim(), `${mode}: petunjuk kosong`)
  }
}

console.log("Bank soal valid")
