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

class Terms extends React.Component {
  render() {
    return (
      <Modal animationType="slide" onRequestClose={this.props.onRequestClose}>
        <View style={styles.contain}>
          <StatusBar />
          <SimpleHeader
            onLeftButtonPress={this.props.onRequestClose}
            title="Terms and Conditions"
            leftButtonIcon="close"
          />
          <KeyboardScroll extraHeight={100}>
            <View style={styles.content}>
              <Text style={styles.para}>
                <Text style={{fontFamily: theme.fontBold}}>General Use:</Text>{' '}
                Please Read these terms and conditions (“terms, “terms and
                conditions”) carefully before using the website{` `}
                <TextLink
                  onPress={() => {
                    Linking.openURL('https://www.lumenette.com');
                  }}
                >
                  www.lumenette.com
                </TextLink>{' '}
                and mobile wallet “Lumenette” (“the service”, “services”)
                operated by Lumenette Inc. (“Company”, “us”, “our”, “we”). This
                Terms of Use Agreement constitutes a legally binding agreement
                between you, the user, and us, Lumenette Inc., concerning your
                access to and use of the website, mobile wallet as well as any
                media form, media channel related or connected to the website or
                mobile wallet. By accessing and using our services you are
                indicating your acceptance to be bound by the terms and
                conditions of this Agreement.
              </Text>
              <Text style={styles.para}>
                <Text style={{fontFamily: theme.fontBold}}>Eligibility:</Text>
                {` `}
                To be eligible to use our services, you must be at least 18
                years old.
              </Text>
              <Text style={styles.para}>
                <Text style={{fontFamily: theme.fontBold}}>Services:</Text>{' '}
                Through your Lumenette mobile application and/or website you
                will access the following basic services: one Digital Currency
                wallet for Stellar Lumens that will allow you to store Stellar
                Lumens, send Stellar Lumens to, request, and receive
                aforementioned digital currency from third parties known to you
                pursuant to instructions you provide through the Lumenette
                mobile application or website. The service is controlled and
                operated from facilities in the United States. We do not make
                any representation that our service is appropriate or available
                for use in other locations. You may not use our service from the
                country embargoed by the U.S., or if you are a person or entity
                locked or denied by the U.S. Government. You acknowledge that
                your use of our services is at your own discretion and in
                compliance with all applicable laws.
              </Text>
              <Text style={styles.para}>
                <Text style={{fontFamily: theme.fontBold}}>Registration:</Text>{' '}
                In order to use Lumenette services, you must first register by
                providing your full name, telephone number, an e-mail address,
                and confirm acceptance of this agreement. By using our services,
                you represent and warrant that: a) all registration information
                you submit is truthful and accurate, b) you will keep your
                secret key confidential and will be responsible for all use of
                your secret key and account, and c) your use of our services
                does not violate any U.S. law or regulation.
              </Text>
              <Text style={styles.para}>
                <Text style={{fontFamily: theme.fontBold}}>Licenses:</Text> We
                grant you a limited license to access and make personal use of
                our website and mobile application. By posting contributions
                (i.e. comments, reviews) to any part of the website, or making
                them accessible to the website by linking your account to any of
                your social network accounts, you automatically grant us the
                right, in our sole and absolute discretion, to a) edit, redact
                or otherwise change any contributions, b) re-categorize
                contributions to place them in more appropriate locations or c)
                pre-screen or delete any contributions that deemed to be
                inappropriate or otherwise in violation of this Agreement.
              </Text>
              <Text style={styles.para}>
                By uploading your contribution to the website, you hereby
                authorize us to print and otherwise use your contributions for
                internal purposes and not for distribution, transfer, sale or
                commercial exploitation of any kind. If you are accessing our
                services via a mobile application, we grant you a revocable,
                non-exclusive, non-transferable, limited right to install and
                use the application on wireless handsets owned and controlled by
                you, and to access and use the application on such devices
                strictly in accordance with the terms and conditions of this
                document.
              </Text>
              <Text style={styles.para}>
                <Text style={{fontFamily: theme.fontBold}}>
                  Prohibited Use:
                </Text>{' '}
                In connection with your use of our services, and your
                interactions with other users and third parties you agree and
                represent you will not engage in any Prohibited Business or
                Prohibited Use defined herein. We reserve the right at all times
                to monitor, review, retain and/or disclose any information as
                necessary to satisfy any applicable law, regulation, sanctions
                program, legal process or governmental request. We reserve the
                right to cancel and/or suspend your Lumenette account and/or
                block transactions or freeze funds immediately and without
                notice if we determine, in our sole discretion, that your
                account is associated with a Prohibited Use and/or a Prohibited
                Business.
              </Text>
              <Text style={styles.para}>
                <Text style={{fontFamily: theme.fontBold}}>
                  Intellectual Property and Content:
                </Text>{' '}
                You are not permitted to re-distribute Lumenette’s software,
                modify any code or use any of our content, including images and
                text, as part of any other software or project of any kind. You
                must obtain our written permission before acting contrary to
                copyright law or the terms of this clause.
              </Text>
              <Text style={styles.para}>
                <Text style={{fontFamily: theme.fontBold}}>
                  Suspension, Termination and Cancellation:
                </Text>{' '}
                We may, in its sole discretion, suspend, terminate or cancel
                your right to use our services, or any part of the services, at
                any time without notice for any reason. In the event of
                termination, you will not be authorized to access our services.
                We shall not be liable to any party for such termination.
              </Text>
              <Text style={styles.para}>
                We reserve complete and sole discretion with respect to
                operation of our services. We may, among other things, suspend
                or discontinue any functionality or feature of the services.
              </Text>
              <Text style={styles.para}>
                <Text style={{fontFamily: theme.fontBold}}>
                  Privacy Policy:
                </Text>{' '}
                Before you continue using our mobile wallet “Lumenette” we
                recommend you to read our Privacy Policy regarding our user data
                collection.
              </Text>
              <Text style={styles.para}>
                <Text style={{fontFamily: theme.fontBold}}>Security:</Text> Any
                information sent or received over the internet may be
                compromised. Therefore, you are responsible for safekeeping your
                secret key, PINs and any other codes you use to access our
                services.
              </Text>
              <Text style={styles.para}>
                The company does not store any secret keys, backup phrases or
                passwords (collectively, “Secret Key Information”). Secret Key
                information is stored only on your mobile device. It is very
                important that you backup your Secret Key information. If you
                lose Your Secret Key information then it will not be possible
                for us to recover it for you and you may permanently lose access
                to Your Digital Assets.
              </Text>
              <Text style={styles.para}>
                IF YOU LOSE ACCESS TO YOUR LUMENETTE WALLET OR YOUR ENCRYPTED
                SECRET KEYS AND YOU HAVE NOT SEPARATELY STORED A BACKUP OF YOUR
                WALLET AND CORRESPONDING PASSWORD, YOU ACKNOWLEDGE AND AGREE
                THAT ANY STELLAR LUMENS YOU HAVE ASSOCIATED WITH THAT COPAY
                WALLET WILL BECOME INACCESSIBLE.
              </Text>
              <Text style={styles.para}>
                LUMENETTE INC. IS NOT RESPONSIBLE FOR LUMENS THAT ARE SENT TO
                THE WRONG ADDRESS, WHETHER BY MISTAKE OR ON PURPOSE BY THE USER,
                REGARDLESS IF RELATED TO THE WRONG PHONE NUMBER, WRONG EMAIL
                ADDRESS, OR WRONG PUBLIC KEY.
              </Text>
              <Text style={styles.para}>
                <Text style={{fontFamily: theme.fontBold}}>
                  Disclaimer of Warranties:
                </Text>
                {` `}Lumenette software is provided to you “As-is” and without
                any warranty whatsoever, to the maximum extend permissible by
                law. Without limiting generality of the foregoing, we do not
                warrant that Lumenette software is fit for your purpose, even if
                you have previously provided notice of your intended purpose,
                and does not warrant that Lumenette software will operate in a
                bug-free manner.
              </Text>
              <Text style={styles.para}>
                <Text style={{fontFamily: theme.fontBold}}>
                  Indemnification 1:
                </Text>
                {` `}UNDER NO CIRCUMSTANCES WILL LUMENETTE INC. BE LIABLE TO YOU
                OR ANY OTHER PERSON FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL,
                SPECIAL, EXEMPLARY, OR PUNITIVE DAMAGES ARISING OUT OF OR IN
                CONNECTION WITH THESE TERMS OF SERVICE, THE SERVICE, THE USE OF
                THE CRYPTOCURRENCY, OR THE INTERNET GENERALLY, INCLUDING,
                WITHOUT LIMITATION, YOUR USE OR INABILITY TO USE THE SERVICES;
                ANY CHANGES TO OR INACCESSIBILITY OR TERMINATION OF THE
                SERVICES; ANY DELAY, FAILURE, UNAUTHORIZED ACCESS TO OR
                ALTERATION OF ANY TRANSMISSION OR DATA; ANY TRANSACTION OR
                AGREEMENT ENTERED INTO THROUGH THE SERVICES; OR ANY DATA OR
                MATERIAL FROM A THIRD PERSON ACCESSED ON OR THROUGH THE
                SERVICES, WHETHER SUCH LIABILITY IS ASSERTED ON THE BASIS OF
                TORT OR OTHERWISE, AND WHETHER OR NOT COMPANY HAS BEEN ADVISED
                OF THE POSSIBILITY OF SUCH DAMAGES. SUCH LIMITATION OF LIABILITY
                SHALL APPLY WHETHER THE DAMAGES ARISE FROM USE OR MISUSE OF AND
                RELIANCE ON COMPANY OR THE SERVICES, NOTWITHSTANDING ANY FAILURE
                OF ESSENTIAL PURPOSE OF ANY LIMITED REMEDY AND TO THE FULLEST
                EXTENT PERMITTED BY LAW. IF YOU ARE DISSATISFIED WITH THE
                SERVICES, YOUR SOLE AND EXCLUSIVE REMEDY SHALL BE FOR YOU TO
                DISCONTINUE YOUR USE OF THE SERVICES. SOME JURISDICTIONS DO NOT
                ALLOW THE EXCLUSION OR LIMITATION OF INCIDENTAL OR CONSEQUENTIAL
                DAMAGES, SO THE ABOVE LIMITATION AND EXCLUSIONS MAY NOT APPLY TO
                YOU.
              </Text>
              <Text style={styles.para}>
                YOU AGREE TO HOLD HARMLESS AND INDEMNIFY LUMENETTE INC., ITS
                DIRECTORS, OFFICERS, EMPLOYEES AND AGENTS FROM AND AGAINST ANY
                ACTION, CAUSE CLAIM, SUIT, JUDGMENT, DAMAGE (ACTUAL AND
                CONSEQUENTIAL), DEBT, DEMAND, EXPENSE OR LIABILITY (INCLUDING
                REASONABLE COSTS AND ATTORNEY’S FEES) OF EVERY KIND AND NATURE,
                ASSERTED BY ANY PERSON, ARISING FROM OR IN ANY WAY RELATED TO
                YOUR USE OF THE SERVICES, THE CRYPTOCURRENCY OR COMPANY
                WEBSITES.
              </Text>
              <Text style={styles.para}>
                <Text style={{fontFamily: theme.fontBold}}>Taxes:</Text>
                {` `}It is your sole responsibility to determine whether, and to
                what extent, any taxes apply to any transactions you conduct
                through our services, and to withhold, collect, report and remit
                the correct amounts of taxes to the appropriate tax authorities.
                Your transaction history is available through your Lumenette
                account.
              </Text>
              <Text style={styles.para}>
                <Text style={{fontFamily: theme.fontBold}}>Contact:</Text>
                {` `}If you have any feedback, questions, or complaints contact
                us at:
              </Text>
              <Text style={styles.para}>
                Email:{' '}
                <TextLink
                  onPress={() => {
                    Linking.openURL('mailto:team@lumenette.com');
                  }}
                >
                  team@lumenette.com
                </TextLink>
              </Text>
              <Text style={styles.para}>
                <Text style={{fontFamily: theme.fontBold}}>Consent:</Text>
                {` `}By proceeding forward, we assume you accept these terms and
                conditions in full. Do not continue to use Lumenette’s Wallet
                website if you do not accept all of the terms and conditions
                stated above.
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
  last: {
    marginBottom: 0
  }
});

export default Terms;
