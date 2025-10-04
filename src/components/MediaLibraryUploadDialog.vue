
<script>
export default {
  props: ['uploadOptions', 'targetId', 'bucket'],
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
    template() {
      switch (this.$props.bucket) {
        case 'videos': return 'yngrk-media-video';
        case 'documents': return 'yngrk-media-document';
        default: return 'yngrk-media-image';
      }
    }
  },
  methods: {
    uploadRename(file, filename) {
      console.log(file, filename)
    },
    async fetchCategories() {
      try {
        this.categories = await this.$api.get('yngrk-media-library/categories')
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
          template: this.template,
        },
        on: {
          done: async (files) => {
            await Promise.allSettled(
                files.map((f) => {
                  this.$panel.api.patch(f.link, {
                    category: [this.categorySelection]
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
    removeFromUploadQueue(file) {
      this.$panel.upload.remove(file.id)
      this.$refs.fileInput.value = ''
      console.log(this.$panel.upload.files)
    },
    sluggify(string) {
      return this.$helper.string.slug(string ,'', 'a-z0-9@._-')
    },
    async getFiles() {
      const response = await this.$api.get(`pages/${this.$props.targetId}/files`)
      return response.data
    },
    async onSubmit() {
      const uploadFiles = this.$panel.upload.files
      uploadFiles.forEach((f) => f.name = this.sluggify(f.name))

      const files = await this.getFiles()

      uploadFiles.forEach((f) => f.error = '')

      let hasErrors = false
      uploadFiles.forEach((f) => {
        if (files.some((fa) => fa.name === f.name)) {
          f.error = 'This file already exists.'
          hasErrors = true
        }

        if (uploadFiles.filter((fa) => fa.name === f.name).length > 1) {
          f.error = 'Duplicate names found.'
          hasErrors = true
        }
      })

      if (hasErrors) {
        throw Error('validation failed.')
      }

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
        :options="categories"
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
          @remove="removeFromUploadQueue"
          @rename="(file, name) => {file.name = name}"
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