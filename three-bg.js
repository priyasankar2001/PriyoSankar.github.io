/* =============================================
   THREE-BG.JS — Galaxy Vortex + Aurora Nebula
   Beautiful spiral galaxy with glowing nebula clouds
   ============================================= */

(function () {
  const canvas   = document.getElementById('galaxy-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 500);
  camera.position.set(0, 18, 32);
  camera.lookAt(0, 0, 0);

  /* ========== GALAXY SPIRAL PARTICLES ========== */
  const ARMS       = 3;
  const PER_ARM    = 800;
  const TOTAL      = ARMS * PER_ARM;
  const GAL_RADIUS = 18;

  const positions = new Float32Array(TOTAL * 3);
  const colors    = new Float32Array(TOTAL * 3);

  // Color palette: gold → cyan → indigo
  const palette = [
    new THREE.Color('#c9a84c'),
    new THREE.Color('#f0d080'),
    new THREE.Color('#06b6d4'),
    new THREE.Color('#4f46e5'),
    new THREE.Color('#10b981'),
    new THREE.Color('#7c3aed'),
  ];

  for (let arm = 0; arm < ARMS; arm++) {
    const armOffset = (arm / ARMS) * Math.PI * 2;
    for (let i = 0; i < PER_ARM; i++) {
      const idx = (arm * PER_ARM + i) * 3;
      const t   = i / PER_ARM;
      const r   = t * GAL_RADIUS;
      const spin   = t * Math.PI * 5;
      const angle  = armOffset + spin;
      const scatter = (1 - t) * 0.6 + t * 2.5;

      positions[idx]     = Math.cos(angle) * r + (Math.random() - 0.5) * scatter;
      positions[idx + 1] = (Math.random() - 0.5) * (t * 1.5 + 0.2);
      positions[idx + 2] = Math.sin(angle) * r + (Math.random() - 0.5) * scatter;

      // Blend colors: inner = gold, outer = cool
      const colorIdx = Math.floor(t * (palette.length - 1));
      const colorMix = t * (palette.length - 1) - colorIdx;
      const c1 = palette[colorIdx];
      const c2 = palette[Math.min(colorIdx + 1, palette.length - 1)];
      colors[idx]     = c1.r + (c2.r - c1.r) * colorMix;
      colors[idx + 1] = c1.g + (c2.g - c1.g) * colorMix;
      colors[idx + 2] = c1.b + (c2.b - c1.b) * colorMix;
    }
  }

  const galGeo = new THREE.BufferGeometry();
  galGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  galGeo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

  const galMat = new THREE.PointsMaterial({
    size: 0.12,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    sizeAttenuation: true,
    depthWrite: false,
  });

  const galaxy = new THREE.Points(galGeo, galMat);
  scene.add(galaxy);

  /* ========== NEBULA CLOUDS ========== */
  function makeNebula(count, color, spread, y, size) {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r     = Math.random() * spread;
      pos[i*3]     = Math.cos(theta) * r * (0.5 + Math.random());
      pos[i*3+1]   = y + (Math.random() - 0.5) * 2;
      pos[i*3+2]   = Math.sin(theta) * r * (0.5 + Math.random());
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: color, size: size,
      transparent: true, opacity: 0.25,
      sizeAttenuation: true, depthWrite: false,
    });
    return new THREE.Points(geo, mat);
  }

  scene.add(makeNebula(600, 0x4f46e5, 14, 0.5, 0.35));
  scene.add(makeNebula(400, 0x06b6d4, 10, -0.5, 0.28));
  scene.add(makeNebula(300, 0xc9a84c, 6,  0.2,  0.22));
  scene.add(makeNebula(250, 0x10b981, 12, 0.8,  0.2));

  /* ========== OUTER STAR FIELD ========== */
  const starCount = 1200;
  const starPos   = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi   = Math.acos(2 * Math.random() - 1);
    const r     = 40 + Math.random() * 60;
    starPos[i*3]     = r * Math.sin(phi) * Math.cos(theta);
    starPos[i*3+1]   = r * Math.sin(phi) * Math.sin(theta);
    starPos[i*3+2]   = r * Math.cos(phi);
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  const starMat = new THREE.PointsMaterial({
    color: 0xffffff, size: 0.06,
    transparent: true, opacity: 0.5,
    sizeAttenuation: true,
  });
  scene.add(new THREE.Points(starGeo, starMat));

  /* ========== GLOWING CORE ========== */
  const coreMat = new THREE.MeshBasicMaterial({
    color: 0xf0d080, transparent: true, opacity: 0.18,
  });
  const coreMesh = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 16), coreMat);
  scene.add(coreMesh);

  const haloMat = new THREE.MeshBasicMaterial({
    color: 0x4f46e5, transparent: true, opacity: 0.07,
    side: THREE.BackSide,
  });
  const haloMesh = new THREE.Mesh(new THREE.SphereGeometry(2.5, 16, 16), haloMat);
  scene.add(haloMesh);

  /* ========== MOUSE PARALLAX ========== */
  let mouseX = 0, mouseY = 0;
  let camX = 0, camY = 18;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  /* ========== ANIMATE ========== */
  const clock = new THREE.Clock();
  const animate = () => {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Galaxy slow rotation
    galaxy.rotation.y = t * 0.06;

    // Pulsing core
    const pulse = 0.15 + Math.sin(t * 1.5) * 0.05;
    coreMesh.material.opacity = pulse;
    haloMesh.scale.setScalar(1 + Math.sin(t * 0.8) * 0.08);

    // Smooth camera parallax
    camX += (mouseX * 4 - camX) * 0.025;
    camY += (18 - mouseY * 3 - camY) * 0.025;
    camera.position.x = camX;
    camera.position.y = camY;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  };
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();
