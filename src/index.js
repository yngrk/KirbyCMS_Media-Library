
import MediaLibraryFilesDialog from "./components/MediaLibraryFilesDialog.vue";
import MediaLibraryField from "./fields/MediaLibraryField.vue";
import MediaLibraryModelsDialog from "./components/MediaLibraryModelsDialog.vue";

panel.plugin('yngrk/media-library', {
  fields: {
    'media-library': MediaLibraryField
  },
  components: {
    'media-library-files-dialog': MediaLibraryFilesDialog,
    'media-library-models-dialog': MediaLibraryModelsDialog
  }
})
