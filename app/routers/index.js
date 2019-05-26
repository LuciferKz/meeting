const express = require('express')
const router = express.Router()
const user = require('./user')
const role = require('./role')
const brand = require('./brand')
const meeting = require('./meeting')
const meetingRecord = require('./meeting-record')
const log = require('./log')
const handler = require('../handler')
const initialDb = require('../db')
const query = require('../db/query');

router.use((req, res, next) => {
  if (req.url === '/user/login' || req.url === '/user/register') {
    next()
  } else {
    handler.user.auth(req, res, next)
  }
})
router.use('/user', user)
router.use('/role', role)
router.use('/meeting', meeting)
router.use('/meeting-record', meetingRecord)
router.use('/brand', brand)
router.use('/log', log)
router.use('/dashboard', function (req, res, next) {
  // let db = initialDb()
  let params = req.query

  let strCondition = '';
  let groupCondition = '';
  let condition = [];
  let conditionValues = [];
  let groupConditionValues = [];
  if (params.brandId) {
    condition.push('FIND_IN_SET(?,brand_id)')
    conditionValues.push(params.brandId)
    groupCondition.push('FIND_IN_SET(?,brand_id)')
    groupConditionValues.push(params.brandId)
  }
  if (params.theme) {
    condition.push('meeting.theme = ?')
    conditionValues.push(params.theme)
    groupCondition.push('meeting.theme = ?')
    groupConditionValues.push(params.theme)
  }
  if (params.year) {
    groupCondition.push('year(meeting.meeting_date) = ?')
    groupConditionValues.push(params.year)
  }
  if (params.month) {
    groupCondition.push('month(meeting.meeting_date) = ?')
    groupConditionValues.push(params.month)
  }
  if (condition.length) strCondition = 'WHERE ' + condition.join(' and ')

  console.log(strCondition)

  Promise
  .all([
    // 会议场数 覆盖医生 覆盖代表 参会总人数
    query('SELECT month(meeting_date) as month, count(*) as meetingCount, sum(attend_doctor_count) as doctorCount,sum(attend_director_count) as directorCount, sum(attend_wechat_doctors_count) as wechatDoctorCount FROM meeting_record as mr INNER JOIN meeting AS m ON m.id = mr.meeting_id '+ strCondition +' group by month(meeting_date);', conditionValues),
    // 医院数 平均观看时长
    query('SELECT count(distinct doctor_hos) as countDoctorHospital, avg(stream_duration) as avgStreamDuration FROM meeting_record;'),
    // 大区根据总人数排序 参会医生 + 散会医生 + 参会代表
    query('SELECT sum(attend_doctor_count) as attendDoctorCount, sum(attend_wechat_doctors_count) as attendWechatDoctorsCount, sum(attend_director_count) as attendDirectorCount, sum(ifnull(attend_doctor_count,0) + ifnull(attend_wechat_doctors_count,0) + ifnull(attend_director_count,0)) as totalAttendCount, director_district FROM meeting_record '+ strCondition +' group by director_district order by totalAttendCount desc limit 0,20'),
    // 大区根据总人数排序 参会医生 + 散会医生 + 参会代表
    query('SELECT sum(attend_doctor_count) as attendDoctorCount, sum(attend_wechat_doctors_count) as attendWechatDoctorsCount, sum(attend_director_count) as attendDirectorCount, sum(ifnull(attend_doctor_count,0) + ifnull(attend_wechat_doctors_count,0) + ifnull(attend_director_count,0)) as totalAttendCount, doctor_province FROM meeting_record '+ strCondition +' group by doctor_province order by totalAttendCount desc limit 0,20'),
    // 大区根据总人数排序 参会医生 + 散会医生 + 参会代表
    query('SELECT sum(attend_doctor_count) as attendDoctorCount, sum(attend_wechat_doctors_count) as attendWechatDoctorsCount, sum(attend_director_count) as attendDirectorCount, sum(ifnull(attend_doctor_count,0) + ifnull(attend_wechat_doctors_count,0) + ifnull(attend_director_count,0)) as totalAttendCount, doctor_city FROM meeting_record '+ strCondition +' group by doctor_city order by totalAttendCount desc limit 0,20'),
  ])
  .then(data => {
    let bar = data[0];
    // db.end();
    res.send({
      code: 20000,
      data: {
        bar,
        countDoctorHospital: data[1][0].countDoctorHospital,
        avgStreamDuration: data[1][0].avgStreamDuration,
        group: {
          district: data[2],
          province: data[3],
          city: data[4]
        }
      },
      meesage: '请求成功'
    })
  })
  .catch(err => {
    throw err
  })
})

module.exports = router