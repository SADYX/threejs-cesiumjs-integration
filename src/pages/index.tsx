import { useCallback, useEffect, useRef, useState } from 'react';
import threeInit, { ThreeParams } from '@/src/utils/threeInit';
import cesiumInit, { CesiumParams } from '@/src/utils/cesiumInit';
import styles from './index.module.sass';
import * as Cesium from 'cesium';
import * as THREE from 'three';
import { flyMeToTheMoon, getThreeModelQuaternion } from '../utils/3d';

type Twins = {
	three: ThreeParams;
	cesium: CesiumParams;
}

const Home = () => {
	const cesiumRef = useRef<HTMLDivElement>(null);
	const threeRef = useRef<HTMLDivElement>(null);
	const [twins, setTwins] = useState<Twins>();
	const lastSelectedMesh = useRef<THREE.Mesh>();

	// init scenes & add events
	useEffect(() => {
		const threeDom = threeRef.current;
		const cesiumDom = cesiumRef.current;
		if (!threeDom || !cesiumDom) return;
		const three = threeInit(threeDom);
		const cesium = cesiumInit(cesiumDom);
		let idAnimateFrame = 0;

		const {
			camera: threeCamera,
			renderer: threeRenderer,
			scene: threeScene,
		} = three;

		const { viewer: cesiumViewer } = cesium;

		const resize = () => {
			const {
				clientWidth: width,
				clientHeight: height,
			} = threeDom;
			threeCamera.aspect = width / height;
			threeCamera.updateProjectionMatrix();
			threeRenderer.setSize(width, height);
		}

		const render = () => {
			// cesium render
			cesiumViewer.render();
			// three render
			//@ts-ignore
			threeCamera.fov = Cesium.Math.toDegrees(cesiumViewer.camera.frustum.fovy);
			threeCamera.updateProjectionMatrix();
			threeCamera.matrixAutoUpdate = false;
			threeCamera.matrixWorldNeedsUpdate = false;

			const cvm = cesiumViewer.camera.viewMatrix;
			const civm = cesiumViewer.camera.inverseViewMatrix;

			threeCamera.matrixWorld.set(
				civm[0], civm[4], civm[8], civm[12],
				civm[1], civm[5], civm[9], civm[13],
				civm[2], civm[6], civm[10], civm[14],
				civm[3], civm[7], civm[11], civm[15],
			);

			threeCamera.matrixWorldInverse.set(
				cvm[0], cvm[4], cvm[8], cvm[12],
				cvm[1], cvm[5], cvm[9], cvm[13],
				cvm[2], cvm[6], cvm[10], cvm[14],
				cvm[3], cvm[7], cvm[11], cvm[15],
			);
			threeRenderer.render(threeScene, threeCamera);
		}

		const animate = () => {
			idAnimateFrame = requestAnimationFrame(animate);
			render();
		}

		const onMouseMove = (evt: MouseEvent) => {
			const pointer = new THREE.Vector2();
			const rect = cesiumDom.getBoundingClientRect();
			pointer.x = ((evt.clientX - rect.left) / rect.width) * 2 - 1;
			pointer.y = -((evt.clientY - rect.top) / rect.height) * 2 + 1;
			const raycaster = new THREE.Raycaster();
			raycaster.setFromCamera(pointer, threeCamera);
			const intersects = raycaster.intersectObjects(threeScene.children, true);
			const found = intersects
				.find(({ object }) => object.type === 'Mesh')?.object as THREE.Mesh | undefined;

			if (found) {
				if (found.uuid !== lastSelectedMesh.current?.uuid) {
					lastSelectedMesh.current
						&& (lastSelectedMesh.current.material = new THREE.MeshPhongMaterial({ color: 0xff0000 }));
					found.material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
					lastSelectedMesh.current = found;
				}
			}
			else {
				if (lastSelectedMesh.current) {
					lastSelectedMesh.current.material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
					lastSelectedMesh.current = undefined;
				}
			}
		}

		setTwins({ three, cesium });
		resize();
		animate();
		window.addEventListener('resize', resize);
		cesiumDom.addEventListener('mousemove', onMouseMove);

		return () => {
			window.removeEventListener('resize', resize);
			cesiumDom.removeEventListener('mousemove', onMouseMove);
			cancelAnimationFrame(idAnimateFrame);
		}
	}, []);

	// add meshes
	useEffect(() => {
		if (!twins) return;

		// add cube
		const cubeGeo = new THREE.BoxGeometry(6, 6, 6);
		cubeGeo.translate(0, 3, 0);
		const cube = new THREE.Mesh(
			cubeGeo,
			new THREE.MeshPhongMaterial({ color: 0xff0000 }),
		);
		cube.name = 'cube';
		//@ts-ignore
		cube.position.copy(Cesium.Cartesian3.fromDegrees(120, 30));
		cube.setRotationFromQuaternion(
			new THREE.Quaternion(...getThreeModelQuaternion(120, 30))
		);
		twins.three.scene.add(cube);

		// add sphere
		const sphereGeo = new THREE.SphereGeometry(100, 32, 32);
		sphereGeo.translate(0, 100, 0);
		const sphere = new THREE.Mesh(
			sphereGeo,
			new THREE.MeshPhongMaterial({ color: 0xff0000 }),
		);
		sphere.name = 'sphere';
		//@ts-ignore
		sphere.position.copy(Cesium.Cartesian3.fromDegrees(120.002, 30));
		sphere.setRotationFromQuaternion(
			new THREE.Quaternion(...getThreeModelQuaternion(120.002, 30))
		);
		twins.three.scene.add(sphere);

		twins.cesium.viewer.camera.setView({
			destination: Cesium.Cartesian3.fromDegrees(120, 30, 100),
		});

		return () => {
			twins.three.scene.remove(cube, sphere);
		}
	}, [twins]);

	const flyTo = useCallback((objectName: string) => {
		if (!twins) return;
		const target = twins.three.scene.children.find(({ name }) => name === objectName);
		if (!target) return;
		flyMeToTheMoon(twins.cesium.viewer, target);
	}, [twins]);


	return (<>
		<div className={styles.container}>
			<div
				ref={cesiumRef}
				className={styles.cesium}
			/>
			<div
				ref={threeRef}
				className={styles.three}
			/>
			<div className={styles.btns}>
				<div onClick={() => flyTo('cube')}>
					Fly to cube
				</div>
				<div onClick={() => flyTo('sphere')}>
					Fly to sphere
				</div>
			</div>
		</div>
	</>)
}

export default Home;