# Analiza stylu montażu — reel "AI focus group / symulacja 1000 klientów" (instagram.com/reel/DaJNswPglVZ)

Analiza klatka po klatce (metoda `/claude-watch`: hook 15fps w arkuszach kontaktowych + reszta co 3,5s + transkrypcja Whisper). Długość: 50s. Język: angielski.

## Transkrypt (angielski, oryginalny, skorygowany względem obrazu)

> This free AI skill can basically predict the future of your business before it happens. It builds you a focus group inside of a simulation. So a thousand fake customers, each one with their own personality, their own opinions, and their own memory. And then it lets them argue and react to your decision just like real people would. So let's say you're about to launch a new service or push a price increase. Now instead of guessing whether or not it'll work, you just type "will raising my price from $200 to $300 lose me customers", and then these thousand AI people will debate it just like a real comment section. Some love it, some actually talk the other AIs into changing their minds, and at the end it hands you a plain report on what is most likely to happen. You don't need to know how to code to install this, literally just ask it a question, you let the simulation run. So before you bet your revenue on a gut feeling, you let a fake focus group take the hit first. If you want to set this up for yourself, just comment "need" and I'll send you the entire setup guide.

## Struktura

1. **Hook (0-4,5s):** obietnica ("free AI skill", "predict the future of your business") + naprzemienne cięcia twarz/abstrakcyjny wizual grafu sieci co ok. 0,6-1s
2. **Mechanika produktu (4,5-16s):** "1000 fake customers, personality, opinions, memory" — talking head z reużywanym B-roll grafu w tle
3. **Scenariusz użycia (16-29s):** konkretny przykład (podwyżka ceny $200→$300) — split-screen z prawdziwym UI aplikacji (persony, dashboard)
4. **Payoff/dowód (29-41s):** "comment section", debata AI, raport na końcu — pełnoekranowe zrzuty ekranu z realistycznym UI
5. **Odwrócenie ryzyka + CTA (41-50s):** kinetyczna karta tytułowa "gut feeling" → talking head → karta "Set This Up" → CTA-komentarz ("comment need")

## Co widać wizualnie — NOWE techniki montażowe (nie mamy ich jeszcze w /montaz)

### 1. Trwały split-screen 60/40 (góra: żywy zrzut ekranu aplikacji, dół: talking head) — używany jako WARSTWA, nie wstawka
W środkowej części wideo (ok. 16-40s) górne ~60% kadru to NIEPRZERWANIE odtwarzany zrzut ekranu prawdziwie wyglądającej aplikacji (dashboard z personami, karty "Generating Agent Persona", liczniki agentów, węzły grafu), a dolne ~40% to talking head z napisami — oba na raz, cały czas, nie jako osobna pełnoekranowa wstawka między ujęciami twarzy. To zupełnie inny model niż nasze "pełnoekranowe cutaway, które wjeżdżają i znikają" — tu jest STAŁA dwudzielna kompozycja przez dłuższe odcinki, dająca wrażenie "słuchasz eksperta i jednocześnie widzisz dowód" bez przerywania kontaktu wzrokowego z mówcą.

### 2. Kinetyczne karty tytułowe ze stopniowanym (diagonalnym) układem słów i mieszanką dwóch krojów w JEDNYM zdaniu
Przy przejściach emocjonalnych (np. "So before you bet your revenue on a gut feeling", "If you want to set this up") pojawia się pełnoekranowa czarna karta z siatką jak papier milimetrowy w tle. Słowa nie lecą jedno pod drugim równo — układają się po przekątnej, każde kolejne przesunięte w prawo i w dół (schodkowo). Większość słów to biały, prosty sans-serif, ale JEDNO kluczowe słowo/fraza na końcu (np. "gut feeling", "Set This Up") jest w eleganckim kursywnym/pisanym foncie z poświatą neonową (czerwoną albo turkusową) — kontrastujący akcent koloru i kroju w tym samym zdaniu. To osobna, samodzielna "karta emfazy" (nie karaoke-napisy), używana 2-3 razy w wideo jako mocne uderzenie na kluczowej myśli.

### 3. Ten sam abstrakcyjny wizual (graf/sieć punktów) reużyty z DWOMA różnymi znaczeniami dzięki samej zmianie napisu
Animowana kula/graf zielonych punktów (wygląda jak sieć neuronowa/dane) pojawia się na starcie jako ogólny wizualny symbol "AI myśli", a później DOKŁADNIE TEN SAM typ grafu (inny wariant, z podpisanymi węzłami i kolorami) wraca pod napisem "COMMENT SECTION" — czyli widz odczytuje ten sam rodzaj grafiki jako "wizualizację debaty/komentarzy". Jeden zasób wizualny, przypisany do dwóch różnych momentów narracji przez sam tekst na ekranie — oszczędność produkcji przy zachowaniu wrażenia różnorodności.

