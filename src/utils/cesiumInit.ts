
import * as Cesium from 'cesium';

type CesiumParams = {
    viewer: Cesium.Viewer;
}

const cesiumInit = (dom: HTMLDivElement) => {
    const viewer = new Cesium.Viewer(dom, {
        useDefaultRenderLoop: false,
        selectionIndicator: false,
        homeButton: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        infoBox: false,
        navigationInstructionsInitiallyVisible: false,
        animation: false,
        timeline: false,
        fullscreenButton: false,
        contextOptions: {
            webgl: {
                alpha: false,
                antialias: true,
                preserveDrawingBuffer: true,
                failIfMajorPerformanceCaveat: false,
                depth: true,
                stencil: false,
            },
        },
        targetFrameRate: 60,
        orderIndependentTranslucency: true,
        baseLayerPicker: false,
        geocoder: false,
        automaticallyTrackDataSourceClocks: false,
        dataSources: undefined,
        terrainShadows: Cesium.ShadowMode.DISABLED,
        // imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
        //     url: "http://{s}.tianditu.gov.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0" +
        //         "&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
        //         "&style=default&format=tiles&tk=THIS_IS_YOUR_TOKEN",
        //     layer: "img_w",
        //     style: "default",
        //     format: "tiles",
        //     tileMatrixSetID: "GoogleMapsCompatible",
        //     subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
        //     minimumLevel: 0,
        //     maximumLevel: 18,
        // }),
    });
    // @ts-ignore
    viewer.cesiumWidget.creditContainer.style.display = 'none';
    viewer.scene.screenSpaceCameraController.enableCollisionDetection = false;

    return {
        viewer,
    } as CesiumParams;
}

export type { CesiumParams };

export default cesiumInit;