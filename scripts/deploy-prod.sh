#!/usr/bin/env bash
# Configure Convex Auth et StoreKit, puis déploie le backend de production.
# Les valeurs peuvent être fournies par l'environnement ou scripts/.env.deploy.
set -euo pipefail

LAMAP_REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LAMAP_ENV_FILE="${LAMAP_REPO_ROOT}/scripts/.env.deploy"

color_red() { printf "\033[31m%s\033[0m\n" "$*"; }
color_green() { printf "\033[32m%s\033[0m\n" "$*"; }
color_blue() { printf "\033[34m%s\033[0m\n" "$*"; }

ask() {
  local var=$1 prompt=$2 input
  if [[ -n "${!var:-}" ]]; then
    color_blue "$var déjà fourni."
    return
  fi
  read -r -p "$prompt : " input
  printf -v "$var" '%s' "$input"
  export "$var"
}

ask_secret() {
  local var=$1 prompt=$2 input
  if [[ -n "${!var:-}" ]]; then
    color_blue "$var déjà fourni."
    return
  fi
  read -r -s -p "$prompt : " input
  printf "\n"
  printf -v "$var" '%s' "$input"
  export "$var"
}

cd "$LAMAP_REPO_ROOT"
if [[ ! -d packages/convex ]]; then
  color_red "packages/convex est introuvable."
  exit 1
fi

if [[ -f "$LAMAP_ENV_FILE" ]]; then
  color_blue "Chargement de $LAMAP_ENV_FILE"
  # shellcheck disable=SC1090
  set -a
  . "$LAMAP_ENV_FILE"
  set +a
fi

ask CONVEX_DEPLOY_KEY "Convex Production Deploy Key"
ask AUTH_APPLE_ID "Service ID Apple"
ask_secret AUTH_APPLE_SECRET "Secret JWT Apple"
ask AUTH_GOOGLE_ID "Client ID Google OAuth"
ask_secret AUTH_GOOGLE_SECRET "Client secret Google OAuth"
ask APPLE_APP_ID "Apple ID numérique de l'app App Store Connect"
ask_secret APPLE_ROOT_CERTIFICATES_BASE64 "Tableau JSON des certificats racine Apple encodés en base64"

cd "${LAMAP_REPO_ROOT}/packages/convex"

if command -v bunx >/dev/null 2>&1; then
  LAMAP_CONVEX=(bunx convex)
  LAMAP_AUTH_INIT=(bunx @convex-dev/auth)
else
  LAMAP_CONVEX=(npx convex)
  LAMAP_AUTH_INIT=(npx @convex-dev/auth)
fi

color_green "Initialisation des secrets Convex Auth de production"
"${LAMAP_AUTH_INIT[@]}" --prod

set_env() {
  local key=$1 value=$2
  color_blue "Configuration de $key"
  "${LAMAP_CONVEX[@]}" env set --prod "$key" "$value" >/dev/null
}

set_env AUTH_APPLE_ID "$AUTH_APPLE_ID"
set_env AUTH_APPLE_SECRET "$AUTH_APPLE_SECRET"
set_env AUTH_GOOGLE_ID "$AUTH_GOOGLE_ID"
set_env AUTH_GOOGLE_SECRET "$AUTH_GOOGLE_SECRET"
set_env APPLE_APP_ID "$APPLE_APP_ID"
set_env APPLE_ROOT_CERTIFICATES_BASE64 "$APPLE_ROOT_CERTIFICATES_BASE64"

color_green "Déploiement du schéma et des fonctions Convex"
"${LAMAP_CONVEX[@]}" deploy --prod

color_green "Backend de production déployé."
printf '%s\n' "Configure maintenant EXPO_PUBLIC_CONVEX_URL dans EAS, puis exécute le codegen contre ce déploiement."
