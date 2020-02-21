import Vue from "vue";
import { CategoriesClient } from "src/api/api";

const client = new CategoriesClient(process.env.API_BASE_URL);

const state = {
  list: {},
  colors: {
    2: "#89bd40",
    3: "#27b9cc",
    4: "#c46c29",
    5: "#953c96",
    6: "#6eb197",
    7: "#e3402d",
    9: "#c92045",
    10: "#895ea6",
    11: "#c48a2b",
    12: "#bf569e",
    13: "#915aa3",
    14: "#4e7872",
    15: "#cc292c",
    21: "#63a89f",
    121: "#eb4997",
    141: "#7dbb7f",
    142: "#ed3e64",
    143: "#2577ba",
    161: "#34bfc2",
    162: "#faaf19",
    181: "#5d95cb",
    201: "#b55e61",
    202: "#6274a3",
    203: "#9c9835",
    204: "#855e45",
    321: "#666666"
  }
};
const getters = {
  all: state => Object.values(state.list).sort(c => c.englishName),
  get: state => id => state.list[id]
};

const mutations = {
  addCategory(state, payload) {
    Vue.set(state.list, payload.id, payload);
  },

  setCategoryIcon(state, payload) {
    Vue.set(state.list, payload.id, {
      ...state.list[payload.id],
      icon: payload.icon
    });
  }
};

const actions = {
  async load({ state, commit, dispatch }) {
    const options = Object.values({
      projection: ["Id", "Name", "EnglishName"],
      filter: undefined,
      orderby: "EnglishName",
      top: undefined,
      skip: undefined,
      inlinecount: true
    });

    const result = await client.getCategoriesListPost(...options);

    for (const index in result.items) {
      const cat = result.items[index];
      cat.color = state.colors[cat.id];
      commit("addCategory", cat);
      dispatch("loadIcon", cat.id);
    }
  },

  async loadIcon({ commit }, cid) {
    const base64 = await client.getItemIcon(cid);
    commit("setCategoryIcon", {
      id: cid,
      icon: `data:image/png;base64,${base64}`
    });
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
