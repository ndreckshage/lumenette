import React from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import {
  SimpleHeader,
  StatusBar,
  FormInput,
  KeyboardScroll,
  Button,
  TextLink
} from "app/components/ui";
import { connect, compose, selectors, actions } from "app/core";
import ContactCard from "app/components/transfer/ContactCard";
import theme from "app/lib/theme";

class Favorites extends React.Component {
  state = {
    add: false,
    edit: false,
    id: null,
    label: "",
    value: ""
  };

  back = () => this.props.history.push("/main/more");

  add = () => this.setState({ add: true, label: "", value: "" });

  edit = favorite => () => {
    this.setState({
      edit: true,
      id: favorite.id,
      label: favorite.label,
      value: favorite.value
    });
  };

  save = () => {
    if (this.state.add) {
      this.props.addFavorite({
        label: this.state.label,
        value: this.state.value
      });
    } else {
      this.props.editFavorite({
        id: this.state.id,
        label: this.state.label,
        value: this.state.value
      });
    }

    this.cancel();
  };

  cancel = () => this.setState({ add: false, edit: false });

  remove = () => {
    this.props.removeFavorite(this.state.id);
    this.cancel();
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar />
        <SimpleHeader title="Saved Wallets" onLeftButtonPress={this.back} />
        {this.state.add || this.state.edit ? (
          <KeyboardScroll>
            <View style={{ padding: 15 }}>
              <FormInput
                label="Label"
                placeholder="Offline wallet / Friends name"
                value={this.state.label}
                autoCapitalize="words"
                onChangeText={label => {
                  this.setState({ label });
                }}
              />
              <FormInput
                label="Public Key / Federation Address"
                placeholder="Enter public key"
                value={this.state.value}
                onChangeText={value => {
                  this.setState({ value });
                }}
              />
              <Button title="Save Wallet" onPress={this.save} />
              {this.state.edit && (
                <Text style={{ fontSize: 16, marginTop: 15 }}>
                  <TextLink onPress={this.remove}>Remove Wallet</TextLink>
                </Text>
              )}
              <Text style={{ fontSize: 16, marginTop: 15 }}>
                <TextLink onPress={this.cancel}>Cancel</TextLink>
              </Text>
            </View>
          </KeyboardScroll>
        ) : (
          <View style={{ flex: 1 }}>
            {this.props.favorites.length ? (
              <FlatList
                data={this.props.favorites}
                keyExtractor={item => item.id}
                ItemSeparatorComponent={() => (
                  <View style={styles.contactSeparator} />
                )}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={this.edit(item)}>
                    <ContactCard
                      type="lumen"
                      name={item.label}
                      displayValue={item.value}
                    />
                  </TouchableOpacity>
                )}
              />
            ) : (
              <View style={{ padding: 15, paddingBottom: 0 }}>
                <Text
                  style={{
                    color: theme.colorBodyCopy,
                    fontFamily: theme.fontBodyRegular,
                    fontSize: 16
                  }}
                >
                  Add a wallet or a federation address for easy access.
                </Text>
              </View>
            )}
            <View style={{ padding: 15 }}>
              <Button title="Add Wallet" onPress={this.add} />
            </View>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contactSeparator: {
    backgroundColor: theme.colorLightBorder,
    height: 1
  }
});

export default compose(
  connect(
    state => ({
      favorites: selectors.selectFavorites(state)
    }),
    {
      addFavorite: actions.addFavorite,
      removeFavorite: actions.removeFavorite,
      editFavorite: actions.editFavorite
    }
  )
)(Favorites);
