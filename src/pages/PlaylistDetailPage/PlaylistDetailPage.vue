<script setup lang="ts">

import {ref, computed} from 'vue'
import { useRoute, useRouter } from 'vue-router'; // 引入 useRoute
import { useLoginInfoStore } from '@/stores/counter'

const route = useRoute(); // 獲取當前路由物件
const router = useRouter();
const playlistId = ref(route.params.id);
const loginInfoStore = useLoginInfoStore()

const playlist_detail_temp = ref({})
const playlist_detail_save = ref("")

const is_playlistDataEdited = computed(() => { 
  if (playlist_detail_save.value === JSON.stringify(playlist_detail_temp.value)) {
    return false
  }
  return true
})


function updatePlaylistDetail() {
  return fetch(`${loginInfoStore.mainURL}/playlist/${playlistId.value}/?include_delete`, {
    headers: loginInfoStore.header,
  })
  .then(function (response) {
    return response.json();
  })
  .then(D_data => {
    playlist_detail_temp.value = D_data
    playlist_detail_save.value = JSON.stringify(D_data)
    loginInfoStore.chosedSite = D_data["site"]
  })
}

updatePlaylistDetail()
.then(() => {
  loginInfoStore.updateImagelist()
})

function delThisPlaylist() {
  loginInfoStore.deletePlaylist(playlistId.value)
  .then(() => {
    updatePlaylistDetail()
  })
}

function patchData() {
  var patchData = {}
  patchData["name"] = playlist_detail_temp.value.name
  patchData["canbeoverlaped"] = playlist_detail_temp.value.canbeoverlaped
  patchData["image_list"] = []
  for (var image_setting of playlist_detail_temp.value.image_list) {
    var addData = {}
    addData["image"] = image_setting["image"]
    addData["periodInSec"] = image_setting["periodInSec"]
    addData["valid_date_from"] = image_setting["valid_date_from"]
    addData["valid_date_end"] = image_setting["valid_date_end"]
    addData["configs"] = image_setting["configs"]
    patchData["image_list"].push(addData)
  }
  fetch(`${loginInfoStore.mainURL}/playlist/${playlistId.value}/`, {
    headers: loginInfoStore.header,
    method: "PATCH",
    body: JSON.stringify(patchData)
  })
  .then(function (response) {
    return response.json();
  })
  .then(D_data => {
    updatePlaylistDetail()
  })
}

function addNewPictureSetting(target) {
  target.push({
    "name": "",
    "periodInSec": 10,
    "valid_date_from": "2025-01-01",
    "valid_date_end": "2025-12-31",
    "nowChoseConfigKey": "",
    "detail_show": false,
    "configs": {}
  })
}

function addConfig(target) {
  target.configs[target.nowChoseConfigKey+""] = {}
  target.nowChoseConfigKey = ""
}
</script>

