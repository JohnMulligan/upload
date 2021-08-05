import React, { useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Slider,
  TouchableWithoutFeedback,
  Dimensions,
  SafeAreaView,
  Platform,
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
import RNFS from "react-native-fs";

const { width, height } = Dimensions.get("window");

var images = [];
var uploading = false;
var uploadpercentage = 0;
var uploadnum = 0;
var uploadidx = -1;

const checkUploading = function () {
  console.log("tick");
  if (!uploading) {
    images.map((image, idx) => {
      if (image["progress"] == 0 && !uploading) {
        uploading = true;
        uploadidx = idx;
        uploadImage(
          image["item"],
          image["uri"],
          image["files"],
          image["page"],
          idx
        );
        return [uploadpercentage, uploadnum];
      } else {
        return ["DONE", uploadnum];
      }
    });
  }
  return [uploadpercentage, uploadnum];
};

const uploadImage = (item, fileUri, files, page, idx) => {
  const uploadBegin = (response) => {
    var jobId = response.jobId;
    console.log("UPLOAD HAS BEGUN! JobId: " + jobId);
    uploadnum = jobId;
  };

  const uploadProgress = (response) => {
    var percentage = Math.floor(
      (response.totalBytesSent / response.totalBytesExpectedToSend) * 100
    );
    console.log("UPLOAD IS " + percentage + "% DONE!");
    images[idx]["progress"] = percentage;
    uploadpercentage = percentage;
  };

  SecureStore.getItemAsync("host").then((host) => {
    SecureStore.getItemAsync("keys").then((keys) => {
      RNFS.uploadFiles({
        toUrl: `http://${host}/api/media?key_identity=${
          keys.split(",")[0]
        }&key_credential=${keys.split(",")[1]}`,
        files: files,
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        fields: {
          data: `{
              "o:ingester": "upload", 
              "file_index": 0, 
              "o:item": {"o:id": ${item} }, 
              "bibo:number": [
                {
                  "type": "literal", 
                  "property_id": 108,
                  "@value": "${page}"
                }
              ]
            }`,
        },
        begin: uploadBegin,
        progress: uploadProgress,
      })
        .promise.then((response) => {
          if (response.statusCode == 200) {
            jsonresponse = JSON.parse(response.body);
            RNFS.hash(fileUri, "sha256")
              .then((rnhash) => {
                if (jsonresponse["o:sha256"] == rnhash) {
                  console.log("SHA VERIFIED");
                  uploading = false;
                }
              })
              .catch((error) => console.log("error", error));
          } else {
            console.log("SERVER ERROR", response);
          }
        })
        .catch((error) => console.log("error", error));
    });
  });
};

const CameraPreview = ({
  fileUri,
  item,
  navigation,
  params,
  page,
  setPage,
  type,
  resetPhoto,
}: any) => {
  const [optionsModal, setOptionsModal] = useState(false);
  const [confirmButton, setConfirmButton] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState([]);
  const [uploadTracker, setUploadTracker] = useState(false);
  const [pageNumberModal, setPageNumberModal] = useState(false);

  keepPicture = function (item, fileUri) {
    setOptionsModal(true);
    if (!item) item = params.testItem;
    var files = [
      {
        name: "file[0]",
        filename: fileUri.split("/")[fileUri.split("/").length - 1],
        filepath:
          Platform.OS === "ios" ? fileUri.replace("file://", "") : fileUri,
        filetype: "image/jpeg",
      },
    ];
    images.push({
      item: item,
      uri: fileUri,
      files: files,
      progress: 0,
      page: page,
    });
    if (params.type == 1) {
      setPage(page + 1);
      resetPhoto();
    } else if (params.type == 2) {
      setOptionsModal(true);
    } else {
      navigation.navigate("Confirm", { params: { numPages: images.length } });
    }
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
          onPress={() =>
            navigation.navigate("Confirm", {
              params: { numPages: images.length },
            })
          }
        />
      )}

      {optionsModal ? (
        <Modal
          style={{ zIndex: 200 }}
          title={`Media on page ${page} added. Continue adding?`}
        >
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
            onPress={() => {
              setOptionsModal(false);
              resetPhoto();
              navigation.navigate("Confirm", {
                params: { numPages: images.length },
              });
            }}
          />
        </Modal>
      ) : (
        <>
          {pageNumberModal ? (
            <Modal style={{ zIndex: 100 }} title={`Set page number`}>
              <View style={styles.children}>
                <ModalButton
                  onPress={() => setPage(page - 1)}
                  line={3}
                  title={`-`}
                />
                <ModalButton line={3} title={page} />
                <ModalButton
                  onPress={() => setPage(page + 1)}
                  line={3}
                  title={`+`}
                />
              </View>
              <View style={styles.children}>
                <ModalButton
                  line={2}
                  title={"SAVE"}
                  color={colors.light}
                  onPress={() => setPageNumberModal(false)}
                />
                <ModalButton
                  line={2}
                  title={"CANCEL"}
                  color={colors.light}
                  onPress={() => setPageNumberModal(false)}
                />
              </View>
            </Modal>
          ) : null}
          <View
            style={{
              width: "100%",
              height: "8%",
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
            <SmallButton
              onPress={() => resetPhoto()}
              style={{ backgroundColor: colors.primary }}
              textStyle={{ color: colors.light }}
              title="retake"
            />
            {/* <Text style={{ color: "white" }}>Uploaded {uploadProgress}%</Text> */}
            <View style={{ flexDirection: "row" }}>
              <SmallButton
                activeOpacity={params.type == 2 ? 0 : 1}
                // onPress={params.type == 2 ? () => setPageNumberModal(true) : null}
                onPress={() => setPageNumberModal(true)}
                title={"PAGE " + page}
                style={{
                  paddingRight: 50,
                  backgroundColor: colors.light,
                  alignItems: "flex-start",
                }}
              />
              <SmallButton
                onPress={() => keepPicture(item, fileUri)}
                style={{
                  position: "absolute",
                  right: 0,
                  backgroundColor: colors.primary,
                  width: 50,
                }}
                textStyle={{ color: colors.light }}
                title="keep"
              />
            </View>
          </View>
        </>
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
    console.log(item);
    if (item) this.setState({ item: item["item"][0] });
    //item[1] holds other options (like user, booleans, etc.)
    this.setState({ page: this.props.page });

    this.checkUploading = setInterval(() => {
      this.setState({ upload: checkUploading() });
    }, 5000);

    // this.checkError = setInterval(() => {
    //   checkError();
    // }, 10000);
  }

  componentWillUnMount() {
    clearInterval(this.interval);
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
    pageNumberModal: false,
    upload: [],
  };

  touchToFocus(event) {
    const { pageX, pageY } = event.nativeEvent;
    const screenWidth = Dimensions.get("window").width;
    const screenHeight = Dimensions.get("window").height;
    const isPortrait = screenHeight > screenWidth;
  }

  takePicture = async function () {
    if (this.camera) {
      const file = await this.camera.takePictureAsync();
      console.log("photo path", file);

      this.setState({ cameraPreview: true, fileUri: file.uri });
    }
  };

  assignPageNumber = function () {
    this.setState({ pageNumberModal: true });
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
        // flashMode={this.state.flash}
        // autoFocus={this.state.autoFocus}
        // autoFocusPointOfInterest={this.state.autoFocusPoint.normalized}
        // zoom={this.state.zoom}
        // whiteBalance={this.state.whiteBalance}
        // ratio={this.state.ratio}
        // focusDepth={this.state.depth}
        androidCameraPermissionOptions={{
          title: "Permission to use camera",
          message: "We need your permission to use your camera",
          buttonPositive: "Ok",
          buttonNegative: "Cancel",
        }}
        captureAudio={false}
      >
        <SmallButton
          style={styles.snap}
          onPress={this.takePicture.bind(this)}
        />
        {this.props.params.type == 2 ? (
          <SmallButton
            title={"PAGE " + this.state.page}
            style={styles.page}
            onPress={() => this.assignPageNumber()}
          />
        ) : (
          <SmallButton
            activeOpacity={1}
            title={"PAGE " + this.state.page}
            style={styles.page}
          />
        )}
        {this.state.pageNumberModal ? (
          <Modal title={`Set page number`}>
            <View style={styles.children}>
              <ModalButton
                onPress={() => this.setState({ page: this.state.page - 1 })}
                line={3}
                title={`-`}
              />
              <ModalButton line={3} title={this.state.page} />
              <ModalButton
                onPress={() => this.setState({ page: this.state.page + 1 })}
                line={3}
                title={`+`}
              />
            </View>
            <View style={styles.children}>
              <ModalButton
                line={2}
                title={"SAVE"}
                color={colors.light}
                onPress={() => this.setState({ pageNumberModal: false })}
              />
              <ModalButton
                line={2}
                title={"CANCEL"}
                color={colors.light}
                onPress={() => this.setState({ pageNumberModal: false })}
              />
            </View>
          </Modal>
        ) : null}
        {uploadnum != 0 && (
          <View
            style={{
              position: "absolute",
              top: 100,
              left: 0.05 * width,
              backgroundColor: "rgba(134, 157, 156, 0.5)",
              borderRadius: 20,
              alignItems: "center",
              marginTop: 10,
              padding: 15,
              width: 0.9 * width,
              zIndex: 100,
            }}
          >
            {uploadpercentage == 100 && (
              <Text>Upload {this.state.upload[1]} finished</Text>
            )}
            <Text>
              Uploading image {this.state.upload[1]}... {this.state.upload[0]}%
              done...
            </Text>
          </View>
        )}
        <NavigationButton
          style={{
            position: "absolute",
            bottom: 30,
            right: 30,
            zIndex: 40,
          }}
          direction="right"
          onPress={() =>
            this.props.navigation.navigate("Confirm", {
              params: { numPages: images.length },
            })
          }
        />
        <NavigationButton
          style={styles.back}
          onPress={() => this.props.navigation.goBack()}
          label="Back"
          direction="left"
        />
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
              this.setState({
                cameraPreview: false,
                fileUri: null,
                pageNumberModal: false,
              })
            }
            navigation={this.props.navigation}
            params={this.props.params}
            page={this.state.page}
            setPage={() => this.setState({ page: this.state.page + 1 })}
            item={this.state.item}
            fileUri={this.state.fileUri}
            assignPageNumber={this.state.pageNumberModal}
            setPageNumberModal={(bool) =>
              this.setState({ pageNumberModal: bool })
            }
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
    zIndex: 100,
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
  snap: {
    left: width / 2 - 25,
    borderRadius: 25,
    borderWidth: 5,
    width: 50,
    height: 50,
    position: "absolute",
    bottom: 30,
  },
  page: {
    position: "absolute",
    bottom: 40,
    left: width / 2 + 40,
    zIndex: 50,
  },
  children: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  back: {
    position: "absolute",
    bottom: 30,
    left: 30,
  },
});
