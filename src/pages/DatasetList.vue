<template>
  <q-page padding v-if="category">
    <div class="text-h5 q-pa-md">{{ category.name }}</div>
    <q-separator />
    <q-list>
      <q-item
        :to="`/category/${item.categoryId}/dataset/${item.id}`"
        v-for="item in datasets"
        :key="item.id"
      >
        <q-item-section avatar>
          <q-avatar rounded :color="`category-${category.id}`">
            <q-img :src="item.iconUrl" />
          </q-avatar>
        </q-item-section>
        <q-item-section>{{ item.caption }}</q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      datasets: []
    };
  },
  computed: {
    ...mapGetters("categories", { getCategory: "get" }),
    ...mapGetters("datasets", { categoryDatasets: "forCategory" }),
    category() {
      return this.getCategory(this.$route.params.cid);
    }
  },
  watch: {
    category: {
      handler(val) {
        if (val) this.datasets = this.categoryDatasets(val.id);
      },
      deep: true,
      immediate: true
    }
  }
};
</script>
