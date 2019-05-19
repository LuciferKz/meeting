module.exports = {
    BRAND_ALL: 'SELECT * FROM brand WHERE id != 1',
    COUNT_BRAND: 'SELECT count(*) as total FROM brand',
    USER_INSERT: 'INSERT INTO user(username,password,brand_id,createAt,updateAt) Values(?,?,?,?,?)',
    USER_JOIN_BRAND: 'SELECT `user`.username, `user`.password, `user`.brand_id, `brand`.name as brandName, `user`.createAt, `user`.updateAt, `user`.avatar, `user`.roles, `user`.introduction FROM user LEFT JOIN brand ON user.brand_id = brand.id',
    USER_ALL: 'SELECT * FROM user',
    USER_LIST: 'SELECT `user`.id, `user`.username, `brand`.name as brandName, `user`.createAt, `user`.updateAt FROM user LEFT JOIN brand ON user.brand_id = brand.id LIMIT ?,?',

    // where name like '%,b' or name like 'b,%' or name like '%,b,%'
    MEETING_ALL: 'SELECT * FROM meeting',
    MEETING_RECORD_INSERT: 'INSERT INTO `meeting_record` (meeting_id,meeting_attend_form,meeting_speaker,director_district,director_region,director_name,director_email,doctor_open_id,doctor_province,doctor_city,doctor_hos,doctor_dept,stream_enter_time,stream_leave_time,stream_duration,attend_doctor_count,attend_director_count,attend_wechat_doctors_count,log_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
    MEETING_RECORD_LIST: 'SELECT `meeting`.meeting_date as meeting_date,`meeting`.brands,`meeting`.meeting_time as meeting_time,`meeting`.theme as meeting_name,`meeting`.founder as meeting_founder,`meeting`.`type` as meeting_type,meeting_attend_form,meeting_speaker,director_district,director_region,director_name,director_email,doctor_open_id,doctor_province,doctor_city,doctor_hos,doctor_dept,stream_enter_time,stream_leave_time,stream_duration,attend_doctor_count,attend_director_count,attend_wechat_doctors_count FROM test.meeting_record LEFT JOIN meeting ON meeting.id = meeting_record.meeting_id',
    RELATION_MEETING_BREAND: 'SELECT * FROM relation_brand_meeting, meeting WHERE meeting.id = relation_brand_meeting.meeting_id',
    
    COUNT_USER: 'SELECT count(*) as total FROM user',
    
    LOG_CREATE: 'INSERT INTO upload_log(operator,filename,action,create_time) VALUES (?,?,?,?)',

    JOIN_LOG: 'LEFT JOIN upload_log ON upload_log.id = meeting_record.log_id ',

    RELATION_BRAND_MEETING_ALL: 'SELECT * FROM relation_brand_meeting'
}