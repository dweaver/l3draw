import log from 'loglevel';
import axios from 'axios';
import querystring from 'querystring';

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.baseURL = 'https://api.particle.io';

/*curl https://api.particle.io/v1/devices/53ff70066678505529312367/setVoxel -d access_token='943a315bb5e0f0a78c7cd8975df7f52c6c4a6bc9' -d params='6,6,6,30,30,255'
{
  "id": "53ff70066678505529312367",
  "last_app": "",
  "connected": true,
  "return_value": 1
}*/
export function setVoxel(device, token, x, y, z, r, g, b) {
  axios.post(`/v1/devices/${device}/setVoxel`, querystring.stringify({
    access_token: token,
    params: [x, y, z, r, g, b].join(','),
  })).then((todo) => log.info('posted.', todo)
  ).catch((error) => log.error('error', error));
}
