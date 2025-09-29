<script>
// https://github.com/getkirby/kirby/blob/main/panel/src/components/Dialogs/ModelsDialog.vue

export default {
  extends: 'k-models-dialog',
  data() {
    return {
      categories: [],
      category: ''
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
        const categoriesResponse = await this.$api.get('yngrk-media-library/categories')
        this.categories = categoriesResponse.categories

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
  >
    <slot name="header" />

    <k-dialog-search v-if="hasSearch" :value="query" @search="query = $event" />

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
        layout="list"
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
        <slot name="options" v-bind="{ item: row }" />
      </template>
    </k-collection>
  </k-dialog>
</template>