import React from 'react';
import TextSlide from './TextSlide';
import {Text} from 'react-native';

const HowLumenetteWorks = () => (
  <TextSlide
    title="How Lumenette Works"
    paragraphs={[
      <Text key="1">
        With Lumenette you can send Lumen to anyone on your contact list, even
        if they haven’t heard of Lumen (yet).
      </Text>,
      <Text key="2">
        Select a contact, and enter an amount to send. We look up their public
        key by phone number, or email in our registry.
      </Text>,
      <Text key="3">
        If they have an existing Stellar address, the transaction occurs
        immediately, from your secret key on your phone, to their public key,
        and we notify them via email or text.
      </Text>,
      <Text key="4">
        If they do not have an address, we notify them via email or text, prompt
        them to download the app, and create a pending transaction (which you
        can cancel until claimed). When the recipient downloads the app, and
        verifies their email or phone number, we notify you to open the app. The
        app then automatically completes the pending transaction.
      </Text>
    ]}
  />
);

export default HowLumenetteWorks;
