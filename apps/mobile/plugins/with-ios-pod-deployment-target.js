const fs = require("fs");
const path = require("path");
const { withDangerousMod } = require("expo/config-plugins");

const MARKER = "# Lamap: align every pod with Xcode's supported iOS target";
const TARGET = "16.0";

module.exports = function withIosPodDeploymentTarget(config) {
  return withDangerousMod(config, [
    "ios",
    async (modConfig) => {
      const podfilePath = path.join(
        modConfig.modRequest.platformProjectRoot,
        "Podfile",
      );
      const podfile = fs.readFileSync(podfilePath, "utf8");
      if (podfile.includes(MARKER)) {
        const updatedPodfile = podfile.replace(
          /(\# Lamap: align every pod with Xcode's supported iOS target[\s\S]*?build_config\.build_settings\['IPHONEOS_DEPLOYMENT_TARGET'\] = ')[^']+(')/,
          `$1${TARGET}$2`,
        );
        if (updatedPodfile !== podfile) {
          fs.writeFileSync(podfilePath, updatedPodfile);
        }
        return modConfig;
      }

      const reactNativePostInstall =
        /(    react_native_post_install\([\s\S]*?\n    \)\n)/;
      if (!reactNativePostInstall.test(podfile)) {
        throw new Error(
          "Bloc react_native_post_install introuvable dans le Podfile",
        );
      }

      const override = [
        `    ${MARKER}`,
        "    installer.pods_project.targets.each do |target|",
        "      target.build_configurations.each do |build_config|",
        `        build_config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '${TARGET}'`,
        "      end",
        "    end",
        "",
      ].join("\n");
      fs.writeFileSync(
        podfilePath,
        podfile.replace(reactNativePostInstall, `$1${override}`),
      );
      return modConfig;
    },
  ]);
};
