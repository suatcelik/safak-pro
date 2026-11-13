// Android ana ekran etiketini (strings.xml app_name) Türkçe ada çevirir.
// app.json'daki iç ad Xcode hedef adıyla uyum için ASCII tutulur ("Safak Sayar").
const { AndroidConfig, withStringsXml } = require('expo/config-plugins');

module.exports = function withAndroidAppName(config, { name }) {
  return withStringsXml(config, (cfg) => {
    cfg.modResults = AndroidConfig.Strings.setStringItem(
      [{ $: { name: 'app_name', translatable: 'false' }, _: name }],
      cfg.modResults,
    );
    return cfg;
  });
};
