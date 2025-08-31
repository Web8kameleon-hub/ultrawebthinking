# WEB8 / EuroWeb Ultra - PROJECT RULES & REQUIREMENTS

🧠 **FOKUS ABSOLUT: KOD INDUSTRIAL, I VËRTETË, I MODULARIZUAR DHE I FUNKSIONALIZUAR 100%**

---

## ✅ TEKNOLOGJITË QË PËRDOREN

- ✅ `TypeScript` – çdo komponent, API, modul është `.ts` ose `.tsx` (nuk përdorim `.js`)
- ✅ `React + Next.js` – vetëm për UI të bazuar në faqe reale
- ✅ `Yarn` – menaxhimi kryesor i paketave (`yarn dev`, `yarn lint`, `yarn build`)
- ✅ `npm`, `npx` – përdorim kur duhet të thërrasim mjete CLI ose të integruar
- ✅ `PWSh` – çdo komandë zhvillimi dhe kontrolli në PowerShell (Windows)
- ✅ `WSL2 + Ubuntu` – zhvillimi serioz dhe testimi (ZSH ose bash)
- ✅ `Postman` – testim API real
- ✅ `Docker` – për backend AGI + testim të izoluar
- ✅ `Rust` – për module ultra-performante që lidhen me sistemin ose sigurinë
- ✅ `ESLint + Prettier` – kontroll i kodit dhe stilit për çdo skedar

---

## ❌ TEKNOLOGJITË QË NDALOHEN

- ❌ `Vite` – nuk përdoret, sepse projekti është bazuar në `Next.js`
- ❌ `TailwindCSS` – nuk përdoret (vendosim klasa vetë ose UltraThemeEngine)
- ❌ `Siluate`, `Mock`, `Faker` – ndalohet çdo formë "fake testing"
- ❌ `Math.random` në funksione të prodhimit – vetëm në debug ose shembuj
- ❌ `Lorem ipsum`, `placeholder`, `API fiktivë` – të gjitha hiqen nga çdo modul
- ❌ `Imagjinata teknike jo-funksionale` – çdo skedar duhet të japë **vlerë reale ose fshihet**

---

## 🧱 STRUKTURË MODULARE

```
ultrawebthinking/
├── backend/
│   ├── agi/             # AGICore dhe module inteligjente
│   │   ├── core-real.ts
│   │   ├── sense.ts
│   │   ├── mind.ts
│   │   ├── response.ts
│   │   └── monitor.ts
│   ├── api/             # API reale për Surfing, AGI, Navigate
│   ├── routes.ts        # Centralizon të gjitha endpoint-et
│   └── server.ts        # Server Express
├── components/          # Komponentët realë (Surfing, AGISheet, Navigator)
├── app/                 # Next.js App Router pages
├── themes/              # UltraThemeEngine (jo Tailwind)
├── lib/                 # Utilities dhe helpers
├── tests/               # Unit tests për çdo modul
├── scripts/             # Backup, build, maintenance scripts
├── docker/              # Docker configs
├── memory.json          # Ruajtje reale për input + përgjigje
├── logs.json            # Log real për çdo operacion
├── VERSION.txt          # Version control qendror
├── .dockerignore
├── .eslintignore
├── PROJECT_RULES.md     # Ky dokument
└── README.md            # Udhëzime reale për përdorim/prodhim
```

---

## 🎯 ELEMENTET KRITIKE QË DUHEN IMPLEMENTUAR

### 🔄 1. LOGGING REAL
- `backend/agi/monitor.ts` duhet të shkruaj në `logs.json`
- Çdo API call të regjistrohet me timestamp
- Çdo gabim të ruhet për debug

### 📖 2. DOKUMENTIM MODULAR
- README për çdo modul: `/backend/agi/README.md`
- API documentation në `/docs/api.md`
- Komponentët e UI të dokumentuar

### 🔐 3. SIGURIA API
- Rate limiting në `/api/chat`
- Input validation në çdo endpoint
- Authentication basis (nëse nevojitet)

