<script setup lang="ts">
import {ref, computed} from 'vue'
const is_detailChoser = ref('0')

const range__start = ref("")
const range__end = ref("")
const detail__month = ref([])
const detail__day = ref([])

const timetable_item_list = ref([])
function addNewTimetableItem() {
  var newRangeData = {"start_date": "2024-01-01", "end_date": "2024-12-31","cron" : []}
  addNewCronItem(newRangeData.cron)
  var newDetailData = {"month": [], "date": [] ,"cron" : []}
  addNewCronItem(newDetailData.cron)
  timetable_item_list.value.push({"mode": "range","range": newRangeData,"detail": newDetailData, "uuid": crypto.randomUUID().split('-')[0]})
}

function addNewCronItem(target) {
  var newTimeItemList = []
  addNewTimeItem(newTimeItemList)
  target.push({"weekday": [],"times": newTimeItemList})
}

function addNewTimeItem(target) {
  target.push({"time": [ "0000", "2359" ],"playlist_id": "A"})
}
addNewTimetableItem()


function getTimeSettingStr(TimeSetting) {
  var strList = []
  for(var timeTime of TimeSetting) {
    var timeitemStr = `                    {"time": [ "${timeTime.time[0]}", "${timeTime.time[1]}" ], "playlist_id": "${timeTime.playlist_id}" }`
    strList.push(timeitemStr)
  }
  return strList.join(",\n")
}

function getCronSettingStr(CronSetting) {
  var cornStrList = []
  for (var cronItem of CronSetting) {
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
      console.log(timetableItem["detail"])
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
  return timetableStrList.join(",\n")
}



const cron__list = ref([])
const cron__list__detailmode = ref([])


const cornlist_str = computed(() => {
  var returnStr = ""
  for (var dataChose of nowTarget.value) {
    var weekdayStr = `        {
          "weekday": [${(dataChose.weekday.length===0 || dataChose.weekday.length===7) ?"-1":dataChose.weekday.join(",")}],
          "times": [\n`
    returnStr += weekdayStr
    for(var timeTime of dataChose.times) {
      var timeitemStr = `              {"time": [ "${timeTime.time[0]}", "${timeTime.time[1]}" ], "playlist_id": "${timeTime.playlist_id}" },\n`
      returnStr += timeitemStr
    }
    returnStr += "          ]\n      },\n"
    // var itemStr = JSON.stringify(dataChose, null, '\t')
    // returnStr += itemStr
  } 
  returnStr += "    ],"
  return returnStr
})

const displayDate = computed(() => {
  return `{"timetable":[\n${getTimetableSettingStr(timetable_item_list.value)}\n]}`
})

const nowTarget = computed(() => {
  if (is_detailChoser.value === '0') {
    return cron__list.value
  } else {
    return cron__list__detailmode.value
  }
})



function addItem_detail() {
  cron__list__detailmode.value.push(
    {
      "weekday": [],
      "times": []
    }
  )
  addTimeItem(cron__list__detailmode.value[cron__list.value.length-1].times)
}

function addItem() {
  cron__list.value.push(
    {
      "weekday": [],
      "times": []
    }
  )
  addTimeItem(cron__list.value[cron__list.value.length-1].times)
}

function addTimeItem(timeList) {
  timeList.push({
    "time": [ "0000", "2359" ],
    "playlist_id": "A"
  })
}
</script>

<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-6">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12">
              <div class="card p-3" v-for="timetable_item, timetable_index in timetable_item_list">
                <div class="col-12" style="display: flex;justify-content: space-between;align-items: baseline;">
                  <h1>timetable item - {{ timetable_item.uuid }}</h1>
                  <div class="btn btn-danger" @click="timetable_item_list.splice(timetable_index, 1)">刪除</div>
                </div>
                <div class="col-12">
                  <hr>
                  <div class="row">
                    <h2>日期選擇</h2>
                  </div>
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
                                                          <option value="A">A</option>
                                                          <option value="B">B</option>
                                                          <option value="C">C</option>
                                                          <option value="D">D</option>
                                                          <option value="E">E</option>
                                                          <option value="F">F</option>
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
      </div>
      <div class="col-6" style="margin-top: 8px;">
        <textarea v-model="displayDate" style="width: 100%;height: 95vh;"></textarea>
      </div>
    </div>
  </div>

</template>

<script lang="ts">

</script>

<style lang="postcss">
/* https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-nesting */
</style>