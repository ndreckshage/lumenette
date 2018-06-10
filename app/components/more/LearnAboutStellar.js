import React from 'react';
import TextSlide from './TextSlide';
import {Linking, Text} from 'react-native';

const LearnAboutStellar = () => (
  <TextSlide
    title="Learn About Stellar"
    paragraphs={[
      <Text key="1">
        Stellar is a blockchain network, built to process transactions quickly
        (1-5 seconds) and cheaply (1/1000th of a penny).
      </Text>,
      <Text key="2">
        Lumen (XLM) is the asset of the Stellar platform. It is a popular
        cryptocurrency that can be traded on numerous exchanges. You can see the
        current and historical prices of Stellar Lumen on{' '}
        <Text
          style={{textDecorationLine: 'underline'}}
          onPress={() => {
            Linking.openURL('https://www.coinmarketcap.com');
          }}
        >
          Coin Market Cap
        </Text>.
      </Text>,
      <Text key="3">
        <Text
          style={{textDecorationLine: 'underline'}}
          onPress={() => {
            Linking.openURL('https://www.stellar.org');
          }}
        >
          Stellar.org
        </Text>{' '}
        runs the Stellar platform. They are a nonprofit, whose mission is to
        provide access to low-cost financial services to fight poverty in
        developing nations - to service the unbanked. One way they achieve this
        is through the speed and efficiency of their platform.
      </Text>,
      <Text key="4">
        Unlike Bitcoin, Stellar Lumen is not a mined coin. Unfortunately,
        Bitcoin mining has a negative impact on the environment. Stellar also
        validates transactions in a more desirable way than Bitcoin.
        Transactions on the Bitcoin blockchain have been known to take multiple
        days to process, and the high mining fees have been a subject of
        constant complaint. Stellar saves users both time and money.
      </Text>,
      <Text key="5">
        To learn more about Stellar, please visit{' '}
        <Text
          style={{textDecorationLine: 'underline'}}
          onPress={() => {
            Linking.openURL('https://www.stellar.org');
          }}
        >
          https://www.stellar.org
        </Text>,{' '}
        <Text
          style={{textDecorationLine: 'underline'}}
          onPress={() => {
            Linking.openURL('https://stellar.stackexchange.com');
          }}
        >
          https://stellar.stackexchange.com
        </Text>, or read articles that the community has written on{' '}
        <Text
          style={{textDecorationLine: 'underline'}}
          onPress={() => {
            Linking.openURL(
              'https://medium.com/@dominiczhai/a-comprehensive-introduction-on-how-stellar-xlm-works-for-non-techies-7060595af749'
            );
          }}
        >
          Medium
        </Text>.
      </Text>
    ]}
  />
);

export default LearnAboutStellar;