### 4. Realistyczny popup/tooltip UI (nie kolorowa ramka, tylko prawdziwie wyglądające okienko aplikacji)
Zamiast kolorowej ramki podświetlającej (którą już stosujemy), tu pojawia się CAŁE fałszywe okienko "Node Details" z polami: Name, UUID, Created, Properties, Summary, Labels — wygląda jak prawdziwy popup z narzędzia deweloperskiego. Buduje wiarygodność produktu dużo mocniej niż sama ramka, bo pokazuje "dowód działania", nie tylko wskazuje punkt uwagi.

### 5. Liczby rosnące WEWNĄTRZ realistycznej karty dashboardu, nie jako osobna duża grafika
Licznik ("8 current number of agents", "29 expected total number of agents", "37...") jest osadzony w wyglądającym na prawdziwy interfejsie aplikacyjnym (karta "02 Generating Agent Persona" z kolorowymi tagami: Goldman Sachs, truth_social_315, nancy_pelosi_870), a nie jako wyizolowana grafika z wielką liczbą na pustym tle. To sprawia, że dowód wygląda jak zrzut ekranu prawdziwego narzędzia, a nie jak grafika marketingowa.

### 6. Dwa różne systemy podpisów w zależności od "wagi" momentu (osobno od dwuczcionkowego systemu, który już mamy)
Główne napisy to cały czas ten sam czarny pill/box z białym boldem (frazy 2-4 słowa, nie pojedyncze słowo jak nasz karaoke-sweep). Ale w kilku miejscach na pełnoekranowych zrzutach ekranu (np. "LIKELY TO HAPPEN") napis traci czarne tło pod-boxem i staje się samym białym tekstem z grubym czarnym obrysem/cieniem, nałożonym wprost na zrzut ekranu — lżejszy wariant zarezerwowany na końcowe/kulminacyjne stwierdzenia.

## Dlaczego to działa

- Split-screen 60/40 pozwala mówcy cały czas być "na antenie" (buduje relację z widzem), a jednocześnie non-stop dostarcza wizualny dowód — nie trzeba wybierać między twarzą a produktem.
- Karty emfazy z mieszanym fontem+poświatą to mocny "oddech" rytmiczny w środku gęstego wideo pełnego zrzutów ekranu - resetują uwagę przed kluczową myślą.
- Reużycie tego samego assetu graficznego z innym podpisem = tania, ale skuteczna sztuczka na "różnorodność" bez dodatkowej produkcji.
- Fałszywe realistyczne UI (popup, dashboard z licznikami) buduje wiarygodność produktu mocniej niż abstrakcyjna grafika — wygląda jak realny dowód, nie jak ilustracja.

## Co przenieść do naszego /montaz (konkretne zmiany)

1. **Wprowadzić tryb split-screen 60/40** jako trzecią opcję obok "pełny talking head" i "pełnoekranowy cutaway": górna część kadru = stały, przewijający się zrzut ekranu/dowód (case study, wyniki kampanii, opinia klienta w formie zrzutu), dolna = Mateusz mówiący. Użyć zwłaszcza w środkowej części dłuższych shortów, gdy trzeba pokazać dowód (wyniki reklam, opinie, zrzuty z Meta Ads Managera) BEZ przerywania kontaktu z widzem.
2. **Zbudować szablon "kinetycznej karty emfazy"**: czarne/ciemne tło z delikatną siatką, słowa schodkowo po przekątnej, biały sans dla większości + jedno słowo w kursywie/skrypcie z poświatą w kolorze akcentowym marki. Użyć 1-2 razy na shorta przy kluczowej myśli (np. przed CTA albo po najmocniejszym argumencie).
3. **Zamienić prostą kolorową ramkę podświetlającą na realistyczny popup UI**, gdy pokazujemy dowód z prawdziwego narzędzia (np. Meta Ads Manager, WhatsApp z klientem) — fałszywe/prawdziwe okienko z polami (nazwa, data, wynik) zamiast samej ramki, żeby wyglądało bardziej jak dowód niż grafika.
4. **Reużywać ten sam wizualny asset (np. nasza rosnąca liczba, wykres, mapa Polski) z różnymi podpisami** w różnych momentach tego samego lub różnych shortów, zamiast za każdym razem projektować nowy asset od zera - oszczędność czasu przy zachowaniu wrażenia świeżości.
5. **Osadzać count-up liczby WEWNĄTRZ realistycznej karty/dashboardu** (np. "27 leadów w tym miesiącu" w karcie przypominającej panel Meta Ads), a nie jako gołą wielką liczbę na pustym tle - podnosi wiarygodność.
6. **Drugi, lżejszy wariant napisu bez czarnego tła** (biały tekst z grubym czarnym obrysem, wprost na zrzucie ekranu) zarezerwowany na 1-2 najmocniejsze zdania w wideo, dla odróżnienia od standardowego pill-boxa.

## Uczciwa uwaga

To analiza TECHNIKI i STRUKTURY montażu do inspiracji, nie kopiowania treści. Temat (symulacja AI focus group) jest z zupełnie innej branży (narzędzia AI/marketing ogólny) - przenosimy metodę, nie przekaz.
