import React from 'react';
import TextSlide from './TextSlide';
import {Text} from 'react-native';

const MinimumAccountBalance = () => (
  <TextSlide
    title="Minimum Account Balance"
    paragraphs={[
      <Text key="1">
        Stellar requires each account to have a 1 lumen minimum. The maximum you
        will be able to transfer is your account balance minus 1 lumen. The
        minimum you will be able to transfer to a new user is 1 lumen.
      </Text>
    ]}
  />
);

export default MinimumAccountBalance;
