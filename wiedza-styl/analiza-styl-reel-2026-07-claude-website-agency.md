# Analiza stylu montażu — reel "Claude buduje strony za $10 000" (instagram.com/reel/DZflUYLHKb-)

Analiza klatka po klatce (metoda `/claude-watch`: hook 15fps w arkuszach kontaktowych + reszta co 2s + transkrypcja whisper). Długość: 18,6s.

## Treść (1 zdanie, dla kontekstu)

Twórca (branding "AIS" na koszulce) pokazuje, że AI Claude potrafi zbudować premium stronę www (nie "AI-wyglądającą" landing page, tylko realny produkt warty $10 000), i zachęca do skomentowania "website", żeby dostać instrukcję workflow.

## Transkrypt (skorygowany, angielski)

> [0-3s] ...buduje strony, za które ludzie płacą $10 000. [3-8s] Nie podstawowe, "AI-wyglądające" landing page, tylko prawdziwe premium strony: czyste layouty, animacje, responsywność. [8-13s] Dajesz mu branżę, styl, materiały i stronę referencyjną, a Claude zbuduje całość. [13-17s] Znając odpowiedni workflow, jedną stronę zamieniasz w realną ofertę dla klientów. [17-19s] Więc napisz w komentarzu "website", wyślę Ci pełny setup.

## Struktura

1. **Hook (0-3s):** twierdzenie o wysokiej wartości ("$10 000") + od razu wizualny dowód (mockup premium strony w tle)
2. **Kontrast (3-8s):** "nie X, tylko Y" — odcina się od tandetnych efektów AI, buduje wiarygodność
3. **Mechanika (8-13s):** co user musi dostarczyć, żeby to zadziałało (branża, styl, assets, referencja)
4. **Obietnica biznesowa (13-17s):** przejście od "ciekawostki" do "oferty dla klientów" (monetyzacja)
5. **CTA (17-19s):** klasyczna mechanika CTA-komentarz, którą już stosujemy

## Co widać wizualnie — NOWE techniki montażowe (nie mamy jeszcze żadnej z nich)

### 1. Stały split-screen (góra/dół), nie cutaway pełnoekranowy
Przez cały hook i większość body ekran jest podzielony na dwie stałe strefy: górna ~55% to ciągle grający B-roll (mockupy stron, ekran nagrywany na żywo z kursorem), dolna ~45% to twarz mówiącego. To NIE jest nasz obecny model (pełnoekranowy cutaway wjeżdżający na chwilę i znikający) — tu obie warstwy są widoczne CAŁY czas równolegle, napisy siedzą dokładnie na granicy między nimi. Dzięki temu widz ma "dowód" na oczach przez cały czas mówienia, a nie tylko w wybranych momentach.

### 2. Zmiana koloru słowa zamiast zmiany fontu — emfaza w napisach
Napisy są jednym fontem (bold sans, słowo-po-słowie, karaoke), ale wybrane słowa/frazy-klucze ("AI looking", "landing pages", "$10,000", "premium sites", "workflow", "one website") dostają inny kolor (miętowy/turkusowy) zamiast białego. To prostszy mechanizm niż nasz system dwóch fontów — nie trzeba przełączać całej typografii, wystarczy pokolorować konkretne słowo w tej samej sekwencji, żeby oko wyłapało kluczowe hasła nawet bez czytania całości.

### 3. Diagonalny "przebłysk światła" (light sweep) na screen-recordingach
Na ciemnych zrzutach ekranu (VS Code, panel narzędzia) co jakiś czas przelatuje po przekątnej jasny pas/glare, jakby światło odbijało się od szkła. Ożywia statyczny zrzut ekranu bez żadnej faktycznej zmiany treści na ekranie — tani trik animacyjny do zastosowania na naszych screen-recordingach/mockupach.

