# ECHO — Skill montażu z AI, wersja PREMIUM

Rozszerzona wersja zestawu, dzięki któremu AI montuje Twoje rolki: napisy karaoke,
zoomy, animowane efekty (Remotion), muzyka i cięcia.

**Dostęp tylko dla posiadaczy pakietu Premium.** Nie udostępniaj dalej.

## Instalacja

Skopiuj komendę ze swojej sekcji Premium na stronie kursu i wklej do Claude.
Reszta zrobi się sama: podmieni skill na wersję Premium i doinstaluje nowe efekty.

Jeśli masz w skillu własne notatki o swoim stylu montażu, **nie zostaną skasowane**,
komenda pilnuje, żeby je przenieść.

## Co dochodzi ponad wersję podstawową

**1. Generator filtra ffmpeg** — `narzedzia/buduj-filtr.mjs`

Zamiast pisać setki linii `-filter_complex` przy każdym montażu, AI pisze kilkanaście
linijek planu JSON, a resztę generuje narzędzie. Sam dokłada zabezpieczenia przed
błędami, które w wersji podstawowej trzeba pamiętać za każdym razem (zoom przez
`zoompan`, `enable=` na każdej nakładce, apostrofy w ścieżkach Windows).
**Efekt: montaż zużywa wyraźnie mniej tokenów i rzadziej się wykłada.**

**2. Transkrypcja z pamięcią podręczną** — `narzedzia/transkrypcja.py`

Whisper liczy się raz na plik, każde kolejne uruchomienie na tym samym nagraniu jest
natychmiastowe. Od razu wypluwa gotowe napisy karaoke `.ass` w stylu ECHO, bez
składania ich ręcznie.

**3. Tryb szybkiego podglądu**

Render 540x960 przy 30 fps do akceptacji, pełna jakość dopiero po „ok".
Przy kilku poprawkach to największa oszczędność czasu w całym procesie.

**4. Dwanaście nowych efektów** — `remotion-montaz/src/compsPremium.tsx`

`chapter-label`, `multi-countup`, `light-sweep`, `badge-2kolory`, `karta-czasu`,
`strzalka`, `glitch`, `scramble`, `marker`, `money-counter`, `typewriter`,
`emoji-burst`.

Wszystkie sterowane propsami, więc jedna kompozycja obsługuje wiele momentów bez
pisania nowego kodu. Sześć pierwszych to techniki, które wersja podstawowa wymieniała
jako „warto wypróbować" po analizie cudzych rolek. Tutaj są już gotowe.

## Co jest w środku (z wersji podstawowej)

- `.claude/skills/montaz/SKILL.md` — skill montażu, rozszerzony o instrukcje Premium
- `remotion-montaz/` — **80 kompozycji** (68 bazowych + 12 Premium)
- `wiedza-styl/` — analizy stylu montażu, na których uczył się skill
- `narzedzia/` — narzędzia Premium (generator filtra, transkrypcja)

**Podmień logo na swoje:** plik `remotion-montaz/public/brand-bug.png` jest pusty
(przezroczysty). Wrzuć tam swoje logo pod tą samą nazwą, a pojawi się w rogu kadru
wszędzie tam, gdzie efekt tego używa.

## Aktualizacje

Co miesiąc dostajesz mailem nową wersję z ulepszeniami i usprawnieniami, a przy
zmianach w Claude poprawki, żeby Twój montaż zawsze był na najwyższym poziomie.
Nic nie musisz robić, wszystko leci na adres, z którego kupiłeś pakiet.

## Pomoc

Utknąłeś albo coś wychodzi inaczej, niż chciałeś? Napisz na
**echo.marketing.contact@gmail.com**, podeślij swoją rolkę i napisz, jaki efekt chcesz
osiągnąć. Nagrywam osobistą odpowiedź wideo w ciągu 3 dni roboczych.

## Muzyka

W repo nie ma plików muzycznych (kwestia licencji). AI pobiera muzykę royalty-free
na bieżąco. Do rolek używaj wyłącznie muzyki bez praw autorskich.

---

echo · [echomarketing.biz.pl](https://echomarketing.biz.pl)
