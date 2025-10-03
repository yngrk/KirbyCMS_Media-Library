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
  const _sfc_main$3 = {
    extends: "k-models-dialog",
    data() {
      return {
        categories: [],
        category: "",
        layout: "list"
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
      setLayout(layout) {
        this.layout = layout;
      },
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
  var _sfc_render$3 = function render() {
    var _vm = this, _c = _vm._self._c;
    return _c("k-dialog", _vm._b({ staticClass: "k-models-dialog", attrs: { "size": "large" }, on: { "cancel": function($event) {
      return _vm.$emit("cancel");
    }, "submit": _vm.submit } }, "k-dialog", _vm.$props, false), [_c("k-select-field", { staticClass: "category-select", attrs: { "options": _vm.categoryOptions, "placeholder": "Filter by category" }, model: { value: _vm.category, callback: function($$v) {
      _vm.category = $$v;
    }, expression: "category" } }), _c("div", { staticClass: "control" }, [_vm.hasSearch ? _c("k-dialog-search", { attrs: { "value": _vm.query }, on: { "search": function($event) {
      _vm.query = $event;
    } } }) : _vm._e(), _c("k-button-group", { attrs: { "layout": "collapsed" } }, [_c("k-button", { attrs: { "icon": "bars", "size": "lg", "variant": "filled" }, on: { "click": function($event) {
      return _vm.setLayout("list");
    } } }), _c("k-button", { attrs: { "icon": "grid", "size": "lg", "variant": "filled" }, on: { "click": function($event) {
      return _vm.setLayout("cards");
    } } })], 1)], 1), _c("k-collection", { attrs: { "empty": {
      ..._vm.empty,
      text: _vm.$panel.dialog.isLoading ? _vm.$t("loading") : _vm.empty.text
    }, "items": _vm.items, "link": false, "pagination": {
      details: true,
      dropdown: false,
      align: "center",
      ..._vm.pagination
    }, "sortable": false, "layout": _vm.layout, "size": "small" }, on: { "item": _vm.toggle, "paginate": _vm.paginate }, scopedSlots: _vm._u([{ key: "options", fn: function({ item: row }) {
      return [_c("k-choice-input", { attrs: { "checked": _vm.isSelected(row), "type": _vm.multiple && _vm.max !== 1 ? "checkbox" : "radio", "title": _vm.isSelected(row) ? _vm.$t("remove") : _vm.$t("select") }, on: { "click": function($event) {
        $event.stopPropagation();
        return _vm.toggle(row);
      } } })];
    } }]) })], 1);
  };
  var _sfc_staticRenderFns$3 = [];
  _sfc_render$3._withStripped = true;
  var __component__$3 = /* @__PURE__ */ normalizeComponent(
    _sfc_main$3,
    _sfc_render$3,
    _sfc_staticRenderFns$3,
    false,
    null,
    "0b9d33f2"
  );
  __component__$3.options.__file = "/home/yngrk/code/kirby_dev/cms/site/plugins/media-library/src/components/MediaLibraryModelsDialog.vue";
  const MediaLibraryModelsDialog = __component__$3.exports;
  const _sfc_main$2 = {
    components: { MediaLibraryModelsDialog },
    extends: "k-files-dialog"
  };
  var _sfc_render$2 = function render() {
    var _vm = this, _c = _vm._self._c;
    return _c("media-library-models-dialog", _vm._b({ on: { "cancel": function($event) {
      return _vm.$emit("cancel");
    }, "submit": function($event) {
      return _vm.$emit("submit", $event);
    } } }, "media-library-models-dialog", _vm.$props, false));
  };
  var _sfc_staticRenderFns$2 = [];
  _sfc_render$2._withStripped = true;
  var __component__$2 = /* @__PURE__ */ normalizeComponent(
    _sfc_main$2,
    _sfc_render$2,
    _sfc_staticRenderFns$2,
    false,
    null,
    null
  );
  __component__$2.options.__file = "/home/yngrk/code/kirby_dev/cms/site/plugins/media-library/src/components/MediaLibraryFilesDialog.vue";
  const MediaLibraryFilesDialog = __component__$2.exports;
  const _sfc_main$1 = {
    extends: "k-files-field",
    props: ["query", "uploads", "bucket", "libUid"],
    created() {
      console.log(this.$props);
    },
    computed: {
      mediaLibraryEndpoint() {
        return "yngrk-media-library/files";
      },
      fetchParams() {
        return {
          bucket: this.$props.bucket ?? "images",
          libUid: this.$props.libUid ?? "media-library"
        };
      },
      uploadOptions() {
        var _a, _b;
        return {
          accept: (_a = this.$props.uploads) == null ? void 0 : _a.accept,
          max: this.$props.max,
          multiple: this.$props.multiple,
          preview: (_b = this.$props.uploads) == null ? void 0 : _b.preview,
          on: {
            done: async (items) => {
              if (this.multiple === false) {
                this.selected = [];
              }
              for (const item of items) {
                if (this.selected.find((i) => i.id === item.id) === void 0) {
                  this.selected.push(item);
                }
              }
              this.onInput();
              await this.$panel.content.update();
            }
          }
        };
      },
      buttons() {
        const buttons = [];
        if (this.hasDropzone) {
          buttons.push({
            autofocus: this.autofocus,
            text: this.$t("upload"),
            responsive: true,
            icon: "upload",
            click: () => this.$panel.dialog.open({
              component: "yngrk-media-library-upload-dialog",
              props: {
                targetId: `${this.fetchParams.libUid}+${this.fetchParams.bucket}`,
                uploadOptions: this.uploadOptions,
                bucket: this.fetchParams.bucket
              }
            })
          });
        }
        buttons.push({
          autofocus: this.autofocus,
          text: this.$t("select"),
          icon: "checklist",
          responsive: true,
          click: () => this.open()
        });
        return buttons;
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
  const _sfc_render$1 = null;
  const _sfc_staticRenderFns$1 = null;
  var __component__$1 = /* @__PURE__ */ normalizeComponent(
    _sfc_main$1,
    _sfc_render$1,
    _sfc_staticRenderFns$1,
    false,
    null,
    null
  );
  __component__$1.options.__file = "/home/yngrk/code/kirby_dev/cms/site/plugins/media-library/src/fields/MediaLibraryField.vue";
  const MediaLibraryField = __component__$1.exports;
  const _sfc_main = {
    props: ["uploadOptions", "targetId", "bucket"],
    emits: ["cancel", "close", "submit", "success"],
    data() {
      return {
        isUploading: false,
        categories: [],
        categorySelection: ""
      };
    },
    async created() {
      await this.fetchCategories();
      await this.setUploadParams();
      await this.openPicker();
    },
    computed: {
      apiBase() {
        var _a, _b;
        return (_b = (_a = this.$panel) == null ? void 0 : _a.urls) == null ? void 0 : _b.api;
      },
      uploadUrl() {
        return `${this.apiBase}/pages/${this.$props.targetId}/files`;
      },
      categoryOptions() {
        return this.categories.map((c) => ({
          value: c,
          text: c
        })).filter((c) => c.value !== "uncategorized");
      },
      template() {
        switch (this.$props.bucket) {
          case "videos":
            return "yngrk-media-video";
          case "documents":
            return "yngrk-media-document";
          default:
            return "yngrk-media-image";
        }
      }
    },
    methods: {
      async fetchCategories() {
        try {
          const categoriesResponse = await this.$api.get("yngrk-media-library/categories");
          this.categories = categoriesResponse.categories;
        } catch (e) {
          console.error(e);
        }
      },
      async setUploadParams() {
        var _a, _b, _c, _d;
        await this.$panel.upload.set({
          url: this.uploadUrl,
          accept: ((_a = this.uploadOptions) == null ? void 0 : _a.accept) ?? "*",
          max: ((_b = this.uploadOptions) == null ? void 0 : _b.max) ?? null,
          multiple: ((_c = this.uploadOptions) == null ? void 0 : _c.multiple) ?? true,
          preview: ((_d = this.uploadOptions) == null ? void 0 : _d.preview) ?? {},
          attributes: {
            template: this.template
          },
          on: {
            done: async (files) => {
              var _a2, _b2, _c2;
              await Promise.allSettled(
                files.map((f) => {
                  this.$panel.api.patch(f.link, {
                    category: this.categorySelection
                  });
                })
              );
              const normalized = files.map((f) => {
                const item = {
                  id: f.id,
                  link: f.link,
                  text: f.filename
                };
                if (f.type === "video") {
                  item.image = {
                    icon: "video",
                    color: "yellow",
                    cover: false,
                    back: "pattern"
                  };
                } else if (f.type === "document") {
                  item.image = {
                    icon: "document",
                    color: "red-500",
                    cover: false,
                    back: "pattern"
                  };
                } else {
                  item.image = {
                    src: f.url,
                    cover: false,
                    back: "pattern"
                  };
                }
                return item;
              });
              await ((_c2 = (_b2 = (_a2 = this.$props.uploadOptions) == null ? void 0 : _a2.on) == null ? void 0 : _b2.done) == null ? void 0 : _c2.call(_b2, normalized));
            },
            error: (file, err) => {
              console.error("upload error", file == null ? void 0 : file.name, err);
            }
          }
        });
      },
      onCancel() {
        this.$emit("cancel");
        this.close();
      },
      async onSubmit() {
        var _a, _b;
        this.isUploading = true;
        try {
          await this.$panel.upload.submit();
          (_b = (_a = this.$panel.upload).reset) == null ? void 0 : _b.call(_a);
        } catch (e) {
          console.error(e);
        } finally {
          this.isUploading = false;
        }
      },
      close() {
        var _a, _b;
        (_b = (_a = this.$refs.dialog) == null ? void 0 : _a.close) == null ? void 0 : _b.call(_a);
        this.$panel.dialog.close();
      },
      openPicker() {
        var _a;
        (_a = this.$refs.fileInput) == null ? void 0 : _a.click();
      },
      async onPicked(e) {
        const files = e.target.files;
        this.$panel.upload.select(files);
      }
    }
  };
  var _sfc_render = function render() {
    var _a, _b;
    var _vm = this, _c = _vm._self._c;
    return _c("k-dialog", { ref: "dialog", staticClass: "yngrk-media-library-upload-dialog", attrs: { "visible": true, "disabled": _vm.$panel.upload.files.length === 0 || _vm.isUploading }, on: { "cancel": _vm.onCancel, "submit": _vm.onSubmit } }, [_c("k-select-field", { staticClass: "category-select", attrs: { "placeholder": "No Category", "options": _vm.categoryOptions }, model: { value: _vm.categorySelection, callback: function($$v) {
      _vm.categorySelection = $$v;
    }, expression: "categorySelection" } }), _c("k-dropzone", { on: { "drop": function($event) {
      return _vm.$panel.upload.select($event);
    } } }, [_vm.$panel.upload.files.length === 0 ? _c("k-empty", { attrs: { "icon": "upload", "layout": "cards" }, on: { "click": _vm.openPicker } }, [_vm._v(" " + _vm._s(_vm.$t("files.empty")) + " ")]) : _c("k-upload-items", { attrs: { "items": _vm.$panel.upload.files }, on: { "remove": (file) => _vm.$panel.upload.remove(file.id), "rename": (file, name) => _vm.$panel.upload.rename(file.id, name) } })], 1), _c("input", { ref: "fileInput", staticStyle: { "display": "none" }, attrs: { "type": "file", "multiple": ((_a = _vm.uploadOptions) == null ? void 0 : _a.multiple) ?? true, "accept": (_b = _vm.uploadOptions) == null ? void 0 : _b.accept }, on: { "change": _vm.onPicked } })], 1);
  };
  var _sfc_staticRenderFns = [];
  _sfc_render._withStripped = true;
  var __component__ = /* @__PURE__ */ normalizeComponent(
    _sfc_main,
    _sfc_render,
    _sfc_staticRenderFns,
    false,
    null,
    "40b0430e"
  );
  __component__.options.__file = "/home/yngrk/code/kirby_dev/cms/site/plugins/media-library/src/components/MediaLibraryUploadDialog.vue";
  const MediaLibraryUploadDialog = __component__.exports;
  panel.plugin("yngrk/media-library", {
    fields: {
      "yngrk-media-library": MediaLibraryField
    },
    components: {
      "media-library-files-dialog": MediaLibraryFilesDialog,
      "media-library-models-dialog": MediaLibraryModelsDialog,
      "yngrk-media-library-upload-dialog": MediaLibraryUploadDialog
    }
  });
})();