### 4. Mała czerwona strzałka-wskaźnik zamiast ramki podświetlającej
Zamiast (albo obok) kolorowej ramki, pojawia się prosta czerwona strzałka w górę wskazująca konkretny element interfejsu, zsynchronizowana ze słowem. Prostsza w produkcji niż ramka, dobra do wskazywania pojedynczego punktu (np. konkretnej liczby, przycisku, elementu na wizytówce) zamiast całego obszaru.

### 5. Przejście split-screen → pełny ekran twarzy na CTA
Cały segment wartości (hook + wyjaśnienie + mechanika) jest w split-screenie z dowodem wizualnym w tle. W momencie CTA ("skomentuj website") ekran przechodzi na CZYSTĄ, pełnoekranową twarz — bez żadnego B-roll w tle. To wizualny sygnał "teraz mówię bezpośrednio do Ciebie" dokładnie w momencie prośby o akcję — B-roll znika, żeby nic nie rozpraszało od CTA.

### 6. Cykl kilku przykładów pod jednym twierdzeniem-liczbą ("$10,000")
Podczas gdy napis "$10,000" trzyma się na ekranie, w tle B-roll przełącza się między 3-4 RÓŻNYMI mockupami premium stron (zegarek, biżuteria, moda) w szybkim tempie. To buduje "dowód przez powtórzenie i różnorodność" zamiast jednego case study — sugeruje "to działa dla wielu branż", nie "to jeden przypadek".

## Dlaczego to działa

- Split-screen eliminuje najsłabszy moment formatu talking-head (chwile, gdy widz patrzy tylko na gadającą twarz bez dowodu) — dowód wizualny jest permanentnie obecny, nie tylko punktowo.
- Kolorowanie słów zamiast zmiany fontu to mniejszy koszt produkcji przy podobnym efekcie kierowania uwagi.
- Zdjęcie B-roll dokładnie na CTA to świadomy wybór reżyserski — kontrast "dużo bodźców → cisza + twarz" wzmacnia wagę prośby.

## Co przenieść do naszego /montaz (konkretne zmiany)

1. **Wprowadzić wariant split-screen** jako alternatywę dla pełnoekranowego cutawaya — przydatny zwłaszcza przy pokazywaniu wyników/case study klienta, gdzie chcemy, żeby dowód (zrzut ekranu Meta Ads Managera, wynik kampanii) był widoczny CAŁY czas obok twarzy, a nie tylko wjeżdżał na 2s.
2. **Dodać kolorowanie słów-kluczy w napisach** (np. akcentowy turkus/zielony z naszej palety) jako szybszą alternatywę/dodatek do systemu dwóch fontów — łatwiejsze do wdrożenia w Remotion (zmiana `color` na pojedynczym słowie w karaoke-sweep zamiast całego bloku).
3. **Diagonalny light-sweep na screen-recordingach** (zrzuty Ads Managera, panelu klienta) — prosty overlay w Remotion (gradient przesuwający się po przekątnej), ożywia statyczne zrzuty ekranu bez dodatkowej pracy montażowej.
4. **Strzałka-wskaźnik jako lżejsza wersja ramki podświetlającej** — do szybkiego wskazania pojedynczej liczby/elementu, tańsza produkcyjnie niż animowana ramka, dobra gdy nie chcemy przeciążać kadru.
5. **Zdjąć B-roll na moment CTA** — świadomie przechodzić z (split-screen/cutaway) na czystą, pełnoekranową twarz w ostatnich 2-3s przed CTA, żeby wizualnie oddzielić "wartość" od "prośby o akcję".
6. **Cykl 3-4 wariantów dowodu pod jedną liczbą-twierdzeniem** — przy mocnym claimie (np. "wyniki od 20-30 zł/lead") pokazać w tle kilka RÓŻNYCH zrzutów/case studies zamiast jednego, żeby sugerować powtarzalność.

## Uczciwa uwaga
To analiza TECHNIKI i STRUKTURY montażu do inspiracji, nie kopiowania treści. Temat (agencja AI/no-code buduje strony) jest z innej branży niż nasza (marketing dla HVAC/wypożyczalni) — przenosimy metodę montażu, nie przekaz ani markę.
