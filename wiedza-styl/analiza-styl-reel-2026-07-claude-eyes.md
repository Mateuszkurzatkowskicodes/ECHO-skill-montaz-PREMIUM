# Analiza stylu montażu — reel "Claude can't watch video, so I gave it eyes" (@buildwith.conrad, instagram.com/reel/DalaUaasv-G)

Analiza klatka po klatce (metoda `/claude-watch`: hook 15fps w arkuszach kontaktowych + reszta co 3,5s + transkrypcja whisper, korekta ręczna). Długość: 22,9s. Język: angielski.

## Temat (dla kontekstu, NIE kopiujemy treści)
Autor reklamuje własny skill do Claude Code, który pozwala Claude "oglądać" wideo klatka po klatce zamiast tylko czytać transkrypcję — czyli koncepcyjnie to dokładnie to samo narzędzie co nasz `/claude-watch`. Ciekawy zbieg okoliczności, zero związku z tematem Twoich rolek, więc analizujemy WYŁĄCZNIE technikę.

## Transkrypt (skorygowany względem klatek)

> Claude can't watch video, it only reads the transcript and misses half.
> So I gave it eyes, one skill that makes Claude see every single frame.
> yt-dlp grabs the video, FFmpeg rips the frames and Claude flips through them while it reads.
> A 30-minute video, decoded frame by frame in 90 seconds.
> Running local, zero API cost. Comment "eyes" and I'll send you the skill.

## Struktura

1. **Hook (0-4s):** problem/ból ("Claude can't watch video... misses half") — na kontrastowym czerwono-białym napisie
2. **Fix / obietnica (4-8s):** "So I gave it eyes" — payoff hooka, jedno zdanie
3. **Under the hood (8-14s):** trzy kroki technicznego "jak to działa" (yt-dlp → ffmpeg → Claude), każdy z osobną ikoną/wizualizacją UI
4. **Payoff / dowód (14-20s):** liczba (30 min → 90s), duży count-up "0" → statystyka, kontrast "Every frame. Not just the words."
5. **CTA (20-23s):** "Comment eyes and I'll send you the skill" — mechanika CTA-komentarz, którą już stosujemy

Cały film NIE ma talking head ani prawdziwego B-roll — to w 100% grafika ruchoma (motion graphics) na jednym, ciągle obracającym się/oddychającym tle (przypomina przysłonę obiektywu aparatu, brązowo-pomarańczowy gradient, subtelne gwiazdki w tle). Zero cięć kamery, bo kamery nie ma.

## Co widać wizualnie — NOWE techniki (nie mamy ich jeszcze)

### 1. System numerowanych rozdziałów w rogu ekranu (chapter labels)
W prawym górnym rogu, przez CAŁY materiał, mały dyskretny podpis zmienia się wraz z sekcją: "01 / THE BLIND SPOT" → "02 / THE FIX" → "03 / UNDER THE HOOD" → "04 / THE PAYOFF". Widz podświadomie czuje strukturę i postęp (jak spis treści dokumentu technicznego), mimo że treść wygląda na "jedną ciągłą narrację". Bardzo tania w wykonaniu (statyczny tekst, zmiana raz na kilka sekund), a mocno podnosi odczucie "przemyślanego" materiału.

### 2. Warstwa terminala/kodu jako element wizualny (nie tylko cytat)
Krok "yt-dlp grabs the video" pokazuje faktyczny wygląd linii komend: `$ yt-dlp https://youtu.be/…` w monospace foncie, ze SKŁADNIĄ KOLOROWANĄ jak w prawdziwym terminalu (nazwa komendy na pomarańczowo, reszta na biało/szaro). To buduje wiarygodność technicznego produktu bez pokazywania prawdziwego screen recordingu — sam "fragment" UI wystarcza.

### 3. Rząd/siatka miniaturek-klatek z timecodami jako motyw powracający
Mały rząd 5-6 zaokrąglonych kafelków z ikoną "play" i podpisanym timecode (01:03, 02:44, 03:15...) pojawia się dwa razy: raz jako pojedynczy rząd (środek filmu, "Claude flips through them"), raz jako pełna siatka 3x4 (finałowy payoff, "Every frame. Not just the words."). To spójny motyw wizualny reprezentujący "próbkowane klatki wideo" — rośnie z rzędu do siatki, wizualnie pokazując skalowanie ("więcej klatek = więcej dowodu").

### 4. Jedno ciągłe tło zamiast cięć B-roll (loop jako baza całego wideo)
Zamiast wielu różnych cutawayów, cały film stoi na JEDNYM zapętlonym, powoli obracającym się motywie graficznym (przysłona/tunel, ciepłe barwy). Zmienia się tylko WARSTWA nałożona na wierzchu (tekst, ikony, miniaturki). To radykalnie tańsze w produkcji niż multi-cutaway, a nadal wygląda spójnie i "żywo" dzięki ciągłemu subtelnemu ruchowi tła. Warte rozważenia jako baza dla materiałów bez dostępu do B-roll/zdjęć z realizacji (np. posty czysto edukacyjne, tips).

