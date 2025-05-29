import { createStore, Store } from 'vuex'


// 1. 定義 state 的型別
export interface State {
  /**
   * 測試用count數
   */
  count: number
}

// 2. 建立 Store，並加上型別註解
export const store: Store<State> = createStore<State>({
  state: {
    count: 0, // test
  },
  mutations: {
    /**
     * 測試用count數 ++
     */
    increment(state) {
      state.count++
    },
  },
  actions: {
    incrementAsync({ commit }) {
      setTimeout(() => {
        commit('increment')
      }, 1000)
    },
  },
  modules: {},
})

export default store