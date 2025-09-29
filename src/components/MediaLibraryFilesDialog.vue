<script>
// https://github.com/getkirby/kirby/blob/main/panel/src/components/Dialogs/FilesDialog.vue
import MediaLibraryModelsDialog from "./MediaLibraryModelsDialog.vue";

export default {
  components: {MediaLibraryModelsDialog},
  extends: 'k-files-dialog',
}
</script>

<template>
  <media-library-models-dialog
      v-bind="$props"
      @cancel="$emit('cancel')"
      @submit="$emit('submit', $event)"
  />
</template>