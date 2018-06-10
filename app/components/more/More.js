import React from "react";
import { Switch, Route, withRouter } from "react-router-native";

import { RouteTransition } from "app/components/ui";
import Menu from "app/components/more/Menu";
import Account from "app/components/more/Account";
import TouchPin from "app/components/more/TouchPin";
import Favorites from "app/components/more/Favorites";
import FrequentlyAskedQuestions from "app/components/more/FrequentlyAskedQuestions";
import DepositWithdraw from "app/components/more/DepositWithdraw";
import LearnAboutStellar from "app/components/more/LearnAboutStellar";
import HowLumenetteWorks from "app/components/more/HowLumenetteWorks";
import MinimumAccountBalance from "app/components/more/MinimumAccountBalance";
import Security from "app/components/more/Security";
import Fees from "app/components/more/Fees";

class More extends React.Component {
  state = {
    transition: false,
    forwardTransition: false
  };

  componentWillReceiveProps(nextProps) {
    const transition =
      this.props.location.pathname !== nextProps.location.pathname &&
      this.props.location.pathname.includes("/main/more") &&
      nextProps.location.pathname.includes("/main/more");

    this.setState({
      transition,
      forwardTransition:
        transition && this.getLevel(nextProps) > this.getLevel(this.props)
    });
  }

  getLevel = props => (props.location.pathname.match(/\//g) || []).length;

  render() {
    return (
      <RouteTransition
        transition={this.state.transition}
        increment={this.state.forwardTransition}
      >
        <Switch location={this.props.location}>
          <Route exact path="/main/more" component={Menu} />
          <Route exact path="/main/more/account" component={Account} />
          <Route exact path="/main/more/touchpin" component={TouchPin} />
          <Route exact path="/main/more/favorites" component={Favorites} />
          <Route
            exact
            path="/main/more/faqs"
            component={FrequentlyAskedQuestions}
          />
          <Route
            exact
            path="/main/more/deposit-withdraw"
            component={DepositWithdraw}
          />
          <Route
            exact
            path="/main/more/learn-about-stellar"
            component={LearnAboutStellar}
          />
          <Route
            exact
            path="/main/more/learn-about-lumenette"
            component={HowLumenetteWorks}
          />
          <Route
            exact
            path="/main/more/minimum-account-balance"
            component={MinimumAccountBalance}
          />
          <Route exact path="/main/more/security" component={Security} />
          <Route exact path="/main/more/fees" component={Fees} />
        </Switch>
      </RouteTransition>
    );
  }
}

export default withRouter(More);
