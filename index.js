(function() {
  "use strict";
  function normalizeComponent(scriptExports, render, staticRenderFns, functionalTemplate, injectStyles, scopeId, moduleIdentifier, shadowMode) {
    var options = typeof scriptExports === "function" ? scriptExports.options : scriptExports;
    return {
      exports: scriptExports,
      options
    };
  }
  const _sfc_main = {
    extends: "k-files-field",
    props: ["query", "uploads", "bucket", "libUid"],
    created() {
      console.log(this.$props);
    }
  };
  var __component__ = /* @__PURE__ */ normalizeComponent(
    _sfc_main
  );
  __component__.options.__file = "/home/yngrk/code/kirby_dev/cms/site/plugins/media-library/src/panel/MediaLibraryField.vue";
  const MediaLibraryField = __component__.exports;
  panel.plugin("yngrk/media-library", {
    fields: {
      "media-library": MediaLibraryField
    }
  });
})();
