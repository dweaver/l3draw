const React = require('react');
const ReactDOM = require('react-dom');
const THREE = require('three');

const helpers = require('../utils/helpers');

export default class Main extends React.Component {
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

// Set up three.js
function cubeSetup() {
  const scene = new THREE.Scene();
  const cubeElement = document.getElementById('cube');
  const innerWidth = 600;
  const innerHeight = 600;
  const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
  const unselectedColor = 0x666666;
  const selectedColor = 0xffff44;
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(innerWidth, innerHeight);
  cubeElement.appendChild(renderer.domElement);

  const geometry = new THREE.SphereGeometry(0.1);
  //const material = new THREE.MeshBasicMaterial(
  //  { color: 0x70d030, wireframe: true, transparent: true });
  const cubeOfCubes = new THREE.Group();

  var light = new THREE.DirectionalLight( 0xffffff, 1 );
  light.position.set( 1, 1, 1 ).normalize();
  scene.add( light );

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      for (let k = 0; k < 8; k++) {
        const cube = new THREE.Mesh(
          geometry,
          new THREE.MeshLambertMaterial( { color: unselectedColor } ));
        cube.position.set((-3.5 + i) * 0.5, (-3.5 + j) * 0.5, (-3.5 + k) * 0.5);
        cube.l3dCoord = [i, j, k];
        cubeOfCubes.add(cube);
      }
    }
  }

  scene.add(cubeOfCubes);

  const mouse = new THREE.Vector2();
  let INTERSECTED;
  const raycaster = new THREE.Raycaster();
  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  document.addEventListener( 'mouseup', onDocumentMouseUp, false );
    
  function onDocumentMouseMove( event ) {
    event.preventDefault();
    // TODO: account for scrolling
    mouse.x = ( event.clientX / innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / innerHeight ) * 2 + 1;
  }

  function onDocumentMouseUp( event ) {
    event.preventDefault();
    if (INTERSECTED !== null) {
      console.log('clicked!', INTERSECTED.l3dCoord);
      INTERSECTED.material.color.setHex( selectedColor );
    }
  }

  function render() {
    requestAnimationFrame(render);
    // cubeOfCubes.rotation.x += 0.001;
    // cubeOfCubes.rotation.y += 0.001;
    // cubeOfCubes.rotation.z += 0.001;
    
    // find intersections
    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( cubeOfCubes.children );
    if ( intersects.length > 0 ) {
      if ( INTERSECTED != intersects[ 0 ].object ) {
        if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
        INTERSECTED = intersects[ 0 ].object;
        INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
        INTERSECTED.material.emissive.setHex( 0xff0000 );
      }
    } else {
      if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
      INTERSECTED = null;
    }

    renderer.render(scene, camera);
  }
  render();
}
cubeSetup();


ReactDOM.render(<Main />, document.getElementById('app'));
