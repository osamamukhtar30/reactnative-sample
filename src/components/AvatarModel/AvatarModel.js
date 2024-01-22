import React, {useState, useEffect} from 'react';
import styled from 'styled-components/native';
// eslint-disable-next-line
import {useEngine, EngineView} from '@babylonjs/react-native';
import '@babylonjs/loaders/glTF';
import {
  SceneLoaderAnimationGroupLoadingMode,
  Color4,
  Scene,
  SceneLoader,
  UniversalCamera,
  Vector3,
  HemisphericLight,
} from '@babylonjs/core';
import {ActivityIndicator} from 'react-native-paper';
import {heightPercentageToDP, widthPercentageToDP} from 'react-native-responsive-screen';

const Container = styled.View`
  height: ${({height}) => height}px;
  width: ${({width}) => width}px;
  align-self: center;
  overflow: visible;
`;

const ActivityIndicatorContainer = styled.View`
  position: absolute;
  bottom: 0px;
  top: 15%;
  width: 10%;
  display: flex;
  justify-content: center;
  align-self: center;
  align-items: center;
`;

const AvatarModel = ({
  engine = null,
  width = widthPercentageToDP(100),
  height = heightPercentageToDP(42),
  modelUrl,
  modelAnimationUrl = 'https://qa-dubbz.com/idleBreathing.glb',
}) => {
  // WARNING: This model should not be rendered in Android API level > 29
  // TODO: Fix the issue https://github.com/BabylonJS/BabylonReactNative/issues/375
  // This can be fixed downgrading or fixing the underlying issue
  // Downgrade will need some manual fixes to dependencies that are not compatible with the old build tools

  const [camera, setCamera] = useState();
  const [modelLoaded, setModelLoaded] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  let modelsLoaded = false;
  let shouldDispose = false;
  let scene;

  const syncDispose = () => {
    if (scene) {
      scene.dispose();
    }
  };
  useEffect(() => {
    setTimeout(() => {
      setShouldRender(true);
    }, 1000);
  }, []);

  const asyncDispose = async () => {
    while (!modelsLoaded) {
      // Models are not loaded yet, sleep 2000
      await new Promise(resolve => setTimeout(() => resolve(), 2000));
    }
    // Models are loaded, dispose scene
    syncDispose();
  };

  useEffect(() => {
    (async () => {
      if (engine) {
        scene = new Scene(engine);
        scene.clearColor = new Color4(0, 0, 0, 0);

        let camera = new UniversalCamera('UniversalCamera', new Vector3(0, 0, 3.7), scene);
        camera.setTarget(Vector3.Zero());

        new HemisphericLight('HemisphericLight', new Vector3(0, 1, 0), scene);

        const loadModel = (modelUrl, modelAnimationUrl, success = () => {}) => {
          if (!shouldDispose) {
            SceneLoader.ImportMesh(null, modelUrl, '', scene, async (meshes, particleSystems, skeletons) => {
              width = 100;
              height = 150;
              meshes[0].position.x = 0;
              meshes[0].position.y = -1;
              if (!shouldDispose) {
                SceneLoader.ImportAnimations(
                  modelAnimationUrl,
                  '',
                  scene,
                  false,
                  SceneLoaderAnimationGroupLoadingMode.NoSync,
                  target => {
                    if (target) {
                      let idx = skeletons[0].getBoneIndexByName(target.name);
                      if (idx === -1) {
                        return skeletons[0].getChildren()[0];
                      }
                      return skeletons[0].bones[idx].getTransformNode();
                    } else {
                      return skeletons[0].getChildren()[0];
                    }
                  },
                  () => {
                    success();
                  },
                );
              } else {
                // Component unmount before loading animations
                success();
              }
            });
          } else {
            // Component unmount before loading models
            success();
          }
        };

        if (!modelLoaded && modelUrl) {
          loadModel(modelUrl, modelAnimationUrl, () => {
            modelsLoaded = true;
            setModelLoaded(true);
          });
        }
        setCamera(camera);
      }
    })();
    return () => {
      if (engine) {
        setCamera(null);
        setModelLoaded(false);
        if (modelsLoaded) {
          // Models are already loaded, we can dispose it
          syncDispose();
        } else {
          // Models are not loaded, we need to wait until they are loaded
          shouldDispose = true;
          asyncDispose();
        }
      }
    };
  }, [engine, width, height, modelAnimationUrl]);

  return (
    <Container height={height} width={width}>
      {shouldRender && <EngineView isTransparent={true} displayFrameRate={false} camera={camera} />}
      {!modelLoaded && (
        <ActivityIndicatorContainer>
          <ActivityIndicator animating={true} size={width / 25} />
        </ActivityIndicatorContainer>
      )}
    </Container>
  );
};

export default AvatarModel;
