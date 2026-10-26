# Herkunft dieser öffentlichen Quellkopie

Ausgangsstand der privaten Test-App: Commit `4aba46b305cd45f3a104e33aecfe3f740c89fc57` vom 26.10.2026. Programmierung: GPT 6.1 Sol. Der verwendete Aufbau-Prompt ist vollständig in `PROMPT.txt` und im README enthalten.

Die öffentliche Kopie beginnt mit einer neuen Git-Historie. Enthalten sind der Anwendungscode, Datenbankschema und Migration, Starter-/Build-Helfer, Abhängigkeits-Lockfile und mitgelieferte Drittanbieter-Lizenzen. Keine privaten Testberichte, E-Mails, Review-Screenshots, ursprüngliche Git-Historie, Anmeldedaten, Datenbanken oder Laufzeitverzeichnisse werden übernommen.

## Bewusste Abweichungen vom geprüften Ausgangsstand

- `.openai/hosting.json` mit der ursprünglichen Projekt-ID ausgeschlossen. `hosting.example.json` enthält nur neutrale DB-/MCP-Bindungen für eine neue Instanz.
- Ursprüngliche Owner-E-Mail in `lib/store.ts` durch `owner@example.com` ersetzt. Vor Bereitstellung an das eigene Konto anpassen. Die vorgeschaltete Owner-only-Zugriffsregel in Sites muss neu eingerichtet werden.
- Personenbezogene Formulierungen in MCP-Beschreibungen, `PRODUCT.md` und `DESIGN.md` neutralisiert.
- `.impeccable/` mit lokalen Review-Screenshots ausgeschlossen.
- `.gitignore` um private Instanz- und Review-Verzeichnisse ergänzt.
- Starter-README durch projektspezifische Anleitung, Originalprompt, Modellangabe und belegte Testbeschreibung ersetzt. `PROMPT.txt`, `TESTS.md` und diese Herkunftsnotiz hinzugefügt.

Der übrige Anwendungscode wurde unverändert aus dem Ausgangscommit übernommen. Live-Prüfungen des Ausgangsstands und Prüfungen der bereinigten Kopie werden getrennt ausgewiesen.
