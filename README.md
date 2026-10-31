# 💰 FinanceApp — Controle Financeiro Mensal

App Android para controle financeiro com dashboard, gráficos e lançamentos diários.

---

## Funcionalidades

- **Dashboard mensal** com navegação mês a mês
- **Saldo, ganhos e gastos** com somas automáticas
- **Gráfico de barras** — balanço diário do mês
- **Gráfico de pizza** — breakdown por categoria
- **Lançamentos diários** — ganhos e gastos com categoria e descrição
- **Histórico** com filtros e agrupamento por data
- **Dados locais** — tudo salvo no dispositivo (AsyncStorage)
- **Dark theme** moderno

---

## Pré-requisitos para compilar

1. Conta gratuita em [expo.dev](https://expo.dev)
2. Repositório no GitHub

---

## Setup — Como gerar o APK pelo GitHub Actions

### 1. Fork / push para seu GitHub

```bash
git init
git add .
git commit -m "initial"
git remote add origin https://github.com/SEU_USUARIO/financeapp.git
git push -u origin main
```

### 2. Criar conta Expo e obter o token

1. Crie conta em https://expo.dev
2. Vá em **Account Settings → Access Tokens**
3. Crie um token com nome "github-actions"
4. Copie o token gerado

### 3. Adicionar o token no GitHub

1. No seu repositório → **Settings → Secrets and variables → Actions**
2. Clique em **New repository secret**
3. Nome: `EXPO_TOKEN`
4. Valor: o token que você copiou
5. Salve

### 4. Atualizar o app.json

Troque o campo `owner` e `slug` no `app.json`:

```json
{
  "expo": {
    "owner": "SEU_USUARIO_EXPO",
    "slug": "financeapp"
  }
}
```

### 5. Inicializar EAS (uma vez, localmente)

Se quiser fazer isso via CLI local primeiro:

```bash
npm install -g eas-cli
eas login
eas build:configure
```

Ou deixe o GitHub Actions fazer tudo automaticamente.

### 6. Disparar o build

- O build roda automaticamente em cada push na branch `main`
- Ou vá em **Actions → Build Android APK → Run workflow**

### 7. Baixar o APK

1. Acesse https://expo.dev/accounts/SEU_USUARIO/projects/financeapp/builds
2. Aguarde o build completar (~10–15 min)
3. Baixe o `.apk` diretamente

---

## Rodar localmente (desenvolvimento)

```bash
npm install
npx expo start
```

Escaneia o QR com o app **Expo Go** no celular.

Para build local (precisa do Android SDK):

```bash
npx expo run:android
```

---

## Estrutura

```
financeapp/
├── .github/workflows/build-apk.yml   # CI/CD
├── src/
│   ├── components/   # MonthNavigator, SummaryCards, Charts, EntryCard
│   ├── screens/      # Dashboard, AddEntry, History
│   ├── storage/      # AsyncStorage layer
│   ├── theme/        # Cores e categorias
│   ├── types/        # TypeScript interfaces
│   └── utils/        # Formatação, parsing
├── App.tsx           # Navegação + bottom tabs
├── app.json          # Config Expo
├── eas.json          # Perfis de build
└── package.json
```

---

## Profiles de build

| Profile | Output | Uso |
|---|---|---|
| `preview` | `.apk` | Instalar direto no celular |
| `production` | `.aab` | Publicar na Play Store |

---

## Notas

- AsyncStorage persiste os dados localmente no dispositivo
- Para backup/sync, adicione Supabase ou Firebase depois
- `uuid` para IDs únicos por lançamento
- `date-fns` para cálculo de dias no mês
