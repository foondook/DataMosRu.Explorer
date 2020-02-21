<template>
  <q-layout view="lHh Lpr lFf">
    <q-header
      elevated
      :class="{ 'bg-dark': darkMode, 'bg-primary': !darkMode }"
    >
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          icon="menu"
          aria-label="Menu"
        />

        <q-toolbar-title>Data.Mos.Ru Explorer</q-toolbar-title>

        <q-toggle v-model="darkMode" label="Dark Mode" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header class="text-grey-8">Categories</q-item-label>
        <q-item
          :to="`/category/${item.id}`"
          v-for="item in categories"
          :key="item.id"
        >
          <q-item-section avatar>
            <q-img :src="item.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ item.name }}</q-item-label>
            <!-- <q-item-label>{{ item.englishName }}</q-item-label> -->
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import axios from "axios";

export default {
  name: "MainLayout",

  data() {
    return {
      leftDrawerOpen: false
    };
  },
  computed: {
    ...mapGetters("categories", { categories: "all" }),
    darkMode: {
      get() {
        return this.$q.dark.isActive;
      },
      set(val) {
        this.$q.dark.set(val);
      }
    }
  },
  methods: {
    ...mapActions("categories", { loadCategories: "load" }),
    ...mapActions("datasets", { loadDatasets: "load" })
  },
  created() {
    this.darkMode = true;
    this.loadCategories();
    this.loadDatasets();
  }
};
</script>
