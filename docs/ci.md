# Mobile CI — GitHub Actions

Two workflows live under `.github/workflows/`:

| File | What it does |
|---|---|
| `build-android.yml` | Builds the Android **APK** on EAS Build, attaches it to a GitHub Release. |
| `build-ios.yml`     | Builds the iOS **IPA** on EAS Build, attaches it to a GitHub Release, optionally submits to **App Store Connect**. |

Both run on Expo's hosted EAS Build infrastructure — the GitHub runner only kicks the build, downloads the artifact and creates the release.

---

## Triggers

Each workflow can be fired in two ways:

1. **Manual** — `Actions` tab → pick the workflow → `Run workflow`. You choose the EAS profile (`preview` or `production`) and, on iOS, whether to also submit to App Store.
2. **Tag push** — pushing a tag matching `v*` (for example `git tag v1.2.0 && git push origin v1.2.0`) automatically:
   - Builds with the `production` profile on both platforms (run `build-android.yml` and `build-ios.yml` independently — both listen to `v*`).
   - Creates / updates the GitHub release for the tag and attaches the binary.
   - For iOS: submits the build to App Store Connect.

The release tag is the git tag itself on a tag push, or `android-build-<run_number>` / `ios-build-<run_number>` on a manual run (override via the `release_tag` input).

---

## One-time setup

### 1. Create an Expo access token

```bash
# Locally, signed in as the project owner (`kamau_it`):
eas user:tokens:create --name "github-actions-lamap"
# → copy the token shown (only shown once)
```

### 2. Add it as a GitHub repository secret

In the GitHub repo: `Settings` → `Secrets and variables` → `Actions` → `New repository secret`.

| Secret name | Value |
|---|---|
| `EXPO_TOKEN` | The token from step 1. |

That's the only secret the workflows themselves need. Everything else is handled inside Expo.

### 3. Configure runtime environment variables on EAS

The app reads `EXPO_PUBLIC_*` vars at build time. Locally they live in `.env.local`; for cloud builds register them on EAS:

```bash
eas env:create --environment production EXPO_PUBLIC_CONVEX_URL="https://your-deployment.convex.cloud"
eas env:create --environment production EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_live_..."
# Repeat for any other EXPO_PUBLIC_* vars you depend on.

# Same for the `preview` environment if you build the preview profile in CI.
eas env:create --environment preview EXPO_PUBLIC_CONVEX_URL="..."
eas env:create --environment preview EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY="..."
```

You can also set sensitive (non-`EXPO_PUBLIC_`) vars the Convex backend or other tooling needs:

```bash
eas env:create --environment production CLERK_SECRET_KEY="sk_live_..." --visibility secret
```

### 4. Generate signing credentials (one time, locally)

EAS needs to sign the binaries. Run these once on a machine logged into Expo:

```bash
# Android keystore — auto-generated and stored in Expo's secure store.
eas credentials --platform android

# iOS — distribution certificate + provisioning profile.
# Choose "Use App Store" when prompted. Requires Apple ID with the right role
# in App Store Connect for the team that owns `com.okatech.lamap`.
eas credentials --platform ios
```

After this, CI runs in `--non-interactive` mode and reuses the stored credentials automatically.

### 5. App Store Connect submission setup

Open `apps/mobile/eas.json` and replace the placeholders in the `submit.production.ios` block:

```json
"submit": {
  "production": {
    "ios": {
      "ascAppId": "1234567890",
      "appleTeamId": "ABCDE12345"
    }
  }
}
```

- `ascAppId` — the App Store Connect app's numeric ID (`appstoreconnect.apple.com` → your app → App Information → Apple ID).
- `appleTeamId` — the 10-character team ID from `developer.apple.com/account` → Membership.

For the very first submission you'll also need an App Store Connect API key (recommended over Apple ID + 2FA for CI):

```bash
eas credentials --platform ios   # → "Manage App Store Connect API keys"
```

EAS stores it; the CI workflow doesn't need to know about it.

---

## Day-to-day usage

### Manual one-off APK / IPA

1. Go to the repo's **Actions** tab.
2. Pick the workflow (`Build Android (APK)` or `Build iOS (IPA) + App Store`).
3. Click **Run workflow** → pick a profile (`preview` for internal sharing, `production` for store-grade signing) → run.
4. Wait for the build (typically 10–30 min on EAS). The job creates a release tagged `android-build-<n>` / `ios-build-<n>` with the binary attached.

### Production release (both platforms + submission)

```bash
# Update version in app.json + lockfiles, then:
git tag v1.2.0
git push origin v1.2.0
```

Both workflows fire on the tag, build the production binaries, attach them to release `v1.2.0`, and the iOS workflow submits to App Store Connect. Promote the build inside App Store Connect (TestFlight / production submission) once it lands.

---

## Notes

- `bun install --frozen-lockfile` runs at the repo root and installs the whole workspace; the `eas build` step then runs in `apps/mobile/`.
- The Android workflow uses the `production` profile by default, which produces an `.apk` (per `apps/mobile/eas.json`). Switch to `aab` (Play Store bundle) by editing `build.production.android.buildType` — the workflow itself doesn't need changes.
- iOS builds default to `distribution: store` since no override is set — the resulting IPA is signed for both TestFlight upload and App Store submission.
- The `softprops/action-gh-release@v2` step uses the default `GITHUB_TOKEN`; no extra PAT needed.
- If a build fails inside EAS, the GitHub job fails too with a link to the EAS build page in the logs (`https://expo.dev/accounts/kamau_it/projects/lamap/builds/<id>`).
