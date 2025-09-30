<script setup lang="ts">

import {ref, computed} from 'vue'
import { useRoute, useRouter } from 'vue-router'; // 引入 useRoute
import { useLoginInfoStore } from '@/stores/counter'
import { format, addDays } from 'date-fns';

const loginInfoStore = useLoginInfoStore()
const route = useRoute(); // 獲取當前路由物件
const router = useRouter();
const DeviceMAC = ref(route.params.id);

const device_detail = ref({})
const device_job_record_list = ref([])
const now_snapshot_detail = ref({})
const now_timetable_detail = ref({})
const now_playlist_detail_dict = ref({})
const distribute_history_list = ref([])

function updateDeviceDetail() {
  fetch(`${loginInfoStore.mainURL}/devices/aecoPost/${DeviceMAC.value}/`, {
    headers: loginInfoStore.header,
  })
  .then(function (response) {
    return response.json();
  })
  .then(D_data => {
    device_detail.value = D_data
    updateSnapshotDetail(D_data['current_timetable_snapshot'])
    updateDeviceDistributeHistory()
  })
}

function updateDeviceRecodeList(){
  function do_url (url) {
    fetch(url, {
      headers: loginInfoStore.header,
    })
    .then(function (response) {
      return response.json();
    })
    .then(D_data => {
      console.log(D_data)
      device_job_record_list.value = device_job_record_list.value.concat(D_data["results"])
      if (device_job_record_list.value.length >= 20) {

      } else if (D_data["next"] != null) {
        do_url(D_data["next"])
      }
    })
  }
  device_job_record_list.value = []
  var first_url = `${loginInfoStore.mainURL}/record/aecoPost_job/?device=${DeviceMAC.value}`
  do_url(first_url)
}
updateDeviceDetail()
updateDeviceRecodeList()

async function updateSnapshotDetail(snapshot_id:String) {
  var response = await fetch(`${loginInfoStore.mainURL}/snapshot/${snapshot_id}`, {
    headers: loginInfoStore.header,
  })
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const D_data = await response.json();
  now_snapshot_detail.value = D_data
  updateTimetableDetail(D_data['timetable_source_id'])
  now_playlist_detail_dict.value = {}
  for (const playlist_id of D_data['playlist_source_id_list']) {
    var playlist_respone = await updatePlaylistDetail(playlist_id);
    const playlist_data = await playlist_respone.json();
    now_playlist_detail_dict.value[playlist_data['id']] = playlist_data
  }
}

async function updateTimetableDetail(timetable_id:String) {
  return fetch(`${loginInfoStore.mainURL}/timetable/${timetable_id}/`, {
    headers: loginInfoStore.header,
  })
  .then(function (response) {
    return response.json();
  })
  .then(D_data => {
    now_timetable_detail.value = D_data
  })
}

async function updatePlaylistDetail(playlist_id:String) {
  return fetch(`${loginInfoStore.mainURL}/playlist/${playlist_id}/`, {
    headers: loginInfoStore.header,
  })
}

function updateDeviceDistributeHistory() {
  function do_url (url) {
    fetch(url, {
      headers: loginInfoStore.header,
    })
    .then(function (response) {
      return response.json();
    })
    .then(D_data => {
      distribute_history_list.value = distribute_history_list.value.concat(D_data["results"])
      if (distribute_history_list.value.length > 20) {

      } else if (D_data["next"] != null) {
        do_url(D_data["next"])
      }
    })
  }
  distribute_history_list.value = []
  var first_url = `${loginInfoStore.mainURL}/devices/aecoPost/distribute_history/${device_detail.value.id}/`
  do_url(first_url)
}




</script>

