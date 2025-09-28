<script>
export default {
  extends: 'k-files-field',
  props: ['test'],
  mounted() {
    console.log(this.$props.test)
  },
}
</script>