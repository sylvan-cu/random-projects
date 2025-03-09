import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const CeramicPot3D = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const potMeshRef = useRef(null);
  const scenePivotRef = useRef(null);
  
  // For custom rotation controls
  const isRotatingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const rotationRef = useRef({ x: 0, y: 0 });
  const zoomLevelRef = useRef(400);
  const autoRotateRef = useRef(false);

  const [potProfile, setPotProfile] = useState({
    height: 200,
    baseWidth: 80,
    maxWidth: 120,
    neckWidth: 60,
    mouthWidth: 70,
    clay: '#a67c52',
    texture: 'smooth',
    segments: 32
  });

  // Possible pot colors and textures
  const potColors = ['#a67c52', '#d7b49e', '#efd9c7', '#6d4c3d', '#c1a296', '#8d7358', '#a08679', '#5c4033'];
  const textures = ['smooth', 'rough', 'crackled'];

  // Generate a random number between min and max
  const randomRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  // Generate a random pot profile
  const generateRandomPot = () => {
    // Create more random, varied pot shapes
    const height = randomRange(120, 300);
    const baseWidth = randomRange(40, 120);
    const mouthWidth = randomRange(30, 140);
    const segments = randomRange(24, 36);
    
    // Randomize pot shape characteristics
    const potStyle = randomRange(0, 5); // Different style categories
    
    // Create more varied profiles based on pot style
    let maxWidth, neckWidth, neckHeight, bellyPosition, hasDivot;
    
    switch(potStyle) {
      case 0: // Wide belly, narrow neck vase
        maxWidth = randomRange(Math.max(baseWidth, mouthWidth) * 1.5, Math.max(baseWidth, mouthWidth) * 2.2);
        neckWidth = randomRange(Math.min(baseWidth, mouthWidth) * 0.6, Math.min(baseWidth, mouthWidth) * 0.9);
        neckHeight = randomRange(0.1, 0.25); // Percentage of height where neck starts
        bellyPosition = randomRange(0.4, 0.6); // Belly position (percentage from top)
        hasDivot = randomRange(0, 10) > 7; // 30% chance of divot
        break;
      
      case 1: // Bowl shape (wide mouth)
        maxWidth = randomRange(Math.max(baseWidth, mouthWidth) * 0.9, Math.max(baseWidth, mouthWidth) * 1.2);
        neckWidth = mouthWidth * 0.9; // Almost no neck
        neckHeight = randomRange(0.05, 0.15);
        bellyPosition = randomRange(0.3, 0.5);
        hasDivot = false;
        break;
        
      case 2: // Straight-sided cylinder with possible waist
        maxWidth = randomRange(Math.max(baseWidth, mouthWidth) * 0.9, Math.max(baseWidth, mouthWidth) * 1.1);
        neckWidth = randomRange(Math.min(baseWidth * 0.7, mouthWidth * 0.7), Math.min(baseWidth, mouthWidth) * 0.9);
        neckHeight = randomRange(0.3, 0.7);
        bellyPosition = randomRange(0.4, 0.6);
        hasDivot = randomRange(0, 10) > 5; // 50% chance of divot/waist
        break;
        
      case 3: // Double-belly amphora
        maxWidth = randomRange(Math.max(baseWidth, mouthWidth) * 1.3, Math.max(baseWidth, mouthWidth) * 1.8);
        neckWidth = randomRange(Math.min(baseWidth, mouthWidth) * 0.5, Math.min(baseWidth, mouthWidth) * 0.8);
        neckHeight = randomRange(0.2, 0.3);
        bellyPosition = randomRange(0.3, 0.4); // First belly position
        hasDivot = true; // Always has divot (for double belly)
        break;
        
      case 4: // Bottle shape (very narrow neck, wide body)
        maxWidth = randomRange(Math.max(baseWidth, mouthWidth) * 1.4, Math.max(baseWidth, mouthWidth) * 2.0);
        neckWidth = randomRange(20, 40); // Very narrow neck
        neckHeight = randomRange(0.15, 0.3);
        bellyPosition = randomRange(0.5, 0.7);
        hasDivot = randomRange(0, 10) > 6; // 40% chance of divot
        break;
        
      case 5: // Flared top vase
        maxWidth = randomRange(Math.max(baseWidth, mouthWidth) * 0.8, Math.max(baseWidth, mouthWidth) * 1.3);
        neckWidth = randomRange(Math.min(baseWidth, mouthWidth) * 0.6, Math.min(baseWidth, mouthWidth) * 0.8);
        neckHeight = randomRange(0.1, 0.2);
        bellyPosition = randomRange(0.4, 0.6);
        hasDivot = randomRange(0, 10) > 7; // 30% chance of divot
        break;
        
      default: // Fallback standard vase
        maxWidth = randomRange(Math.max(baseWidth, mouthWidth) * 1.2, Math.max(baseWidth, mouthWidth) * 1.5);
        neckWidth = randomRange(Math.min(baseWidth, mouthWidth) * 0.7, Math.min(baseWidth, mouthWidth));
        neckHeight = randomRange(0.1, 0.3);
        bellyPosition = randomRange(0.4, 0.6);
        hasDivot = randomRange(0, 10) > 8; // 20% chance of divot
    }
    
    const newPotProfile = {
      height,
      baseWidth,
      maxWidth,
      neckWidth,
      neckHeight,
      mouthWidth,
      bellyPosition,
      hasDivot,
      potStyle,
      clay: potColors[randomRange(0, potColors.length - 1)],
      texture: textures[randomRange(0, textures.length - 1)],
      segments
    };
    
    setPotProfile(newPotProfile);
    
    if (sceneRef.current) {
      updatePot(newPotProfile);
    }
  };

  // Create the pot geometry
  const createPotGeometry = (profile) => {
    const { height, baseWidth, maxWidth, neckWidth, neckHeight, mouthWidth, bellyPosition, hasDivot, potStyle, segments } = profile;
    
    // Generate points for the pot profile - more points for smoother curves
    const numPoints = 20; // Increased for more detail
    const points = [];
    
    for (let i = 0; i < numPoints; i++) {
      const t = i / (numPoints - 1); // Normalized position (0 to 1)
      // Y position from bottom to top (0 = base, height = top)
      const y = t * height;
      
      let radius;
      
      // Different pot profiles based on style and parameters
      if (i === 0) {
        // Bottom (base) - perfectly flat for stability
        radius = baseWidth / 2;
      } else if (i === numPoints - 1) {
        // Top (mouth)
        radius = mouthWidth / 2;
      } else {
        // Complex shape generation based on pot style
        switch(potStyle) {
          case 0: // Wide belly, narrow neck vase
            if (t > 1 - neckHeight) {
              // Neck area with slight curve
              const neckPosition = (t - (1 - neckHeight)) / neckHeight;
              const neckCurve = Math.sin(neckPosition * Math.PI / 2);
              radius = neckWidth / 2 * (1 - neckCurve) + mouthWidth / 2 * neckCurve;
            } else if (t > 1 - bellyPosition) {
              // Shoulder to belly
              const factor = (t - (1 - bellyPosition)) / (bellyPosition - neckHeight);
              const bellyCurve = Math.sin(factor * Math.PI / 2);
              radius = maxWidth / 2 - bellyCurve * (maxWidth / 2 - neckWidth / 2);
            } else {
              // Base to belly
              const factor = t / (1 - bellyPosition);
              // Apply easing for a more graceful taper from base
              const easedFactor = Math.pow(factor, 2);
              radius = baseWidth / 2 * (1 - easedFactor) + maxWidth / 2 * easedFactor;
            }
            break;
            
          case 1: // Bowl shape
            if (t > 0.9) {
              // Small lip at top
              radius = mouthWidth / 2;
            } else {
              // Curved bowl shape
              const factor = (1 - t) / 0.9;
              const bowlCurve = 1 - Math.pow(factor, 1.5);
              radius = baseWidth / 2 + bowlCurve * (maxWidth / 2 - baseWidth / 2);
            }
            break;
            
          case 2: // Straight-sided cylinder with possible waist
            if (hasDivot && t > 0.3 && t < 0.7) {
              // Create waist/divot in the middle
              const centerFactor = 2 * Math.abs(t - 0.5);
              const waistDepth = randomRange(0.1, 0.3); // How pronounced the waist is
              const waistCurve = Math.sin(centerFactor * Math.PI);
              
              // Interpolate between straight sides and waist
              const straightSide = baseWidth / 2 + (mouthWidth / 2 - baseWidth / 2) * t;
              const waistValue = straightSide * (1 - waistDepth * waistCurve);
              radius = waistValue;
            } else {
              // Straight(ish) sides with slight curve
              const straightFactor = t;
              const curveFactor = Math.sin(t * Math.PI) * 0.1; // Subtle curve
              radius = baseWidth / 2 + (mouthWidth / 2 - baseWidth / 2) * straightFactor + curveFactor * maxWidth / 2;
            }
            break;
            
          case 3: // Double-belly amphora
            if (t > 1 - neckHeight) {
              // Neck area
              const neckPosition = (t - (1 - neckHeight)) / neckHeight;
              const neckCurve = Math.sin(neckPosition * Math.PI / 2);
              radius = neckWidth / 2 * (1 - neckCurve) + mouthWidth / 2 * neckCurve;
            } else if (t > 1 - bellyPosition) {
              // First belly (from top)
              const factor = (t - (1 - bellyPosition)) / (bellyPosition - neckHeight);
              const bellyCurve = Math.sin(factor * Math.PI);
              radius = maxWidth / 2 - bellyCurve * (maxWidth / 2 - neckWidth / 2);
            } else if (t > 1 - bellyPosition - 0.2) {
              // Waist between bellies
              const factor = (t - (1 - bellyPosition - 0.2)) / 0.2;
              const waistCurve = Math.sin(factor * Math.PI);
              const waistWidth = neckWidth * 1.2;
              radius = waistWidth / 2 + waistCurve * (maxWidth / 2 - waistWidth / 2);
            } else {
              // Second belly (toward base) to base
              const factor = t / (1 - bellyPosition - 0.2);
              const bellyCurve = Math.sin(factor * Math.PI);
              const secondBellyMax = maxWidth * 0.9;
              
              if (factor < 0.5) {
                // Expanding from base to second belly
                radius = baseWidth / 2 + bellyCurve * (secondBellyMax / 2 - baseWidth / 2);
              } else {
                // Tapering from second belly to waist
                const tapeFactor = (factor - 0.5) / 0.5;
                const easedFactor = Math.pow(tapeFactor, 2);
                radius = secondBellyMax / 2 * (1 - easedFactor) + waistWidth / 2 * easedFactor;
              }
            }
            break;
            
          case 4: // Bottle shape
            if (t > 1 - neckHeight) {
              // Long narrow neck
              const neckPosition = (t - (1 - neckHeight)) / neckHeight;
              const neckCurve = Math.pow(neckPosition, 0.5); // Slightly curved neck
              radius = neckWidth / 2 * (1 - neckCurve) + mouthWidth / 2 * neckCurve;
            } else if (t > 1 - neckHeight - 0.1) {
              // Shoulder - quick transition to belly
              const factor = (t - (1 - neckHeight - 0.1)) / 0.1;
              const shoulderCurve = Math.sin(factor * Math.PI / 2);
              radius = maxWidth / 2 - shoulderCurve * (maxWidth / 2 - neckWidth / 2);
            } else {
              // Base to belly
              const factor = t / (1 - neckHeight - 0.1);
              // Egg-shaped or round belly
              const eggFactor = Math.pow(factor, 1.2); // Adjusted for egg shape
              radius = baseWidth / 2 * (1 - eggFactor) + maxWidth / 2 * eggFactor;
            }
            break;
            
          case 5: // Flared top vase
            if (t > 0.95) {
              // Flared lip at top
              const flareFactor = (t - 0.95) / 0.05;
              radius = mouthWidth / 2 * (1 + flareFactor * 0.1); // Slight outward flare
            } else if (t > 1 - neckHeight - 0.05) {
              // Neck area
              const neckFactor = (t - (1 - neckHeight - 0.05)) / neckHeight;
              const neckCurve = Math.sin(neckFactor * Math.PI / 2);
              radius = neckWidth / 2 * (1 - neckCurve) + mouthWidth / 2 * neckCurve;
            } else if (t > 1 - bellyPosition) {
              // Shoulder to belly
              const factor = (t - (1 - bellyPosition)) / (bellyPosition - (neckHeight + 0.05));
              const bellyCurve = Math.sin(factor * Math.PI / 2);
              radius = maxWidth / 2 - bellyCurve * (maxWidth / 2 - neckWidth / 2);
            } else {
              // Base to belly
              const factor = t / (1 - bellyPosition);
              const easedFactor = Math.pow(factor, 2.5); // Steeper curve near base
              radius = baseWidth / 2 * (1 - easedFactor) + maxWidth / 2 * easedFactor;
            }
            break;
            
          default: // Generic vase shape with random divot if needed
            if (t > 1 - neckHeight) {
              // Neck area
              const neckPosition = (t - (1 - neckHeight)) / neckHeight;
              const neckCurve = Math.sin(neckPosition * Math.PI / 2);
              radius = neckWidth / 2 * (1 - neckCurve) + mouthWidth / 2 * neckCurve;
            } else if (t > 1 - bellyPosition) {
              // Shoulder to belly
              const factor = (t - (1 - bellyPosition)) / (bellyPosition - neckHeight);
              
              if (hasDivot && factor > 0.3 && factor < 0.7) {
                // Create a random divot in the upper body if specified
                const divotFactor = (factor - 0.3) / 0.4;
                const divotDepth = randomRange(0.1, 0.25);
                const divotCurve = Math.sin(divotFactor * Math.PI);
                
                const normalRadius = maxWidth / 2 - factor * (maxWidth / 2 - neckWidth / 2);
                radius = normalRadius * (1 - divotDepth * divotCurve);
              } else {
                // Normal curve to belly
                const bellyCurve = Math.sin(factor * Math.PI / 2);
                radius = maxWidth / 2 - bellyCurve * (maxWidth / 2 - neckWidth / 2);
              }
            } else {
              // Base to belly
              const factor = t / (1 - bellyPosition);
              // Apply easing for a more graceful taper from base
              const easedFactor = Math.pow(factor, 2);
              radius = baseWidth / 2 * (1 - easedFactor) + maxWidth / 2 * easedFactor;
            }
        }
      }
      
      points.push(new THREE.Vector2(radius, y));
    }
    
    // Create a LatheGeometry which rotates the profile curve around the Y axis
    return new THREE.LatheGeometry(points, segments);
  };

  // Add texture to the pot material
  const createPotMaterial = (profile) => {
    const { clay, texture } = profile;
    
    // Convert hex color to THREE.Color
    const clayColor = new THREE.Color(clay);
    
    // Create basic material
    const material = new THREE.MeshStandardMaterial({
      color: clayColor,
      roughness: 0.7,
      metalness: 0.0,
    });
    
    // Add texture variations
    if (texture === 'rough') {
      material.roughness = 0.9;
      
      // Create bump texture for rough surface
      const bumpTexture = new THREE.TextureLoader().load(createNoiseTexture(256, 256));
      material.bumpMap = bumpTexture;
      material.bumpScale = 0.5;
    } else if (texture === 'crackled') {
      // Create crackle texture
      const crackleTexture = new THREE.TextureLoader().load(createCrackleTexture(512, 512));
      material.map = crackleTexture;
      material.roughnessMap = crackleTexture;
      material.roughness = 0.8;
    }
    
    return material;
  };

  // Create a data URL for a noise texture
  const createNoiseTexture = (width, height) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    
    const imageData = context.createImageData(width, height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const value = Math.floor(Math.random() * 128) + 64;
      data[i] = value;
      data[i + 1] = value;
      data[i + 2] = value;
      data[i + 3] = 255;
    }
    
    context.putImageData(imageData, 0, 0);
    return canvas.toDataURL();
  };

  // Create a data URL for a crackle texture
  const createCrackleTexture = (width, height) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    
    // Fill with base color
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, width, height);
    
    // Draw cracks
    context.strokeStyle = '#00000050';
    context.lineWidth = 1;
    
    const numCracks = 20;
    for (let i = 0; i < numCracks; i++) {
      const startX = Math.random() * width;
      const startY = Math.random() * height;
      
      context.beginPath();
      context.moveTo(startX, startY);
      
      let x = startX;
      let y = startY;
      
      const segments = 5 + Math.floor(Math.random() * 10);
      for (let j = 0; j < segments; j++) {
        x += (Math.random() - 0.5) * 100;
        y += (Math.random() - 0.5) * 100;
        context.lineTo(x, y);
      }
      
      context.stroke();
    }
    
    return canvas.toDataURL();
  };

      // Update the pot in the scene
  const updatePot = (profile) => {
    if (!scenePivotRef.current) return;
    
    // Remove existing pot if it exists
    if (potMeshRef.current) {
      scenePivotRef.current.remove(potMeshRef.current);
      potMeshRef.current.geometry.dispose();
      potMeshRef.current.material.dispose();
    }
    
    // Create new pot geometry and material
    const geometry = createPotGeometry(profile);
    const material = createPotMaterial(profile);
    
    // Create mesh and add to scene
    const mesh = new THREE.Mesh(geometry, material);
    // No need to flip with x rotation since our points are already oriented correctly
    mesh.position.y = 0; // Base sits on the ground plane
    
    scenePivotRef.current.add(mesh);
    potMeshRef.current = mesh;
  };

  // Custom rotation control handlers
  const handleMouseDown = (e) => {
    if (!mountRef.current) return;
    isRotatingRef.current = true;
    previousMousePositionRef.current = {
      x: e.clientX,
      y: e.clientY
    };
  };

  const handleMouseMove = (e) => {
    if (!isRotatingRef.current || !sceneRef.current || !potMeshRef.current) return;
    
    const deltaMove = {
      x: e.clientX - previousMousePositionRef.current.x,
      y: e.clientY - previousMousePositionRef.current.y
    };
    
    if (e.shiftKey) {
      // Pan camera
      if (cameraRef.current) {
        cameraRef.current.position.x -= deltaMove.x * 0.5;
        cameraRef.current.position.y += deltaMove.y * 0.5;
      }
    } else {
      // Rotate pot
      rotationRef.current.y += deltaMove.x * 0.01;
      rotationRef.current.x += deltaMove.y * 0.01;
      
      // Limit rotation on X axis to avoid flipping
      rotationRef.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotationRef.current.x));
      
      // Rotate the entire scene pivot
      if (scenePivotRef.current) {
        scenePivotRef.current.rotation.y = rotationRef.current.y;
        scenePivotRef.current.rotation.x = rotationRef.current.x;
      }
    }
    
    previousMousePositionRef.current = {
      x: e.clientX,
      y: e.clientY
    };
  };

  const handleMouseUp = () => {
    isRotatingRef.current = false;
  };

  const handleMouseLeave = () => {
    isRotatingRef.current = false;
  };

  const handleMouseWheel = (e) => {
    if (!cameraRef.current) return;
    
    e.preventDefault();
    
    // Zoom in/out
    zoomLevelRef.current += e.deltaY * 0.1;
    zoomLevelRef.current = Math.max(100, Math.min(800, zoomLevelRef.current));
    
    cameraRef.current.position.z = zoomLevelRef.current;
  };

  // Touch controls for mobile
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      isRotatingRef.current = true;
      previousMousePositionRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
    }
  };

  const handleTouchMove = (e) => {
    if (!isRotatingRef.current || !potMeshRef.current) return;
    
    if (e.touches.length === 1) {
      const deltaMove = {
        x: e.touches[0].clientX - previousMousePositionRef.current.x,
        y: e.touches[0].clientY - previousMousePositionRef.current.y
      };
      
      rotationRef.current.y += deltaMove.x * 0.01;
      rotationRef.current.x += deltaMove.y * 0.01;
      
      // Limit rotation on X axis
      rotationRef.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotationRef.current.x));
      
      // Rotate the entire scene pivot
      if (scenePivotRef.current) {
        scenePivotRef.current.rotation.y = rotationRef.current.y;
        scenePivotRef.current.rotation.x = rotationRef.current.x;
      }
      
      previousMousePositionRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
    }
  };

  const handleTouchEnd = () => {
    isRotatingRef.current = false;
  };

  // Set up the 3D scene
  useEffect(() => {
    if (!mountRef.current) return;
    
    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#f5f5f5');
    sceneRef.current = scene;
    
    // Create a pivot point for the entire scene
    const scenePivot = new THREE.Group();
    scene.add(scenePivot);
    scenePivotRef.current = scenePivot;
    
    // Create camera
    const aspectRatio = mountRef.current.clientWidth / mountRef.current.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, aspectRatio, 1, 2000);
    camera.position.set(0, 150, 400); // Position camera higher to see pot from slightly above
    cameraRef.current = camera;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(100, 200, 100);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
    backLight.position.set(-100, 100, -100);
    scene.add(backLight);
    
    // Add fill light from below for better detail visibility
    const fillLight = new THREE.DirectionalLight(0xffffcc, 0.3);
    fillLight.position.set(0, -100, 50);
    scene.add(fillLight);
    
    // Add grid for reference
    const gridHelper = new THREE.GridHelper(400, 40, 0x888888, 0xdddddd);
    scenePivot.add(gridHelper);
    gridHelper.position.y = -1; // Ensure grid is visibly below the pot
    
    // Create initial pot
    updatePot(potProfile);
    
    // Set initial rotation reference
    rotationRef.current = { x: 0, y: 0 };
    zoomLevelRef.current = 400;
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Auto-rotate scene if enabled
      if (autoRotateRef.current && scenePivotRef.current) {
        scenePivotRef.current.rotation.y += 0.01;
      }
      
      renderer.render(scene, camera);
    };
    animate();
    
    // Add event listeners for custom controls
    const canvas = renderer.domElement;
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('wheel', handleMouseWheel, { passive: false });
    
    // Touch events for mobile
    canvas.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    
    // Clean up on unmount
    return () => {
      renderer.dispose();
      if (potMeshRef.current) {
        potMeshRef.current.geometry.dispose();
        potMeshRef.current.material.dispose();
      }
      
      // Remove event listeners
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('wheel', handleMouseWheel);
      
      // Touch events
      canvas.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      
      rendererRef.current.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 rounded-lg">
      <h1 className="text-2xl font-bold mb-4">3D Ceramic Pot Generator</h1>
      
      <div className="w-full bg-white rounded-lg shadow-md mb-6">
        <div 
          ref={mountRef} 
          className="w-full h-96 rounded-lg"
          style={{ touchAction: 'none' }}
        />
      </div>
      
      <div className="w-full max-w-md">
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <h2 className="font-bold mb-2">Pot Specifications:</h2>
          <ul className="text-sm">
            <li>Height: {potProfile.height}mm</li>
            <li>Base Width: {potProfile.baseWidth}mm</li>
            <li>Max Width: {potProfile.maxWidth}mm</li>
            <li>Neck Width: {potProfile.neckWidth}mm</li>
            <li>Mouth Width: {potProfile.mouthWidth}mm</li>
            <li>Clay Color: {potProfile.clay}</li>
            <li>Surface Texture: {potProfile.texture}</li>
            <li>Style: {['Wide Belly Vase', 'Bowl Shape', 'Cylinder', 'Double-Belly Amphora', 'Bottle Shape', 'Flared Top Vase'][potProfile.potStyle || 0]}</li>
            {potProfile.hasDivot && <li>Features: Center Divot/Waist</li>}
          </ul>
        </div>
        
        <div className="flex flex-col space-y-2">
          <div className="flex space-x-2">
            <button
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={generateRandomPot}
            >
              Generate New Pot
            </button>
            
            <button
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => autoRotateRef.current = !autoRotateRef.current}
            >
              Toggle Tumble
            </button>
          </div>
          
          <div className="text-center text-sm text-gray-600 mt-2">
            Drag to rotate | Scroll to zoom | Shift+drag to pan
          </div>
        </div>
      </div>
    </div>
  );
};

export default CeramicPot3D;
