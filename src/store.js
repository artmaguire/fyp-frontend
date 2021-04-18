import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    startNode: {},
    endNode: {},
    additionalNodes: [],
    routeType: null,
    routeHistory: []
  },
  mutations: {
    PUSH_NODE({ additionalNodes }, node) {
      additionalNodes.push(node);
    },
    UPDATE_NODE({ additionalNodes }, { index, data }) {
      additionalNodes[index].data = data;
    },
    REMOVE_NODE({ additionalNodes }, index) {
      additionalNodes.splice(index, 1);
    },
    SET_START_NODE(state, node) {
      state.startNode = node;
    },
    SET_END_NODE(state, node) {
      state.endNode = node;
    },
    SET_ROUTE_LOADING(state, searchType) {
      state.routeType = searchType;
    },
    SET_ROUTE_HISTORY(state, history) {
      Vue.set(state, 'routeHistory', history);
    },
    CLEAR_NODES(state) {
      state.additionalNodes = [];
    }
  },
  actions: {
    swapNodes({ commit, state }) {
      let start = state.startNode;
      commit('SET_START_NODE', state.endNode);
      commit('SET_END_NODE', start);
      commit('SET_ROUTE_HISTORY', []);
    },
    clearNodes({ commit }) {
      commit('SET_START_NODE', {});
      commit('SET_END_NODE', {});
      commit('CLEAR_NODES');
      commit('SET_ROUTE_HISTORY', []);
    }
  }
});
