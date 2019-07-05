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

const getMeetingCountSql = function (brandId, meetingId, year, attendForm) {
  // 条件: 品牌 主题 年份
  let values = [];
  let conditions = [];
  let str = '';
  str += 'SELECT count(*) as meetingCount, month(m.meeting_date) as month ';
  str += 'FROM meeting as m ';
  // str += 'INNER JOIN relation_brand_meeting as rbm ON m.id = rbm.meeting_id';
  if (brandId) {
    str += ', (SELECT * from relation_brand_meeting WHERE brand_id = ?) rbm WHERE ';
    conditions.push('m.id = rbm.meeting_id')
    values.push(brandId);
  } else if (meetingId || year) {
    str += ' WHERE ';
  }

  if (meetingId) {
    conditions.push('m.id = ?')
    values.push(meetingId)
  }
  if (year) {
    conditions.push('year(m.meeting_date) = ?')
    values.push(year)
  }
  str += conditions.join(' and ')
  str += ' GROUP BY month(meeting_date)'

  return { sql: str, values }
}

const getTotalCount = function (brandId, meetingId, year, attendForm) {
  let values = []
  let conditions = []
  let str = ''
  str += 'SELECT '
  str += 'month(meeting_date) as month, '
  str += 'sum(attend_doctor_count) as doctorCount, '
  str += 'sum(attend_director_count) as directorCount, '
  str += 'sum(attend_wechat_doctors_count) as wechatDoctorCount '
  str += 'FROM meeting_record as mr INNER JOIN meeting AS m ON m.id = mr.meeting_id'
  if (brandId || meetingId || year || attendForm) {
    str += ' WHERE '
  }
  if (brandId) {
    conditions.push('find_in_set(?,brand_id)')
    values.push(brandId)
  }
  if (meetingId) {
    conditions.push('m.id = ?')
    values.push(meetingId)
  }
  if (year) {
    conditions.push('year(m.meeting_date) = ?')
    values.push(year)
  }
  if (attendForm) {
    conditions.push('mr.meeting_attend_form like ?')
    values.push(attendForm)
  }

  str += conditions.join(' and ')
  str += ' group by month(meeting_date);'
  return { sql: str, values }
}

const getHospitalAndDuration = function (brandId, meetingId, year, month, attendForm) {
  let values = []
  let conditions = ['mr.meeting_id = m.id']
  let str = ''
  str += 'SELECT ';
  str += 'count(distinct doctor_hos) as countHospital, ';
  str += 'avg(stream_duration) as avgStreamDuration, ';
  str += 'sum(attend_doctor_count) as sumDoctor, '
  str += 'sum(attend_director_count) as sumDirector, '
  str += 'sum(attend_wechat_doctors_count) as sumWechatDoctor '
  str += 'FROM meeting_record as mr, meeting as m WHERE ';
  if (brandId) {
    conditions.push('find_in_set(?,brand_id)')
    values.push(brandId)
  }
  if (meetingId) {
    conditions.push('m.id = ?')
    values.push(meetingId)
  }
  if (year) {
    conditions.push('year(m.meeting_date) = ?')
    values.push(year)
  }
  if (month) {
    conditions.push('month(m.meeting_date) in (?)')
    values.push(month)
  }
  if (attendForm) {
    conditions.push('mr.meeting_attend_form like ?')
    values.push(attendForm)
  }

  str += conditions.join(' and ')
  return { sql: str, values }
}

const getDistrictGroup = function (brandId, meetingId, year, month, attendForm) {
  let values = []
  let conditions = ['mr.meeting_id = m.id']
  let str = ''
  str += 'SELECT sum(attend_doctor_count) as attendDoctorCount, '
  str += 'sum(attend_wechat_doctors_count) as attendWechatDoctorsCount, ' 
  str += 'sum(attend_director_count) as attendDirectorCount, '
  str += 'sum(ifnull(attend_doctor_count,0) + ifnull(attend_wechat_doctors_count,0) + ifnull(attend_director_count,0)) as totalAttendCount, '
  str += 'director_district '
  str += 'FROM meeting_record as mr, meeting as m WHERE '

  if (brandId) {
    conditions.push('find_in_set(?,brand_id)')
    values.push(brandId)
  }
  if (meetingId) {
    conditions.push('m.id = ?')
    values.push(meetingId)
  }
  if (year) {
    conditions.push('year(m.meeting_date) = ?')
    values.push(year)
  }
  if (month) {
    conditions.push('month(m.meeting_date) in (?)')
    values.push(month)
  }
  if (attendForm) {
    conditions.push('mr.meeting_attend_form like ?')
    values.push(attendForm)
  }

  str += conditions.join(' and ')
  str += ' group by director_district order by totalAttendCount desc limit 0,20'
  return { sql: str, values }
}

const getProvinceGroup = function (brandId, meetingId, year, month, attendForm) {
  let values = []
  let conditions = ['mr.meeting_id = m.id']
  let str = ''
  str += 'SELECT sum(attend_doctor_count) as attendDoctorCount, '
  str += 'sum(attend_wechat_doctors_count) as attendWechatDoctorsCount, ' 
  str += 'sum(attend_director_count) as attendDirectorCount, '
  str += 'sum(ifnull(attend_doctor_count,0) + ifnull(attend_wechat_doctors_count,0) + ifnull(attend_director_count,0)) as totalAttendCount, '
  str += 'doctor_province '
  str += 'FROM meeting_record as mr, meeting as m WHERE '

  if (brandId) {
    conditions.push('find_in_set(?,brand_id)')
    values.push(brandId)
  }
  if (meetingId) {
    conditions.push('m.id = ?')
    values.push(meetingId)
  }
  if (year) {
    conditions.push('year(m.meeting_date) = ?')
    values.push(year)
  }
  if (month) {
    conditions.push('month(m.meeting_date) in (?)')
    values.push(month)
  }
  if (attendForm) {
    conditions.push('mr.meeting_attend_form like ?')
    values.push(attendForm)
  }

  str += conditions.join(' and ')
  str += ' group by doctor_province order by totalAttendCount desc limit 0,20'
  return { sql: str, values }
}

