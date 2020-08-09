import request from './request.js';

const  getWeather = () => {
  return request({
    method: "GET",
    url: '/api1/calendars/calendars/listInfo'
  })
}

export default getWeather;