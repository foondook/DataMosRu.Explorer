import Vue from "vue";
import { RowsClient, DatasetsClient } from "src/api/api";
import datasets from "./datasets";

const datasetsClient = new DatasetsClient(process.env.API_BASE_URL);
const rowsClient = new RowsClient(process.env.API_BASE_URL);

const state = {
  list: {},
  dataset: {}
};
const getters = {
  all: state => Object.values(state.list).sort(d => d.name),
  forCategory: state => cid =>
    Object.values(state.list)
      .filter(d => d.categoryId == cid)
      .sort(d => d.name),
  get: state => id => state.list[id],
  columns: state => {
    console.log(state.dataset);
    if (!state.dataset || !state.dataset.columns) return [];
    const columns = Object.values(state.dataset.columns).map(c =>
      Object.assign({}, c, {
        label: c.caption,
        field: c.name,
        align: "left"
        //style: "max-width:300px"
      })
    );
    return columns;
  },
  visibleColumns: state => {
    if (!state.dataset || !state.dataset.columns) return [];
    return Object.values(state.dataset.columns)
      .filter(c => c.visible)
      .map(c => c.name);
  },
  rows: (state, getters) => {
    if (!state.list) return [];
    const rows = getters.all.map(r => r.cells);
    console.log(rows);
    return rows;
  }
};

const mutations = {
  resetRows(state) {
    state.list = {};
  },
  resetDataset(state) {
    state.dataset = {};
  },

  setRows(state, payload) {
    state.list = payload.reduce(function(result, item) {
      result[item.global_id] = item;
      return result;
    }, {});
  },
  setDataset(state, payload) {
    state.dataset = payload;
  },
  addRow(state, payload) {
    Vue.set(state.list, payload.id, payload);
  }
};

const actions = {
  async load({ commit }, payload) {
    const options = Object.values({
      //categoryId: payload,
      projection: ["Id", "Caption", "CategoryId"],
      foreign: true,
      filter: undefined,
      orderby: undefined,
      top: undefined,
      skip: undefined,
      inlinecount: "allpages"
    });
    commit("resetRows");
    commit("resetDataset");
    const dataset = await datasetsClient.getItem(payload);
    commit("setDataset", dataset);

    const cols = dataset.columns.map(c => c.name);
    const rows = await rowsClient.getListByDatasetIdPost(payload, cols);
    commit("setRows", rows);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
