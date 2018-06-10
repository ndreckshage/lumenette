import { STELLAR_NETWORK } from "react-native-dotenv";

if (
  !STELLAR_NETWORK ||
  (STELLAR_NETWORK !== "DEV" && STELLAR_NETWORK !== "PROD")
) {
  throw new Error("stellar net unknown");
}

const stellarEndpint =
  STELLAR_NETWORK === "DEV"
    ? "https://horizon-testnet.stellar.org"
    : "https://horizon.stellar.org";

export default stellarEndpint;
