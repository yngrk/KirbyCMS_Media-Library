<script>
// https://github.com/getkirby/kirby/blob/main/panel/src/components/Dialogs/ModelsDialog.vue

export default {
  extends: 'k-models-dialog',
  data() {
    return {
      categories: [],
      category: '',
      layout: 'list'
    }
  },
  watch: {
    async category() {
      await this.fetch()
    }
  },
  methods: {
    setLayout(layout) {
      this.layout = layout
    },
    async fetch() {
      const params = {
        page: this.pagination.page,
        search: this.query,
        ...this.fetchParams,
        category: this.category
      };

      try {
        this.categories = await this.$api.get('yngrk-media-library/categories')

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
    },
  }
}
</script>

<template>
  <k-dialog
      v-bind="$props"
      class="k-models-dialog"
      @cancel="$emit('cancel')"
      @submit="submit"
      size="large"
  >
    <k-select-field
        :options="categories"
        v-model="category"
        placeholder="Filter by category"
        class="category-select"
    ></k-select-field>

    <div class="control">
      <k-dialog-search v-if="hasSearch" :value="query" @search="query = $event" />
      <k-button-group layout="collapsed">
        <k-button icon="bars" size="lg" variant="filled" @click="setLayout('list')"></k-button>
        <k-button icon="grid" size="lg" variant="filled" @click="setLayout('cards')"></k-button>
      </k-button-group>
    </div>

    <k-collection
        :empty="{
				...empty,
				text: $panel.dialog.isLoading ? $t('loading') : empty.text
			}"
        :items="items"
        :link="false"
        :pagination="{
				details: true,
				dropdown: false,
				align: 'center',
				...pagination
			}"
        :sortable="false"
        :layout="layout"
        size="small"
        @item="toggle"
        @paginate="paginate"
    >
      <template #options="{ item: row }">
        <k-choice-input
            :checked="isSelected(row)"
            :type="multiple && max !== 1 ? 'checkbox' : 'radio'"
            :title="isSelected(row) ? $t('remove') : $t('select')"
            @click.stop="toggle(row)"
        />
      </template>
    </k-collection>
  </k-dialog>
</template>

<style scoped>
.k-models-dialog {
  max-height: 100%;
}

.category-select {
  margin-bottom: 0.75rem;
}

.control {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 0.75rem;
}

.control .k-dialog-search {
  flex: 1;
  margin-bottom: 0;
}
</style>