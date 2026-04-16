import { Dimensions, StyleSheet, Text, TouchableOpacity } from "react-native";

const screen = Dimensions.get("window");
const buttonSize = screen.width / 5;

const Button = ({ onPress, text }) => (
  <TouchableOpacity onPress={onPress} style={styles.button}>
    <Text style={styles.text}>{text}</Text>
  </TouchableOpacity>
);

export default Button;

const styles = StyleSheet.create({
  text: {
    color: "#2D3142",
    fontSize: 25,
  },
  button: {
    backgroundColor: "#f7f9fc",
    flex: 1,
    height: buttonSize,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.5,
    borderColor: "black",
  },
});
