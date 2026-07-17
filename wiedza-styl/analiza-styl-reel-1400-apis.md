# Analiza stylu montażu — reel "1400 free APIs" (@źródło: instagram.com/reel/DaYDKRKyOl9)

Analiza klatka po klatce (metoda `/claude-watch`: hook 15fps w arkuszach + reszta co 2s + transkrypcja). Długość: 29s.

## Transkrypt (angielski, oryginalny)

> This secret GitHub repo gives you access to over 1,400 free APIs, all neatly organized across 50 categories. Inside, you'll find APIs for finance, news, jobs, programming, and much more. You can use them to build apps, automations, or even personal projects, and they're all completely free to use. For example, let's say you're building an app that needs some live sports data. Just connect it to one of these sports APIs and it'll instantly pull real-time scores straight into your app. So if you want to try this for yourselves, just comment API down below and I'll send you the link directly.

## Struktura (dokładnie playbook Hormoziego, tylko dopracowany montażowo)

1. **Hook (0-4s):** obietnica + liczba szokowa ("1400 darmowych API") + dowód wizualny (odliczające w górę liczby na ekranie)
2. **Co w środku (4-9s):** rapid-fire lista kategorii (finance, news, jobs, programming...)
3. **Zastosowania (9-15s):** apps / automations / personal projects — z wizualnym przykładem dla każdego
4. **Konkretny przykład (15-23s):** scenariusz "sports API" — jak dokładnie użyć
5. **CTA (23-29s):** "napisz API w komentarzu, wyślę link" — DOKŁADNIE mechanika CTA-komentarz, którą już stosujemy

## Co widać wizualnie — kluczowe techniki montażowe

### 1. DWA różne fonty napisów w zależności od typu ujęcia (to jest nowość, nie stosowałem tego)
- **Talking head (twarz):** bold biały sans-serif, słowo-po-słowie, dolna-lewa część kadru, bardzo szybkie tempo (~0,15-0,2s/słowo)
- **Screen recording / B-roll (ekran, telefon):** elegancka kursywa szeryfowa (wygląda jak Georgia/Times italic), wyśrodkowana, większa — używana konsekwentnie przy każdym ujęciu ekranu
- **Wniosek:** typografia sama w sobie sygnalizuje widzowi "teraz mówię do Ciebie" (bold sans) vs "teraz pokazuję Ci produkt" (kursywa). To rozróżnienie warto przenieść.

### 2. Odliczające w górę liczby (count-up animation)
Liczby na ekranie realnie się zmieniają w górę: 543 → 789 → 997 → 1054 → 1247 → 1400, każda zmiana zsynchronizowana z innym słowem/klatką. Na końcu (personal projects) to samo z kwotą pieniędzy: $12 258 → $12 392 → ... → $12 480. To silny trik na "dowód" i przykuwa wzrok bardziej niż statyczna liczba.

### 3. Kolorowy prostokąt podświetlający (attention box)
Na screen-recordingach pojawia się pomarańczowa/czerwona ramka podświetlająca konkretny wiersz tabeli, dokładnie w momencie, gdy jest o nim mowa. Kieruje wzrok widza bez potrzeby tłumaczenia "patrz tutaj".

### 4. Ekstremalnie ciasny sync słowo-obraz
Prawie KAŻDE wypowiedziane słowo = zmiana obrazu (nowy stan ekranu, nowa liczba, nowa kategoria, nowy mockup telefonu). Żadne ujęcie B-roll nie trzyma się dłużej niż ~0,3-0,5s bez jakiejś zmiany. To dużo szybsze tempo niż to, co robiliśmy do tej pory (u nas jeden cutaway trzyma się 2-2,2s bez zmiany w środku).

### 5. Struktura hooka
Pierwsze 4 sekundy to naprzemienne cięcia twarz/ekran co ok. 0,5-1s, z liczbami odliczającymi w tle ekranu — hook nie jest "spokojny", jest gęsto poszatkowany.

## Co przenieść do naszego /montaz (konkretne zmiany)

1. **Dwa fonty napisów** — wprowadzić rozróżnienie: bold sans przy talking head (już mamy, karaoke-sweep), ale przy PEŁNOEKRANOWYCH cutawayach (B-roll) rozważyć elegancki serif/kursywę zamiast bold caps, żeby wizualnie odróżnić "mówię" od "pokazuję".
2. **Count-up animacja liczb** — zamiast statycznej karty "271 zł / 45 000 wyświetleń", zrobić żeby liczby faktycznie ROSŁY na oczach widza (0 → 271, 0 → 45 000) w ciągu ~0,5-0,8s. To technicznie robimy przez animację tekstu w kolejnych renderowanych klatkach (podobnie jak przy slide-in, tylko renderujemy kilka wersji liczby i przełączamy szybko, albo generujemy klatka-po-klatce).
3. **Kolorowa ramka podświetlająca** — przy pokazywaniu np. wizytówki Google czy przykładowego profilu, dodać animowaną ramkę wskazującą konkretny element (np. "tu wstaw zdjęcia realizacji").
4. **Szybsze tempo w cutawayach** — nasze 3 wstawki B-roll trzymają się ~2-2,2s bez zmiany po wjechaniu elementów; ten reel zmienia coś praktycznie co słowo. Można skrócić hold-time i dodać drugi/trzeci "stan" w tej samej wstawce (np. w "PRZED→PO" po chwili podmienić na kolejną parę słów).
5. **Struktura hooka z liczbą + dowodem od razu w 0-4s** — u nas hook to sam tekst mówiony; ten reel dokłada wizualny dowód (rosnąca liczba) RÓWNOLEGLE z hookiem, nie po nim.

## Uczciwa uwaga
To analiza TECHNIKI i STRUKTURY montażu do inspiracji, nie kopiowania treści. Temat (API dla programistów) jest z zupełnie innej branży — przenosimy metodę, nie przekaz.
