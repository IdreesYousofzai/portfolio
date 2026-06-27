/* ============================================================
   three-scene.js — Hero Three.js background
   ============================================================ */

export async function initThreeScene() {
  const canvas = document.getElementById('three-canvas');
  if (!canvas) return;

  // Dynamically load Three.js from CDN
  const THREE = await loadThree();
  if (!THREE) { console.warn('Three.js failed to load'); return; }

  const W = canvas.offsetWidth;
  const H = canvas.offsetHeight;

  /* ── Renderer ─────────────────────────────────────────────── */
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);
  renderer.setClearColor(0x000000, 0);

  /* ── Scene & Camera ──────────────────────────────────────── */
  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 200);
  camera.position.set(0, 0, 20);

  /* ── Lighting ────────────────────────────────────────────── */
  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambient);

  const pointLight = new THREE.PointLight(0x3B82F6, 1.5, 60);
  pointLight.position.set(10, 10, 10);
  scene.add(pointLight);

  const pointLight2 = new THREE.PointLight(0x8B5CF6, 1.0, 60);
  pointLight2.position.set(-10, -5, 5);
  scene.add(pointLight2);

  /* ── Geometries ──────────────────────────────────────────── */
  const shapes = [];
  const isDark  = () => document.documentElement.getAttribute('data-theme') !== 'light';

  function getMaterial(type = 'wireframe') {
    if (type === 'wireframe') {
      return new THREE.MeshBasicMaterial({
        color: isDark() ? 0x3B82F6 : 0x2563EB,
        wireframe: true,
        opacity: isDark() ? 0.35 : 0.2,
        transparent: true,
      });
    }
    return new THREE.MeshPhongMaterial({
      color: isDark() ? 0x1E3A8A : 0x3B82F6,
      transparent: true,
      opacity: isDark() ? 0.12 : 0.08,
      shininess: 60,
    });
  }

  const geoConfigs = [
    { geo: new THREE.IcosahedronGeometry(2.5, 0), type: 'wireframe', x:  5, y:  2, z: -5  },
    { geo: new THREE.OctahedronGeometry(1.8, 0),  type: 'wireframe', x: -6, y: -2, z: -8  },
    { geo: new THREE.TetrahedronGeometry(2, 0),   type: 'wireframe', x:  8, y: -4, z: -12 },
    { geo: new THREE.IcosahedronGeometry(1.2, 0), type: 'wireframe', x: -9, y:  5, z: -15 },
    { geo: new THREE.OctahedronGeometry(1.0, 0),  type: 'wireframe', x:  3, y: -7, z: -10 },
    { geo: new THREE.TorusGeometry(2, 0.5, 8, 20),type: 'wireframe', x: -4, y:  6, z: -18 },
  ];

  geoConfigs.forEach(cfg => {
    const mesh = new THREE.Mesh(cfg.geo, getMaterial(cfg.type));
    mesh.position.set(cfg.x, cfg.y, cfg.z);
    mesh.userData = {
      rotX: (Math.random() - 0.5) * 0.008,
      rotY: (Math.random() - 0.5) * 0.008,
      floatSpeed: 0.3 + Math.random() * 0.4,
      floatAmp: 0.3 + Math.random() * 0.5,
      baseY: cfg.y,
      phase: Math.random() * Math.PI * 2,
    };
    scene.add(mesh);
    shapes.push(mesh);
  });

  /* ── Particles ───────────────────────────────────────────── */
  const particleCount = 120;
  const positions     = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 60;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 30 - 10;
  }

  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0x3B82F6,
    size: 0.08,
    transparent: true,
    opacity: isDark() ? 0.6 : 0.4,
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  /* ── Mouse interaction ───────────────────────────────────── */
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  /* ── Resize ──────────────────────────────────────────────── */
  function onResize() {
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', onResize);

  /* ── Animate ─────────────────────────────────────────────── */
  let clock = new THREE.Clock();
  let animFrame;

  function animate() {
    animFrame = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    targetX += (mouseX * 0.8 - targetX) * 0.04;
    targetY += (mouseY * 0.8 - targetY) * 0.04;

    camera.position.x = targetX * 2;
    camera.position.y = -targetY * 1.5;

    shapes.forEach(mesh => {
      const ud = mesh.userData;
      mesh.rotation.x += ud.rotX;
      mesh.rotation.y += ud.rotY;
      mesh.position.y  = ud.baseY + Math.sin(t * ud.floatSpeed + ud.phase) * ud.floatAmp;
    });

    particles.rotation.y = t * 0.015;

    renderer.render(scene, camera);
  }

  animate();

  // Handle theme changes — update material colors
  const observer = new MutationObserver(() => {
    const dark = isDark();
    shapes.forEach(mesh => {
      mesh.material.color.set(dark ? 0x3B82F6 : 0x2563EB);
      mesh.material.opacity = dark ? 0.35 : 0.18;
    });
    particleMat.color.set(dark ? 0x3B82F6 : 0x2563EB);
    particleMat.opacity = dark ? 0.6 : 0.3;
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  // Cleanup
  return () => {
    cancelAnimationFrame(animFrame);
    observer.disconnect();
    window.removeEventListener('resize', onResize);
    renderer.dispose();
  };
}

/* ── Load Three.js from CDN ─────────────────────────────────── */
function loadThree() {
  return new Promise((resolve) => {
    if (window.THREE) { resolve(window.THREE); return; }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.onload  = () => resolve(window.THREE);
    script.onerror = () => resolve(null);
    document.head.appendChild(script);
  });
}