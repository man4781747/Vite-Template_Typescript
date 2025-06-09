<template>
  <div class="card" id="akira-c-websocket-manager-card">
    <div class="card-header">
      <div class="container-fluid">
        <div class="row">
          <div class="col px-0" style="display: flex;flex-direction: row-reverse;">
            <div class="btn btn-sm btn-outline-secondary" @click="close_window">X</div>
          </div>
        </div>
      </div>
    </div>
    <div class="card-body">
      
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'websocketManager',
  props: {
  },
  data() {
    return {
    }
  },
  computed: {
  },
  mounted() {
  },
  methods: {
    close_window() {
      if (document.getElementById('akira-c-websocket-manager-card')) {
        document.getElementById('akira-c-websocket-manager-card').classList.add("not-show")
      }
    },
  },
  created() {
  },
  deactivated() {
  },
})
</script>

<style lang="postcss">
.not-show {
  display: none !important;
}
</style>