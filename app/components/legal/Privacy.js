import React from 'react';
import {Text, View, Linking, Modal, StyleSheet} from 'react-native';
import {StatusBar, SimpleHeader, KeyboardScroll} from 'app/components/ui';
import theme from 'app/lib/theme';

const TextLink = props => (
  <Text style={textLinkStyle.textLink} onPress={props.onPress}>
    {props.children}
  </Text>
);

const textLinkStyle = StyleSheet.create({
  textLink: {
    color: theme.colorBlue,
    fontFamily: theme.fontBodyRegular,
    textDecorationLine: 'underline',
    textDecorationColor: theme.colorBlue
  }
});

class Privacy extends React.Component {
  render() {
    return (
      <Modal animationType="slide" onRequestClose={this.props.onRequestClose}>
        <View style={styles.contain}>
          <StatusBar />
          <SimpleHeader
            onLeftButtonPress={this.props.onRequestClose}
            title="Privacy Policy"
            leftButtonIcon="close"
          />
          <KeyboardScroll extraHeight={100}>
            <View style={styles.content}>
              <Text style={styles.para}>
                Please read this Privacy Policy regarding our user data
                collection carefully before accessing and using
                {` `}
                <TextLink
                  onPress={() => {
                    Linking.openURL('https://www.lumenette.com');
                  }}
                >
                  www.lumenette.com
                </TextLink>{' '}
                and the Lumenette Inc. mobile wallet (“services”, “website”,
                “mobile wallet” thereafter). This document describes how
                Lumenette Inc. (“Company”, “we”, “us”) collects, uses, and
                shares information about you through our website and mobile
                wallet. By using our services, you are providing your consent to
                practices described in this document. This document may be
                periodically updated, at which point you may be or may not be
                prompted to an additional review. We reserve the right, at any
                time and without notice, to add to, modify, change or update
                this Privacy Policy, simply by posting such change, update or
                modification on{` `}
                <TextLink
                  onPress={() => {
                    Linking.openURL('https://www.lumenette.com');
                  }}
                >
                  www.lumenette.com
                </TextLink>. Any such change, update or modification will be
                effective immediately upon posting on the Company’s website. If
                you do not understand any of the aspects of this Privacy Policy,
                please feel free to Contact Us as described at the end of this
                policy.
              </Text>
              <Text style={styles.para}>
                <Text style={{fontFamily: theme.fontBold}}>Definitions:</Text>
                {` `}
                <Text style={{textDecorationLine: 'underline'}}>
                  Personally Identifiable Information
                </Text>{' '}
                is any information linked to a person or persistently linked to
                a mobile device. This information can identify a person via
                personal information or a device via a unique identifier, and it
                may be a user-entered information or an automatically collected
                information.
              </Text>
              <Text style={styles.para}>
                <Text style={{textDecorationLine: 'underline'}}>
                  Sensitive Information
                </Text>{' '}
                is personally identifiable information about which users are
                likely to be concerned, such as their precise geo-location;
                passwords, contacts, photos, videos and other information stored
                on a mobile device.
              </Text>
              <Text style={styles.para}>
                <Text style={{fontFamily: theme.fontBold}}>Scope:</Text>
                {` `}
                This policy applies to all users of our services and pertains to
                information we collect at and through our website and mobile
                application or any other channel related to the Company. Our
                website or mobile application may include links to third-party
                websites. These websites are not endorsed by our Company and we
                do not take responsibility for the privacy practices of such
                parties.
              </Text>
              <Text style={styles.para}>
                The services are meant for adults only, and children may not
                register for accounts. We do not knowingly collect or maintain
                personally identifiable information or non-personally-
                identifiable information from persons under 18 years of age, and
                no part of our website is directed to persons under 18. If we
                learn that personally identifiable information of persons under
                18 years of age has been collected on the Services without
                verified parental consent, then we will take the appropriate
                steps to delete this information.
              </Text>
              <Text style={styles.para}>
                <Text style={{fontFamily: theme.fontBold}}>
                  Information Collected:
                </Text>
                {` `}
                You may be able to install the Lumenette Inc. app on iPhone or
                Android or access our website without entering any personal
                information. When registering for our services, we may ask you
                to provide us with some personally identifiable and/or sensitive
                information that we will collect or have access to such as:
              </Text>
              <View style={styles.paraV}>
                <Text style={styles.bp}>- Public Key</Text>
                <Text style={styles.bp}>- Full Name</Text>
                <Text style={styles.bp}>- Email Address</Text>
                <Text style={styles.bp}>- Telephone Number</Text>
                <Text style={styles.bp}>
                  - Email Address/Telephone Number of each individual contact
                  that is being sent Lumens
                </Text>
                <Text style={styles.bp}>
                  - SHA256 encrypted value of all contacts, to display contacts
                  on Lumenette.
                </Text>
              </View>
              <Text style={styles.para}>
                <Text style={{fontFamily: theme.fontBold}}>
                  Information Not Collected:
                </Text>
                {` `}
                Your Secret Key is stored on your mobile device, not on our
                servers. Your Secret Key is the password to send Lumens from one
                Stellar address to another. Since we do not store your Secret
                Key on our server, we cannot recover it for you, if you lose
                your phone. When registering for our services, information that
                is stored on your personal device and not collected by us:
              </Text>
              <View style={styles.paraV}>
                <Text style={styles.bp}>- Secret Key</Text>
                <Text style={styles.bp}>
                  - Sensitive Contact Information (Plain text emails / phone
                  numbers)
                </Text>
              </View>
              <Text style={styles.para}>
                <Text style={{fontFamily: theme.fontBold}}>
                  How is information used and/or shared?
                </Text>
                {` `}
                We may collect information from you in order to operate,
                maintain, and provide to you the features and functionality of
                the services. We may use collected information for the following
                purposes:
              </Text>
              <View style={styles.paraV}>
                <Text style={styles.bp}>- Perform services you requested</Text>
                <Text style={styles.bp}>- Personalize your experience</Text>
                <Text style={styles.bp}>- Improve our services</Text>
                <Text style={styles.bp}>- Contact you</Text>
              </View>
              <Text style={styles.para}>
                We do not use your phone number or email address or other
                Personal Information to send commercial or marketing messages
                without your consent or except as part of a specific program or
                feature for which you will have the ability to opt- in or
                opt-out. As a valued user of our Services, we may occasionally
                contact you (typically by e-mail) in order to notify you of
                special promotions and up-to-date news. Of course, if you do not
                wish to receive this personalized information, you can remove
                yourself from receiving such information by opting out.
              </Text>
              <Text style={styles.para}>
                Please be advised that emails we receive to our customer support
                email, including the sender’s email address, will be visible to
                our employees. Information received through the customer support
                email will be considered confidential and will not be shared
                outside the company.
              </Text>
              <Text style={styles.para}>
                Our developers or employees will not have access to your Stellar
                Lumens secret key. Stellar Lumen keypairs (public key and secret
                key) are generated on your device. Your secret key is never sent
                to our servers, and are only stored on your personal mobile
                device. Users can optionally encrypt their secret key with a
                password. Public keys are sent and stored on Lumenette servers.
              </Text>
              <Text style={styles.para}>
                Transactions on the Stellar network are public by default, and
                can be looked up by public key. Your contacts will be able to
                see your transactions if they look up the key outside of
                Lumenette. Lumenette Inc. may or may not display other contacts
                transactions in the Lumenette app.
              </Text>
              <Text style={styles.para}>
                We may employ third-party companies or individuals to process
                your personally identifiable information on our behalf based on
                our instructions and in compliance with this Privacy Policy. The
                Company and any authorized third-party analytics providers may
                perform aggregate statistical analysis of customer usage in
                order to measure interest in, and use of, the various parts of
                the Service and other applications, and Company may share that
                information with other interested third parties or the public.
                Any information shared in this manner is aggregated data only
                (statistics, etc.), and contains no Personal Information
                whatsoever (other than what is aggregated and anonymized).
              </Text>
              <Text style={styles.para}>
                <Text style={{fontFamily: theme.fontBold}}>Security</Text>
                {` `}
                The information we collect is securely stored within our
                database, and we use standard, industry-wide practices such as
                encryption, firewalls and (in some certain areas) SSL (Secure
                Socket Layers) for protecting your information. However, as
                effective as encryption technology is, no security system is
                impenetrable. We cannot guarantee the security of our database,
                nor can we guarantee that information you supply won’t be
                intercepted while being transmitted to us over the Internet.
              </Text>
              <Text style={styles.para}>
                <Text style={{fontFamily: theme.fontBold}}>Contact</Text>
                {` `}
                If you have further privacy concerns please do not hesitate to
                ask us by contacting{' '}
                <TextLink
                  onPress={() => {
                    Linking.openURL('mailto:team@lumenette.com');
                  }}
                >
                  team@lumenette.com
                </TextLink>. This Privacy Policy is not intended to and does not
                create any contractual or other legal rights in or on behalf of
                any party. Lumenette Inc. reserves the right, at any time and
                without notice, to add to, modify, change or update this Privacy
                Policy, simply by posting such change, update or modification on
                {` `}
                <TextLink
                  onPress={() => {
                    Linking.openURL('https://www.lumenette.com');
                  }}
                >
                  www.lumenette.com
                </TextLink>. Any such change, update or modification will be
                effective immediately upon posting on our website.
              </Text>
              <Text style={{fontFamily: theme.fontBold}}>
                Effective: February 1st, 2018
              </Text>
            </View>
          </KeyboardScroll>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  contain: {flex: 1},
  content: {padding: 20},
  para: {
    color: theme.colorDarkBlue,
    fontSize: 18,
    fontFamily: theme.fontBodyRegular,
    marginBottom: 20
  },
  paraV: {
    marginBottom: 20
  },
  bp: {
    color: theme.colorDarkBlue,
    fontSize: 18,
    fontFamily: theme.fontBodyRegular,
    marginBottom: 5,
    paddingLeft: 25
  },
  last: {
    marginBottom: 0
  }
});

export default Privacy;
