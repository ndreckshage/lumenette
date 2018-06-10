import React from "react";
import { Text, View, Linking, Modal, StyleSheet } from "react-native";
import {
  StatusBar,
  SimpleHeader,
  KeyboardScroll,
  TextLink
} from "app/components/ui";
import { connect, selectors } from "app/core";
import theme from "app/lib/theme";

const MarketCap = connect(state => ({
  lastFetched: selectors.selectLumenUpdatedAt(state),
  rank: selectors.selectLumenRank(state),
  marketCap: selectors.selectLumenCap(state)
}))(props => (
  <Text>
    The most recent Stellar Lumen market cap as of {props.lastFetched}, is{" "}
    {props.marketCap}. They are currently {props.rank} in the world among
    cryptocurrencies in market cap. This information and more can be found on{" "}
    <TextLink onPress={() => Linking.openURL("https://coinmarketcap.com/")}>
      https://coinmarketcap.com/
    </TextLink>.
  </Text>
));

const faqdata = [
  {
    question: "What is this virtual currency’s most recent market cap?",
    answer: [<MarketCap key="marketcap" />]
  },
  {
    question: "What kind of virtual currency is this?",
    answer: [
      "The Stellar Network is designed to allow individuals, banks and companies to use traditional assets more efficiently through crypto technology. This is possible because the network gives anchors (asset issuers) the ability to create assets of any type. For example, Bank of America could create Bank of America USD on Stellar.",
      "Stellar is known for its extremely quick and low cost transfers, as it can process transactions in 1-5 seconds and for a fraction of a penny. The Stellar Network validates transactions by a consensus protocol (majority vote) of other computers on the network, rather than Bitcoin’s proof of work method, which is energy intensive mining that has an unfortunately substantial carbon footprint."
    ]
  },
  {
    question: "What is this virtual currency primarily used for?",
    answer: [
      "Stellar aims to facilitate fast, cheap, global payments between either different fiat currencies or its native cryptocurrency (referred to as Lumens, or XLM). Stellar has partnered with several companies in the quest to create a new and inclusive global infrastructure for payments, including Stripe, Deloitte, KlickEx, and IBM. In October 2017, IBM announced it would use Stellar to partner with banks to provide cross-country payments in the South Pacific. Stellar is a non-profit whose goal is to expand access to low-cost financial services for the 2 billion unbanked people in the world to fight poverty."
    ]
  },
  {
    question: "When was this virtual currency first introduced?",
    answer: ["Stellar was founded in early 2014 by Jed McCaleb and Joyce Kim."]
  },
  {
    question: "What is the history of this virtual currency?",
    answer: [
      <Text key="history1">
        Originally at launch, Stellar was based on the Ripple protocol, which is
        also a virtual currency that runs on consensus. Stellar’s founder Jed
        McCaleb was also a cofounder of Ripple. McCaleb’s desire is to connect
        everyone in the world through the Stellar network and to enable users to
        send remittances cheaply across international borders. The Stellar
        Development Foundation created an updated version of the Ripple protocol
        with a new consensus algorithm based on entirely new code in April 2015,
        and the upgraded network went live in November 2015.
      </Text>,
      <Text key="history2">
        Throughout the last 3 years, Stellar has partnered with a number of
        financial firms located throughout the world. Stellar has prestigious
        advisors such as Patrick Collison, CEO of Stripe, Sam Altman, President
        of Y Combinator, Matt Mullenweg, Founder of WordPress.com, and many
        others. If you wish to learn more, please visit{" "}
        <TextLink onPress={() => Linking.openURL("https://www.stellar.org/")}>
          https://www.stellar.org/
        </TextLink>.
      </Text>
    ]
  },
  {
    question: "What is a Lumen?",
    answer: [
      "A lumen is a unit of cryptocurrency that is the built-in currency of the Stellar network. 1 lumen is a unit of digital currency, just like 1 bitcoin."
    ]
  },
  {
    question: "Are Lumens the same thing as Stellar?",
    answer: [
      "Lumens are not the same thing as Stellar. Stellar is a platform that aims to connect banks, payment processors, and people worldwide through quick and cheap transfers. Lumens are the underlying currency of the Stellar network."
    ]
  },
  {
    question: "What is XLM?",
    answer: ["XLM is shorthand for lumen."]
  },
  {
    question: "How is the Price of a Lumen (XLM) calculated?",
    answer: [
      "The price of a Lumen (XLM) is calculated by taking the most up-to-date volume weighted average of all prices reported at each market that offers Lumen (XLM) buying/selling."
    ]
  },
  {
    question: "What is a Public Key?",
    answer: [
      "A public key is a cryptographic code that acts as the address for your account where other users send lumens. Think of a public key as your email address, and lumens as emails. If your friend Mike wants to send you an email, he sends it to your email address. Similarly, if Mike wants to send you lumens, he sends it to your public key.",
      "Given that public keys are incredibly lengthy in characters, Lumenette makes it easy for you to transfer lumens to any of your personal contacts without needing to type out their entire public key. Simply go to the Transfer section (which contains your personal contacts) to send lumens to any of your contacts whether they have an existing Lumenette account or not."
    ]
  },
  {
    question:
      "What happens to the lumens I send to my friend who doesn’t have a Lumenette wallet?",
    answer: [
      "Once you send lumens to one of your contacts who doesn’t have a wallet, they will receive a notification via email or text from the Lumenette team of the initiated transfer. Once the app is downloaded by the new user and they are verified, you will be prompted to open up your Lumenette app, at which point the transfer occurs. If the new user chooses to not create a Lumenette account, your funds will be returned to you within 10 days automatically. You can also cancel the transaction at any point before the new user creates their account and gets verified."
    ]
  },
  {
    question: "Why do I see a pending transaction on my Activity Page?",
    answer: [
      "Generally, it is because the person you are sending the lumens to does not yet have a Lumenette wallet verified. As soon as the receiver of lumens creates a Lumenette wallet and they are verified, you will be prompted to open up your Lumenette app, at which point the transfer occurs, and the status on the Activity page of the transaction for both the sender and the receiver changes from pending to sent."
    ]
  },
  {
    question: "Where does my Public Key come from?",
    answer: [
      "Public keys are generated by cryptographic algorithms. They are not known in advance by Lumenette or by the Stellar network. Once public keys are funded for the first time with at least 1 lumen (minimum balance requirement), they are then activated on the Stellar network."
    ]
  },
  {
    question: "What is a Secret Key?",
    answer: [
      "A secret key is generated simultaneously with the public key. It is essential you keep it safeguarded to protect your lumens, as you are the only one who knows your secret key and because your secret key serves to authorize transactions. Secret keys, just like public keys, are displayed as a large combination of numbers and letters.",
      "Given that secret keys are incredibly lengthy in characters, Lumenette makes it easy for you to transfer lumens to any of your personal contacts without needing to type out your entire secret key. Simply go to the Transfer section (which contains your personal contacts) to send lumens to any of your contacts whether they have an existing Lumenette account or not."
    ]
  },
  {
    question: "What are recovery words?",
    answer: [
      "Recovery words let us generate your secret key. Think of these recovery words as equivalent to your secret key, and you can write either your recovery words down, your secret key, or both.",
      "We encourage use of recovery words, because they are easier to write down than a secret key."
    ]
  },
  {
    question:
      "Why do I need to write down or save my Secret Key / Recovery Words?",
    answer: [
      "You will need your recovery words / secret key if your phone is lost, stolen or broken; if you ever want to use your wallet on another mobile device; or if for any other reason you need to reinstall the Lumenette app on your existing device. If you lose access to the recovery words / secret key, your funds will be unrecoverable - the Lumenette team does not have access to your key and cannot recover it for you.",
      "Think of your secret key as your login/password that cannot be changed in order to access your lumens. For example, if you want to login to your existing Lumenette wallet on another device, you will download the app on the new device, fill in your first and last name, phone number, and email address, and then click on “Existing Stellar Account?” where you will enter your recovery words / secret key."
    ]
  },
  {
    question: "How is Lumenette protecting my lumens?",
    answer: [
      "Lumenette offers users the optional dual security features of Touch ID (to open the app) and a PIN (to encrypt your secret keys). To ensure the highest level of protection of your lumens and personal information, the Lumenette team encourages all users to enable these features.",
      "Unlike centralized wallets that hold all user funds and thus are in danger of losing such funds in the event of a hack, user funds are never sent to Lumenette servers. Your secret key is generated and stored on your individual device."
    ]
  },
  {
    question: "What is a Touch ID?",
    answer: [
      "Touch ID is a fingerprint recognition feature that adds an additional level of protection when you open the Lumenette wallet. You can activate this feature on the app by clicking “More” on the blue taskbar and selecting “Touch ID & Pin.”  If the Lumenette wallet prevents you from turning on the Touch ID function, you likely need to enable this feature on your phone. The exact steps may vary based on the type of phone that you use (Apple or Android), but generally it is available under Lock screen and security settings in your phone."
    ]
  },
  {
    question: "What is a PIN?",
    answer: [
      "A PIN adds an extra layer of protection to your secret key by encrypting it. You can activate this feature on the app by clicking “More” on the blue taskbar and selecting “Touch ID & PIN.”  To ensure the highest level of protection of your lumens and personal information, the Lumenette team encourages all users to enable this feature."
    ]
  },
  {
    question:
      "I received lumens for the first time on Lumenette. In my Activity Page it says “Someone paid you.”  How do I know who that is?",
    answer: [
      "To send lumens to your contacts and to know who you are receiving them from, you need to go to the Transfer Page and click the “Allow” button for your wallet to have access to your contact list."
    ]
  }
];

