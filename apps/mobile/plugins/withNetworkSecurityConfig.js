const { withAppBuildGradle } = require('@expo/config-plugins');

function createNetworkSecurityConfig() {
  return `<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">192.168.100.57</domain>
    </domain-config>
</network-security-config>`;
}

function withNetworkSecurityConfig(config) {
  // Add usesCleartextTraffic to AndroidManifest.xml
  config = withAppBuildGradle(config, (config) => {
    if (config.modResults.contents.includes('android:usesCleartextTraffic')) {
      return config;
    }

    config.modResults.contents = config.modResults.contents.replace(
      /<application/g,
      `<application android:usesCleartextTraffic="true"`
    );

    return config;
  });

  return config;
}

module.exports = withNetworkSecurityConfig;