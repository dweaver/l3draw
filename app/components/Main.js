const React = require('react');
const ReactDOM = require('react-dom');
const THREE = require('three');
// imports provides THREE to the OrbitControls example
// exports gets THREE.OrbitControls 
THREE.OrbitControls = require('imports?THREE=three!exports?THREE.OrbitControls!../../node_modules\/three\/examples\/js\/controls\/OrbitControls');
const helpers = require('../utils/helpers');

let device = localStorage.getItem('device') || '';
let token = localStorage.getItem('token') || '';


export default class Main extends React.Component {
  constructor() {
    super();
    this.setVoxel = this.setVoxel.bind(this);
    this.unsetVoxel = this.unsetVoxel.bind(this);
    this.save = this.save.bind(this);
    this.clear = this.clear.bind(this);
  }
  setVoxel() {
    helpers.setVoxel(
      this.refs.device.value,
      this.refs.token.value,
      this.refs.x.value, this.refs.y.value, this.refs.z.value,
      255, 255, 255);
  }
  clear() {
    helpers.background(
      this.refs.device.value,
      this.refs.token.value,
      0, 0, 0);
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
        <div><button onClick={this.clear}>Clear</button></div>
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
          new THREE.MeshLambertMaterial( { 
            color: unselectedColor, 
            reflectivity: 1.0} ));
        cube.position.set((-3.5 + i) * 0.5, (-3.5 + j) * 0.5, (-3.5 + k) * 0.5);
        cube.l3dCoord = [i, j, k];
        cube.set = false;
        cubeOfCubes.add(cube);
      }
    }
  }

  scene.add(cubeOfCubes);

  const controls = new THREE.OrbitControls( camera, renderer.domElement );
  //controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.enableZoom = false;

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
      let coord = INTERSECTED.l3dCoord;
      if (!INTERSECTED.set) {
        INTERSECTED.material.color.setHex( selectedColor );
        helpers.setVoxel(
          device,
          token,
          coord[0], coord[1], coord[2],
          40, 40, 20);
          INTERSECTED.set = true;
      } else {
        INTERSECTED.material.color.setHex( unselectedColor );
        helpers.setVoxel(
          device,
          token,
          coord[0], coord[1], coord[2],
          0, 0, 0);
          INTERSECTED.set = false;
      }

    }
  }

  function render() {
    requestAnimationFrame(render);
    controls.update();
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
