import React from 'react';
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  ScrollView,
  InteractionManager,
  RefreshControl,
  Modal,
  ActivityIndicator,
  StyleSheet,
  Image
} from 'react-native';
import {StatusBar, SimpleHeader, KeyboardScroll} from 'app/components/ui';
import {connect, actions, selectors} from 'app/core';
import {PENDING_STATUS} from 'app/core/reducer';
import theme from 'app/lib/theme';

const WhyPending = props => (
  <Modal animationType="slide" onRequestClose={props.onRequestClose}>
    <StatusBar backgroundColor={theme.colorBlue} barStyle="light-content" />
    <View style={whyPendStyles.header}>
      <View style={whyPendStyles.headerOuter}>
        <TouchableOpacity onPress={props.onRequestClose}>
          <Image
            style={whyPendStyles.close}
            source={require('app/assets/images/icons/close.png')}
          />
        </TouchableOpacity>
      </View>
      <Text style={whyPendStyles.headerText}>Pending 🤔</Text>
      <View style={whyPendStyles.headerOuter} />
    </View>
    <KeyboardScroll>
      <View style={whyPendStyles.content}>
        <View style={whyPendStyles.textContain}>
          <Text style={whyPendStyles.text}>
            Congrats! {props.with} is sending you Lumen for the first time!
          </Text>
          <Text style={whyPendStyles.text}>
            When they sent it, you didn&apos;t have a Lumen address yet. Now
            that you do, we sent them a message to open Lumenette and complete
            the transaction.
          </Text>
          <Text style={whyPendStyles.text}>
            This only happens once, for new accounts. Transactions are instant
            (never pending) from now on!
          </Text>
        </View>
      </View>
    </KeyboardScroll>
  </Modal>
);

