import Vue from "vue";
import { DatasetsClient } from "src/api/api";

const client = new DatasetsClient(process.env.API_BASE_URL);

const state = {
  list: {}
};
const getters = {
  all: state => Object.values(state.list).sort(d => d.name),
  forCategory: state => cid =>
    Object.values(state.list)
      .filter(d => d.categoryId == cid)
      .sort(d => d.name),
  get: state => id => state.list[id]
};

const mutations = {
  resetDatasets(state) {
    state.list = {};
  },

  setDatasets(state, payload) {
    state.list = payload.reduce(function(result, item) {
      result[item.id] = item;
      return result;
    }, {});
  },

  addDataset(state, payload) {
    Vue.set(state.list, payload.id, payload);
  }
};

const actions = {
  async load({ commit }) {
    const options = Object.values({
      projection: ["Id", "Caption", "CategoryId"],
      foreign: false,
      filter: undefined,
      orderby: undefined,
      top: undefined,
      skip: undefined,
      inlinecount: "allpages"
    });

    const result = await client.getListPost(...options);

    // commit("resetDatasets");
    for (const index in result.items) {
      // const dataset = result.items[index];
      // commit("addDataset", {
      //   ...dataset,
      //   imageUrl: `${process.env.API_BASE_URL}/v1/datasets/${dataset.id}/image`,
      //   iconUrl: `${process.env.API_BASE_URL}/v1/datasets/${dataset.id}/icon/m`
      // });
      result.items[index] = {
        ...result.items[index],
        imageUrl: `${process.env.API_BASE_URL}/v1/datasets/${result.items[index].id}/image`,
        iconUrl: `${process.env.API_BASE_URL}/v1/datasets/${result.items[index].id}/icon/m`
      };
    }

    commit("setDatasets", result.items);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
