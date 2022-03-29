import moment from 'moment'
const tz = require('moment-timezone')


export const getDayAndTime = (firtParam=false) => {
    let curtime = moment().diff(moment('00:00', 'HH:mm'), "minutes")+(moment().tz('America/Los_Angeles')._offset-moment().utcOffset())
    
    let day = moment.tz().format('dddd').toUpperCase()
    if(curtime < 0){
        day = moment.tz().subtract(1, 'days').format('dddd').toUpperCase()
        curtime = 1440 - curtime
    } else if(curtime > 1439){
        day = moment.tz().add(1, 'days').format('dddd').toUpperCase()
        curtime = curtime - 1440
    }



    return `${firtParam ? '?' : '&'}day=${day}&time=${curtime}`
}



const CheckIfOpen = (hoursofoperation, TZ) => {

    let offset = 0

    offset = TZ ? moment().tz(TZ)._offset-moment().utcOffset() : 0
    let dayName = moment().format('dddd').toLowerCase()
    

    
    let dayTimeProgress = moment.duration(moment().diff(moment('00:00', 'hh:mm'))).asMinutes()+(offset)

    let previousDayName = moment(dayName, 'dddd').subtract('1', 'day').format('dddd').toLowerCase()
    let previousDay = hoursofoperation[previousDayName]
    let previousDayTimeProgress = dayTimeProgress + 1440

    let _day = moment()

    if(dayTimeProgress < 0){
        dayTimeProgress = 1440 - (dayTimeProgress * -1)
        dayName = moment().subtract(1, 'days').format('dddd').toLowerCase()
        _day = moment().subtract(1, 'days')
    } else if(dayTimeProgress > 1439){
        dayTimeProgress =  dayTimeProgress - 1440
        dayName = moment().add(1, 'days').format('dddd').toLowerCase()
    }

    let day = hoursofoperation[dayName]

    if(day.opens_at <= dayTimeProgress && day.closes_at > dayTimeProgress && day.isEnabled){
        return {
            isOpen: true,
            closes_at: day.closes_at
        }
    } else if (previousDay.opens_at <= previousDayTimeProgress && previousDay.closes_at > previousDayTimeProgress && previousDay.isEnabled){
        return {
            isOpen: true,
            previousDay: true,
            closes_at: previousDay.closes_at
        }
    } else {
        if(day.opens_at > dayTimeProgress){
            return {
                isOpen: false,
                opensToday: true,
                opens_at: day.opens_at
            }
        } else {
            return {
                isOpen: false,
                opensToday: false,
                ...getNearestDayOpen(hoursofoperation, _day)
            }
        }
    }
}

export default CheckIfOpen 


let getNearestDayOpen = (hoursofoperation, currentDay = moment()) => {

    let dayOpened = false

    let isThereDayOpen = false

    Object.keys(hoursofoperation).map(x => {
        if(hoursofoperation[x].isEnabled === true){
            isThereDayOpen = true
        }
    })

    if(isThereDayOpen){
        do {
       
            currentDay = currentDay.add(1, 'days')
            let dayName = currentDay.format('dddd').toLowerCase()
            if(hoursofoperation[dayName]['isEnabled'] === true){
                dayOpened = {...hoursofoperation[dayName], day: dayName}
            }
        } while (dayOpened === false)
    
        return dayOpened
    } 
}