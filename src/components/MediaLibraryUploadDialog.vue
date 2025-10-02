
<script>
export default {
  props: ['uploadOptions', 'targetId'],
  emits: ['cancel', 'close', 'submit', 'success'],
  data() {
    return {
      isUploading: false,
      categories: [],
      categorySelection: ''
    }
  },
  async created() {
    await this.fetchCategories()
    await this.setUploadParams()
    await this.openPicker()
  },
  computed: {
    apiBase() {
      return this.$panel?.urls?.api
    },
    uploadUrl() {
      return `${this.apiBase}/pages/${this.$props.targetId}/files`
    },
    categoryOptions() {
      return this.categories.map((c) => ({
        value: c,
        text: c,
      })).filter((c) => c.value !== 'uncategorized')
    },
  },
  methods: {
    async fetchCategories() {
      try {
        const categoriesResponse = await this.$api.get('yngrk-media-library/categories')
        this.categories = categoriesResponse.categories
      } catch (e) {
        console.error(e)
      }
    },
    async setUploadParams() {
      await this.$panel.upload.set({
        url: this.uploadUrl,
        accept: this.uploadOptions?.accept ?? '*',
        max: this.uploadOptions?.max ?? null,
        multiple: this.uploadOptions?.multiple ?? true,
        preview: this.uploadOptions?.preview ?? {},
        attributes: {
          template: 'yngrk-media-library-file',
        },
        on: {
          done: async (files) => {
            await Promise.allSettled(
                files.map((f) => {
                  this.$panel.api.patch(f.link, {
                    category: this.categorySelection
                  })
                })
            )

            const normalized = files.map((f) => {
              const item = {
                id: f.id,
                link: f.link,
                text: f.filename
              }

              if (f.type === 'video') {
                item.image = {
                  icon: 'video',
                  color: 'yellow',
                  cover: false,
                  back: 'pattern'
                }
              }
              else if (f.type === 'document') {
                item.image = {
                  icon: 'document',
                  color: 'red-500',
                  cover: false,
                  back: 'pattern'
                }
              }
              else {
                item.image = {
                  src: f.url,
                  cover: false,
                  back: 'pattern'
                }
              }

              return item
            })

            await this.$props.uploadOptions?.on?.done?.(normalized)
          },
          error: (file, err) => {
            console.error('upload error', file?.name, err)
          }
        }
      })
    },
    onCancel() {
      this.$emit('cancel');
      this.close();
    },
    async onSubmit() {
      this.isUploading = true
      try {
        await this.$panel.upload.submit();
        this.$panel.upload.reset?.()
      } catch (e) {
        console.error(e)
      } finally {
        this.isUploading = false
      }
    },
    close() {
      this.$refs.dialog?.close?.();
      this.$panel.dialog.close();
    },
    openPicker() {
      this.$refs.fileInput?.click()
    },
    async onPicked(e) {
      const files = e.target.files
      this.$panel.upload.select(files)
    },
  }
}
</script>


<template>
  <k-dialog
      ref="dialog"
      class="yngrk-media-library-upload-dialog"
      :visible="true"
      @cancel="onCancel"
      @submit="onSubmit"
      :disabled="$panel.upload.files.length === 0 || isUploading"
  >
    <k-select-field
        class="category-select"
        placeholder="No Category"
        :options="categoryOptions"
        v-model="categorySelection"
    ></k-select-field>

    <k-dropzone @drop="$panel.upload.select($event)">
      <k-empty
          v-if="$panel.upload.files.length === 0"
          icon="upload"
          layout="cards"
          @click="openPicker"
      >
        {{ $t('files.empty') }}
      </k-empty>

      <k-upload-items
          v-else
          :items="$panel.upload.files"
          @remove="(file) => $panel.upload.remove(file.id)"
          @rename="(file, name) => $panel.upload.rename(file.id, name)"
      />
    </k-dropzone>

    <input
        ref="fileInput"
        type="file"
        :multiple="uploadOptions?.multiple ?? true"
        :accept="uploadOptions?.accept"
        style="display:none"
        @change="onPicked"
    />
  </k-dialog>
</template>

<style scoped>
.category-select {
  margin-bottom: 0.75rem;
}
</style>