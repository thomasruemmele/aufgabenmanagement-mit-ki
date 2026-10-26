# Aufgabenmanagement mit KI

Eine private Aufgaben-App im Stil von Apple Notes: Listen, Checkboxen, Notizen, Fälligkeiten und Zeitansichten. Website und MCP-Werkzeuge arbeiten mit derselben Cloudflare-D1-Datenbank. Die App wurde in einer neuen Codex-Session mit **GPT 6.1 Sol** programmiert. Der vollständige verwendete Prompt steht unten und in [PROMPT.txt](PROMPT.txt).

**[Installationsanleitung und Praxisartikel auf thomasruemmele.com](https://www.thomasruemmele.com/aufgabenmanagement-mit-ki)**

## Was die App kann

- Projekt- und Themenlisten anlegen und verwalten.
- Aufgaben anlegen, bearbeiten, abhaken, verschieben und löschen.
- Notizen, Fälligkeiten und Erinnerungszeitpunkte speichern.
- Dieselben Aufgaben in ihrer Liste sowie unter Heute, Diese Woche, Nächste Woche und Dieser Monat anzeigen.
- Ausgewählte Listen aus JSON, CSV oder Text importieren und alle Daten als JSON exportieren.
- Listen und Aufgaben über elf MCP-Werkzeuge lesen und bearbeiten.

## Eine eigene private Instanz einrichten

Die öffentliche Quellkopie enthält keine Zugangsdaten, private Datenbank, persönlichen Aufgaben oder Verbindung zur ursprünglichen Test-App. Sie ist für **eine neue private ChatGPT-Sites-Instanz** vorgesehen. Die Anmeldung und der Schutz des MCP-Zugangs werden von Sites bereitgestellt. Der Code ist ohne diese vorgeschaltete Zugriffskontrolle kein eigenständiger Authentifizierungsdienst.

1. Folge der [Installationsanleitung im Artikel](https://www.thomasruemmele.com/aufgabenmanagement-mit-ki). Du kannst dort den Prompt für einen eigenen Aufbau verwenden oder diesen Quellcode als Grundlage übernehmen.
2. Lege beim Übernehmen des Codes eine **neue private Site** mit eigener Datenbank und MCP-Funktion an. Übernimm keine Projekt-ID oder Datenbank der ursprünglichen App.
3. Kopiere `hosting.example.json` lokal nach `.openai/hosting.json`. Der Sites-Ablauf ergänzt die neue eigene Projekt-ID. Das Verzeichnis `.openai/` wird nicht veröffentlicht.
4. Ersetze vor der Bereitstellung die Beispieladresse `owner@example.com` in `lib/store.ts` durch die E-Mail-Adresse deines eigenen ChatGPT-Kontos. Stelle in Sites den Zugriff ausschließlich auf dieses Konto ein. Die zusätzliche E-Mail-Prüfung im Code ergänzt die vorgeschaltete private Sites-Zugriffsregel.
5. Stelle die eigene Site über Sites bereit und verbinde **ihren** MCP-Anschluss in ChatGPT. Falls die neuen Werkzeuge noch fehlen, öffne nach dem Verbinden einen neuen Chat.
6. Prüfe zunächst mit fiktiven Aufgaben beide Richtungen: eine Aufgabe über MCP anlegen und in der Website abhaken; anschließend den geänderten Status per MCP zurücklesen.

Das öffentliche Repository ist eine bereinigte Kopie des erprobten Stands. Entfernt wurden die ursprüngliche Sites-Projekt-ID, die Owner-Adresse, lokale Laufzeitdaten und interne Review-Screenshots. Weitere Einzelheiten stehen in [SOURCE-COPY.md](SOURCE-COPY.md).

## Lokal entwickeln

Voraussetzung: Node.js ab 22.13.0 und npm. Für die automatischen TypeScript-Tests wird `--experimental-strip-types` verwendet.

```sh
mkdir -p .openai
cp hosting.example.json .openai/hosting.json
npm run install:ci
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_motionless_stephen_strange.sql
npm run dev -- --hostname 127.0.0.1
```

Der portable lokale Starter verwendet eine simulierte Anmeldung ausschließlich auf Loopback. `/signin-with-chatgpt?return_to=/` meldet das fiktive Entwicklungskonto `seedy@sites.test` an. Das ersetzt keinen Test der produktiven Sites-Zugriffsregeln. Daten werden lokal unter `.wrangler/` gespeichert; diese Verzeichnisse gehören nicht ins Repository. Anwendungscode liegt in `app/` und `lib/`, Schema und Migrationen in `db/` und `drizzle/`.

## Durchgeführte Tests

Der ursprüngliche Prompt wurde am **26.10.2026 unverändert in einer neuen Codex-Session** ausgeführt. Als einzige zusätzliche fachliche Eingabe wurden auf Nachfrage zwei fiktive Listen zum Import geliefert. Die Bau-Session prüfte und korrigierte ihre Umsetzung. Danach wurde die veröffentlichte private App unabhängig im Browser und über tatsächlich verbundene MCP-Werkzeuge geprüft.

| Prüfung | Ergebnis |
| --- | --- |
| Browser ↔ MCP | MCP-Anlage in der Website sichtbar; im Browser angelegte Aufgabe mit derselben ID per MCP gelesen; Browser-Abhaken als `done: true` und erhöhte Revision per MCP bestätigt. |
| Alle elf MCP-Werkzeuge | Listen lesen, anlegen, ändern und löschen; Aufgaben suchen, lesen, anlegen, ändern und löschen; Import und Export tatsächlich aufgerufen. |
| Zeitansichten | Fällige Aufgaben in ihren Projekt- und Zeitansichten; nächste Woche über einen Monatswechsel geprüft. Lokale Tests für Wiener Datum, Wochen-, Monats- und Jahresgrenzen. |
| Import | Auswahl einzelner Listen in der Website; abgewählte Liste nicht importiert. Wiederholter Import derselben IDs erzeugte keine zusätzlichen Aufgaben. |
| Export | JSON-Datei über die Website heruntergeladen und Inhalt, stabile IDs, Erledigtstatus und Vollständigkeit geprüft. |
| Datenintegrität | Veraltete Revisionen, ungültige Datumswerte und Löschen befüllter Listen abgewiesen; bestehende Daten beim Import erhalten. |
| Desktop und schmale Ansicht | Desktop 1440 × 900 und Browserfenster 390 × 844 angesehen; bei 390 Pixeln keine horizontale Überbreite. |
| Privater Zugriff | Sites-Zugriffsregel nur für den Owner; unangemeldete Aufrufe von `/`, `/api` und `/mcp` lieferten HTTP 403 ohne Aufgabeninhalte. Keine zweite fremde angemeldete Identität getestet. |
| Erinnerungsformat | Lokale Prüfung des Kalenderformats einschließlich Alarm, Sonderzeichen und Zeilenfaltung. |
| Bereinigung | Zusätzliche QA-Listen und -Aufgaben nach dem Test entfernt. Es wurden ausschließlich fiktive Aufgaben verwendet. |

Die ursprünglichen Live-Prüfungen betreffen die private Ausgangsinstanz. Für die neutrale öffentliche Quellkopie sind die erneut ausgeführten Prüfungen in [TESTS.md](TESTS.md) ausgewiesen. Das ist keine erneute Live-Abnahme einer neu installierten Kopie.

### Grenzen

- Browser-Mitteilungen setzen eine geöffnete App und eine passende Browserfreigabe voraus. **Automatische Push-Mitteilungen bei geschlossener App sind nicht umgesetzt.** Dafür gibt es eine herunterladbare Kalenderdatei. Tatsächliche Zustellung einer Browser- oder Kalenderbenachrichtigung wurde nicht nachgewiesen.
- Kein tatsächlicher Sprach-, Mikrofon- oder Sprachnachrichtentest. Die verbundenen MCP-Werkzeuge wurden in Codex verwendet.
- Kein physisches Handy und kein zweiter Computer getestet. Eine schmale Browseransicht ist kein vollständiger Gerätetest.
- Die erste Browseranmeldung meldete einmal `invalid_state`; ein erneuter Aufruf öffnete anschließend die angemeldete App. Es wurden keine Authentifizierungsregeln dafür geändert.
- Die App verwendet derzeit `Europe/Vienna` für die Datumsansichten.

Automatische lokale Prüfungen:

```sh
node --experimental-strip-types scripts/test-model.mjs
npx tsc --noEmit
npm run build
```

`scripts/test-integration.mjs` ist zusätzlich enthalten. Es schreibt und verändert fiktive Testeinträge und ist ausschließlich für eine frische lokale Testdatenbank vorgesehen:

```sh
node --experimental-strip-types scripts/test-integration.mjs
```

## Verwendeter Aufbau-Prompt

Der folgende Prompt wurde für die Erstellung verwendet. Er beschreibt den Auftrag; die tatsächlich geprüften Funktionen und Grenzen stehen oben.

```text
Baue mir mit ChatGPT Sites eine private Aufgaben-App für Handy und Computer. Orientiere Design und Bedienung ausdrücklich an Apple Notes: schlichte Listen, Checkboxen und Dark Mode.

Die App soll:
- Eigene Projekt- und Themenlisten verwalten.
- Aufgaben anlegen, bearbeiten, abhaken, verschieben und löschen.
- Notizen, Fälligkeiten und Erinnerungen unterstützen.
- Ansichten für „Heute“, „Diese Woche“, „Nächste Woche“ und „Dieser Monat“ bieten.
- Ausgewählte bestehende Listen importieren und alle Daten exportieren.

Speichere jede Aufgabe nur einmal. Sie soll gleichzeitig in ihrer Projektliste und der passenden Zeitansicht erscheinen. Änderungen und Erledigtstatus gelten überall.

Richte eine dauerhafte Datenbank und einen MCP-Server ein, damit ich meine Listen und Aufgaben auch in ChatGPT per Text oder Sprachnachricht bearbeiten kann. Website und ChatGPT greifen auf dieselben Daten zu. Nur ich darf darauf zugreifen.

Halte die App so einfach wie möglich. Setze sie um, teste das Zusammenspiel und gib mir den App-Link sowie eine kurze Anleitung zum Verbinden mit ChatGPT.
```

## Technologie und Hinweise

Vinext/Vite, React, TypeScript, Cloudflare D1 und Drizzle. Der MCP-Endpunkt liegt unter `/mcp`. Die App folgt ausdrücklich dem Apple-Notes-Vorbild; sie ist kein Apple-Produkt.

Eine eigene Projektlizenz wurde bisher nicht festgelegt. Vorhandene Drittanbieterhinweise bleiben erhalten, insbesondere [Sites-Vite-Plugin-Lizenz](scripts/vite/sites-vite-plugin.LICENSE) und [Shadcn-Tailwind-Lizenz](vendor/shadcn-tailwind-4.13.0.LICENSE.md). Die weiteren Abhängigkeiten behalten ihre jeweiligen Lizenzen.
