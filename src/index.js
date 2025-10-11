
import MediaLibraryFilesDialog from "./components/MediaLibraryFilesDialog.vue";
import MediaLibraryField from "./fields/MediaLibraryField.vue";
import MediaLibraryModelsDialog from "./components/MediaLibraryModelsDialog.vue";
import MediaLibraryUploadDialog from "./components/MediaLibraryUploadDialog.vue";

import MediaLibraryPanelView from "./components/panel/MediaLibraryPanelView.vue";


panel.plugin('yngrk/media-library', {
  fields: {
    'yngrk-media-library': MediaLibraryField
  },
  components: {
    'media-library-files-dialog': MediaLibraryFilesDialog,
    'media-library-models-dialog': MediaLibraryModelsDialog,
    'yngrk-media-library-upload-dialog': MediaLibraryUploadDialog,
    'yngrk-media-library-panel-view': MediaLibraryPanelView
  }
})
