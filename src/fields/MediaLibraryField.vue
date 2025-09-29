<script>
export default {
  extends: 'k-files-field',
  props: ['query', 'uploads', 'bucket', 'libUid'],
  computed: {
    mediaLibraryEndpoint() {
      return 'yngrk-media-library/files'
    },
    fetchParams() {
      return {
        bucket: this.bucket ?? 'images',
        libUid: this.libUid ?? 'media-library'
      }
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
    },
  }
}
</script>