#!/bin/bash

echo "🔧 FILLIMI: Kontroll i strukturës së projektit..."

ROOT="$HOME/euroweb/euroweb-backend"
CORE="$ROOT/core"
TESTS="$ROOT/tests"
LOGS="$ROOT/logs"
SERVER="$ROOT/server.ts"

# 1. Verifikim i ekzistencës së moduleve kritike
critical_modules=("core.ts" "memory.ts" "monitor.ts" "validate.ts" "response.ts" "planner.ts" "sense.ts" "types.ts")
missing=()

echo "📦 Kontroll i moduleve në core/"

for mod in "${critical_modules[@]}"; do
  if [[ ! -f "$CORE/$mod" ]]; then
    echo "❌ Mungon: $mod"
    missing+=("$mod")
  else
    echo "✅ OK: $mod"
  fi
done

# 2. Krijimi i logs/ nëse mungon
if [[ ! -d "$LOGS" ]]; then
  echo "📁 Krijim i dosjes logs/"
  mkdir -p "$LOGS"
  touch "$LOGS/agi.log"
else
  echo "🗂️ logs/ ekziston."
fi

# 3. Kontroll i duplikimeve (jashtë core/)
dupes=$(find "$ROOT" -maxdepth 1 -type f -name "core.ts")
if [[ -f "$ROOT/core.ts" ]]; then
  echo "❌ Duplikat në rrënjë: core.ts – fshihet"
  rm "$ROOT/core.ts"
fi

# 4. Kontroll i core.ts duplikat në `agi/`
if [[ -f "$ROOT/agi/core.ts" ]]; then
  echo "❌ Duplikat në agi/: core.ts – fshihet"
  rm "$ROOT/agi/core.ts"
fi

# 5. Zhvendosje testesh (nëse ekziston core.test.ts)
if [[ -f "$ROOT/agi/core.test.ts" ]]; then
  echo "📦 Zhvendosje: core.test.ts → tests/"
  mkdir -p "$TESTS"
  mv "$ROOT/agi/core.test.ts" "$TESTS/core.test.ts"
fi

# 6. Reset imports në server.ts
if grep -q 'from "./agi/' "$SERVER"; then
  echo "♻️ Zëvendësim i importeve ./agi/ → ./core/"
  sed -i 's|from "./agi/|from "./core/|g' "$SERVER"
fi

# 7. Test minimal: a ekziston AGICore dhe a është i ekzekutueshëm
if ! grep -q 'class AGICore' "$CORE/core.ts"; then
  echo "🚨 Nuk u gjet klasa AGICore – kontrollo core/core.ts!"
  exit 1
fi

# 8. Rezultat final
echo ""
if [ ${#missing[@]} -eq 0 ]; then
  echo "✅ STRUKTURË E PLOTË. GATI PËR PRODhim."
else
  echo "⚠️ MUNGESA: ${missing[*]}"
fi

echo "🧠 Mbaroi. Mund të ekzekutosh: yarn dev"
