import React from 'react';
import TextSlide from './TextSlide';
import {withRouter} from 'react-router-native';
import {faqs} from 'app/components/legal/FAQs';

const skKey = `Why do I need to write down or save my Secret Key?-question`;

const FrequentlyAskedQuestions = props => (
  <TextSlide
    title="Frequently Asked Questions"
    scrollTo={
      props.history.location.state && props.history.location.state.whyWriteSk
        ? skKey
        : undefined
    }
    paragraphs={faqs}
  />
);

export default withRouter(FrequentlyAskedQuestions);
