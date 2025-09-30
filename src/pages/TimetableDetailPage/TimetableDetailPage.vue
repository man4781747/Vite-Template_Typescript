<script setup lang="ts">
import {ref, computed, onMounted} from 'vue'
import { useRoute, useRouter } from 'vue-router'; // 引入 useRoute
import { useLoginInfoStore } from '@/stores/counter'
import * as d3 from 'd3';

const route = useRoute(); // 獲取當前路由物件
const router = useRouter();
const timetableId = ref(route.params.id);
const siteId = ref("");

const loginInfoStore = useLoginInfoStore()

const timetable_detail_save = ref({})
const timetable_detail_temp = ref({})

const used_playlist_list = ref([])

const select_macs = ref([])
const distribute_history_list = ref([])

async function updateTimetableDetail() {
  return fetch(`${loginInfoStore.mainURL}/timetable/${timetableId.value}/`, {
    headers: loginInfoStore.header,
  })
  .then(function (response) {
    return response.json();
  })
  .then(D_data => {
    timetable_detail_save.value = JSON.parse(JSON.stringify(D_data))
    timetable_detail_temp.value = D_data
    loadData(D_data)
  })
}

function init_this_page() {
  updateTimetableDetail()
  .then(()=>{
    loginInfoStore.chosedSite = timetable_detail_save.value.site
    loginInfoStore.updatePlaylist(timetable_detail_save.value.site)
    loginInfoStore.updateDeviceList()
    updateTimetableDistribute()
  })
}
init_this_page()

function addNewTimetableItem() {
  var newRangeData = {"start_date": "2024-01-01", "end_date": "2024-12-31","cron" : []}
  addNewCronItem(newRangeData.cron)
  var newDetailData = {"month": [], "date": [] ,"cron" : []}
  addNewCronItem(newDetailData.cron)

  timetable_detail_temp.value.timetable_json_content.timetable.push({"mode": "range","range": newRangeData,"detail": newDetailData, "uuid": crypto.randomUUID().split('-')[0]})
}

function addNewCronItem(target) {
  var newTimeItemList = []
  addNewTimeItem(newTimeItemList)
  target.push({"weekday": [],"times": newTimeItemList})
}

function addNewTimeItem(target) {
  target.push({"time": [ "0000", "2359" ],"playlist_id": ""})
}


function getTimeSettingStr(TimeSetting) {
  var strList = []
  for(var timeTime of TimeSetting) {
    var timeitemStr = `                    {"time": [ "${timeTime.time[0]}", "${timeTime.time[1]}" ], "playlist_id": "${timeTime.playlist_id}" }`
    strList.push(timeitemStr)
    used_playlist_list.value.push(timeTime.playlist_id)
  }
  return strList.join(",\n")
}

function getCronSettingStr(CronSetting) {
  var cornStrList = []
  for (var cronItem of CronSetting) {
    const index = cronItem.weekday.indexOf(-1);

    // 2. 如果找到了，就使用 splice() 刪除
    if (index > -1) {
      // splice(start, deleteCount)
      cronItem.weekday.splice(index, 1);
    }
    var cronStr = `            {
                "weekday": [${(cronItem.weekday.length===0 || cronItem.weekday.length===7) ?"-1":cronItem.weekday.sort().join(",")}],
                "times": [\n${getTimeSettingStr(cronItem.times)}
                ]
            }`
    cornStrList.push(cronStr)
  }
  return cornStrList.join(",\n")
}