<template>
  <div class="card">
    <div class="card-body">
      <div class="card-title" style="display: flex;justify-content: space-between;align-items: baseline;">
        <div class="btn btn-info" @click="router.back()">上一頁</div>
        <div class="btn-toolbar">
          <div class="btn-group me-2">
            <button class="btn" :class="is_playlistDataEdited?'btn-info':'btn-secondary'" @click="patchData" :disabled="is_playlistDataEdited===false">上傳變更</button>
          </div>
          <div class="btn-group me-2">
            <div class="btn btn-info" @click="updatePlaylistDetail">🗘</div>
          </div>
          <div class="btn-group">
            <div class="btn btn-danger" @click="delThisPlaylist">刪除</div>
          </div>
        </div>
      </div>
      <hr>
      <div class="row g-2" style="position: relative;">
        <div style="position: absolute;z-index: 9999;top: 0;bottom: 0;left: 0;right: 0;background: rgba(0, 0, 0, 0.6);
            color: #eee;font-size: 2rem;display: flex;justify-content: center;align-items: center;" v-if="playlist_detail_temp.is_delete">
          此Playlist已遭刪除
        </div>
        <div class="col-12">
          <div class="input-group">
            <span class="input-group-text">Name</span>
            <input type="text" class="form-control" v-model="playlist_detail_temp.name">
            <span class="input-group-text">id</span>
            <input type="text" class="form-control" v-model="playlist_detail_temp.id" disabled>
          </div>
        </div>
        <div class="col-12">
          <div class="input-group">
            <span class="input-group-text">Site</span>
            <div class="form-control" v-if="loginInfoStore.site_dict[playlist_detail_temp.site]">{{ loginInfoStore.site_dict[playlist_detail_temp.site].name }}</div>
          </div>
        </div>
        <div class="col-12">
          <div class="input-group">
            <span class="input-group-text">被引用</span>
            <div class="form-control">
              <template v-for="timetable_info, timetable_id in playlist_detail_temp.linked_timetable">
                <router-link class="btn badge bg-primary" 
                  :to="`/Timetable/${timetable_id}`">{{ timetable_info.name }}</router-link>
              </template>
            </div>
          </div>
        </div>
        <div class="col-12">
          <div class="input-group">
            <span class="input-group-text">引用圖片</span>
            <div class="form-control">
              <template v-for="image_info, image_id in playlist_detail_temp.linked_image">
                <router-link class="btn badge bg-primary" style="margin-right: 2px;" :to="`/Image/${image_id}`" v-if="image_info.name !== null">
                  {{ image_info.name }}
                </router-link>
                <router-link class="btn badge bg-danger" style="text-decoration:line-through;margin-right: 2px;" :to="`/Image/${image_id}`" v-else>
                  {{ image_id }}
                </router-link>

              </template>
            </div>
          </div>
        </div>
        <hr>
        <div class="col-12">
          <div class="row g-2">
            <div class="col-12" v-for="pic_data, pic_data_index in playlist_detail_temp.image_list">
              <div class="card" style="border-left: 8px solid gray;" :style="
                loginInfoStore.image_dict[pic_data.image] === undefined || loginInfoStore.image_dict[pic_data.image].is_delete === true
                ?'border-color: var(--bs-red);':''">
                <div class="card-body">
                  <div class="row g-2">
                    <div class="col-8">
                      <div class="input-group">
                        <span class="input-group-text">照片選取</span>

                        
                        <select class="form-control" v-model="pic_data.image" :style="
                          loginInfoStore.image_dict[pic_data.image] === undefined || loginInfoStore.image_dict[pic_data.image].is_delete === true
                          ?'color: var(--bs-red);font-weight: bolder;':''">
                          <template v-for="image_data of loginInfoStore.image_list">
                            <option v-if="image_data.is_delete===false" :value="image_data.id">{{ image_data.name }}</option>
                          </template>
                          <option v-if="
                            loginInfoStore.image_dict[pic_data.image] === undefined || loginInfoStore.image_dict[pic_data.image].is_delete === true
                          " :value="pic_data.image" style="color: var(--bs-red);font-weight: bolder;">
                            unknow image: {{ pic_data.image }}
                          </option>
                        </select>


                        <!-- <input type="text" class="form-control" v-model="pic_data.image"> -->
                      </div>
                    </div>
                    <div class="col-4">
                      <div class="input-group">
                        <span class="input-group-text">持續時間(分鐘)</span>
                        <input type="number" class="form-control" v-model="pic_data.periodInSec">
                      </div>
                    </div>
                    <div class="col-11">
                      <div class="input-group">
                        <span class="input-group-text">有效時間</span>
                        <input type="date" class="form-control" v-model="pic_data.valid_date_from">
                        <span class="input-group-text"> ~ </span>
                        <input type="date" class="form-control" v-model="pic_data.valid_date_end">
                      </div>
                    </div>
                    <div class="col-1 d-grid">
                      <div class="btn btn-danger" @click="playlist_detail_temp.image_list.splice(pic_data_index,1)">移除</div>
                    </div>
                    <!-- <hr style="margin-bottom: 0;"> -->
                    <div class="col-12 d-grid" style="padding: 0;">
                      <div class="btn" :class="Object.keys(pic_data.configs).length !== 0?'btn-info':'btn-secondary'"
                        style="size: .25rem;padding: 0;" v-if="pic_data.detail_show" @click="pic_data.detail_show=false">▴</div>
                      <div class="btn"  :class="Object.keys(pic_data.configs).length !== 0?'btn-outline-info':'btn-outline-secondary'"
                        style="size: .25rem;padding: 0;" v-else @click="pic_data.detail_show=true">▾</div>
                    </div>
                    <div class="col-12" v-if="pic_data.detail_show">
                      <div class="row g-2">
                        <div class="col-12" v-for="data,key,index in pic_data.configs">
                          <div class="card" v-if="key === 'aecoPost_32'">
                            <div class="card-body">
                              <div class="card-title">
                                <div style="display: flex;justify-content: space-between;align-items: baseline;">
                                  <h6>aecoPost 32 特別設定</h6>
                                  <div class="btn btn-danger btn-sm" @click="delete pic_data.configs[key]">移除</div>
                                </div>
                              </div>
                              <hr>
                              <div class="row g-2">
                                <div class="col-12">
                                  <div class="row g-2">
                                    <div class="col-6">
                                      <label for="customRange1" class="form-label">亮度</label>
                                      <input type="range" class="form-range" id="customRange1">
                                      <label for="customRange1" class="form-label">對比</label>
                                      <input type="range" class="form-range" id="customRange1">
                                      <label for="customRange1" class="form-label">銳度</label>
                                      <input type="range" class="form-range" id="customRange1">
                                    </div>
                                    <div class="col-6">
                                      <div style="height: 30vh;background-color: #dddddd;display: flex;justify-content: center;align-items: center;">照片預覽</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="card" v-else-if="key === 'aecoPost_13'">
                            <div class="card-body">
                              <div class="card-title">
                                <div style="display: flex;justify-content: space-between;align-items: baseline;">
                                  <h6>aecoPost 13 特別設定</h6>
                                  <div class="btn btn-danger btn-sm" @click="delete pic_data.configs[key]">移除</div>
                                </div>
                              </div>
                              <hr>
                              <div class="row g-2">
                                <div class="col-12">
                                  <div class="row g-2">
                                    <div class="col-6">
                                      <label for="customRange1" class="form-label">亮度</label>
                                      <input type="range" class="form-range" id="customRange1">
                                      <label for="customRange1" class="form-label">對比</label>
                                      <input type="range" class="form-range" id="customRange1">
                                      <label for="customRange1" class="form-label">銳度</label>
                                      <input type="range" class="form-range" id="customRange1">
                                    </div>
                                    <div class="col-6">
                                      <div style="height: 30vh;background-color: #dddddd;display: flex;justify-content: center;align-items: center;">照片預覽</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="card" v-else>
                            <div class="card-body">
                              <div class="card-title">
                                <div style="display: flex;justify-content: space-between;align-items: baseline;">
                                  <h6>{{ key }} 特別設定</h6>
                                  <div class="btn btn-danger btn-sm" @click="delete pic_data.configs[key]">移除</div>
                                </div>
                              </div>
                              <hr>
                              <div class="row g-2">
                                <div class="col-12">
                                  <div class="row g-2">
                                    <div class="col-6">
                                      <label for="customRange1" class="form-label">可能有</label>
                                      <input type="range" class="form-range" id="customRange1">
                                      <label for="customRange1" class="form-label">各種我還沒想到的</label>
                                      <input type="range" class="form-range" id="customRange1">
                                      <label for="customRange1" class="form-label">參數類型</label>
                                      <input type="range" class="form-range" id="customRange1">
                                    </div>
                                    <div class="col-6">
                                      <div style="height: 30vh;background-color: #dddddd;display: flex;justify-content: center;align-items: center;">照片預覽</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="col-12">
                          <div class="input-group">
                            <span class="input-group-text">額外設定</span>
                            <span class="input-group-text">儀器類型</span>
                            <select class="form-control" v-model="pic_data.nowChoseConfigKey">
                              <option v-for="keyName of [...new Set(['HiRaso_8', 'aecoPost_32', 'aecoPost_13', 'Akira_666'])].filter(element => !(new Set(Object.keys(pic_data.configs))).has(element))">{{ keyName }}</option>
                            </select>
                            <span class="input-group-text btn btn-info" @click="addConfig(pic_data)">新增</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-12 d-grid gap-2">
              <div class="btn btn-outline-secondary" @click="addNewPictureSetting(playlist_detail_temp.image_list)">新增照片</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

</script>

<style lang="postcss">
/* https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-nesting */
</style>