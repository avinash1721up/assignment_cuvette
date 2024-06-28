import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import Dashboard from "./src/components/Dashboard";

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Dashboard />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default App;