function getTimetableSettingStr(timetableSetting) {
  var timetableStrList = []
  used_playlist_list.value = []
  for (var timetableItem of timetableSetting) {
    var timetableItemStr = ""
    if (timetableItem.mode === "range") {
      var startDate = new Date(timetableItem["range"].start_date || '2024-01-01')
      var startStr = (startDate.getMonth() + 1).toString().padStart(2, '0')+startDate.getDate().toString().padStart(2, '0')

      var endDate = new Date(timetableItem["range"].end_date || '2024-12-31')
      var endStr = (endDate.getMonth() + 1).toString().padStart(2, '0')+endDate.getDate().toString().padStart(2, '0')
      timetableItemStr = `    {
        "start_date": "${startStr}", "end_date": "${endStr}",
        "cron" : [\n${getCronSettingStr(timetableItem["range"]["cron"])}
        ]
    }`
    } else {
      // console.log(timetableItem["detail"])
      timetableItemStr = `    {
        "date_cron": ["${
          [0,12].indexOf(timetableItem["detail"].month.length) !== -1?'1-12':timetableItem["detail"].month.join(',')
        }", "${
          [0,31].indexOf(timetableItem["detail"].date.length) !== -1?'1-31':timetableItem["detail"].date.join(',')
        }"],
        "cron" : [\n${getCronSettingStr(timetableItem["detail"]["cron"])}
        ]
    }`
    }
    timetableStrList.push(timetableItemStr)
  }
  replotPic()
  return timetableStrList.join(",\n")
}

function runTimetableDistribute() {
  return fetch(`${loginInfoStore.mainURL}/timetable/${timetableId.value}/`, {
    headers: loginInfoStore.header,
    method: "POST",
    body: JSON.stringify({'mac_list': select_macs.value})
  })
  .then(function (response) {
    return response.json();
  })
  .then(D_data => {
    console.log(D_data)
  })
}

const usedPlaylist = computed(() => {
  var returnListSet = new Set()
  if (timetable_detail_save.value.timetable_json_content === undefined) {
    return []
  }
  for (var timetable_time of timetable_detail_save.value.timetable_json_content.timetable) {
    for (var cron of timetable_time.cron) {
      for (var time_item of cron.times) {
        returnListSet.add(time_item.playlist_id)
      }
    }
  } 
  var returnArray = []
  for (var playlist_id of returnListSet) {
    returnArray.push({
      "id": loginInfoStore.playlist_dict[playlist_id].id,
      "name": loginInfoStore.playlist_dict[playlist_id].name,
    })
  }

  return returnArray;
})

const displayDate = computed(() => {
  if (timetable_detail_temp.value.timetable_json_content !== undefined) {
    return `{"timetable":[\n${getTimetableSettingStr(timetable_detail_temp.value.timetable_json_content.timetable)}\n]}`
  }
  return ""
})

function loadData(D_data) {
  var timetable_item_list = []
  for (var data of D_data.timetable_json_content.timetable) {
    var mode = ""
    var newDetailData, newRangeData
    if (data.date_cron !== undefined) {
      newDetailData = {"month": data.date_cron[0].split(","), "date": data.date_cron[1].split(",") ,"cron" : data.cron}
      newRangeData = {"start_date": "2024-01-01", "end_date": "2024-12-31","cron" : []}
      mode = "detail"
    }
    else {
      newDetailData = {"month": [], "date": [] ,"cron" : []}
      newRangeData = {"start_date": `2024-${data.start_date[0]}${data.start_date[1]}-${data.start_date[2]}${data.start_date[3]}`, "end_date": `2024-${data.end_date[0]}${data.end_date[1]}-${data.end_date[2]}${data.end_date[3]}`,"cron" : data.cron}
      mode = "range"
    }
    timetable_item_list.push({"mode": mode,"range": newRangeData,"detail": newDetailData, "uuid": crypto.randomUUID().split('-')[0]})
  }
  D_data.timetable_json_content.timetable = timetable_item_list
}


function patch_new_timetable() {
  var D_newData= {
    "name": timetable_detail_temp.value.name,
    "timetable_json_content": JSON.parse(displayDate.value),
  }
  fetch(`${loginInfoStore.mainURL}/timetable/${timetableId.value}/`, {
    headers: loginInfoStore.header,
    method: "PATCH",
    body: JSON.stringify(D_newData)
  })
  .then(function (response) {
    return response.json();
  })
  .then(D_data => {
    updateTimetableDetail()
    // timetable_detail_temp.value = D_data
    // loadData(D_data)
  })
}

