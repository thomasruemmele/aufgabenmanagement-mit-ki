# Prüfung der öffentlichen Quellkopie

Stand: 26.10.2026. Alle folgenden Prüfungen wurden nach der Neutralisierung der privaten Instanzangaben auf einer getrennten lokalen Kopie mit frisch installierten Abhängigkeiten ausgeführt. Ausgangscode: `4aba46b305cd45f3a104e33aecfe3f740c89fc57`. Die ursprünglichen Live-Browser-/MCP-Prüfungen sind im README gesondert beschrieben.

| Prüfung | Ergebnis |
| --- | --- |
| `npm run install:ci` | Bestanden; Abhängigkeiten über das vorhandene Lockfile installiert. |
| `node --experimental-strip-types scripts/test-model.mjs` | Bestanden: Datum Europe/Vienna, Wochen-/Monats-/Jahresgrenzen, Zeitansichten, Auswahl fiktiver Importlisten, stabile wiederholte Import-IDs, CSV, JSON und Kalenderalarmformat. |
| `npx tsc --noEmit` | Bestanden. |
| `npm run build` | Produktionsbuild bestanden; Routen `/`, `/api`, `/mcp` erzeugt. |
| Frische lokale D1-Migration | Bestanden; vier SQL-Befehle erfolgreich. |
| `TEST_BASE=http://127.0.0.1:5273 node --experimental-strip-types scripts/test-integration.mjs` | Bestanden; ausschließlich fiktive Testaufgaben in einer eigenen lokalen Datenbank. |
| Neutralisierte Owner-Adresse | Im lokalen Produktionsbuild: synthetischer Header `owner@example.com` liefert 200; fremde Beispieladresse und das reine Entwicklungskonto liefern 403 ohne Aufgabeninhalt. Das ist ein Test der zusätzlichen Codeprüfung, keine Prüfung einer neu gehosteten Identität. |
| Veröffentlichungsumfang | Originalprompt bytegleich; öffentliche Dateien auf private Owner-/Projekt-/Plugin-Kennungen, lokale Benutzerpfade, private Schlüssel und gängige Zugangstokenmuster geprüft: keine Treffer. Keine Symlinks oder private Laufzeitdaten im Veröffentlichungssatz. |

## Umfang des lokalen Integrationstests

- MCP-Erkennung und Aufruf aller elf Werkzeuge.
- Wiederholte Anlage mit gleicher ID erzeugt keine zweite Aufgabe.
- Nur ausgewählte Gartenliste importiert; Einkauf ausgeschlossen; wiederholter Import überspringt vorhandene Aufgaben.
- MCP-Änderungen an Notizen, Fälligkeit und Erinnerungszeitpunkt über die Website-API zurückgelesen.
- Eine Aufgaben-ID in Projekt-, Heute-, Wochen- und Monatsansichten.
- Erledigtstatus über Website-API geändert und per MCP bestätigt.
- Veraltete Revisionen mit 409 und ungültiges Datum mit 400 abgewiesen.
- Verschieben und Zurückverschieben einer Aufgabe; Löschen befüllter Liste abgewiesen.
- Löschen fiktiver Aufgaben und Listen, Umbenennen einer Liste und Ändern ihres Typs.
- Vollständiger JSON-Export mit Rückimport-Prüfung.
- Schreibanfrage mit fremdem Origin abgewiesen.

Die API-/MCP-Integration auf der bereinigten Kopie wurde automatisiert geprüft. Dabei fand kein zusätzlicher visueller Browserdurchlauf statt. Lokale Testserver wurden anschließend beendet. Die zwei rein fiktiven Gartenaufgaben verbleiben ausschließlich in der ignorierten lokalen Testdatenbank und sind kein Repositoryinhalt.

## Grenzen

Keine neue private Sites-Instanz aus dem öffentlichen Repository bereitgestellt. Keine erneute gehostete Owner-only-Abnahme der neutralisierten Kopie. Der lokale Entwicklungsstarter entfernt selbst gesetzte Identitätsheader; der Owner-Platzhalter wurde deshalb am Produktionsbuild mit synthetischen Headern geprüft. Produktion benötigt weiterhin die private Sites-Zugriffsregel einschließlich geschütztem MCP-Zugang.

Keine tatsächliche Push- oder Kalenderzustellung, kein Sprach-/Mikrofontest, kein physisches Handy und kein zweiter Computer. Hintergrund-Push bei geschlossener App ist nicht implementiert. Die ursprünglichen Live-Nachweise gelten für die geprüfte Ausgangsinstanz, deren private Daten und Kennungen hier nicht veröffentlicht werden.
