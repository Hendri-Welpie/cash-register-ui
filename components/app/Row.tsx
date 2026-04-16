import React, { PropsWithChildren } from "react";
import { View } from "react-native";

const Row = ({ children }: PropsWithChildren) => (
  <View style={{ flexDirection: "row", width: "100%" }}>{children}</View>
);

export default Row;
