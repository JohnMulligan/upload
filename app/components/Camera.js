import React, { useContext, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Slider,
  TouchableWithoutFeedback,
  Dimensions,
  SafeAreaView,
  ImageBackground,
} from "react-native";
import Button from "./Button";
import SmallButton from "./SmallButton";
import NavigationButton from "./NavigationButton";

import Modal from "./Modal";
import ModalButton from "./ModalButton";
import { RNCamera } from "react-native-camera";

import colors from "../config/colors";
import AuthContext from "../../api/auth/context";
import ItemContext from "../../api/auth/itemContext";
import * as SecureStore from "expo-secure-store";
import * as Crypto from "expo-crypto";
import RNFS from "react-native-fs";

const { width, height } = Dimensions.get("window");

const CameraPreview = ({
  fileUri,
  item,
  navigation,
  params,
  page,
  setPage,
  resetPhoto,
}: any) => {
  const [optionsModal, setOptionsModal] = useState(false);
  const [confirmButton, setConfirmButton] = useState(false);

  keepPicture = function (item, fileUri) {
    console.log(item);
    var data = new FormData();
    data.append(
      "data",
      `{"o:ingester": "upload", "file_index": 0, "o:item": {"o:id": ${item[0]}}, "dcterms:title": [{"type": "literal", "property_id": 1, "@value": "picture.jpg"}]}`
    );
    data.append("file[0]", {
      name: "placeholder.jpg",
      uri: fileUri,
      type: "image/jpg",
    });

    var config = {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
      body: data,
    };

    SecureStore.getItemAsync("host").then((host) => {
      SecureStore.getItemAsync("keys").then((keys) => {
        console.log(
          `http://${host}/api/media?key_identity=${
            keys.split(",")[0]
          }&key_credential=${keys.split(",")[1]}`
        );
        fetch(
          `http://${host}/api/media?key_identity=${
            keys.split(",")[0]
          }&key_credential=${keys.split(",")[1]}`,
          config
        )
          .then((res) => res.json())
          .then((data) => {
            console.log("fileUri", fileUri, page, data);
            RNFS.readFile(fileUri, "base64").then((string) => {
              Crypto.digestStringAsync(
                Crypto.CryptoDigestAlgorithm.SHA256,
                string
              ).then((digest) => console.log("Digest: ", digest));
            });
            if (params.type == 0) navigation.navigate("Confirm");
            else if (params.type == 1) {
              resetPhoto();
              setPage(page + 1);
              setConfirmButton(true);
            } else setOptionsModal(true);
          })

          .catch((err) => {
            console.log(err);
          });
      });
    });
  };

  const uploadSamePageMedia = () => {
    setOptionsModal(false);
    resetPhoto();
  };

  const uploadNextPageMedia = () => {
    setOptionsModal(false);
    resetPhoto();
    setPage(page + 1);
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: "transparent",
        flex: 1,
        width: "100%",
        height: "100%",
      }}
    >
      {confirmButton && (
        <NavigationButton
          style={{
            position: "absolute",
            bottom: 30,
            right: 30,
            zIndex: 40,
          }}
          direction="right"
          onPress={() => navigation.navigate("Confirm")}
        />
      )}

      {optionsModal && params.type == 2 ? (
        <Modal title="Media on page 1 added. Continue adding?">
          <View style={styles.children}>
            <ModalButton
              onPress={() => uploadSamePageMedia()}
              line={2}
              title={`ON CURRENT PAGE ${page}`}
            />
            <ModalButton
              onPress={() => uploadNextPageMedia()}
              line={2}
              title={`ON NEXT PAGE \>${page + 1}`}
            />
          </View>
          <ModalButton
            line={1}
            title={"SAVE & FINISH"}
            color={colors.light}
            onPress={() => navigation.navigate("Confirm")}
          />
        </Modal>
      ) : (
        <View
          style={{
            width: "100%",
            height: "8%",
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            zIndex: 2,
            justifyContent: "space-between",
            padding: 25,
            paddingTop: 10,
            flexDirection: "row",
            alignItems: "center",
            position: "absolute",
            bottom: 0,
          }}
        >
          <>
            <TouchableOpacity
              onPress={() => resetPhoto()}
              style={{ zIndex: 20, left: 0 }}
            >
              <Text style={{ zIndex: 20, color: colors.light }}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => keepPicture(item, fileUri)}
              style={{ zIndex: 20, left: 0 }}
            >
              <Text style={{ zIndex: 20, color: colors.light }}>Keep</Text>
            </TouchableOpacity>
          </>
        </View>
      )}

      <ImageBackground
        source={{ uri: fileUri }}
        style={{
          flex: 1,
          zIndex: 1,
        }}
      />
    </SafeAreaView>
  );
};

export default class CameraScreen extends React.Component {
  static contextType = ItemContext;

  componentDidMount() {
    const item = this.context;
    this.setState({ item: item["item"] });
    //item[1] holds other options (like user)
  }

  state = {
    flash: "off",
    zoom: 0,
    autoFocus: "on",
    autoFocusPoint: {
      normalized: { x: 0.5, y: 0.5 }, // normalized values required for autoFocusPointOfInterest
      drawRectPosition: {
        x: Dimensions.get("window").width * 0.5 - 32,
        y: Dimensions.get("window").height * 0.5 - 32,
      },
    },
    depth: 0,
    type: "back",
    whiteBalance: "auto",
    ratio: "16:9",
    item: null,
    optionsModal: false,
    cameraPreview: false,
    fileUri: null,
  };

