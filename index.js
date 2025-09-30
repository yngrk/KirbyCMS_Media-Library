(function() {
  "use strict";
  function normalizeComponent(scriptExports, render, staticRenderFns, functionalTemplate, injectStyles, scopeId, moduleIdentifier, shadowMode) {
    var options = typeof scriptExports === "function" ? scriptExports.options : scriptExports;
    if (render) {
      options.render = render;
      options.staticRenderFns = staticRenderFns;
      options._compiled = true;
    }
    if (scopeId) {
      options._scopeId = "data-v-" + scopeId;
    }
    return {
      exports: scriptExports,
      options
    };
  }
  const _sfc_main$2 = {
    extends: "k-models-dialog",
    data() {
      return {
        categories: [],
        category: ""
      };
    },
    computed: {
      categoryOptions() {
        return this.categories.map((c) => ({
          value: c,
          text: c
        }));
      }
    },
    watch: {
      async category() {
        await this.fetch();
      }
    },
    methods: {
      async fetch() {
        const params = {
          page: this.pagination.page,
          search: this.query,
          ...this.fetchParams,
          category: this.category
        };
        try {
          const categoriesResponse = await this.$api.get("yngrk-media-library/categories");
          this.categories = categoriesResponse.categories;
          this.$panel.dialog.isLoading = true;
          const response = await this.$api.get(this.endpoint, params);
          this.models = response.data;
          this.pagination = response.pagination;
          this.$emit("fetched", response);
        } catch (e) {
          this.$panel.error(e);
          this.models = [];
        } finally {
          this.$panel.dialog.isLoading = false;
        }
      }
    }
  };
  var _sfc_render$2 = function render() {
    var _vm = this, _c = _vm._self._c;
    return _c("k-dialog", _vm._b({ staticClass: "k-models-dialog", on: { "cancel": function($event) {
      return _vm.$emit("cancel");
    }, "submit": _vm.submit } }, "k-dialog", _vm.$props, false), [_vm._t("header"), _c("k-select-field", { staticClass: "category-select", attrs: { "options": _vm.categoryOptions, "placeholder": "Filter by category" }, model: { value: _vm.category, callback: function($$v) {
      _vm.category = $$v;
    }, expression: "category" } }), _vm.hasSearch ? _c("k-dialog-search", { attrs: { "value": _vm.query }, on: { "search": function($event) {
      _vm.query = $event;
    } } }) : _vm._e(), _c("k-collection", { attrs: { "empty": {
      ..._vm.empty,
      text: _vm.$panel.dialog.isLoading ? _vm.$t("loading") : _vm.empty.text
    }, "items": _vm.items, "link": false, "pagination": {
      details: true,
      dropdown: false,
      align: "center",
      ..._vm.pagination
    }, "sortable": false, "layout": "list" }, on: { "item": _vm.toggle, "paginate": _vm.paginate }, scopedSlots: _vm._u([{ key: "options", fn: function({ item: row }) {
      return [_c("k-choice-input", { attrs: { "checked": _vm.isSelected(row), "type": _vm.multiple && _vm.max !== 1 ? "checkbox" : "radio", "title": _vm.isSelected(row) ? _vm.$t("remove") : _vm.$t("select") }, on: { "click": function($event) {
        $event.stopPropagation();
        return _vm.toggle(row);
      } } }), _vm._t("options", null, null, { item: row })];
    } }], null, true) })], 2);
  };
  var _sfc_staticRenderFns$2 = [];
  _sfc_render$2._withStripped = true;
  var __component__$2 = /* @__PURE__ */ normalizeComponent(
    _sfc_main$2,
    _sfc_render$2,
    _sfc_staticRenderFns$2,
    false,
    null,
    "0b9d33f2"
  );
  __component__$2.options.__file = "/home/yngrk/code/kirby_dev/cms/site/plugins/media-library/src/components/MediaLibraryModelsDialog.vue";
  const MediaLibraryModelsDialog = __component__$2.exports;
  const _sfc_main$1 = {
    components: { MediaLibraryModelsDialog },
    extends: "k-files-dialog"
  };
  var _sfc_render$1 = function render() {
    var _vm = this, _c = _vm._self._c;
    return _c("media-library-models-dialog", _vm._b({ on: { "cancel": function($event) {
      return _vm.$emit("cancel");
    }, "submit": function($event) {
      return _vm.$emit("submit", $event);
    } } }, "media-library-models-dialog", _vm.$props, false));
  };
  var _sfc_staticRenderFns$1 = [];
  _sfc_render$1._withStripped = true;
  var __component__$1 = /* @__PURE__ */ normalizeComponent(
    _sfc_main$1,
    _sfc_render$1,
    _sfc_staticRenderFns$1,
    false,
    null,
    null
  );
  __component__$1.options.__file = "/home/yngrk/code/kirby_dev/cms/site/plugins/media-library/src/components/MediaLibraryFilesDialog.vue";
  const MediaLibraryFilesDialog = __component__$1.exports;
  const _sfc_main = {
    extends: "k-files-field",
    props: ["query", "uploads", "bucket", "libUid"],
    computed: {
      mediaLibraryEndpoint() {
        return "yngrk-media-library/files";
      },
      fetchParams() {
        return {
          bucket: this.bucket ?? "images",
          libUid: this.libUid ?? "media-library"
        };
      }
    },
    methods: {
      open() {
        if (this.disabled) {
          return false;
        }
        this.$panel.dialog.open({
          component: `media-library-files-dialog`,
          props: {
            endpoint: this.mediaLibraryEndpoint,
            fetchParams: this.fetchParams,
            hasSearch: this.search,
            max: this.max,
            multiple: this.multiple,
            value: this.selected.map((model) => model.id)
          },
          on: {
            submit: (models) => {
              this.select(models);
              this.$panel.dialog.close();
            }
          }
        });
      }
    }
  };
  const _sfc_render = null;
  const _sfc_staticRenderFns = null;
  var __component__ = /* @__PURE__ */ normalizeComponent(
    _sfc_main,
    _sfc_render,
    _sfc_staticRenderFns,
    false,
    null,
    null
  );
  __component__.options.__file = "/home/yngrk/code/kirby_dev/cms/site/plugins/media-library/src/fields/MediaLibraryField.vue";
  const MediaLibraryField = __component__.exports;
  panel.plugin("yngrk/media-library", {
    fields: {
      "media-library": MediaLibraryField
    },
    components: {
      "media-library-files-dialog": MediaLibraryFilesDialog,
      "media-library-models-dialog": MediaLibraryModelsDialog
    }
  });
})();
