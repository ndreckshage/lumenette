import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import theme from "app/lib/theme";

const ContactCard = props => (
  <View style={styles.contactRow}>
    <View style={styles.contactItemCircle}>
      {props.displayType === "lumen" ||
      props.type === "lumen" ||
      props.type === "federation" ? (
        <Image
          style={styles.smallRocket}
          source={require("app/assets/images/lumen-rocket.png")}
        />
      ) : (
        <Text
          style={[
            styles.contactItemCircleText,
            props.type === "email" && styles.contactItemCircleTextEmail
          ]}
        >
          {props.type === "phone" ? "SMS" : "@"}
        </Text>
      )}
    </View>
    <View style={styles.contactContentContain}>
      <Text style={styles.contactNameText}>{props.name}</Text>
      <Text style={styles.contactLabelText}>
        {props.label ? `${props.label}: ` : ""}
        {props.displayValue}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  contactRow: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center"
  },
  contactItemCircle: {
    borderColor: theme.colorDarkBlue,
    borderWidth: 1,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10
  },
  contactItemCircleText: {
    color: theme.colorDarkBlue,
    fontFamily: theme.fontRegular,
    fontSize: 13
  },
  contactItemCircleTextEmail: {
    fontSize: 18,
    marginTop: -2
  },
  contactNameText: {
    fontFamily: theme.fontBodyMedium,
    color: theme.colorDarkBlue,
    fontSize: 18
  },
  contactLabelText: {
    fontFamily: theme.fontBodyRegular,
    color: theme.colorBodyCopy,
    marginTop: -2
    // lineHeight: 16
  },
  smallRocket: {
    width: 19,
    height: 24
  },
  contactContentContain: {
    flex: 1,
    marginRight: 10
  }
});

export default ContactCard;
