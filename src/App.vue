<script setup lang="ts">
import { useLoginInfoStore } from '@/stores/counter'
import { log } from 'console';
import {ref, computed} from 'vue'
const LoadDone = ref(false);
const loginInfoStore = useLoginInfoStore()
loginInfoStore.login()
.then( () => {
  loginInfoStore.updateDeviceList()
  loginInfoStore.updateSiteList()
  loginInfoStore.updateDeviceModelList()
  loginInfoStore.updateDeviceStatusCodeList()
  LoadDone.value = true
})

</script>

<template>
  <div class="container-fluid" style="padding-top:calc(var(--bs-gutter-x) * .5);" v-if="LoadDone">
    <!-- <div class="row">
      <div class="col-12">
        <router-link to="/Site">Site</router-link>
        <router-link to="/Playlist">Playlist</router-link>
        <router-link to="/Timetable">Timetable</router-link>
      </div>
    </div> -->
    <div class="row">
      <div class="col-12">
        <router-view/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
</script>