  zoomOut() {
    this.setState({
      zoom: this.state.zoom - 0.1 < 0 ? 0 : this.state.zoom - 0.1,
    });
  }

  zoomIn() {
    this.setState({
      zoom: this.state.zoom + 0.1 > 1 ? 1 : this.state.zoom + 0.1,
    });
  }

  setFocusDepth(depth) {
    this.setState({
      depth,
    });
  }

  toggleFocus() {
    this.setState({
      autoFocus: this.state.autoFocus === "on" ? "off" : "on",
    });
  }

  touchToFocus(event) {
    const { pageX, pageY } = event.nativeEvent;
    const screenWidth = Dimensions.get("window").width;
    const screenHeight = Dimensions.get("window").height;
    const isPortrait = screenHeight > screenWidth;

    let x = pageX / screenWidth;
    let y = pageY / screenHeight;
    // Coordinate transform for portrait. See autoFocusPointOfInterest in docs for more info
    if (isPortrait) {
      x = pageY / screenHeight;
      y = -(pageX / screenWidth) + 1;
    }

    this.setState({
      autoFocusPoint: {
        normalized: { x, y },
        drawRectPosition: { x: pageX, y: pageY },
      },
    });
  }

  setFocusDepth(depth) {
    this.setState({
      depth,
    });
  }

  takePicture = async function () {
    if (this.camera) {
      const file = await this.camera.takePictureAsync();
      this.setState({ cameraPreview: true, fileUri: file.uri });
    }
  };

  renderCamera(item) {
    const drawFocusRingPosition = {
      top: this.state.autoFocusPoint.drawRectPosition.y - 32,
      left: this.state.autoFocusPoint.drawRectPosition.x - 32,
    };

    return (
      <RNCamera
        ref={(ref) => {
          this.camera = ref;
        }}
        style={{
          flex: 1,
          justifyContent: "space-between",
        }}
        type={this.state.type}
        flashMode={this.state.flash}
        autoFocus={this.state.autoFocus}
        autoFocusPointOfInterest={this.state.autoFocusPoint.normalized}
        zoom={this.state.zoom}
        whiteBalance={this.state.whiteBalance}
        ratio={this.state.ratio}
        focusDepth={this.state.depth}
        androidCameraPermissionOptions={{
          title: "Permission to use camera",
          message: "We need your permission to use your camera",
          buttonPositive: "Ok",
          buttonNegative: "Cancel",
        }}
      >
        <View style={StyleSheet.absoluteFill}>
          <View style={[styles.autoFocusBox, drawFocusRingPosition]} />
          <TouchableWithoutFeedback onPress={this.touchToFocus.bind(this)}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>
        </View>

        <View style={{ bottom: 0, position: "absolute" }}>
          <Slider
            style={{ width: 150, marginTop: 15, alignSelf: "flex-end" }}
            onValueChange={this.setFocusDepth.bind(this)}
            step={0.1}
            disabled={this.state.autoFocus === "on"}
          />
          {this.state.zoom !== 0 && (
            <Text style={[styles.flipText, styles.zoomText]}>
              Zoom: {this.state.zoom}
            </Text>
          )}

          {/* <TouchableOpacity
              style={[styles.flipButton, { flex: 0.1, alignSelf: "flex-end" }]}
              onPress={this.zoomIn.bind(this)}
            >
              <Text style={styles.flipText}> + </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.flipButton, { flex: 0.1, alignSelf: "flex-end" }]}
              onPress={this.zoomOut.bind(this)}
            >
              <Text style={styles.flipText}> - </Text>
            </TouchableOpacity> */}
          <SmallButton
            style={styles.af}
            title={"AF:" + this.state.autoFocus}
            onPress={this.toggleFocus.bind(this)}
          />
          <SmallButton
            style={styles.snap}
            title="snap"
            onPress={this.takePicture.bind(this)}
          />
          <NavigationButton
            style={{
              position: "absolute",
              bottom: 30,
              right: 30,
              zIndex: 40,
            }}
            direction="right"
            onPress={() => this.props.navigation.navigate("Confirm")}
          />
        </View>
      </RNCamera>
    );
  }

  render() {
    let item = this.context;
    return (
      <SafeAreaView style={styles.container}>
        {this.state.cameraPreview ? (
          <CameraPreview
            resetPhoto={() =>
              this.setState({ cameraPreview: false, fileUri: null })
            }
            navigation={this.props.navigation}
            params={this.props.params}
            page={this.props.page}
            setPage={this.props.setPage}
            item={this.state.item}
            fileUri={this.state.fileUri}
          />
        ) : (
          this.renderCamera(item)
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: "#000",
  },
  flipButton: {
    flex: 0.3,
    height: 40,
    marginHorizontal: 2,
    marginBottom: 10,
    marginTop: 10,
    borderRadius: 8,
    borderColor: "white",
    borderWidth: 1,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  autoFocusBox: {
    position: "absolute",
    height: 64,
    width: 64,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "white",
    opacity: 0.4,
  },
  flipText: {
    color: "white",
    fontSize: 15,
  },
  zoomText: {
    position: "absolute",
    bottom: 70,
    zIndex: 2,
    left: 2,
  },
  text: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 2,
    position: "absolute",
    borderColor: "#F00",
    justifyContent: "center",
  },
  textBlock: {
    color: "#F00",
    position: "absolute",
    textAlign: "center",
    backgroundColor: "transparent",
  },
  af: {
    left: 30,
  },
  snap: {
    left: width / 2 - 15,
    bottom: 30,
  },
  children: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});
