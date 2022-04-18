import * as THREE from "three";
import "./style.css";

// キャンバスの取得
const canvas = document.querySelector(".webgl");

/* 
必須の3要素を追加しよう
*/
// シーン
const scene = new THREE.Scene();

// サイズ設定
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// カメラ
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 6;
scene.add(camera);

// レンダラー
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);

/* オブジェクトを作成しよう */

const textureLoader = new THREE.TextureLoader();
const textures = [
  textureLoader.load("https://ynstakeru.github.io/img/origami_img.png"),
  textureLoader.load(
    "https://ynstakeru.github.io/img/ramen-file-mapper-image.png"
  ),
  textureLoader.load("https://ynstakeru.github.io/img/seat_change_img.png"),
  textureLoader.load(
    "https://ynstakeru.github.io/img/ramen-file-mapper-image.png"
  ),
];

// マテリアル
const materials = [];
for (const texture of textures) {
  materials.push(
    new THREE.MeshPhysicalMaterial({
      metalness: 0.9,
      roughness: 1,
      map: texture,
      side: THREE.DoubleSide,
    })
  );
}

// メッシュ
const mesh1 = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2, 16, 16),
  materials[0]
);
const mesh2 = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2, 16, 16),
  materials[1]
);
const mesh3 = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2, 16, 16),
  materials[2]
);
const mesh4 = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2, 16, 16),
  materials[3]
);

mesh1.position.set(2, 0, 0);
mesh1.rotation.x = (-3 * Math.PI) / 4;
mesh2.position.set(-1, 0, 0);
mesh2.rotation.x = -1 * Math.PI;
mesh3.position.set(2, 0, -6);
mesh3.rotation.x = (-1 * Math.PI) / 4;
mesh4.position.set(5, 0, 3);
mesh4.rotation.x = (-1 * Math.PI) / 2;

scene.add(mesh1, mesh2, mesh3, mesh4);

const meshes = [mesh1, mesh2, mesh3, mesh4];

/* パーティクルを追加してみよう */
// ジオメトリ
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 700;
const positionArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
  positionArray[i] = (Math.random() - 0.5) * 10;
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positionArray, 3)
);

// マテリアル
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.025,
  color: "#ffffff",
});

// メッシュ化
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

/* ライトを追加 */
const ambientLight = new THREE.AmbientLight();
ambientLight.color = new THREE.Color(0xffffff);
ambientLight.intensity = 8;
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight("#ffffff", 1);
directionalLight.position.set(0.5, 1, 1);
scene.add(directionalLight);

// ブラウザのリサイズ操作
window.addEventListener("resize", () => {
  // サイズのアップデート
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // カメラのアップデート
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // レンダラーのアップデート
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(window.devicePixelRatio);
});

// ホイールを実装してみよう
let speed = 0;
let rotation = 0;
window.addEventListener("wheel", (event) => {
  speed += event.deltaY * 0.0002;
});

function rot() {
  rotation += speed;
  speed *= 0.93;

  // ジオメトリ全体を回転させる
  mesh1.position.x = +3.8 * Math.cos(rotation);
  mesh1.position.y = 1.8 * Math.cos(rotation);
  mesh1.position.z = -3 + 3.8 * Math.sin(rotation);
  mesh2.position.x = +3.8 * Math.cos(rotation + Math.PI / 2);
  mesh2.position.y = 1.8 * Math.cos(rotation + Math.PI / 2);
  mesh2.position.z = -3 + 3.8 * Math.sin(rotation + Math.PI / 2);
  mesh3.position.x = +3.8 * Math.cos(rotation + Math.PI);
  mesh3.position.y = 1.8 * Math.cos(rotation + Math.PI);
  mesh3.position.z = -3 + 3.8 * Math.sin(rotation + Math.PI);
  mesh4.position.x = +3.8 * Math.cos(rotation + (3 * Math.PI) / 2);
  mesh4.position.y = 1.8 * Math.cos(rotation + (3 * Math.PI) / 2);
  mesh4.position.z = -3 + 3.8 * Math.sin(rotation + (3 * Math.PI) / 2);

  window.requestAnimationFrame(rot);
}
rot();

// カーソルの位置を取得してみよう
const cursor = {};
cursor.x = 0;
cursor.y = 0;

let radian = 0;

// アニメーション
const clock = new THREE.Clock();

const animate = () => {
  renderer.render(scene, camera);
  let getDeltaTime = clock.getDelta();

  // meshを回転させる
  for (const mesh of meshes) {
    mesh.rotation.x += 0.1 * getDeltaTime;
    mesh.rotation.y += 0.12 * getDeltaTime;
  }
  radian += getDeltaTime * 0.25;

  camera.position.x = Math.sin(radian);
  camera.position.y = Math.cos(radian);

  window.requestAnimationFrame(animate);
};

animate();
