#!/usr/bin/env node
/**
 * buduj-filtr.mjs — z krótkiego planu JSON robi gotowy skrypt filtra ffmpeg.
 *
 * PO CO TO JEST (wersja Premium):
 * Bez tego narzędzia AI musi przy KAŻDYM montażu wypisać od zera kilkaset linii
 * `-filter_complex` i za każdym razem od nowa pamiętać o wszystkich pułapkach
 * ffmpeg. To kosztuje mnóstwo tokenów i co jakiś czas kończy się błędem.
 * Tutaj AI pisze tylko krótki plan (kilkanaście linii JSON), a cała reszta
 * powstaje sama, z wbudowanymi zabezpieczeniami przed błędami, które
 * kosztowały nas realne godziny:
 *
 *  - zoom przez `zoompan` (a nie `scale` z wyrażeniem czasowym, które segfaultuje)
 *  - `enable=` na KAŻDEJ nakładce (bez tego element zostaje na ekranie do końca)
 *  - jawny `split` przed dwukrotnym użyciem tego samego strumienia
 *  - ścieżki Windows w apostrofach (inaczej parser wywala się na `C:`)
 *
 * UŻYCIE:
 *   node narzedzia/buduj-filtr.mjs plan.json                 -> wypisuje polecenie
 *   node narzedzia/buduj-filtr.mjs plan.json --zapisz montaz -> pisze montaz.sh + montaz.filter
 *   node narzedzia/buduj-filtr.mjs plan.json --podglad       -> szybki podgląd (540p, 30 fps)
 */

import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const planPath = args[0];
if (!planPath) {
  console.error("Podaj plik planu, np.: node narzedzia/buduj-filtr.mjs plan.json");
  process.exit(1);
}
const podglad = args.includes("--podglad");
const zapiszIdx = args.indexOf("--zapisz");
const zapiszNazwa = zapiszIdx !== -1 ? args[zapiszIdx + 1] : null;

const plan = JSON.parse(fs.readFileSync(planPath, "utf8"));

/* ---------- domyślne wartości: styl ECHO ---------- */
const D = {
  szerokosc: 1080,
  wysokosc: 1920,
  fps: 60,
  glos: 1.35,          // wzmocnienie głosu, sprawdzone na short-01
  muzykaGlosnosc: 0.13, // muzyka cicho pod głosem
  zoomAmplituda: 0.015, // "oddychający" zoom
  zoomOkres: 6,         // sekundy pełnego cyklu
  punchSila: 0.06,      // zoom-punch na cięciu
  punchCzas: 0.35       // jak szybko punch wygasa
};

const W_DOCEL = plan.szerokosc || D.szerokosc;
const H_DOCEL = plan.wysokosc || D.wysokosc;
const W = podglad ? Math.round(W_DOCEL / 2) : W_DOCEL;
const H = podglad ? Math.round(H_DOCEL / 2) : H_DOCEL;
const FPS = podglad ? 30 : (plan.fps || D.fps);

// W podglądzie baza jest mniejsza, więc nakładki i ich pozycje MUSZĄ zjechać
// razem z nią. Bez tego podgląd pokazuje efekty w złych miejscach albo poza
// kadrem i nie da się na nim niczego zweryfikować.
const SKALA = W / W_DOCEL;
const skaluj = (v) => Math.round(v * SKALA);