function replotPic() {
  var parentElement = document.getElementById("chart-container")
  if (parentElement) {
    // 當父元素還有子元素時，持續移除第一個子元素
    while (parentElement.firstChild) {
      parentElement.removeChild(parentElement.firstChild);
    }
  }

  // (Your existing code to generate nodes and links)
  // ...
  var items = new Set()
  var links_ = new Set()
  items.add(
    JSON.stringify({id: timetableId.value, group: 1, name: `timetable: ${timetable_detail_save.value.name}`})
  )
  for (var playlist_id of used_playlist_list.value) {
    if (playlist_id === "" | playlist_id === undefined) {
      continue
    }
    var playlist_chose = loginInfoStore.playlist_dict[playlist_id]
    if (playlist_chose === undefined) {
      continue
    }
    links_.add(
      JSON.stringify({source: playlist_chose.id, target: timetableId.value, value: 10})
    )
    items.add(
      JSON.stringify({id: playlist_chose.id, group: 2, name: `playlist: ${playlist_chose.name}`})
    )
    
    for (var image_id of playlist_chose.linked_image) {
      var image_chose = loginInfoStore.image_dict[image_id]
      if (image_chose === undefined) {continue}
      items.add(
        JSON.stringify({id: image_id, group: 3, name: `image: ${image_chose.name}`})
      )
      links_.add(
        JSON.stringify({source: image_id, target: playlist_chose.id, value: 10})
      )
    }
  }
  const links = Array.from(links_).map(d => ({...JSON.parse(d)}));
  const nodes = Array.from(items).map(d => ({...JSON.parse(d)}));

  const width = 900;
  const height = 600;

  // Specify the color scale.
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  function ticked() {
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    node
        .attr("transform", d => `translate(${d.x},${d.y})`)
  }

  function dragstarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  function dragended(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }
  
  // =============================================================================
  // This is the key change to your code.
  // Add group-specific forces.
  // =============================================================================
  const centerX = d3.scaleOrdinal().domain([1, 1, 1]).range([width / 2, width / 4, width * 3 / 4]);
  const centerY = d3.scaleOrdinal().domain([1, 1, 1]).range([height / 4, height / 2, height * 3 / 4]);
  
  const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id))
      .force("charge", d3.forceManyBody().strength(-2000)) // Use a more moderate repulsion
      
      // Use forceX and forceY to pull nodes towards specific coordinates based on their group.
      .force("x", d3.forceX().strength(0.2).x(d => centerX(d.group)))
      .force("y", d3.forceY().strength(0.2).y(d => centerY(d.group)))
      
      // Add a collision force to prevent nodes from overlapping.
      .force("collision", d3.forceCollide().radius(5))
      
      .on("tick", ticked);

  // The rest of your code remains the same.
  // ...
  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");

  const link = svg.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
    .selectAll()
    .data(links)
    .join("line")
      .attr("stroke-width", d => Math.sqrt(d.value));

  const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
    .selectAll()
    .data(nodes)
    .join("g")
      
  node.append("circle")
      .attr("r", 10)
      .attr("fill", d => color(d.group))

  node.append("text")
    .attr("x", 8)
    .attr("y", "0.31em")
    .attr("fill", "black")
    .attr("stroke", "black")
    .text(d => d.name)

  node.call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

  parentElement?.append(svg.node())
}

function updateTimetableDistribute() {
  function do_url (url) {
    fetch(url, {
      headers: loginInfoStore.header,
    })
    .then(function (response) {
      return response.json();
    })
    .then(D_data => {
      distribute_history_list.value = distribute_history_list.value.concat(D_data["results"])
      if (D_data["next"] != null) {
        do_url(D_data["next"])
      }
    })
  }
  distribute_history_list.value = []
  var first_url = `${loginInfoStore.mainURL}/timetable/distribute_history/${timetableId.value}/`
  do_url(first_url)

}


</script>

