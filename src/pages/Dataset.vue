<template>
  <q-page padding v-if="dataset">
    <q-table
      dense
      class="sticky-header-table"
      :style="{ height: $q.screen.height - 100 + 'px' }"
      :title="dataset.caption"
      :data="rows"
      :columns="columns"
      row-key="name"
      :rows-per-page-options="[0]"
      :pagination="{ rowsPerPage: 0 }"
    />
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters("datasets", { getDataset: "get" }),
    ...mapGetters("rows", { columns: "columns", rows: "rows" }),
    dataset() {
      return this.getDataset(parseInt(this.$route.params.did));
    }
  },
  methods: {
    ...mapActions("rows", { loadRows: "load" })
  },
  watch: {
    dataset: {
      handler(val) {
        if (!!val && val.id) this.loadRows(val.id);
      },
      immediate: true
    }
  }
};
</script>
<style lang="scss">
.sticky-header-table {
  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th {
    /* bg color is important for th; just specify one */
    //background-color: #fff;
  }

  thead tr th {
    position: sticky;
    z-index: 1;
  }
  thead tr:first-child th {
    top: 0;
  }

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th {
    /* height of all previous header rows */
    top: 48px;
  }
}
</style>
