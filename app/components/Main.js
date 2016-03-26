const React = require('react');
const ReactDOM = require('react-dom');

const helpers = require('../utils/helpers');

class Main extends React.Component {
  constructor() {
    super();
    this.setVoxel = this.setVoxel.bind(this);
    this.unsetVoxel = this.unsetVoxel.bind(this);
    this.save = this.save.bind(this);
  }
  setVoxel() {
    helpers.setVoxel(
      this.refs.device.value,
      this.refs.token.value,
      this.refs.x.value, this.refs.y.value, this.refs.z.value,
      255, 255, 255);
  }
  save() {
    localStorage.setItem('device', this.refs.device.value);
    localStorage.setItem('token', this.refs.token.value);
  }
  unsetVoxel() {
    helpers.setVoxel(
      this.refs.device.value,
      this.refs.token.value,
      this.refs.x.value, this.refs.y.value, this.refs.z.value,
      0, 0, 0);
  }
  render() {
    let device = localStorage.getItem('device') || '';
    let token = localStorage.getItem('token') || '';
    return (
      <div>
        Set voxel
        <div>Device <input ref="device" defaultValue={device}></input></div>
        <div>Token <input ref="token" defaultValue={token}></input></div>
        <div>x <input ref="x" defaultValue="4"></input></div>
        <div>y <input ref="y" defaultValue="4"></input></div>
        <div>z <input ref="z" defaultValue="4"></input></div>
        <div><button onClick={this.setVoxel}>Set</button></div>
        <div><button onClick={this.unsetVoxel}>Unset</button></div>
        <div><button onClick={this.save}>Save device</button></div>
      </div>
    );
  }
}

ReactDOM.render(<Main />, document.getElementById('app'));