<template>
  <div class="card">
    <div class="card-body">
      <div class="card-title">
        <div style="display: flex;justify-content: space-between;align-items: baseline;">
          <div class="btn btn-info" @click="router.back()">上一頁</div>
          <div class="btn-toolbar">
            <div class="btn-group me-2" role="group" >
              <div class="btn btn-info" @click="patch_new_timetable">上傳</div>
              <div class="btn btn-info" @click="updateTimetableDetail">刷新</div>
            </div>
            <div class="input-group">
              <select v-model="select_macs" multiple class="form-control" size="1">
                <template v-for="devcie in loginInfoStore.device_in_site">
                  <option :value="devcie.id">{{ devcie.mac_address }}</option>
                </template>
              </select>
              <div class="btn btn-info" @click="runTimetableDistribute">派發</div>
            </div>
          </div>
        </div>
        
      </div>
      <hr>
      <div class="container-fluid">
        <div class="row g-2">
          <div class="col-12">
            <div class="input-group">
              <span class="input-group-text">Name</span>
              <input type="text" class="form-control" v-model="timetable_detail_temp.name">
              <!-- <button class="btn btn-info" type="button" @click="patch_new_timetable">變更</button> -->
              <span class="input-group-text">id</span>
              <input type="text" class="form-control" v-model="timetable_detail_temp.id" disabled>
            </div>
          </div>
          <div class="col-12">
            <div class="input-group">
              <span class="input-group-text">MD5</span>
              <input type="text" class="form-control" v-model="timetable_detail_temp.timetable_md5" disabled>
            </div>
          </div>
          <div class="col-12">
            <div class="input-group">
              <span class="input-group-text">使用的 Playlist</span>
              <div class="form-control">
                <template v-for="playlist_item, in usedPlaylist">
                  <router-link class="btn badge bg-primary" :to="`/Playlist/${playlist_item.id}`" style="margin-right: 4px;">{{ playlist_item.name }}</router-link>
                </template>
              </div>
            </div>
          </div>

          <div class="col-12">
            <div class="input-group">
              <span class="input-group-text">派發過</span>
              <div class="form-control">
                <template v-for="device_mac in timetable_detail_save.dispatched_device">
                  <div class="btn badge bg-secondary" style="margin-right: 4px;">{{ device_mac }}</div>
                </template>
              </div>
            </div>
          </div>
          <div class="col-12">
            <div class="input-group">
              <span class="input-group-text">派發歷史</span>
              <div class="form-control" stlye="max-height: 200px;overflow: auto;">
                <div class="row g-1">
                  <div class="col-12" v-for="distribute_history in distribute_history_list">
                    <div class="input-group">
                      <span class="input-group-text">{{ distribute_history.created_time }}</span>
                      <div class="form-control">
                        {{ distribute_history.cmd_info.snapshot_id }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


          
          <hr>
          <div class="col-6">
            <div class="row">
              <div class="col-12" v-if="timetable_detail_temp.timetable_json_content !== undefined">
                <div class="card p-3" v-for="timetable_item, timetable_index in timetable_detail_temp.timetable_json_content.timetable">
                  <div class="col-12">
                    <div class="row">
                      <div class="btn btn-danger" @click="timetable_detail_temp.timetable_json_content.timetable.splice(timetable_index, 1)">刪除</div>
                    </div>
                    </div>
                    <div class="row">
                      <h2>日期選擇</h2>
                    <div class="row">
                      <div class="col">
                        <div class="input-group">
                          <span class="input-group-text">模式選擇</span>
                          <select class="form-control" v-model="timetable_item.mode">
                            <option value="range">範圍模式</option>
                            <option value="detail">指定模式</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div class="row" style="margin-top: 8px;">
                      <div class="col" v-if="timetable_item.mode==='range'">
                        <div class="input-group">
                          <span class="input-group-text">日期範圍</span>
                          <input type="date" class="form-control" v-model="timetable_item[timetable_item.mode].start_date">
                          <span class="input-group-text">~</span>
                          <input type="date" class="form-control" v-model="timetable_item[timetable_item.mode].end_date">
                        </div>
                      </div>
                      <div class="col" v-else>
                        <div class="row">
                          <div class="col-6">
                            <div class="input-group">
                              <span class="input-group-text">月份選擇</span>
                              <select multiple class="form-control" v-model="timetable_item[timetable_item.mode].month">
                                <option v-for="i in Array(12).keys()" @value=i+1>{{ i+1 }}</option>
                              </select>
                            </div>
                          </div>
                          <div class="col-6">
                            <div class="input-group">
                              <span class="input-group-text">日期選擇</span>
                              <select multiple class="form-control" v-model="timetable_item[timetable_item.mode].date">
                                <option v-for="i in Array(31).keys()" @value=i+1>{{ i+1 }}</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="row" style="margin-top: 8px;">
                      <div class="col-12">
                        <h2>時間設定</h2>
                      </div>
                      <div class="col-12">
                        <div class="card" >
                          <div class="card-body">
                            <div class="container-fluid">
                              <div class="row g-2">
                                <div class="col-12" v-for="cron_item, cron_index in timetable_item[timetable_item.mode].cron">
                                  <div :class="timetable_item.mode==='range'?'card':''">
                                    <div :class="timetable_item.mode==='range'?'card-body':''">
                                      <div class="container-fluid">
                                        <div class="row">
                                          <div class="col">
                                            <div class="input-group" v-if="timetable_item.mode==='range'">
                                              <span class="input-group-text">指定星期</span>
                                              <template v-for="i in [1,2,3,4,5,6,7]">
                                                <label class="input-group-text">{{ i }}
                                                  <input type="checkbox" :value="i" v-model="cron_item.weekday">
                                                </label>
                                              </template>
                                              <span class="input-group-text btn btn-danger" @click="timetable_item[timetable_item.mode].cron.splice(cron_index, 1)">刪除時間設定</span>
                                            </div>
                                          </div>
                                        </div>
                                        <div class="row" style="margin-top: 4px;">
                                          <div class="col">
                                            <div class="card">
                                              <div class="card-body">
                                                <div class="row g-1">
                                                  <div class="col-12" v-for="timeItem, timeItemIndex in cron_item.times">
                                                    <div class="row g-1">
                                                      <div class="col-12">
                                                        <div class="input-group">
                                                          <span class="input-group-text">時間</span>
                                                          <input class="form-control" v-model="timeItem.time[0]">
                                                          <span class="input-group-text">~</span>
                                                          <input class="form-control" v-model="timeItem.time[1]">
                                                          <span class="input-group-text">Playlist</span>
                                                          <select class="form-control" v-model="timeItem.playlist_id">
                                                            <option :value="playlist.id" v-for="playlist in loginInfoStore.playlist_list">{{ playlist.name }}</option>
                                                          </select>
                                                          <span class="input-group-text btn btn-danger" @click="cron_item.times.splice(timeItemIndex, 1)">-</span>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                                <div class="row" style="margin-top: 4px;">
                                                  <div class="col d-grid gap-2">
                                                    <button type="button" class="btn btn-outline-secondary" @click="addNewTimeItem(cron_item.times)">新增Playlist</button>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div class="row" style="margin-top: 4px;">
                                <div class="col d-grid gap-2">
                                  <button type="button" class="btn btn-outline-secondary" @click="addNewCronItem(timetable_item[timetable_item.mode].cron)" v-if="timetable_item.mode==='range'">新增時間設定</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-12 d-grid gap-2">
                <button type="button" class="btn btn-outline-secondary" @click="addNewTimetableItem">新增 timetable item</button>
              </div>
            </div>
          </div>
          <div class="col-6" style="margin-top: 8px;">
            <div class="row g-2">
              <div class="col-12">
                <div id="chart-container">123</div>
              </div>
              <div class="col-12">
                <textarea v-model="displayDate" style="width: 100%;height: 85vh;" disabled></textarea>
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