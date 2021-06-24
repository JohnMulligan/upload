import React, { useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Slider,
  TouchableWithoutFeedback,
  Dimensions,
  SafeAreaView,
} from "react-native";
import Button from "../components/Button";
import SmallButton from "../components/SmallButton";

import { RNCamera } from "react-native-camera";

import AuthContext from "../../api/auth/context";
import ItemContext from "../../api/auth/itemContext";
import * as SecureStore from "expo-secure-store";

const { width, height } = Dimensions.get("window");

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

      var data = new FormData();
      data.append(
        "data",
        `{"o:ingester": "upload", "file_index": 0, "o:item": {"o:id": ${this.state.item[0]}}, "dcterms:title": [{"type": "literal", "property_id": 1, "@value": "picture.jpg"}]}`
      );
      data.append("file[0]", {
        name: "placeholder.jpg",
        uri: file.uri,
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

      SecureStore.getItemAsync(this.state.item[1][1]).then((res) => {
        fetch(
          `http://${this.state.item[1][0]}/api/media?key_identity=${this.state.item[1][1]}&key_credential=${res}`,
          config
        )
          .then((responseData) => {
            console.log(JSON.stringify(responseData));
          })
          .catch((err) => {
            console.log(err);
          });
      });
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
            title={"AF:" + this.state.autoFocus}
            onPress={this.toggleFocus.bind(this)}
          />
          <Button title="snap" onPress={this.takePicture.bind(this)} />
        </View>
      </RNCamera>
    );
  }

  render() {
    let item = this.context;
    return (
      <SafeAreaView style={styles.container}>
        {this.renderCamera(item)}
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
  picButton: {
    backgroundColor: "darkseagreen",
  },
  facesContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
  },
  face: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 2,
    position: "absolute",
    borderColor: "#FFD700",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  faceText: {
    color: "#FFD700",
    fontWeight: "bold",
    textAlign: "center",
    margin: 10,
    backgroundColor: "transparent",
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
    top: 30,
    left: 30,
  },
  snap: {
    position: "absolute",
    bottom: 50,
  },
});
