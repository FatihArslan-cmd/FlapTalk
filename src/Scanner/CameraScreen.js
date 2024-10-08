import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { CameraView, Camera } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import CustomText from "../components/CustomText";
import AlertComponent from "../components/AlertComponent";

export default function CameraScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [facing, setFacing] = useState('back');
  const [zoom, setZoom] = useState(0); // Zoom state (between 0 and 1)
  const [torchEnabled, setTorchEnabled] = useState(false); // Torch state
  const [zoomText, setZoomText] = useState('0x'); // Zoom level text

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    try {
      // Check if the scanned data (username) exists in the database
      const usersSnapshot = await firestore()
        .collection("users")
        .where("username", "==", data)
        .get();
  
      if (!usersSnapshot.empty) {
        // If the user is found, add them as a friend
        const friendId = usersSnapshot.docs[0].id;
        const currentUser = auth().currentUser.uid;
  
        // Check if the friend is already added
        const friendsQuerySnapshot = await firestore()
          .collection("friends")
          .where("userId", "==", currentUser)
          .where("friendId", "==", friendId)
          .get();
  
        if (!friendsQuerySnapshot.empty) {
          setAlertTitle('Friend Exists');
          setAlertMessage('This user is already in your friend list.');
        } else {
          // Add friend to Firestore for the current user
          await firestore().collection("friends").add({
            userId: currentUser,
            friendId,
            avatar: usersSnapshot.docs[0].data().avatar || defaultAvatar,
            time: new Date().toISOString(),
          });
  
          // Add the current user as a friend for the other user
          await firestore().collection("friends").add({
            userId: friendId,
            friendId: currentUser,
            avatar: auth().currentUser.photoURL || defaultAvatar, // Assuming the current user's avatar is available here
            time: new Date().toISOString(),
          });
  
          setAlertTitle('Friend Added');
          setAlertMessage('This user has been added to your friend list.');
        }
      } else {
        setAlertTitle('User Not Found');
        setAlertMessage(`No user with username ${data} found.`);
      }
    } catch (error) {
      console.error("Error adding friend:", error);
      setAlertTitle('Error');
      setAlertMessage('An error occurred while trying to add the friend.');
    } finally {
      setAlertVisible(true);
    }
  };
  

  const handleAlertConfirm = () => {
    setAlertVisible(false);
    setScanned(false);
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const toggleTorch = () => {
    setTorchEnabled((prevState) => !prevState); // Toggle the torch state
  };

  const handleZoomIn = () => {
    setZoom((prevZoom) => {
      const newZoom = Math.min(prevZoom + 0.1, 1); // Increase zoom but limit to 1 (max zoom)
      setZoomText(`${(newZoom * 10).toFixed(1)}x`); // Update zoom level text
      return newZoom;
    });
  };

  const handleZoomOut = () => {
    setZoom((prevZoom) => {
      const newZoom = Math.max(prevZoom - 0.1, 0); // Decrease zoom but limit to 0 (min zoom)
      setZoomText(`${(newZoom * 10).toFixed(1)}x`); // Update zoom level text
      return newZoom;
    });
  };

  if (hasPermission === null) {
    return
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barCodeTypes: ["qr", "pdf417", "code128"],
        }}
        style={StyleSheet.absoluteFillObject}
        facing={facing}
        zoom={zoom} // Apply the zoom value
        enableTorch={torchEnabled} // Enable or disable torch based on state
      />
      <View style={styles.textContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={32} color="white" />
        </TouchableOpacity>
        <CustomText fontFamily={"pop"} style={styles.scanText}>Scan your friend's QR</CustomText>
        <TouchableOpacity onPress={toggleCameraFacing} style={styles.flipButton}>
          <Ionicons name="camera-reverse" size={32} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.zoomContainer}>
        <TouchableOpacity onPress={handleZoomOut} style={styles.zoomButton}>
          <Ionicons name="remove" size={32} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleZoomIn} style={styles.zoomButton}>
          <Ionicons name="add" size={32} color="white" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={toggleTorch} style={styles.torchButton}>
        <Ionicons name={torchEnabled ? "flash" : "flash-off"} size={32} color="white" />
      </TouchableOpacity>

      <View style={styles.zoomLevelContainer}>
        <Text style={styles.zoomText}>{zoomText} </Text>
      </View>

      <View style={styles.dashedContainer}>
        <View style={[styles.dash, styles.dashTopLeft]} />
        <View style={[styles.dash, styles.dashTopRight]} />
        <View style={[styles.dash, styles.dashBottomLeft]} />
        <View style={[styles.dash, styles.dashBottomRight]} />
      </View>
     
      <AlertComponent
        visible={alertVisible}
        onClose={() => setAlertVisible(false)}
        title={alertTitle}
        message={alertMessage}
        onConfirm={handleAlertConfirm}
        confirmText="OK"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    left: 20,
    top: 50,
  },
  flipButton: {
    position: "absolute",
    right: 20,
    top: 50,
  },
  scanText: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    width: "100%",
  },
  zoomContainer: {
    position: "absolute",
    bottom: 50,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  zoomButton: {
    marginHorizontal: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 25,
  },
  torchButton: {
    position: "absolute",
    right: 20,
    bottom: 50,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 25,
  },
  zoomLevelContainer: {
    position: "absolute",
    bottom: 110,
    left: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 5,
    borderRadius: 5,
  },
  zoomText: {
    fontSize: 20,
    color: "white",
  },
  textContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  text: {
    fontSize: 20,
    color: "white",
  },
  dashedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dash: {
    position: "absolute",
    borderColor: "white",
    borderWidth: 2,
    borderStyle: "dashed",
    width: 50,
    height: 50,
  },
  dashTopLeft: {
    top: "35%",
    left: "20%",
  },
  dashTopRight: {
    top: "35%",
    right: "20%",
  },
  dashBottomLeft: {
    bottom: "35%",
    left: "20%",
  },
  dashBottomRight: {
    bottom: "35%",
    right: "20%",
  },
});
