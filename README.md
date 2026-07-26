# ECHO — Skill montażu z AI

To jest zestaw, dzięki któremu AI montuje krótkie i długie filmy w stylu ECHO:
napisy karaoke, zoomy, animowane efekty (Remotion), muzyka i cięcia.

**Dostęp tylko dla kursantów.** Nie udostępniaj dalej.

## Co jest w środku

- `.claude/skills/montaz/SKILL.md` — autorski skill montażu (serce zestawu).
- `remotion-montaz/` — biblioteka efektów: **68 gotowych kompozycji** (hooki, pełnoekranowe interludia, cutawaye, split-screen przed/po, animowany kursor na zrzutach ekranu, badge, mockupy DM i komentarzy, karty poradnikowe, miniaturki).
- `wiedza-styl/` — analizy stylu montażu, na których uczył się skill.

## Aktualizacja z 26.07.2026 (bezpłatna dla wszystkich kursantów)

Dorzuciłem wszystko, co zbudowałem przy własnych rolkach po premierze kursu:

- **Z 14 do 68 kompozycji Remotion.** Nowe rodziny efektów: komplety pod całe rolki (`Rolka1Fx`, `Rolka2Fx`, `Rolka3Fx`), split-screen porównawczy przed i po (`Porownanie`), animowany kursor jeżdżący po zrzucie ekranu (`MouseScreen`), zestawy cutawayów tematycznych, karty poradnikowe i miniaturki pod YouTube.
- **Skill uzupełniony o trzy pułapki ffmpeg**, które kosztowały mnie godziny: segfault przy zoomie robionym przez `scale` (rozwiązanie: `zoompan`), segfault przy błysku przez `color=`, oraz apostrofy w ścieżkach przy `-filter_complex_script` na Windows.

Żeby to pobrać, wystarczy poprosić Claude: „zaktualizuj repo ze skillem montażu i przekopiuj skill na nowo".

**Podmień logo na swoje:** plik `remotion-montaz/public/brand-bug.png` jest pusty (przezroczysty).
Wrzuć tam swoje logo w tej samej nazwie, a pojawi się w rogu kadru wszędzie tam, gdzie efekt tego używa.

## Jak tego użyć

Nie musisz nic robić ręcznie. W kursie masz jedną komendę, którą wklejasz do
Claude Code. Ona pobiera to repo i wszystkie potrzebne narzędzia, a skill ląduje
w Twojej bazie umiejętności. Potem po prostu wrzucasz nagranie i piszesz
"zmontuj mi tę rolkę".

## Muzyka

W repo nie ma plików muzycznych (kwestia licencji). AI pobiera muzykę
royalty-free na bieżąco. Do rolek używaj wyłącznie muzyki bez praw autorskich.
