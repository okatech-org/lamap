#!/usr/bin/env bash
#
# Déploiement Convex production pour lamap.
#
# Ce script :
#   1. Vérifie que tu es bien dans le dépôt.
#   2. Charge les variables depuis scripts/.env.deploy (ou les demande).
#   3. Configure les env vars Convex prod (Clerk, IAP, APNs).
#   4. Déploie schema + functions vers Convex prod.
#
# Prérequis :
#   - bun ou npx installé
#   - Avoir créé le deployment Convex prod (dashboard.convex.dev) et récupéré la deploy key
#   - Avoir Clerk prod, App-Specific Shared Secret, et (option) clé APNs .p8
#
# Usage :
#   bash scripts/deploy-prod.sh
#   ou
#   CONVEX_DEPLOY_KEY=xxx bash scripts/deploy-prod.sh
#
set -euo pipefail

# --- Helpers ---------------------------------------------------------------

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${REPO_ROOT}/scripts/.env.deploy"

color_red()   { printf "\033[31m%s\033[0m\n" "$*"; }
color_green() { printf "\033[32m%s\033[0m\n" "$*"; }
color_blue()  { printf "\033[34m%s\033[0m\n" "$*"; }
color_yellow(){ printf "\033[33m%s\033[0m\n" "$*"; }

ask() {
  # ask VAR_NAME "Prompt" [default]
  local var=$1 prompt=$2 default=${3:-}
  if [[ -n "${!var:-}" ]]; then
    color_blue "  $var déjà fourni (env)."
    return
  fi
  local input
  if [[ -n "$default" ]]; then
    read -r -p "  $prompt [$default] : " input
    input=${input:-$default}
  else
    read -r -p "  $prompt : " input
  fi
  printf -v "$var" '%s' "$input"
  export "$var"
}

ask_secret() {
  # ask_secret VAR_NAME "Prompt"
  local var=$1 prompt=$2
  if [[ -n "${!var:-}" ]]; then
    color_blue "  $var déjà fourni (env)."
    return
  fi
  local input
  read -r -s -p "  $prompt : " input
  echo
  printf -v "$var" '%s' "$input"
  export "$var"
}

# --- Sanity ----------------------------------------------------------------

cd "$REPO_ROOT"
if [[ ! -d packages/convex ]]; then
  color_red "Erreur : packages/convex introuvable. Lance le script depuis la racine du repo."
  exit 1
fi

if [[ -f "$ENV_FILE" ]]; then
  color_blue "Chargement de $ENV_FILE"
  # shellcheck disable=SC1090
  set -a; . "$ENV_FILE"; set +a
fi

# --- 1. Récupération des valeurs ------------------------------------------

color_green "=== Configuration Convex production ==="
ask CONVEX_DEPLOY_KEY      "Convex Production Deploy Key (https://dashboard.convex.dev > Settings > Deploy Keys)"

color_green "=== Clerk production ==="
ask CLERK_JWT_ISSUER_DOMAIN "Clerk JWT Issuer Domain prod (ex: https://clerk.okatech.com)"
ask_secret CLERK_SECRET_KEY        "Clerk Secret Key prod (sk_live_...)"
ask_secret CLERK_WEBHOOK_SECRET    "Clerk Webhook Secret prod (whsec_...)"

color_green "=== In-App Purchase ==="
ask_secret IAP_APPLE_SHARED_SECRET "App-Specific Shared Secret (ASC > App Information)"

color_green "=== Push Notifications APNs (laisser vide si géré par EAS) ==="
ask APNS_KEY_ID            "APNs Key ID (laisser vide pour skip)"
if [[ -n "${APNS_KEY_ID:-}" ]]; then
  ask APNS_TEAM_ID           "Apple Team ID"
  ask APNS_TOPIC             "APNs Topic" "com.okatech.lamap"
  ask APNS_P8_PATH           "Chemin vers AuthKey_${APNS_KEY_ID}.p8"
  if [[ ! -f "$APNS_P8_PATH" ]]; then
    color_red "Fichier $APNS_P8_PATH introuvable."
    exit 1
  fi
  APNS_AUTH_KEY=$(cat "$APNS_P8_PATH")
  export APNS_AUTH_KEY
fi

# --- 2. Push env vars vers Convex prod ------------------------------------

color_green "=== Configuration des env vars Convex prod ==="
cd "${REPO_ROOT}/packages/convex"

CX="bunx convex"
if ! command -v bunx >/dev/null 2>&1; then
  CX="npx convex"
fi
color_blue "Utilisation de : $CX"

set_env() {
  local key=$1 value=$2
  if [[ -z "$value" ]]; then return; fi
  color_blue "  -> $key"
  $CX env set --prod "$key" "$value" >/dev/null
}

set_env CLERK_JWT_ISSUER_DOMAIN "$CLERK_JWT_ISSUER_DOMAIN"
set_env CLERK_SECRET_KEY        "$CLERK_SECRET_KEY"
set_env CLERK_WEBHOOK_SECRET    "$CLERK_WEBHOOK_SECRET"
set_env IAP_APPLE_SHARED_SECRET "$IAP_APPLE_SHARED_SECRET"

if [[ -n "${APNS_KEY_ID:-}" ]]; then
  set_env APNS_KEY_ID   "$APNS_KEY_ID"
  set_env APNS_TEAM_ID  "$APNS_TEAM_ID"
  set_env APNS_TOPIC    "$APNS_TOPIC"
  set_env APNS_AUTH_KEY "$APNS_AUTH_KEY"
fi

# --- 3. Deploy schema + functions -----------------------------------------

color_green "=== Deploy schema + functions vers Convex prod ==="
$CX deploy

color_green "✅ Convex production déployé avec succès."
echo
color_yellow "Prochaines étapes :"
echo "  1. Vérifier le dashboard Convex (https://dashboard.convex.dev)"
echo "  2. Récupérer l'URL prod (https://<slug>.convex.cloud)"
echo "  3. Pousser les secrets EAS :"
echo "       cd apps/mobile && eas secret:create --scope project --name EXPO_PUBLIC_CONVEX_URL --value '<url>'"
echo "  4. Lancer le build : eas build --profile production --platform ios"
