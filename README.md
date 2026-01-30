# Schachmeister

Dies ist eine Schach-App mit der Gabriel, Jakob und Nathan programmieren lernen.

**https://schachmeister.mitscha-baude.at/**

Struktur:

* `src/ui` ist das React interface. Gregor und seine AI Agenten helfen hier mit.
* `src/schach` enthält die eigentliche Schach-Logik! Die Kinder sind allein dafür verantwortlich diese korrekt zu implementieren.

Das UI hat derzeit zwei zentrale Types und zwei Methoden um mit der Schachlogik zu kommunizieren.
Diese Types und Methoden bilden das **API von `src/schach`**.

```ts
/** Ein Spielstand. Enthält alle nötigen Informationen um die App zu rendern. */
type Status;

/** Ein Schachzug. Definiert wie wir von einem Spielstand zum nächsten kommen. */
type Zug;

/** Entscheidet, ob ein vorgeschlagener Zug beim aktuellen Spielstand gültig ist. */
istKorrekterZug(zug: Zug, status: Status): boolean;

/** Wendet einen Zug, der als gültig angenommen werden darf,
  auf einen Spielstand an und gibt den nächsten Spielstand zurück. */
zugAnwenden(zug: Zug, status: Status): Status;
```