<template>
  <div class="card">
    <div class="card-body">
      <div class="container-fluid">
        <div class="row g-2">
          <h4>基本資訊</h4>
          <div class="col-6">
            <div class="input-group">
              <span class="input-group-text">MAC</span>
              <div class="form-control">{{ device_detail.mac_address }}</div>
            </div>
          </div>
          <div class="col-6">
            <div class="input-group">
              <span class="input-group-text">ID</span>
              <div class="form-control">{{ device_detail.id }}</div>
            </div>
          </div>
          <div class="col-6">
            <div class="input-group">
              <span class="input-group-text">product_model</span>
              <div class="form-control">{{ device_detail.product_model }}</div>
            </div>
          </div>
          <div class="col-6">
            <div class="input-group">
              <span class="input-group-text">site</span>
              <div class="form-control">{{ device_detail.site }}</div>
            </div>
          </div>
          <div class="col-6">
            <div class="input-group">
              <span class="input-group-text">fw_version</span>
              <div class="form-control">{{ device_detail.fw_version }}</div>
            </div>
          </div>
          <hr>
          <h4>活動紀錄</h4>
          <div class="col-12">
            <div class="input-group">
              <span class="input-group-text">列表</span>
              <div class="form-control">
                <div class="row g-1" style="max-height: 300px;overflow: auto;">
                  <div class="col-12" v-for="record in device_job_record_list">
                    <div class="input-group">
                      <span class="input-group-text">時間</span>
                      <span class="form-control">{{ format(new Date(record.created_time), 'yyyy-MM-dd HH:mm') }}</span>
                      <span class="input-group-text">類型</span>
                      <span class="form-control">{{ record.job_type }}</span>
                      <span class="input-group-text">狀態</span>
                      <span class="form-control">{{ record.status_code }}</span>
                      <span class="input-group-text">訊息</span>
                      <span class="form-control">{{ record.status }}</span>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr>
          <h4>snapshot 相關資訊</h4>
          <div class="col-6">
            <div class="input-group">
              <span class="input-group-text">當前使用的快照 ID</span>
              <router-link class="form-control" :to="`/Snapshot/${device_detail.current_timetable_snapshot}`">{{ device_detail.current_timetable_snapshot }}</router-link>
            </div>
          </div>
          <div class="col-6">
            <div class="input-group">
              <span class="input-group-text">派發時間</span>
              <span class="form-control">{{ now_snapshot_detail.created_time }}</span>
            </div>
          </div>
          <h5>timetable</h5>
          <div class="col-12">
            <div class="input-group">
              <span class="input-group-text">該快照的timetable來源</span>
              <span class="form-control">{{ now_timetable_detail.name?now_timetable_detail.name:now_snapshot_detail.timetable_source_id }}</span>
            </div>
          </div>
          <div class="col-6">
            <div class="input-group">
              <span class="input-group-text">該快照的 timetable.json MD5</span>
              <span class="form-control">{{ now_snapshot_detail.timetable_snapshot_md5 }}</span>
            </div>
          </div>
          <div class="col-6">
            <div class="input-group">
              <span class="input-group-text">該快照的 timetable 來源當前的 MD5</span>
              <span class="form-control">{{ now_timetable_detail.timetable_md5 }}</span>
            </div>
          </div>
          <h5>playlist</h5>
          <div class="col-12">
            <div class="input-group">
              <span class="input-group-text">該快照的 playlist.json MD5</span>
              <span class="form-control">{{ now_snapshot_detail.playlist_snapshot_md5 }}</span>
            </div>
          </div>
          <div class="col-12">
            <div class="input-group">
              <span class="input-group-text">列表</span>
              <div class="form-control">
                <div class="row g-1">
                  <template v-for="playlist_id in now_snapshot_detail.playlist_source_id_list">
                    <div class="col-12">
                      <div class="input-group">
                        <span class="input-group-text">Playlist</span>
                        <span class="form-control">{{ now_playlist_detail_dict[playlist_id]?now_playlist_detail_dict[playlist_id].name:playlist_id }}</span>
                        <span class="input-group-text">快照md5</span>
                        <span class="form-control">{{ now_snapshot_detail.playlist_md5_dict[playlist_id] }}</span>
                        <span class="input-group-text">最新md5</span>
                        <span class="form-control">{{ now_playlist_detail_dict[playlist_id]?now_playlist_detail_dict[playlist_id].playlist_md5:'loading..' }}</span>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
          <hr>
          <h4>snapshot 歷史</h4>
          <div class="col-12">
            <div class="input-group">
              <span class="input-group-text">紀錄</span>
              <div class="form-control" style="max-height: 400px;overflow: auto;">
                <div class="row g-1">
                  <template v-for="distribute_history in distribute_history_list">
                    <div class="col-12">
                      <div class="input-group">
                        <span class="input-group-text">快照id</span>
                        <span class="form-control">{{ distribute_history.cmd_info.snapshot_id?distribute_history.cmd_info.snapshot_id:'none' }}</span>
                        <span class="input-group-text">派送時間</span>
                        <span class="form-control">{{ distribute_history.created_time }}</span>
                        <span class="input-group-text">狀態</span>
                        <span class="form-control">{{ distribute_history.status_code }}</span>
                      </div>
                    </div>
                    <!-- <div class="col-4">
                      <div class="input-group">

                      </div>
                    </div>
                    <div class="col-4">
                      <div class="input-group">
                        <span class="input-group-text">狀態</span>
                        <span class="form-control">{{ distribute_history.status_code }}</span>
                      </div>
                    </div> -->

                  </template>

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