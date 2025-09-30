<script setup lang="ts">
import {ref, computed} from 'vue'
import { useLoginInfoStore } from '@/stores/counter'
import { format, addDays } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import router from '@/router';

const loginInfoStore = useLoginInfoStore()

const site_list = ref([])

const create_playlist_window_show = ref(false)
const create_timetable_window_show = ref(false)
const create_image_window_show = ref(false)

function updateAllDataInThisSite() {
  loginInfoStore.updateDeviceList()
  loginInfoStore.updateImagelist()
  loginInfoStore.updatePlaylist(loginInfoStore.chosedSite)
  loginInfoStore.updateTimetableList()
  loginInfoStore.updateSnapshotlist(loginInfoStore.chosedSite)
}

async function updateSiteList() {
  fetch(`${loginInfoStore.mainURL}/site_manage/site/`, {
    headers: loginInfoStore.header,
  })
  .then(function (response) {
    return response.json();
  })
  .then(D_data => {
    site_list.value = D_data
    if (loginInfoStore.chosedSite === "") {
      loginInfoStore.chosedSite = D_data[0].id
    }
    updateAllDataInThisSite()
  })
}
if (loginInfoStore.loginSuccess) {
  updateSiteList()
}

const new_playlist_data = ref({
  "name": "",
  "image_list": [],
  "site": loginInfoStore.chosedSite
})
function create_new_playlist() {
  new_playlist_data.value.site = loginInfoStore.chosedSite
  new_playlist_data.value.image_list = []

  fetch(`${loginInfoStore.mainURL}/playlist/`, {
    headers: loginInfoStore.header,
    method: "POST",
    body: JSON.stringify(new_playlist_data.value)
  })
  .then(function (response) {
    return response.json();
  })
  .then(D_data => {
    new_playlist_data.value.name = ""
    loginInfoStore.updatePlaylist(loginInfoStore.chosedSite)
    create_playlist_window_show.value = false
    router.push(`/Playlist/${D_data.id}`);
  })
}

const new_image_data = ref({
  "name": "",
  "image": undefined,
  "site": loginInfoStore.chosedSite,
  "valid_from": format(addDays(new Date(), -30), 'yyyy-MM-dd'),
  "valid_until": format(addDays(new Date(), 30), 'yyyy-MM-dd'),
  "allowed_device_model": "[1,2,3,4]"
})
function handleImageChange(event) {
  // 獲取使用者選擇的第一個檔案
  new_image_data.value.image = event.target.files[0];
  if (new_image_data.value.name === "") {
    new_image_data.value.name = new_image_data.value.image.name
  }
}

function create_new_image() {
  var formData = new FormData();
  for (const key in new_image_data.value) {
    if (new_image_data.value.hasOwnProperty(key)) {
      formData.append(key, new_image_data.value[key]);
    }
  }
  formData.append("site", loginInfoStore.chosedSite);
  console.log(formData)

  var header_ = JSON.parse(JSON.stringify(loginInfoStore.header))
  delete header_["content-type"]

  fetch(`${loginInfoStore.mainURL}/images/`, {
    headers: header_,
    method: "POST",
    body: formData
  })
  .then(function (response) {
    return response.json();
  })
  .then(D_data => {
    loginInfoStore.updateImagelist()
    create_image_window_show.value = false
  })

}

const new_timetable_data = ref({
  "name": "",
  "timetable_json_content": {"timetable":[]},
  "site": loginInfoStore.chosedSite
})

function create_new_timetable() {
  new_timetable_data.value.site = loginInfoStore.chosedSite
  new_timetable_data.value.timetable_json_content = {"timetable":[]},

  fetch(`${loginInfoStore.mainURL}/timetable/`, {
    headers: loginInfoStore.header,
    method: "POST",
    body: JSON.stringify(new_timetable_data.value)
  })
  .then(function (response) {
    return response.json();
  })
  .then(D_data => {
    new_timetable_data.value.name = ""
    loginInfoStore.updateTimetableList()
    router.push(`/Timetable/${D_data.id}`);
  })
}



