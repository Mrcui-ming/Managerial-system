import axios from 'axios';

function request(context) {

  const instance = axios.create({
    // timeout: 5000
  });

  instance.interceptors.response.use(res => {
    return res.data;
  },err => {
    console.log(err);
  })

  return instance(context);
}

export default request;