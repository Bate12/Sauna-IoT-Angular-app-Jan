# Sauna-IoT-Angular-app-Jan
Final project for school project making a mobile app using Angular, TS/JS, Ionic

# Sauna IoT – Aplikace pro ovládání saunového systému

Mobilní, webová a hybridní aplikace vytvořená ve frameworku **Ionic Angular** (TypeScript / JavaScript) s využitím **Ionic Capacitor**. Slouží ke vzdálenému ovládání, plánování a monitorování saun v reálném čase prostřednictvím REST API a vzdáleného cloudového serveru.

## Hlavní funkce

* **Správa více saun a dynamický teplotní rozsah:** Možnost přidat a spravovat více saun s vlastním názvem a typem. Podle typu sauny se automaticky nastaví povolený rozsah teplot (např. *Infra sauna* max. $65^\circ\text{C}$, *Finská sauna* až $90^\circ\text{C}$, *Pára*).
* **Ochrana proti chybným vstupům:** Aplikace i server striktně validují zadané hodnoty – uživatel nemůže nastavit nesmyslnou nebo nebezpečnou teplotu (např. $200^\circ\text{C}$).
* **Výběr teplotních jednotek:** Přepínání mezi stupni Celsia ($^\circ\text{C}$) a Fahrenheita ($^\circ\text{F}$).
* **Časové plánování provozu:**
  * *Relativní odpočet:* např. `"Zapni saunu za 1,5 hodiny"`
  * *Přesný čas:* např. `"Zapni saunu v 15:15"`
* **Obousměrná REST API komunikace:** Odesílání příkazů na server a načítání reálných dat přímo ze sauny (aktuální teplota, stav topení, čas spuštění).

## Struktura aplikace (3 Taby)

V pravém horním rohu každé obrazovky se nachází tlačítko **Přihlásit / Registrovat** (pro nepřihlášené) nebo **Odhlásit** (pro přihlášené uživatele).

1. **Úvod:** Přehled všech připojených saun se stavem v reálném čase (zelená/červená ikona **ON / OFF**), počtem záznamů a možností přidat novou saunu včetně konfigurace jejího teplotního limitu.
2. **Sauna:** Hlavní ovládací panel vybrané sauny (zapnutí/vypnutí), teplotní slider omezený bezpečným rozsahem daného typu sauny, plánovač zapnutí, **teplotní graf** a živé **systémové logy**:
   ```text
   [INFO] 23/11/2026 > System is live
   ```
3. **Informace:** Informace o výrobě, autorech, datu vydání, globální nastavení aplikace a správa uživatelského účtu.

## Bezpečnost a ukládání dat

* **Autorizace vlastnictví:** Uživatel může ovládat a měnit teplotu pouze u saun, které patří k jeho účtu.
* **Hashování uživatelských dat:** Citlivé údaje (jméno, e-mail, heslo) jsou na vzdáleném serveru uloženy výhradně jako **hashe**. Aplikace, administrátor ani vývojář neznají přihlašovací údaje v čitelné podobě – k udržení relace slouží pouze hashe a přístupové tokeny.
* **Dvoustupňová validace:** Kontrola požadavků probíhá na straně uživatele i na straně serveru.
* **Lokální úložiště:** Pro zachování přihlášení a ukládání tokenů využívá aplikace nativní **Ionic Capacitor** (Storage / Preferences).

## Jak projekt spustit na svém zařízení

### Požadavky
* Nainstalovaný **Node.js** (doporučena verze LTS) a **npm**
* **Ionic CLI** (lze nainstalovat příkazem `npm install -g @ionic/cli`)

### Postup spuštění

1. **Naklonujte repozitář z GitHubu:**
   ```bash
   git clone https://github.com/Bate12/Sauna-IoT-Angular-app-Jan.git
   cd Sauna-IoT-Angular-app-Jan
   ```

2. **Nainstalujte potřebné balíčky:**
   ```bash
   npm install
   ```

3. **Spusťte aplikaci v prohlížeči (vývojový režim):**
   ```bash
   ionic serve
   ```
   Aplikace se automaticky otevře na adrese `http://localhost:8100`.

4. *(Volitelné)* **Spuštění na mobilním zařízení přes Ionic Capacitor:**
   ```bash
   ionic build
   npx cap sync
   npx cap open android   # nebo npx cap open ios
   ```
