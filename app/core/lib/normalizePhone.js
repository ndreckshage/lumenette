import phone from "phone";
import DeviceInfo from "react-native-device-info";

const countryCode = DeviceInfo.getDeviceCountry();

export default _phoneNumber => {
  const phoneNumber = _phoneNumber.trim();
  const intl = phoneNumber.startsWith("+");
  return intl ? phone(phoneNumber)[0] : phone(phoneNumber, countryCode)[0];
};