### 🧪 4. TESTING
- Unit tests për `AGICore`
- Integration tests për API endpoints
- Tests për çdo komponent kritik

### 📦 5. DEPENDENCY SECURITY
- `yarn audit` të ekzekutohet rregullisht
- Asnjë dependency e panjohur
- Lock files të ruajtura në Git

### 🗃️ 6. BACKUP & MAINTENANCE
- Script për backup të `memory.json` dhe `logs.json`
- Clean up scripts për old logs
- Health check endpoints

---

## ⚙️ ÇDO MODUL DUHET TË:

1. **Jep shërbim të matshëm real**
2. **Mos përdorë simulim ose placeholder**
3. **Jetë në TypeScript të pastër**
4. **Jetë i testuar manualisht ose përmes Postman**
5. **Mos ketë asnjë funksion të pashfrytëzuar**
6. **Ketë dokumentim minimal në krye të skedarit**

---

## 🛠️ ÇDO FUNKSION:

- **Emër i saktë, i lexueshëm**
- **Jep output real dhe i kuptueshëm**
- **Nëse është bosh, shënohet `// Not implemented yet` dhe nuk thirret në prodhim**
- **Ka type definitions të qarta**
- **Error handling për raste të zakonshme**

---

## 🔐 SIGURIA DHE INTEGRITETI

✅ Pa `eval`, `new Function()`, `hidden import`
✅ Pa token të ngulitur në kod
✅ Pa varësi që nuk dihet se nga vijnë (kontroll në package.json)
✅ Input validation në çdo API endpoint
✅ Rate limiting për endpoint kritikë
✅ Logs për çdo veprim administrativ

---

## 📦 GIT / PUSH / DEPLOY

**Çdo commit duhet të jetë për:**
- Një modul të vetëm
- Me mesazh të qartë (p.sh. `feat: add memory logger`)
- Nuk pranohet push me kod jo-funksional
- Deploy bëhet vetëm kur çdo endpoint dhe UI është i lidhur dhe testuar

**Branch Strategy:**
- `main` - production ready code only
- `develop` - integration branch
- `feature/xxx` - individual features

---

## 🧪 TESTING REQUIREMENTS

### Unit Tests
- `tests/agi/core.test.ts` - AGI core functionality
- `tests/api/chat.test.ts` - Chat API endpoints
- `tests/components/surfing.test.ts` - UI components

### Integration Tests
- API endpoint connectivity
- Database operations (memory.json)
- External service integrations

### Manual Testing
- Postman collections për çdo API
- UI testing në browser
- Performance testing për AGI responses

---

## 📊 PERFORMANCE STANDARDS

- **API Response Time**: < 500ms për operacione normale
- **Memory Usage**: Monitored dhe logged
- **Error Rate**: < 1% për operacione kritike
- **Availability**: 99.9% uptime target

---

## 🔍 CODE QUALITY STANDARDS

### TypeScript
- Strict mode enabled
- No `any` types në production code
- Explicit return types për functions
- Interface definitions për data structures

### ESLint Rules
- No unused variables
- No console.log në production
- Consistent code formatting
- Import order enforcement

---

## 🧠 MOTTO

**"Çdo skedar që nuk bën punë reale, fshihet. Çdo funksion që gënjen përdoruesin, ndalohet. Web8 është kod i vërtetë, për njerëz të vërtetë."**

---

## 📋 IMPLEMENTATION CHECKLIST

- [ ] Monitor.ts shkruan në logs.json
- [ ] Rate limiting në API endpoints
- [ ] Unit tests për AGI core
- [ ] Backup scripts implementuar
- [ ] Security audit i kryer
- [ ] Documentation e përditësuar
- [ ] .dockerignore dhe .eslintignore të konfiguruara
- [ ] VERSION.txt me version tracking
- [ ] Error handling në çdo modul
- [ ] Input validation implementuar

---

**Last Updated:** 2025-08-31  
**Version:** 8.0.0 Ultra  
**Author:** Ledjan Ahmati
