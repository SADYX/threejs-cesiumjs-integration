import * as Cesium from 'cesium';
import * as THREE from 'three';

const deg2rad = (deg: number) => (deg * Math.PI) / 180;

const rad2deg = (rad: number) => (rad * 180) / Math.PI;

// Get the quaternion of the rotation required for the 3D model 
// to fit the ground at the specified latitude and longitude
const getThreeModelQuaternion = (
    longitude: number,
    latitude: number,
    degree: number = 0,
) => {
    const m4 = Cesium.Transforms.eastNorthUpToFixedFrame(
        Cesium.Cartesian3.fromDegrees(longitude, latitude),
    );
    const m3 = Cesium.Matrix4.getMatrix3(m4, new Cesium.Matrix3());
    const q = Cesium.Quaternion.fromRotationMatrix(m3, new Cesium.Quaternion());
    const qx = Cesium.Quaternion.fromRotationMatrix(
        new Cesium.Matrix3(
            1, 0, 0,
            0, 0, -1,
            0, 1, 0
        ),
        new Cesium.Quaternion(),
    );
    const qz = Cesium.Quaternion.fromRotationMatrix(
        new Cesium.Matrix3(
            0, 1, 0,
            -1, 0, 0,
            0, 0, 1
        ),
        new Cesium.Quaternion(),
    );
    const angle_r = deg2rad(degree);
    const qy = Cesium.Quaternion.fromRotationMatrix(
        new Cesium.Matrix3(
            Math.cos(angle_r), 0, -Math.sin(angle_r),
            0, 1, 0,
            Math.sin(angle_r), 0, Math.cos(angle_r)
        ),
        new Cesium.Quaternion(),
    );
    const _q1 = Cesium.Quaternion.multiply(q, qz, new Cesium.Quaternion());
    const _q2 = Cesium.Quaternion.multiply(_q1, qx, new Cesium.Quaternion());
    const _q3 = Cesium.Quaternion.multiply(_q2, qy, new Cesium.Quaternion());

    return [_q3.x, _q3.y, _q3.z, _q3.w] as [number, number, number, number];
}

// look the target object
const flyMeToTheMoon = (viewer: Cesium.Viewer, obj: THREE.Object3D) => {
    const v = new THREE.Vector3();
    obj.getWorldPosition(v);
    const sphere = new THREE.Box3().expandByObject(obj).getBoundingSphere(new THREE.Sphere());
    viewer.camera.flyToBoundingSphere(
        new Cesium.BoundingSphere(new Cesium.Cartesian3(v.x, v.y, v.z), sphere.radius),
        {
            offset: new Cesium.HeadingPitchRange(
                Cesium.Math.toRadians(60),
                Cesium.Math.toRadians(-60),
                0
            )
        }
    );
}

export {
    deg2rad,
    rad2deg,
    getThreeModelQuaternion,
    flyMeToTheMoon,
}