</script>
<template>
  <PopoutCard v-if="create_image_window_show" @closeWindow="create_image_window_show=false">
    <div class="card-body">
      <div class="card-title">
        <h2>上傳照片</h2>
      </div>
      <hr>
      <div class="container-fluid">
        <div class="row g-2">
          <div class="col-12">
            <div class="input-group">
              <span class="input-group-text">名稱</span>
              <input class="form-control" v-model="new_image_data.name">
            </div>
          </div>
          <div class="col-12">
            <div class="input-group">
              <input type="file" class="form-control" accept="image/*" @change="handleImageChange">
            </div>
          </div>
          <div class="col-12">
            <div class="input-group">
              <span class="input-group-text">有效期間</span>
              <input type="date" class="form-control" v-model="new_image_data.valid_from">
              <span class="input-group-text">~</span>
              <input type="date" class="form-control" v-model="new_image_data.valid_until">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card-footer">
      <button @click="create_new_image" class="btn btn-info">上傳</button>
    </div>
  </PopoutCard>

  <PopoutCard v-if="create_playlist_window_show" @closeWindow="create_playlist_window_show=false">
    <div class="card-header">
      <div class="card-title">
        <h2>新建 Playlist</h2>
      </div>
    </div>
    <div class="card-body">
      <div class="row g-2">
        <div class="col-12">
          <div class="input-group">
            <span class="input-group-text">Name</span>
            <input class="form-control" v-model="new_playlist_data.name">
          </div>
        </div>
      </div>
    </div>
    <div class="card-footer">
      <button @click="create_new_playlist" class="btn btn-info">建立並跳轉</button>
    </div>
  </PopoutCard>

  <PopoutCard v-if="create_timetable_window_show" @closeWindow="create_timetable_window_show=false">
    <div class="card-header">
      <div class="card-title">
        <h2>新建 Timetable</h2>
      </div>
    </div>
    <div class="card-body">
      <div class="row g-2">
        <div class="col-12">
          <div class="input-group">
            <span class="input-group-text">Name</span>
            <input class="form-control" v-model="new_timetable_data.name">
          </div>
        </div>
      </div>
    </div>
    <div class="card-footer">
      <button @click="create_new_timetable" class="btn btn-info">建立並跳轉</button>
    </div>
  </PopoutCard>

  <div class="card">
    <div class="card-body">
      <div class="row g-2">
        <div class="col-12">
          <div class="input-group">
            <span class="input-group-text">Site 選擇</span>
            <select class="form-control" v-model="loginInfoStore.chosedSite" @change="updateAllDataInThisSite">
              <template v-for="site in loginInfoStore.site_list">
                <option :value="site.id">{{ site.name }}</option>
              </template>
            </select>
            <span class="btn btn-info" @click="loginInfoStore.updateSiteList()">🗘</span>
          </div>
        </div>

        <div class="col-4">
          <div class="card" style="height: 100%;">
            <div class="card-body">
              <div class="card-title">
                <div class="" style="display: flex;justify-content: space-between;align-items: baseline;">
                  <h3>Device</h3>
                  <div class="btn-toolbar">
                    <div class="btn-group me-2">
                      <div class="btn btn-info" @click="loginInfoStore.updateDeviceList">🗘</div>
                    </div>
                    <!-- <div class="btn-group me-2">
                      <div class="btn btn-info" @click="create_image_window_show = true">+</div>
                    </div> -->
                  </div>
                </div>
              </div>
              <hr>
              <div class="row g-2">
                <div class="col-12" v-for="device_data in loginInfoStore.device_list">
                  
                  <div class="input-group">
                    <span class="input-group-text">mac</span>
                    <router-link class="form-control" :to="`/Device/${device_data.mac_address}`">{{ device_data.mac_address }}</router-link>    
                    <span class="input-group-text">Model</span>
                    <div class="form-control">{{ device_data.product_model }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-4">
          <div class="card" style="height: 100%;">
            <div class="card-body">
              <div class="card-title">
                <div class="" style="display: flex;justify-content: space-between;align-items: baseline;">
                  <h3>Images</h3>
                  <div class="btn-toolbar">
                    <div class="btn-group me-2">
                      <div class="btn btn-info" @click="loginInfoStore.updateImagelist">🗘</div>
                    </div>
                    <div class="btn-group me-2">
                      <div class="btn btn-info" @click="create_image_window_show = true">+</div>
                    </div>
                  </div>
                </div>
              </div>
              <hr>
              <div class="row g-2">
                <div class="col-12" v-for="image_data in loginInfoStore.image_list">
                  <!-- {{ image_data }} -->
                  <div class="input-group">
                    <span class="input-group-text">Name</span>
                    <router-link class="form-control" :to="`/Image/${image_data.id}`">
                      {{ `${image_data.name}` }}
                    </router-link>
                    <button class="btn btn-danger" @click="loginInfoStore.deleteImage(image_data.id)">delete</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-4">
          <div class="card" style="height: 100%;">
            <div class="card-body">
              <div class="card-title">
                <div class="" style="display: flex;justify-content: space-between;align-items: baseline;">
                  <h3>Playlist</h3>
                  <div class="btn-toolbar">
                    <div class="btn-group me-2">
                      <div class="btn btn-info" @click="loginInfoStore.updatePlaylist(loginInfoStore.chosedSite)">🗘</div>
                    </div>
                    <div class="btn-group me-2">
                      <div class="btn btn-info" @click="create_playlist_window_show = true">+</div>
                    </div>
                  </div>
                </div>
              </div>
              <hr>
              <div class="container-fluid">
                <div class="row g-2">
                  <div class="col-12" v-for="playlist in loginInfoStore.playlist_list">
                    <div class="input-group">
                      <span class="input-group-text">Name</span>
                      <router-link class="form-control" :to="`/Playlist/${playlist.id}`">
                        {{ `${playlist.name}` }}
                      </router-link>
                      <button class="btn btn-danger" @click="loginInfoStore.deletePlaylist(playlist.id)">delete</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-4">
          <div class="card" style="height: 100%;">
            <div class="card-body">
              <div class="card-title">
                <div class="" style="display: flex;justify-content: space-between;align-items: baseline;">
                  <h3>Timetable</h3>
                  <div class="btn-toolbar">
                    <div class="btn-group me-2">
                      <div class="btn btn-info" @click="loginInfoStore.updateTimetableList">🗘</div>
                    </div>
                    <div class="btn-group me-2">
                      <div class="btn btn-info" @click="create_timetable_window_show = true">+</div>
                    </div>
                  </div>
                </div>
              </div>
              <hr>
              <div class="row g-2">
                <div class="col-12" v-for="timetable in loginInfoStore.timetable_list">
                  <div class="input-group">
                    <span class="input-group-text">Name</span>
                    <router-link class="form-control" :to="`/Timetable/${timetable.id}`">
                      {{ `${timetable.name}` }}
                    </router-link>
                    <button class="btn btn-danger" @click="loginInfoStore.deleteTimetable(timetable.id)">delete</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-4">
          <div class="card" style="height: 100%;">
            <div class="card-body">
              <div class="card-title">
                <h3>Snapshot</h3>
              </div>
              <hr>
              <div class="row g-2" style="height: 300px;overflow: auto;">
                <div class="col-12" v-for="snapshot in loginInfoStore.snapshot_list">

                  <div class="input-group">
                    <span class="input-group-text">ID</span>
                    <router-link class="form-control" :to="`/Snapshot/${snapshot.id}`">
                      {{ `${snapshot.id}` }}
                    </router-link>
                    <span class="input-group-text">{{ format(new Date(snapshot.created_time), 'yyyy-MM-dd HH:mm') }}</span>
                  </div>
                </div>
              </div>
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