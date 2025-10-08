// 從 pinia 套件中匯入 defineStore 函數，這是用來定義一個 store 的主要 API
import { defineStore } from 'pinia'

export const useLoginInfoStore = defineStore('loginInfo', {
  /*
    state: 定義這個 store 管理的狀態（類似 Vue data）
    - 這裡我們定義了一個變數 count，初始值為 0
    - 使用箭頭函式回傳一個新的狀態物件，避免不同組件共享同一實例（防止污染）
  */
  state: () => ({
    // mainURL : "http://127.0.0.1:8000",
    mainURL : "/api",
    auth : {"username": "admin","password": "84149738"},
    // auth : {"username": "akira","password": "84149738"},
    accessToken: "",
    refreshToken: "",
    loginSuccess: false,
    chosedSite:"",

    site_list: [],
    image_list: [],
    device_list: [],
    playlist_list: [],
    snapshot_list: [],
    timetable_list: [],
    device_model_list: [],
    device_status_code_list: [],
  }),
  getters: {
    /*
      getters: 相當於 Vue 的 computed，用來根據 state 計算衍生資料
      - 這裡定義了一個 currentCount getter，實際上只是回傳 count 本身
      - 雖然可以直接用 this.count 取得值，但這種寫法在大型應用有助於封裝與統一存取邏輯
    */
    header: (state) => {
      return {
        "user-agent": "Mozilla/4.0 MDN Example",
        "content-type": "application/json",
        'Authorization': `Bearer ${state.accessToken}`
      };
    },
    device_in_site: (state) => {
      var returnList = []
      for (var device of state.device_list) {
        if (device.site_id === state.chosedSite) {
          returnList.push(device)
        }
      }
      return returnList
    },
    playlist_dict: (state) => {
      var returnData = {}
      for (var data of state.playlist_list) {
        returnData[data.id] = data 
      }
      return returnData
    },
    site_dict: (state) => {
      var returnData = {}
      for (var data of state.site_list) {
        returnData[data.id] = data 
      }
      return returnData
    },
    image_dict: (state) => {
      var returnData = {}
      for (var data of state.image_list) {
        returnData[data.id] = data 
      }
      return returnData
    },
  },
  /*
    actions: 定義對 state 進行操作的行為（邏輯 + 觸發）
    - 可以是同步或非同步函式（支援 async/await）
    - 在這裡定義了一個 increment 方法，將 count 加 1
    - 在組件中可以用 `store.increment()` 直接呼叫
  */
  actions: {
    login() {
      return fetch(`${this.mainURL}/account/login/`, {
        method: "POST",
        headers: {
          "user-agent": "Mozilla/4.0 MDN Example",
          "content-type": "application/json",
        },
        body: JSON.stringify(this.auth)
      })
      .then(function (response) {
        return response.json();
      })
      .then(D_data => {
          const D_UserInfo = {
              id: D_data?.user_info?.user_id,
              username: D_data?.user_info?.username,
              language: D_data?.user_info?.language,
              isSuperuser: D_data?.user_info?.is_superuser,
          };
          this.accessToken = D_data?.access;
          this.refreshToken = D_data?.refresh;
          this.loginSuccess = true
          console.log('登入成功');
      })
      .catch(error => {
          // 處理請求失敗或網路錯誤
          console.error('請求失敗或發生錯誤：', error);
      });
    },


    updateImagelist() {
      function do_url (url, state) {
        fetch(url, {
          headers: state.header,
        })
        .then(function (response) {
          return response.json();
        })
        .then(D_data => {
          state.image_list = state.image_list.concat(D_data["results"])
          state.image_list.sort((a, b) => a.is_delete - b.is_delete);
          if (D_data["next"] != null) {
            const url = new URL(D_data["next"])
            var next_url = `${state.mainURL}${url.pathname}${url.search}`
            do_url(next_url, state)
          }
        })
      }
      this.image_list = []
      var url = `${this.mainURL}/images/?site=${this.chosedSite}&include_delete`
      do_url(url, this)
    },

    deleteImage(imageID) {
      fetch(`${this.mainURL}/images/${imageID}/`, {
        headers: this.header,
        method: "DELETE"
      })
      .then(function (response) {
        return response;
      })
      .then(D_data => {
        this.updateImagelist()
      })
    },



    updateDeviceList() {

      function do_url (url, state) {
        fetch(url, {
          headers: state.header,
        })
        .then(function (response) {
          return response.json();
        })
        .then(D_data => {
          state.device_list = state.device_list.concat(D_data["results"])
          if (D_data["next"] != null) {
            const urlObject = new URL(D_data["next"]);
            const pathname = urlObject.pathname;
            const search = urlObject.search;
            const pathWithoutDomain = pathname + search;
            // 輸出: "/devices/aecoPost/?page=2&site="
            do_url(`${state.mainURL}${pathWithoutDomain}`, state)
          }
        })
      }
      this.device_list = []
      var first_url = `${this.mainURL}/devices/aecoPost/?site=${this.chosedSite}`
      do_url(first_url, this)
    },


    updatePlaylist(chosedSite) {
      async function do_url (url, state) {
        fetch(url, {
          headers: state.header,
        })
        .then(function (response) {
          return response.json();
        })
        .then(D_data => {
          state.playlist_list = state.playlist_list.concat(D_data["results"])
          state.playlist_list.sort((a, b) => a.is_delete - b.is_delete);
          if (D_data["next"] != null) {
            do_url(D_data["next"], state)
          }
        })
      }
      this.playlist_list = []
      var url = `${this.mainURL}/playlist/?site=${chosedSite}&detail&include_delete`
      do_url(url, this)
    },
    deletePlaylist(playlistID) {
      return fetch(`${this.mainURL}/playlist/${playlistID}/`, {
        headers: this.header,
        method: "DELETE"
      })
      .then(function (response) {
        return response;
      })
      .then(D_data => {
        this.updatePlaylist(this.chosedSite)
      })
    },




    updateSnapshotlist(chosedSite) {
      function do_url (url, state) {
        fetch(url, {
          headers: state.header,
        })
        .then(function (response) {
          return response.json();
        })
        .then(D_data => {
          state.snapshot_list = state.snapshot_list.concat(D_data["results"])
          if (D_data["next"] != null) {
            do_url(D_data["next"], state)
          }
        })
      }
      this.snapshot_list = []
      var first_url = `${this.mainURL}/snapshot/?site=${chosedSite}`
      do_url(first_url, this)

    },



    updateSiteList() {
      fetch(`${this.mainURL}/site_manage/site/`, {
        headers: this.header,
      })
      .then(function (response) {
        return response.json();
      })
      .then(D_data => {
        this.site_list = D_data
      })
    },

    updateTimetableList() {
      fetch(`${this.mainURL}/timetable/?site=${this.chosedSite}`, {
        headers: this.header,
      })
      .then(function (response) {
        return response.json();
      })
      .then(D_data => {
        this.timetable_list = D_data["results"]
      })
    },
    deleteTimetable(timetableID) {
      fetch(`${this.mainURL}/timetable/${timetableID}/`, {
        headers: this.header,
        method: "DELETE"
      })
      .then(function (response) {
        return response;
      })
      .then(D_data => {
        this.updateTimetableList()
      })
    },

    updateDeviceModelList() {
      fetch(`${this.mainURL}/setting/device_model/`, {
        headers: this.header,
      })
      .then(function (response) {
        return response.json();
      })
      .then(D_data => {
        this.device_model_list = D_data
      })
    },


    updateDeviceStatusCodeList() {
      fetch(`${this.mainURL}/record/device_status_code/`, {
        headers: this.header,
      })
      .then(function (response) {
        return response.json();
      })
      .then(D_data => {
        this.device_status_code_list = D_data
      })
    },
  },
})
