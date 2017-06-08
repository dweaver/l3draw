import log from 'loglevel';
import axios from 'axios';
import querystring from 'querystring';

axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.baseURL = 'https://l3d.apps.exosite.io';

export function setVoxels(device, voxels) {
  // set an array of voxels
  // voxels is like this: [{x: 0, y: 0, z: 0, color: 1}]
  axios.post(`/l3d/${device}/voxels`, JSON.stringify({
    voxels: voxels,
  })).then(() => log.info('posted.')
  ).catch((error) => log.error('error', error));
}

export function setVoxel(device, x, y, z, r, g, b) {
  axios.post(`/l3d/${device}/voxel`, JSON.stringify({
    voxel: [x, y, z, r, g, b].join(','),
  })).then(() => log.info('posted.')
  ).catch((error) => log.error('error', error));
}

export function background(device, r, g, b) {
  axios.post(`/v1/devices/${device}/background`, querystring.stringify({
    access_token: token,
    params: [r, g, b].join(','),
  })).then(() => log.info('posted.')
  ).catch((error) => log.error('error', error));
}
