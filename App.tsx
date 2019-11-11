import React from "react";
import * as Font from 'expo-font';
import HomeScreen from "./screens/HomeScreen";

export default function App() {
  const [appLoaded, setAppLoaded] = React.useState(false);
  React.useEffect(() => {
    Font.loadAsync({
      "Roboto-Light": require("./assets/fonts/Roboto-Light.ttf"),
      "Roboto-Medium": require("./assets/fonts/Roboto-Medium.ttf"),
      "Roboto-Regular": require("./assets/fonts/Roboto-Regular.ttf"),
      "Roboto-Thin": require("./assets/fonts/Roboto-Thin.ttf")
    }).then(() => setAppLoaded(true));
  }, []);

  return appLoaded && <HomeScreen />;
}