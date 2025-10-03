<script>
export default {
  extends: 'k-files-field',
  props: ['query', 'uploads', 'bucket', 'libUid'],
  created() {
    console.log(this.$props)
  },
  computed: {
    mediaLibraryEndpoint() {
      return 'yngrk-media-library/files'
    },
    fetchParams() {
      return {
        bucket: this.$props.bucket ?? 'images',
        libUid: this.$props.libUid ?? 'media-library'
      }
    },
    uploadOptions() {
      return {
        accept: this.$props.uploads?.accept,
        max: this.$props.max,
        multiple: this.$props.multiple,
        preview: this.$props.uploads?.preview,
        on: {
          done: async (items) => {
            if (this.multiple === false) {
              this.selected = [];
            }
            for (const item of items) {
              if (this.selected.find((i) => i.id === item.id) === undefined) {
                this.selected.push(item);
              }
            }
            this.onInput();
            await this.$panel.content.update();
          }
        }
      }
    },
    buttons() {
      const buttons = []
      if (this.hasDropzone) {
        buttons.push({
          autofocus: this.autofocus,
          text: this.$t("upload"),
          responsive: true,
          icon: "upload",
          click: () => this.$panel.dialog.open({
            component: 'yngrk-media-library-upload-dialog',
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
      })

      return buttons
    },
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
    },
  }
}
</script>