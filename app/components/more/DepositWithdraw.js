import React from 'react';
import TextSlide from './TextSlide';
import {Linking, Text} from 'react-native';

const DepositWithdraw = () => (
  <TextSlide
    title="Deposit / Withdraw"
    paragraphs={[
      <Text key="1">
        Lumenette is a Stellar Lumen mobile wallet, to easily transfer with
        either your personal contacts or with others in the Stellar Network.
      </Text>,
      <Text key="2">
        If you would like to buy Stellar Lumen using your bank account, or
        withdraw to your bank account, please visit{' '}
        <Text
          style={{textDecorationLine: 'underline'}}
          onPress={() => {
            Linking.openURL('https://www.kraken.com');
          }}
        >
          https://www.kraken.com
        </Text>{' '}
        or a similar exchange.
      </Text>,
      <Text key="3">
        Create an account, and transfer between your Lumenette wallet, and your
        exchange wallet.
      </Text>
    ]}
  />
);

export default DepositWithdraw;
