import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  KeyboardAvoidingView,
} from "react-native";
import Card from "../components/Card";
import Header from "../components/Header";
import ItemScreen from "../components/ItemScreen";
import TextInput from "../components/TextInput";
import Text from "../components/Text";
import Icon from "../components/Icon";
import Modal from "../components/Modal";
import ModalButton from "../components/ModalButton";
import NavigationButton from "../components/NavigationButton";
import Button from "../components/Button";
import SmallButton from "../components/SmallButton";
import Screen from "../components/Screen";
import Camera from "../components/Camera";
import colors from "../config/colors";
import FormData from "form-data";
import * as SecureStore from "expo-secure-store";

import { fetchResourceTemplates, uploadMedia } from "../../api/utils/Omeka";
import * as axios from "axios";

import ItemContext from "../../api/auth/itemContext";

import AuthContext from "../../api/auth/context";

const { width, height } = Dimensions.get("window");

function UploadMedia({ navigation }) {
  const [cameraOn, setCameraOn] = useState(false);
  const [length, setLength] = useState(2);
  const [resourceTemplates, setResourceTemplates] = useState([]);
  const [options, setOptions] = useState([]);
  const [templateSelected, setTemplateSelected] = useState("");
  const [nextModal, setNextModal] = useState(false);
  const [modal, setModal] = useState(false);
  const { item, setItem } = useContext(ItemContext);
  const [startingPage, setStartingPage] = useState(1);
  const { user, setUser } = useContext(AuthContext);

  let templates = [];
  const fields = [
    {
      name: "",
      required: false,
      value: "",
      placeholder: "",
    },
  ];
  const [selectedValue, setSelectedValue] = useState("java");

  useEffect(() => {
    fetchResourceTemplates("158.101.99.206")
      .then((response) =>
        response.map((item) =>
          templates.push({ label: item["o:label"], value: item["o:label"] })
        )
      )
      .catch((error) => console.log(error));
  });

  useEffect;
  const loadFields = (value, idx) => {
    console.log(value, idx);
  };

  const skip = () => {
    setNextModal(true);
  };

  const confirm = () => {
    setNextModal(false);
    setModal(true);
  };

  return cameraOn ? (
    <Camera />
  ) : (
    <ItemScreen
      style={{ flex: 1 }}
      exit={() => navigation.navigate("Quick Start")}
    >
      <Header title="Upload Media" />
      <View style={styles.body}>
        <View style={styles.bodyheader}>
          <Text>{item[0]} | page #</Text>
          <Image
            source={require("../config/Icons/information.png")}
            style={{ width: 20, height: 20 }}
          />
        </View>
        <View style={styles.image}>
          <Text weight="light">no media selected</Text>
          <Image
            source={require("../config/Icons/SClogo.png")}
            style={{ height: 75, resizeMode: "contain" }}
          />
        </View>
        <View style={{ alignItems: "center" }}>
          <Button onPress={() => setCameraOn(true)} title="TAKE PHOTO" />
          {/* <Button title="UPLOAD FROM CAMERA ROLL" /> */}
        </View>
      </View>
      {nextModal && (
        <>
          <Modal title="Are you sure you don't want to add any media?">
            <View style={styles.children}>
              <ModalButton
                onPress={() => confirm()}
                line={2}
                title="YES, MOVE ON"
              />
              <ModalButton
                onPress={() => setNextModal(false)}
                color={colors.light}
                line={2}
                title="NO, GO BACK"
              />
            </View>
          </Modal>
          <View style={styles.shadow} />
        </>
      )}
      <NavigationButton
        onPress={() => navigation.goBack()}
        label="Back"
        direction="left"
        style={styles.back}
      />
      <NavigationButton
        onPress={() => skip()}
        label="Done"
        direction="right"
        style={styles.next}
      />
    </ItemScreen>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  bodyheader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  image: {
    height: 0.5 * height,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    margin: 20,
  },
  button: {
    alignSelf: "flex-end",
    alignItems: "center",
    margin: 10,
    zIndex: 10,
  },
  body: {
    backgroundColor: colors.blue,
    height: "100%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
  },
  icon: {
    position: "absolute",
    zIndex: 5,
  },
  picker: {
    borderRadius: 10,
    borderWidth: 2,
    padding: 5,
    height: 40,
    paddingHorizontal: 10,
    borderColor: colors.primary,
    justifyContent: "center",
    marginBottom: 5,
  },
  children: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  shadow: {
    position: "absolute",
    top: 0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    width: width,
    height: height,
    backgroundColor: colors.gray,
    zIndex: 5,
  },
  navigation: {
    position: "absolute",
    bottom: 30,
    justifyContent: "flex-end",
    alignItems: "center",
    width: width,
    height: 0.2 * height,
  },
  setpage: {
    width: width - 50,
    marginBottom: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  remove: {
    width: width - 180,
  },
  back: {
    position: "absolute",
    bottom: 30,
    left: 30,
  },
  next: {
    position: "absolute",
    bottom: 30,
    right: 30,
  },
});
export default UploadMedia;

// cameraOn ? (
//      <View/>
//   ) : capturedImage ? (
//     <ItemScreen
//       style={{ flex: 1, backgroundColor: colors.blue }}
//       exit={() => navigation.navigate("Quick Start")}
//     >
//       <View
//         style={{
//           alignItems: "center",
//           width: "100%",
//           height: "100%",
//         }}
//       >
//         <View style={{ width: "95%", height: 0.7 * height, marginTop: 50 }}>
//           <Image
//             source={{ uri: capturedImage && capturedImage.uri }}
//             style={{ width: "100%", height: "100%" }}
//           />
//         </View>
//       </View>
//       <View style={styles.navigation}>
//         <View style={styles.setpage}>
//           <Text>Set starting page number</Text>
//           <View style={{ flexDirection: "row", alignItems: "center" }}>
//             <SmallButton
//               onPress={() => {
//                 if (startingPage > 1) {
//                   setStartingPage(startingPage - 1);
//                 }
//               }}
//               title="-"
//             />
//             <TextInput
//               value={startingPage.toString()}
//               style={{ width: 70, marginHorizontal: 3 }}
//             />
//             <SmallButton
//               onPress={() => setStartingPage(startingPage + 1)}
//               title="+"
//             />
//           </View>
//         </View>
//         <View
//           style={{
//             width: width - 50,
//             justifyContent: "space-between",
//             alignItems: "flex-end",
//             flexDirection: "row",
//           }}
//         >
//           <NavigationButton
//             onPress={() => navigation.goBack()}
//             label="Back"
//             direction="left"
//           />
//           <Button
//             style={styles.remove}
//             onPress={() => setCapturedImage(null)}
//             title="REMOVE"
//           />
//           <NavigationButton
//             onPress={() => ssssavePicture()}
//             label="Done"
//             direction="right"
//           />
//         </View>
//       </View>
//     </ItemScreen>
//   ) : (
//     <ItemScreen
//       style={{ flex: 1 }}
//       exit={() => navigation.navigate("Quick Start")}
//     >
//       <Header title="Upload Media" />
//       <View style={styles.body}>
//         {hasPermission ? (
//           <>
//             <View style={styles.bodyheader}>
//               <Text>{item} | page #</Text>
//               <Image
//                 source={require("../config/Icons/information.png")}
//                 style={{ width: 20, height: 20 }}
//               />
//             </View>
//             <>
//               <View style={styles.image}>
//                 <Text weight="light">no media selected</Text>
//                 <Image
//                   source={require("../config/Icons/SClogo.png")}
//                   style={{ height: 75, resizeMode: "contain" }}
//                 />
//               </View>
//               <View style={{ alignItems: "center" }}>
//                 <Button onPress={() => setCameraOn(true)} title="TAKE PHOTO" />
//                 <Button title="UPLOAD FROM CAMERA ROLL" />
//               </View>
//             </>
//           </>
//         ) : (
//           <View>
//             <Text>No access to camera</Text>
//           </View>
//         )}
//       </View>
//       {nextModal && (
//         <>
//           <Modal title="Are you sure you don't want to add any media?">
//             <View style={styles.children}>
//               <ModalButton
//                 onPress={() => confirm()}
//                 line={2}
//                 title="YES, MOVE ON"
//               />
//               <ModalButton
//                 onPress={() => setNextModal(false)}
//                 color={colors.light}
//                 line={2}
//                 title="NO, GO BACK"
//               />
//             </View>
//           </Modal>
//           <View style={styles.shadow} />
//         </>
//       )}
//       <NavigationButton
//         onPress={() => navigation.goBack()}
//         label="Back"
//         direction="left"
//         style={styles.back}
//       />
//       <NavigationButton
//         onPress={() => skip()}
//         label="Done"
//         direction="right"
//         style={styles.next}
//       />
//     </ItemScreen>
//   );
