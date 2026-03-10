# 🎸 Zpěvník Kapely

Tato aplikace slouží k jednoduché správě písniček, které vaše kapela aktuálně hraje, zkouší nebo plánuje zařadit do svého repertoáru. Vznikla jako snadný, rychlý a přístupný pomocník pro udržení přehledu o tom, které skladby už znáte, a těmi, na kterých ještě potřebujete pracovat.

## 🌟 Hlavní funkce

- **Snadná autentizace:** Ochrana repertoáru jednoduchým přihlášením (výchozí heslo na ukázku: `kapela123`), aby přístup ke struktuře a poznámkám vaší kapely neměl každý.
- **Seznam a stav písniček:** Rozdělování songů do třech úrovní podle stavu nacvičení:
  - 📝 **K naučení:** Teprve prozkoumáváte strukturu a ladění.
  - 🎸 **Rozpracované:** Zkoušíte společně ve zkušebně.
  - ⭐ **Umíme:** Odzkoušeno a nabušeno na živé hraní.
- **Detaily a poznámky:** Ke každé písni lze připojit dlouhodobé textové poznámky např. odkaz na YouTube, použité akordy, tóninu, zápis struktury atd.
- **Lokální uložení dat:** Aplikace zatím nepotřebuje backend; vše se okamžitě a automaticky ukládá prohlížeči (`localStorage`) aktuálního uživatele – nic se neztratí po obnovení stránky.

## 🛠️ Použité Technologie

- [Vue.js 3](https://vuejs.org/) (Composition API)
- [Vite](https://vitejs.dev/) pro bleskově rychlý start a sestavení
- [Vue Router](https://router.vuejs.org/) pro plynulý přesun mezi obrazovkami bez zdlouhavého načítání
- [Pinia](https://pinia.vuejs.org/) pro efektivní a moderní správu stavu 
- Čisté CSS kombinující dynamický tmavý vzhled

## 🚀 Jak aplikaci spustit u sebe (lokálně)

Abyste mohli Zpěvník spustit, budete na svém PC potřebovat mít nainstalované [Node.js](https://nodejs.org/).

1. **Klonování repozitáře:**
   ```bash
   git clone https://github.com/Jag3r20/kapela-web.git
   cd kapela-web
   ```

2. **Instalace závislostí:**
   ```bash
   npm install
   ```

3. **Spuštění vývojového serveru:**
   ```bash
   npm run dev
   ```

Aplikace bude poté dostupná na (typicky) `http://localhost:5173`.