const qaParas = faqdata.reduce((acc, i) => {
  const paras = [
    <Text
      key={`${i.question}-question`}
      style={{ fontFamily: theme.fontBodyBold }}
    >
      {i.question}
    </Text>,
    ...i.answer.map((answer, n) => (
      <Text key={`${i.question}-${n}`}>{answer}</Text>
    ))
  ];

  return [...acc, ...paras];
}, []);

export const faqs = [
  ...qaParas,
  <Text key="contact">
    If you have any other questions, please do not hesitate to contact us as{" "}
    <TextLink
      onPress={() => {
        Linking.openURL("mailto:team@lumenette.com");
      }}
    >
      team@lumenette.com
    </TextLink>.
  </Text>
];

class FrequentlyAskedQuestions extends React.Component {
  render() {
    return (
      <Modal animationType="slide" onRequestClose={this.props.onRequestClose}>
        <View style={styles.contain}>
          <StatusBar />
          <SimpleHeader
            onLeftButtonPress={this.props.onRequestClose}
            title="Frequently Asked Questions"
            leftButtonIcon="close"
          />
          <KeyboardScroll extraHeight={100}>
            <View style={styles.content}>
              {qaParas.map((para, ndx) => (
                <Text style={styles.para} key={ndx}>
                  {para}
                </Text>
              ))}
            </View>
          </KeyboardScroll>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  contain: { flex: 1 },
  content: { padding: 20 },
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

export default FrequentlyAskedQuestions;