const getCityGroup = function (brandId, meetingId, year, month, attendForm) {
  let values = []
  let conditions = ['mr.meeting_id = m.id']
  let str = ''
  str += 'SELECT sum(attend_doctor_count) as attendDoctorCount, '
  str += 'sum(attend_wechat_doctors_count) as attendWechatDoctorsCount, ' 
  str += 'sum(attend_director_count) as attendDirectorCount, '
  str += 'sum(ifnull(attend_doctor_count,0) + ifnull(attend_wechat_doctors_count,0) + ifnull(attend_director_count,0)) as totalAttendCount, '
  str += 'doctor_city '
  str += 'FROM meeting_record as mr, meeting as m WHERE '

  if (brandId) {
    conditions.push('find_in_set(?,brand_id)')
    values.push(brandId)
  }
  if (meetingId) {
    conditions.push('m.id = ?')
    values.push(meetingId)
  }
  if (year) {
    conditions.push('year(m.meeting_date) = ?')
    values.push(year)
  }
  if (month) {
    conditions.push('month(m.meeting_date) in (?)')
    values.push(month)
  }
  if (attendForm) {
    conditions.push('mr.meeting_attend_form like ?')
    values.push(attendForm)
  }

  str += conditions.join(' and ')
  str += ' group by doctor_city order by totalAttendCount desc limit 0,20'
  return { sql: str, values }
}

const getDeptGroup = function (brandId, meetingId, year, month, attendForm) {
  let values = []
  let conditions = ['mr.meeting_id = m.id']
  let str = '';
  str += 'SELECT ';
  str += 'sum(ifnull(attend_doctor_count,0) + ifnull(attend_wechat_doctors_count,0) + ifnull(attend_director_count,0)) as deptAttendCount, ';
  str += 'doctor_dept ';
  str += 'FROM meeting_record as mr, meeting as m WHERE ';

  if (brandId) {
    conditions.push('find_in_set(?,brand_id)')
    values.push(brandId)
  }
  if (meetingId) {
    conditions.push('m.id = ?')
    values.push(meetingId)
  }
  if (year) {
    conditions.push('year(m.meeting_date) = ?')
    values.push(year)
  }
  if (month) {
    conditions.push('month(m.meeting_date) in (?)')
    values.push(month)
  }
  if (attendForm) {
    conditions.push('mr.meeting_attend_form like ?')
    values.push(attendForm)
  }

  str += conditions.join(' and ')
  str += ' group by doctor_dept;'
  return { sql: str, values }
}

router.use('/dashboard', function (req, res, next) {
  // let db = initialDb()
  let params = req.query
  let brandId = params.brandId ? params.brandId : (params.decoded.brand_id === 1 ? null : params.decoded.brand_id)
  let meetingId = params.meetingId
  let year = params.year
  let month = params.month
  let attendForm = params.attendForm ? `%${params.attendForm}%` : null

  const meetingCount = getMeetingCountSql(brandId, meetingId, year, attendForm)
  const totalCount = getTotalCount(brandId, meetingId, year, attendForm)
  const hospitalAndDurtaion = getHospitalAndDuration(brandId, meetingId, year, month, attendForm)
  const districtGroup = getDistrictGroup(brandId, meetingId, year, month, attendForm)
  const provinceGroup = getProvinceGroup(brandId, meetingId, year, month, attendForm)
  const cityGroup = getCityGroup(brandId, meetingId, year, month, attendForm)
  const deptGroup = getDeptGroup(brandId, meetingId, year, month, attendForm)

  Promise
  .all([
    query(meetingCount.sql, meetingCount.values),
    // 会议场数 覆盖医生 覆盖代表 参会总人数
    query(totalCount.sql, totalCount.values),
    // 医院数 平均观看时长
    query(hospitalAndDurtaion.sql, hospitalAndDurtaion.values),
    // 大区根据总人数排序 参会医生 + 散会医生 + 参会代表
    query(districtGroup.sql, districtGroup.values),
    // 大区根据总人数排序 参会医生 + 散会医生 + 参会代表
    query(provinceGroup.sql, provinceGroup.values),
    // 大区根据总人数排序 参会医生 + 散会医生 + 参会代表
    query(cityGroup.sql, cityGroup.values),
    // 科室分布
    query(deptGroup.sql, deptGroup.values)
  ])
  .then(data => {
    // db.end();
    res.send({
      code: 20000,
      data: {
        countMeeting: data[0],
        bar: data[1],
        countHospital: data[2][0].countHospital,
        avgStreamDuration: data[2][0].avgStreamDuration,
        sumDoctor: data[2][0].sumDoctor,
        sumDirector: data[2][0].sumDirector,
        sumWechatDoctor: data[2][0].sumWechatDoctor,
        group: {
          district: data[3],
          province: data[4],
          city: data[5],
          dept: data[6]
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