/** Ścieżka bezpieczna dla parsera filtrów ffmpeg na Windows. */
function sciezkaDlaFiltra(p) {
  return "'" + String(p).replace(/\\/g, "/").replace(/:/g, "\\:").replace(/'/g, "\\'") + "'";
}

const czesci = [];
const wejscia = [plan.wejscie];
let kolejneWejscie = 1;

/* ---------- 1. baza: skala, zoom oddychający + punche ---------- */
let zoomWyr = "1.0";
const z = plan.zoom || {};
const amp = z.amplituda !== undefined ? z.amplituda : D.zoomAmplituda;
const okres = z.okres || D.zoomOkres;
if (z.wylaczony !== true) {
  // UWAGA: zmienna nazywa się `time`, nie `t`. Z `t` ffmpeg 8.x pada.
  zoomWyr += `+${amp}*sin(2*PI*time/${okres})`;
}
for (const p of plan.punche || []) {
  const sila = p.sila !== undefined ? p.sila : D.punchSila;
  const czas = p.czas !== undefined ? p.czas : D.punchCzas;
  // wykładniczo gasnący skok w górę od momentu cięcia
  zoomWyr += `+if(between(time,${p.t},${p.t + czas}),${sila}*exp(-(time-${p.t})*${(3 / czas).toFixed(2)}),0)`;
}

// JAKOŚĆ: zoompan powiększa obraz, więc jeśli najpierw zejdziemy do docelowych
// 1080x1920, to zoom rozciąga już zmniejszony materiał i obraz robi się miękki.
// Dlatego pracujemy z zapasem (1.5x) i dopiero na końcu schodzimy do docelowej
// rozdzielczości filtrem lanczos, który przy zmniejszaniu wyostrza.
const ZAPAS = podglad ? 1 : 1.5;
const WP = Math.round((W * ZAPAS) / 2) * 2;
const HP = Math.round((H * ZAPAS) / 2) * 2;
const zejscie = ZAPAS > 1 ? `,scale=${W}:${H}:flags=lanczos` : "";

czesci.push(
  `[0:v]scale=${WP}:${HP}:force_original_aspect_ratio=increase:flags=lanczos,` +
  `crop=${WP}:${HP},` +
  `zoompan=z='${zoomWyr}':d=1:s=${WP}x${HP}:fps=${FPS}${zejscie},setsar=1[baza]`
);
let biezacy = "baza";

/* ---------- 2. napisy (POD interludiami) ----------
   Napisy ida zaraz po bazie, zeby pelnoekranowe interludium je zakrylo.
   Tak wymaga styl: pod slamami i w interludiach napisow nie ma. */
if (plan.napisy) {
  czesci.push(`[${biezacy}]ass=${sciezkaDlaFiltra(plan.napisy)}[z_napisami]`);
  biezacy = "z_napisami";
}

/* ---------- 3. cutawaye pełnoekranowe ---------- */
(plan.cutawaye || []).forEach((c, i) => {
  wejscia.push(c.plik);
  const idx = kolejneWejscie++;
  const et = `cut${i}`;
  czesci.push(
    `[${idx}:v]scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},` +
    `setpts=PTS+${c.od}/TB[${et}]`
  );
  czesci.push(
    `[${biezacy}][${et}]overlay=0:0:enable='between(t,${c.od},${c.do})':eof_action=pass[po_${et}]`
  );
  biezacy = `po_${et}`;
});

/* ---------- 4. nakładki z alfą (Remotion), na samej górze ---------- */
(plan.nakladki || []).forEach((n, i) => {
  wejscia.push(n.plik);
  const idx = kolejneWejscie++;
  const et = `nak${i}`;
  const x = skaluj(n.x !== undefined ? n.x : 0);
  const y = skaluj(n.y !== undefined ? n.y : 0);
  // Szerokość: albo podana w planie, albo naturalna. W podglądzie i tak
  // przeskalowana tym samym współczynnikiem co baza.
  const szer = n.szerokosc ? skaluj(n.szerokosc) : null;
  const skala = szer ? `scale=${szer}:-1,` : (podglad ? `scale=iw*${SKALA}:-1,` : "");
  czesci.push(`[${idx}:v]${skala}setpts=PTS+${n.od}/TB[${et}]`);
  // enable na KAŻDEJ nakładce, inaczej zostaje do końca materiału
  czesci.push(
    `[${biezacy}][${et}]overlay=${x}:${y}:enable='between(t,${n.od},${n.do})':eof_action=pass[po_${et}]`
  );
  biezacy = `po_${et}`;
});

/* ---------- 5. wyjście wideo ---------- */
{
  czesci.push(`[${biezacy}]null[wyj_v]`);
}

/* ---------- 5. audio: głos + muzyka z duckingiem ---------- */
const glos = plan.glos !== undefined ? plan.glos : D.glos;
let audioWyj = "wyj_a";
if (plan.muzyka && plan.muzyka.plik) {
  wejscia.push(plan.muzyka.plik);
  const idx = kolejneWejscie++;
  const vol = plan.muzyka.glosnosc !== undefined ? plan.muzyka.glosnosc : D.muzykaGlosnosc;
  czesci.push(`[0:a]volume=${glos}[gl]`);
  czesci.push(`[${idx}:a]volume=${vol},afade=t=out:st=${(plan.dlugosc || 60) - 2}:d=2[mu]`);
  czesci.push(`[gl][mu]amix=inputs=2:duration=first:dropout_transition=0[${audioWyj}]`);
} else {
  czesci.push(`[0:a]volume=${glos}[${audioWyj}]`);
}

/* ---------- złożenie polecenia ---------- */
const filtr = czesci.join(";\n");
const wejsciaArg = wejscia.map((w) => `-i "${w}"`).join(" ");
// Finalny render idzie wysoko: crf 15 plus sufit bitrate'u, żeby szybkie
// ruchy i ziarno nie rozsypywały się w bloki po kompresji Instagrama.
const jakosc = podglad
  ? "-c:v libx264 -preset ultrafast -crf 30"
  : "-c:v libx264 -preset slow -crf 15 -maxrate 18M -bufsize 36M " +
    "-profile:v high -level 4.2 -pix_fmt yuv420p -movflags +faststart";
const wyjscie = podglad
  ? (plan.wyjscie || "out.mp4").replace(/\.mp4$/, "-PODGLAD.mp4")
  : (plan.wyjscie || "out.mp4");

const polecenie =
  `ffmpeg -y ${wejsciaArg} \\\n` +
  `  -filter_complex_script filtr.txt \\\n` +
  `  -map "[wyj_v]" -map "[${audioWyj}]" \\\n` +
  `  ${jakosc} -c:a aac -b:a 192k -r ${FPS} \\\n` +
  `  "${wyjscie}"`;

if (zapiszNazwa) {
  const katalog = path.dirname(path.resolve(zapiszNazwa));
  fs.writeFileSync(path.join(katalog, "filtr.txt"), filtr, "utf8");
  fs.writeFileSync(
    zapiszNazwa.endsWith(".sh") ? zapiszNazwa : zapiszNazwa + ".sh",
    "#!/bin/bash\nset -e\nexport MSYS2_ARG_CONV_EXCL=\"*\"\n" + polecenie + "\n",
    "utf8"
  );
  console.log("Zapisane: filtr.txt oraz " + zapiszNazwa + (zapiszNazwa.endsWith(".sh") ? "" : ".sh"));
  console.log(podglad ? "Tryb: PODGLĄD (540x960, 30 fps)" : "Tryb: PEŁNA JAKOŚĆ");
} else {
  console.log("=== filtr.txt ===");
  console.log(filtr);
  console.log("\n=== polecenie ===");
  console.log(polecenie);
}
