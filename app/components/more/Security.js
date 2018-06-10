import React from 'react';
import TextSlide from './TextSlide';
import {Text, Linking} from 'react-native';

const Security = () => (
  <TextSlide
    title="Security"
    paragraphs={[
      <Text key="1">
        Lumenette aims to keep you safe. We encourage users to use Touch ID, or
        to encrypt their keys with a PIN from settings. However, the safest form
        of wallet is a hardware wallet, like the{' '}
        <Text
          style={{textDecorationLine: 'underline'}}
          onPress={() => {
            Linking.openURL(
              'https://www.ledgerwallet.com/products/ledger-nano-s'
            );
          }}
        >
          Ledger Nano S
        </Text>. You may want to consider using a hardware wallet to protect
        large balances, and a mobile wallet to facilitate easy transfers.
      </Text>,
      <Text key="2">
        Your secret key is generated and stored on your device. It is never sent
        to our servers.
      </Text>
    ]}
  />
);

export default Security;
