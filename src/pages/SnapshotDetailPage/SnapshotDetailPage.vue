<script setup lang="ts">

import {ref, computed} from 'vue'
import { useRoute, useRouter } from 'vue-router'; // 引入 useRoute
import { useLoginInfoStore } from '@/stores/counter'
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';

const loginInfoStore = useLoginInfoStore()
const route = useRoute(); // 獲取當前路由物件
const router = useRouter();
const SnapshotID = ref(route.params.id);

const snapshot_detail = ref({})
const source_timetable_detail = ref({})
const source_playlist_detail = ref({})


const timetable_json_snapshot = ref({})
const playlist_json_snapshot = ref({})

function updateSnapshotDetail() {
  fetch(`${loginInfoStore.mainURL}/snapshot/${SnapshotID.value}`, {
    headers: loginInfoStore.header,
  })
  .then(function (response) {
    return response.json();
  })
  .then(D_data => {
    snapshot_detail.value = D_data
    updateSourceTimetableDetail(D_data.timetable_source_id)
    updateSourcePlaylistDetail(D_data.playlist_source_id_list)
  })
}

function updateSourceTimetableDetail(timetableId) {
  return fetch(`${loginInfoStore.mainURL}/timetable/${timetableId}/`, {
    headers: loginInfoStore.header,
  })
  .then(function (response) {
    return response.json();
  })
  .then(D_data => {
    source_timetable_detail.value = D_data
  })
}

function updateSourcePlaylistDetail(playlistIDList) {
  function doSearch(playlistID:String) {
    return fetch(`${loginInfoStore.mainURL}/playlist/${playlistID}/`, {
      headers: loginInfoStore.header,
    })
    .then(function (response) {
      return response.json();
    })
    .then(D_data => {
      source_playlist_detail.value[D_data.id] = D_data
    })
  }
  source_playlist_detail.value = {}
  for (var playlistID of playlistIDList) {
    doSearch(playlistID)
  }
}

function updateTimetableSnapshot() {
  fetch(`${loginInfoStore.mainURL}/snapshot/${SnapshotID.value}/timetable`, {
    headers: loginInfoStore.header,
  })
  .then(function (response) {
    return response.json();
  })
  .then(D_data => {
    timetable_json_snapshot.value = D_data
  })
}
function updatePlaylistSnapshot() {
  fetch(`${loginInfoStore.mainURL}/snapshot/${SnapshotID.value}/playlist`, {
    headers: loginInfoStore.header,
  })
  .then(function (response) {
    return response.json();
  })
  .then(D_data => {
    playlist_json_snapshot.value = D_data
  })
}




updateSnapshotDetail()
updateTimetableSnapshot()
updatePlaylistSnapshot()


</script>

<template>
  <div class="card">
    <div class="card-body">
      <div class="container-fluid">
        <div class="row g-2">
          <div class="col-6">
            <div class="input-group">
              <span class="input-group-text">ID</span>
              <div class="form-control">{{ snapshot_detail.id }}</div>
            </div>
          </div>
          <!-- <div class="col-6">
            <div class="input-group">
              <span class="input-group-text">派發時間</span>
              <div class="form-control">{{ format(new Date(snapshot_detail.created_time), 'yyyy-MM-dd HH:mm') }}</div>
            </div>
          </div> -->
          <div class="col-12">
            <div class="input-group">
              <span class="input-group-text">派發目標儀器</span>
              <div class="form-control">
                <template v-for="mac_addr in snapshot_detail.distribute_device_list">
                  <div class="btn badge bg-secondary" :to="`/Device/${mac_addr}`">{{ mac_addr }}</div>
                </template>
              </div>
            </div>
          </div>
          <div class="col-6">
            <div class="input-group">
              <span class="input-group-text">Timetable 來源</span>
              <div class="form-control">
                {{ `${source_timetable_detail.name}  (${source_timetable_detail.id})` }}
              </div>
            </div>
          </div>
          <div class="col-6">
            <div class="input-group">
              <span class="input-group-text">派發時 Timetable MD5</span>
              <div class="form-control" 
                :style="snapshot_detail.timetable_snapshot_md5!==source_timetable_detail.timetable_md5?'red':''">
                {{ `${snapshot_detail.timetable_snapshot_md5}` }}
              </div>
            </div>
          </div>
          <div class="col-12">
            <div class="input-group">
              <span class="input-group-text">Playlist 來源</span>
              <div class="form-control">
                <template v-for="playlist_id in snapshot_detail.playlist_source_id_list ">
                  <div class="btn badge bg-secondary" v-if="source_playlist_detail[playlist_id] !== undefined">
                    {{ source_playlist_detail[playlist_id].name }}
                  </div>
                </template>
              </div>
              
            </div>
          </div>
          <hr>
          <div class="col-6">
            <div class="input-group">
              <span class="input-group-text">Timetable.json</span>
              <textarea class="form-control" style="min-height: 300px;" disabled>{{ timetable_json_snapshot }}</textarea>
            </div>
          </div>
          <div class="col-6">
            <div class="input-group">
              <span class="input-group-text">Playlist.json</span>
              <textarea class="form-control" style="min-height: 300px;" disabled>{{ playlist_json_snapshot }}</textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  {{ snapshot_detail }}
  <br>
  {{ source_timetable_detail }}
  <br>
  {{ source_playlist_detail }}
</template>

<script lang="ts">

</script>

<style lang="postcss">
/* https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-nesting */
</style>