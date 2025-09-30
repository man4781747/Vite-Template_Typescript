<script setup lang="ts">

import {ref, computed} from 'vue'
import { useRoute, useRouter } from 'vue-router'; // 引入 useRoute
import { useLoginInfoStore } from '@/stores/counter'

const route = useRoute(); // 獲取當前路由物件
const router = useRouter();
const ImageID = ref(route.params.id);
const loginInfoStore = useLoginInfoStore()
const imageData_temp = ref({});
const imageData_save = ref("{}");

const is_imageDataEdited = computed(() => { 
  if (imageData_save.value === JSON.stringify(imageData_temp.value)) {
    return false
  }
  return true
})


function updateImageDetail() {
  fetch(`${loginInfoStore.mainURL}/images/${ImageID.value}/`, {
    headers: loginInfoStore.header,
  })
  .then(function (response) {
    return response.json();
  })
  .then(D_data => {
    imageData_temp.value = D_data
    imageData_save.value = JSON.stringify(D_data)
  })
}
updateImageDetail()

function deleteThisImage() {
  fetch(`${loginInfoStore.mainURL}/images/${ImageID.value}/`, {
    headers: loginInfoStore.header,
    method: "DELETE"
  })
  .then(function (response) {
    return response.json();
  })
  .then(D_data => {
    updateImageDetail()
  })
}

function patchImageDetail() {
  var patchData = {
    name: imageData_temp.value.name,
    valid_from: imageData_temp.value.valid_from,
    valid_until: imageData_temp.value.valid_until,
    allowed_device_model: imageData_temp.value.allowed_device_model,
  }
  fetch(`${loginInfoStore.mainURL}/images/${ImageID.value}/`, {
    headers: loginInfoStore.header,
    method: "PATCH",
    body: JSON.stringify(patchData)
  })
  .then(function (response) {
    return response.json();
  })
  .then(D_data => {
    updateImageDetail()
  })
}
</script>

<template>
  <div class="card">
    <div class="card-body">
      <div class="card-title" style="display: flex;justify-content: space-between;align-items: baseline;">
        <div class="btn btn-info" @click="router.back()">上一頁</div>
        <div class="btn-toolbar">
          <div class="btn-group me-2">
            <button class="btn" :class="is_imageDataEdited?'btn-info':'btn-secondary'" @click="patchImageDetail" :disabled="is_imageDataEdited===false">上傳變更</button>
          </div>
          <div class="btn-group me-2">
            <div class="btn btn-info" @click="updateImageDetail">🗘</div>
          </div>
          <div class="btn-group me-2">
            <div class="btn btn-danger" @click="deleteThisImage">刪除</div>
          </div>
        </div>
      </div>
      <hr>
      <div class="container-fluid">
        <div class="row g-2">
          <div class="col-12">
            <div class="card" style="display: flex;width: 100%;align-items: center;">
              <img :src="`${imageData_temp.thumbnail}`" 
                style="max-height: 800px;max-width: 600px;height: auto;width: auto;">
              <div style="position: absolute;z-index: 9999;top: 0;bottom: 0;left: 0;right: 0;background: rgba(0, 0, 0, 0.6);
                  color: #eee;font-size: 2rem;display: flex;justify-content: center;align-items: center;" v-if="imageData_temp.is_delete">
                此照片已遭刪除
              </div>
            </div>
          </div>
          <div class="col-6">
            <div class="input-group">
              <span class="input-group-text">ID</span>
              <div class="form-control">{{ imageData_temp.id }}</div>
            </div>
          </div>
          <div class="col-6">
            <div class="input-group">
              <span class="input-group-text">Name</span>
              <input type="text" class="form-control" v-model="imageData_temp.name">
            </div>
          </div>
          <div class="col-12">
            <div class="input-group">
              <span class="input-group-text">有效時間</span>
              <input type="date" class="form-control" v-model="imageData_temp.valid_from">
              <span class="input-group-text">~</span>
              <input type="date" class="form-control" v-model="imageData_temp.valid_until">
            </div>
          </div>
          <div class="col-12">
            <div class="input-group">
              <span class="input-group-text">被誰引用</span>
              <div class="form-control">
                <template v-for="playlist_id in imageData_temp.linked_playlist">
                  <router-link class="btn badge bg-primary" :to="`/Playlist/${playlist_id}`">{{ playlist_id }}</router-link>
                  <!-- <router-link class="btn badge bg-primary" :to="`/Playlist/${playlist_id}`">{{ loginInfoStore.playlist_dict[playlist_id].name }}</router-link> -->
                </template>
              </div>
            </div>
          </div>
          <div class="col-12">
            <div class="input-group">
              <span class="input-group-text">指定儀器</span>
              <div class="form-control">
                <div class="form-check form-check-inline" v-for="device_model in loginInfoStore.device_model_list">
                  <input class="form-check-input" type="checkbox" :value="device_model.id" v-model="imageData_temp.allowed_device_model">
                  <label class="form-check-label">{{ device_model.product_model }}</label>
                </div>
              </div>
            </div>
              {{ imageData_temp.allowed_device_model }}
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