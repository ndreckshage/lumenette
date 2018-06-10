import React from 'react';
import TextSlide from './TextSlide';
import {Text, Linking} from 'react-native';

const Fees = () => (
  <TextSlide
    title="Fees"
    paragraphs={[
      <Text key="1">
        Stellar charges 0.00001 Lumen ($0.000005 USD) per transaction. That’s
        1/1000th of a single penny!
      </Text>,
      <Text key="2">
        Lumenette does not charge an additional fee per transaction, but is the
        inflationary beneficiary of your account, in order to cover API fees
        (Heroku for our server; Postmark for email; Twilio for text).
      </Text>,
      <Text key="3">
        In order to set Lumenette as the inflation beneficiary for your account,
        there is a 1 time fee of 0.00001 Lumen for your first transaction. This
        operation repeats if you remove Lumenette as your accounts inflation
        destination, outside of the Lumenette app.
      </Text>,
      <Text key="4">
        Read more about inflation on{' '}
        <Text
          style={{textDecorationLine: 'underline'}}
          onPress={() => {
            Linking.openURL(
              'https://www.stellar.org/developers/guides/concepts/inflation.html'
            );
          }}
        >
          Stellar.org
        </Text>.
      </Text>
    ]}
  />
);

export default Fees;