const whyPendStyles = StyleSheet.create({
  contain: {flex: 1},
  header: {
    backgroundColor: theme.colorBlue,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  headerOuter: {
    flex: 1
  },
  headerText: {
    flex: 3,
    fontFamily: theme.fontRegular,
    fontSize: 24,
    color: 'white',
    textAlign: 'center'
  },
  content: {padding: 20},
  textContain: {marginTop: 10},
  text: {
    fontFamily: theme.fontBodyRegular,
    fontSize: 18,
    color: theme.colorDarkBlue,
    marginBottom: 15
  },
  bold: {
    fontFamily: theme.fontBodyBold
  }
});

class TransactionLine extends React.Component {
  state = {showKey: false, processingDots: 0, showIncomingPendingInfo: false};

  componentDidMount() {
    this._mounted = true;
    InteractionManager.runAfterInteractions(() => {
      if (this.props.item.pending) {
        this.dotInterval = this.setDotInterval();
      }
    });
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.item.pending && this.props.item.pending) {
      this.dotInterval = this.setDotInterval();
    } else if (prevProps.item.pending && !this.props.item.pending) {
      clearInterval(this.dotInterval);
    }
  }

  componentWillUnmount() {
    this._mounted = false;
    clearInterval(this.dotInterval);
  }

  dotInterval = null;
  setDotInterval = () =>
    setInterval(() => {
      if (this._mounted) {
        this.setState(state => ({
          ...state,
          processingDots:
            state.processingDots < 3 ? state.processingDots + 1 : 0
        }));
      }
    }, 200);

  toggleKey = () => this.setState({showKey: !this.state.showKey});
  cancelPending = () => this.props.cancelPending(this.props.item.id);
  toggleIncomingPendingInfo = () =>
    this.setState({
      showIncomingPendingInfo: !this.state.showIncomingPendingInfo
    });

  render() {
    const {item} = this.props;
    return (
      <View style={styles.itemContain}>
        {this.state.showIncomingPendingInfo && (
          <WhyPending
            onRequestClose={this.toggleIncomingPendingInfo}
            with={item.with}
          />
        )}
        <View style={styles.contactItemCircle}>
          {item.pending ? (
            <Text
              style={[
                styles.contactItemCircleText,
                item.pendingType === 'email' &&
                  styles.contactItemCircleTextEmail
              ]}
            >
              {item.pendingType === 'phone' ? 'SMS' : '@'}
            </Text>
          ) : (
            <Image
              style={styles.smallRocketContact}
              source={require('app/assets/images/lumen-rocket.png')}
            />
          )}
        </View>
        <View style={styles.itemContentContain}>
          <Text style={styles.detailLine}>
            {item.outgoing ? (
              'You'
            ) : (
              <Text style={styles.detailBold}>{item.with}</Text>
            )}{' '}
            paid{' '}
            {item.outgoing ? (
              <Text style={styles.detailBold}>{item.with}</Text>
            ) : (
              'you'
            )}.
          </Text>
          <Text style={styles.detailDate}>{item.date}</Text>
          {item.pending && (
            <Text style={styles.detailDate}>{item.pendingValue}</Text>
          )}
          {item.memo ? (
            <Text style={styles.detailMemo}>{item.memo}</Text>
          ) : null}
          {this.state.showKey && (
            <Text style={styles.detailKey}>
              {item.outgoing ? item.to : item.from}
            </Text>
          )}
          <View style={styles.linksRow}>
            {item.pending ? (
              (() => {
                switch (item.pendingStatus) {
                  case PENDING_STATUS.NEW:
                    return (
                      <TouchableOpacity onPress={this.cancelPending}>
                        <Text style={styles.showKey}>Cancel Pending</Text>
                      </TouchableOpacity>
                    );
                  case PENDING_STATUS.PROCESSING:
                    return (
                      <Text style={styles.pendingProcessing}>
                        Processing{this.state.processingDots === 3
                          ? '...'
                          : this.state.processingDots === 2
                            ? '..'
                            : this.state.processingDots === 1 ? '.' : ''}
                      </Text>
                    );
                  case PENDING_STATUS.FAILED:
                    return (
                      <View style={styles.failedWrap}>
                        <Text style={styles.pendingFailed}>Failed</Text>
                        <TouchableOpacity onPress={this.cancelPending}>
                          <Text style={styles.dismissOuter}>
                            (<Text style={styles.dismissInner}>Dismiss</Text>)
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  default:
                    return null;
                }
              })()
            ) : (
              <View style={styles.linksRow}>
                {item.incomingPending && (
                  <TouchableOpacity onPress={this.toggleIncomingPendingInfo}>
                    <Text style={styles.showKey}>Why Pending?</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={this.toggleKey}>
                  <Text style={styles.showKey}>
                    {this.state.showKey ? 'Hide' : 'Show'} Key
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
        <View style={styles.transferLumenDetailContain}>
          <Text
            style={[
              styles.transferLumen,
              item.outgoing && styles.transferLumenOutgoing
            ]}
          >
            {item.outgoing ? '-' : '+'}
            {item.amount}
          </Text>
          {item.outgoing ? (
            <Image
              style={styles.smallRocket}
              source={require('app/assets/images/lumen-rev-rocket.png')}
            />
          ) : (
            <Image
              style={styles.smallRocket}
              source={require('app/assets/images/lumen-rocket.png')}
            />
          )}
        </View>
      </View>
    );
  }
}

const FIVE_MINUTES = 1000 * 60 * 5;

class Activity extends React.Component {
  state = {
    loadingInitialItems: !this.props.hasNonPending,
    loadingMore: false,
    refreshing: false
  };

  componentDidMount() {
    this._mounted = true;
    InteractionManager.runAfterInteractions(() => {
      this.props.getAndRecordPushId();
      if (!this.props.hasNonPending) {
        this.props.loadTransactions({cache: FIVE_MINUTES}).then(() => {
          if (this._mounted) {
            this.setState({loadingInitialItems: false});
          }
        });
      } else {
        this.props.loadTransactions({cache: FIVE_MINUTES});
      }
    });
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  handleRefresh = () => {
    this.setState({refreshing: true});
    this.props.checkPendingTransfers();
    this.props.loadTransactions().then(() => {
      if (this._mounted) {
        this.setState({refreshing: false});
      }
    });
  };

  handleEndReached = () => {
    if (!this.state.loadingInitialItems && !this.state.loadingMore) {
      this.setState({loadingMore: true}, () => {
        this.props.loadTransactions({useCursor: true}).then(() => {
          if (this._mounted) {
            this.setState({loadingMore: false});
          }
        });
      });
    }
  };

  render() {
    return (
      <View style={styles.contain}>
        <StatusBar />
        <SimpleHeader title="Activity" />
        {!this.state.loadingInitialItems &&
        this.props.groupedTransactions.length === 0 ? (
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.handleRefresh}
                tintColor={theme.colorBlue}
              />
            }
          >
            <View style={styles.noTransactionsWrap}>
              <Text style={styles.noTransactionsText}>
                No transactions yet!
              </Text>
            </View>
          </ScrollView>
        ) : (
          <View style={styles.contain}>
            <View style={[!this.state.loadingInitialItems && styles.contain]}>
              <SectionList
                onEndReachedThreshold={0.75}
                onEndReached={this.handleEndReached}
                stickySectionHeadersEnabled
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this.handleRefresh}
                    tintColor={theme.colorBlue}
                  />
                }
                renderSectionHeader={({section}) => (
                  <View style={styles.headerContain}>
                    <Text style={styles.headerText}>{section.title}</Text>
                  </View>
                )}
                keyExtractor={item => item.id}
                ItemSeparatorComponent={() => <View style={styles.seperator} />}
                renderItem={({item}) => (
                  <TransactionLine
                    item={item}
                    cancelPending={this.props.cancelPending}
                  />
                )}
                sections={this.props.groupedTransactions}
                ListFooterComponent={
                  this.state.loadingMore &&
                  (() => (
                    <View style={styles.activityIndicator}>
                      <ActivityIndicator size="large" color={theme.colorBlue} />
                    </View>
                  ))
                }
              />
            </View>
            {this.state.loadingInitialItems && (
              <View style={styles.activityIndicator}>
                <ActivityIndicator size="large" color={theme.colorBlue} />
              </View>
            )}
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contain: {flex: 1},
  scrollContain: {flex: 1, justifyContent: 'flex-start'},
  headerContain: {
    backgroundColor: theme.colorSectionDivider,
    padding: 10
  },
  headerText: {
    fontFamily: theme.fontRegular,
    color: theme.colorDarkBlue,
    fontSize: 15
  },
  itemContain: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'flex-start'
  },
  itemContentContain: {
    flex: 1
  },
  linksRow: {flexDirection: 'row'},
  activityIndicator: {margin: 20},
  noTransactionsWrap: {margin: 20, alignItems: 'center'},
  noTransactionsText: {
    fontFamily: theme.fontBodyRegular,
    color: theme.colorDarkBlue,
    fontSize: 18
  },
  contactItemCircle: {
    borderColor: theme.colorDarkBlue,
    borderWidth: 1,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  detailLine: {
    fontFamily: theme.fontBodyRegular,
    color: theme.colorBodyCopy,
    fontSize: 15
  },
  detailBold: {
    fontFamily: theme.fontBodyMedium,
    color: theme.colorDarkBlue
  },
  detailDate: {
    fontFamily: theme.fontBodyRegular,
    color: theme.colorBodyCopy,
    fontSize: 13
  },
  detailKey: {
    marginTop: 10,
    fontFamily: theme.fontBodyRegular,
    color: theme.colorDarkBlue,
    fontSize: 15
  },
  showKey: {
    fontFamily: theme.fontBodyRegular,
    fontSize: 15,
    marginTop: 10,
    marginRight: 10,
    color: theme.colorDarkBlue
  },
  pendingProcessing: {
    fontFamily: theme.fontRegular,
    fontSize: 15,
    marginTop: 10,
    color: theme.colorOrange
  },
  failedWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10
  },
  dismissOuter: {
    fontFamily: theme.fontBodyRegular,
    fontSize: 15,
    marginTop: 2,
    color: theme.colorDarkBlue
  },
  dismissInner: {
    textDecorationLine: 'underline'
  },
  pendingFailed: {
    fontFamily: theme.fontRegular,
    fontSize: 15,
    marginRight: 4,
    color: theme.colorRed
  },
  detailMemo: {
    marginTop: 10,
    fontFamily: theme.fontBodyRegular,
    color: theme.colorDarkBlue,
    fontSize: 20
  },
  seperator: {
    backgroundColor: theme.colorLightBorder,
    height: 1
  },
  contactItemCircleText: {
    color: theme.colorDarkBlue,
    fontFamily: theme.fontRegular,
    fontSize: 13
  },
  transferLumenDetailContain: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  transferLumen: {
    fontFamily: theme.fontRegular,
    fontSize: 15,
    color: theme.colorGreen
  },
  transferLumenOutgoing: {
    color: theme.colorRed
  },
  smallRocket: {
    width: 144 * 0.1,
    height: 184 * 0.1,
    marginLeft: 5
  },
  smallRocketContact: {
    width: 19,
    height: 24
  },
  contactItemCircleTextEmail: {
    fontSize: 18,
    marginTop: -2
  },
  contactNameText: {
    fontFamily: theme.fontBodyMedium,
    color: theme.colorDarkBlue,
    fontSize: 18
  }
});

export default connect(
  state => ({
    groupedTransactions: selectors.selectGroupedTransactions(state),
    hasNonPending: selectors.selectHasNonPendingTransactions(state)
  }),
  {
    getAndRecordPushId: actions.getAndRecordPushId,
    checkPendingTransfers: actions.checkPendingTransfers,
    loadTransactions: actions.loadTransactions,
    cancelPending: actions.cancelPending
  }
)(Activity);