### 5. Dwuwarstwowy system napisów: nagłówek budujący się frazami + osobny podpis zdaniowy na dole
Powyżej środka ekranu duży bold nagłówek buduje się FRAZAMI (nie pojedynczymi słowami jak nasz karaoke-sweep) i zostaje na ekranie, a poprzednie frazy PRZYGASZAJĄ do szarości zamiast znikać (efekt "logu terminala": stare linie widoczne, ale wyciszone, nowa linia jasna). Jednocześnie NA DOLE ekranu leci osobny, mały, statyczny podpis pełnozdaniowy (klasyczny "subtitle bar", szary, bez animacji) — czyli widz ma jednocześnie "dramatyczny nagłówek" i "neutralny podpis do czytania w tle". Dwa różne rejestry typografii na raz, nie tylko dwa różne fonty przy różnych ujęciach (to już mieliśmy z poprzedniej analizy) — tu chodzi o DWIE WARSTWY jednocześnie w tym samym kadrze.

### 6. Kolorowe słowo-klucz w nagłówku (nie cała linijka)
W nagłówkach tylko jedno-dwa słowa mają kolor akcentu (koralowy/pomarańczowy: "watch video", "eyes", "Not just the words"), reszta zdania zostaje biała. Kolor konsekwentnie pada na słowo niosące PROBLEM albo PAYOFF, nie na losowe słowo. To precyzyjniejsze niż nasz obecny sposób podświetlania.

### 7. Duża pojedyncza liczba jako osobna "scena" (nie wpleciona w zdanie)
Przed statystyką "30 minut → 90 sekund" pojawia się osobna krótka scena z samą wielką cyfrą "0" na środku ekranu (najwyraźniej start animacji count-up, wyekstrahowany jako osobny beat montażowy, nie tylko mikro-detal w tle jak w poprzedniej analizie). Liczba jako HERO danej sekundy, nie dodatek.

### 8. Stały, dyskretny znak wodny/handle w rogu przez cały materiał
"@buildwith.conrad" w lewym dolnym rogu, mały, na każdej klatce od początku do końca — czysty branding/anti-repost, nie wpływa na czytelność.

## Co przenieść do naszego /montaz (konkretne zmiany)

1. **Chapter labels w rogu** — dodać mały, statyczny podpis sekcji w rogu kadru (np. "HOOK", "PROBLEM", "ROZWIĄZANIE", "DOWÓD", "CTA" albo bardziej marketingowo "01 / PROBLEM", "02 / ROZWIĄZANIE"...) zmieniający się wraz ze strukturą scenariusza. Tani do zrobienia, podnosi odczucie "produkcji", da się dodać do istniejącego szablonu Remotion jako osobna warstwa tekstowa.
2. **Dwuwarstwowe napisy: nagłówek-frazami-z-historią + osobny pasek podpisu** — rozważyć przy dłuższych/wolniejszych fragmentach (nie hook): duży budujący się nagłówek z przygasającymi poprzednimi liniami NAD stałym, statycznym paskiem pełnego zdania na dole. Można zastosować zamiast czystego karaoke-sweep w segmentach bardziej "wykładowych" (np. w long-formie lub w środkowej części shorta).
3. **Kolor tylko na słowie-kluczu (problem/payoff), nie na całej linii** — doprecyzować naszą zasadę podświetlania: kolor akcentu wyłącznie na 1-2 słowach niosących największy ciężar (ból albo korzyść), reszta neutralna biel.
4. **Miniaturki/kafelki jako motyw rosnący (rząd → siatka)** — dla tematów "dowodowych" (case study, wyniki, przed/po wielu klientów) rozważyć motyw małych kafelków, które najpierw pokazują się pojedynczo w rzędzie, a w finale zbierają się w pełną siatkę jako wizualny "dowód skali" (np. 6 zrzutów z wynikami kampanii układających się w siatkę na koniec).
5. **Duża pojedyncza liczba jako osobna scena/beat** — przy prezentowaniu kluczowej statystyki (koszt/lead, liczba klientów, oszczędność czasu) wydzielić osobną, krótką scenę z SAMĄ wielką liczbą na pustym tle przed pokazaniem kontekstu zdaniowego, zamiast wplatać liczbę od razu w zdanie z resztą tekstu.
6. **Jedno spójne zapętlone tło jako opcja zamienna dla multi-B-roll** — do materiałów, gdzie nie mamy nagrania z realizacji (posty czysto edukacyjne / o AI / o procesie agencji), rozważyć jeden subtelny zapętlony motyw graficzny jako baza zamiast układania wielu różnych cutawayów — szybsze w produkcji, nadal dynamiczne dzięki ruchowi tła.

## Uczciwa uwaga
To analiza TECHNIKI i STRUKTURY montażu do inspiracji, nie kopiowania treści. Temat reela (skill do Claude Code) nie musi mieć nic wspólnego z Twoim tematem, przenosimy metodę wizualną, nie przekaz.
