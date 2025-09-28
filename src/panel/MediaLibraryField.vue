<script>
export default {
  extends: 'k-files-field',
  props: ['query', 'uploads', 'bucket', 'libUid'],
  created() {
    console.log(this.$props)
  },
}
</script>