import { createSelector } from "reselect";
import Big from "bignumber.js";
import { PENDING_STATUS } from "app/core/reducer";
import { numberWithCommas, originalSuffixOf } from "app/lib/number-utils";
import normalizePhone from "app/core/lib/normalizePhone";

const round = (value, decimals = 10) =>
  Number(Math.round(value + "e" + decimals) + "e-" + decimals);

const stellarNetworkFee = new Big(".00001");

// eslint-disable-next-line
const normalizePhoneInput = str => str.replace(/[\(\)\s\-\+]/g, "");

const monthName = num => {
  switch (num) {
    case 0:
      return "January";
    case 1:
      return "February";
    case 2:
      return "March";
    case 3:
      return "April";
    case 4:
      return "May";
    case 5:
      return "June";
    case 6:
      return "July";
    case 7:
      return "August";
    case 8:
      return "September";
    case 9:
      return "October";
    case 10:
      return "November";
    case 11:
      return "December";
    default:
      return "";
  }
};

export const selectContactsFilter = state => state.contactsFilter;

export const selectFilterFederation = createSelector(
  selectContactsFilter,
  filter => {
    const [name, server] = filter.split("*");
    if (!name || !server) return [null, null];
    return [name, server, filter];
  }
);

export const selectFilterFederationAddress = state =>
  state.filterFederationAddress || "";

export const selectFilterMatchesFederation = state => {
  const [name, server] = selectFilterFederation(state);
  return !!(name && server);
};

export const selectFilterFederationWithAddress = createSelector(
  selectFilterMatchesFederation,
  selectFilterFederationAddress,
  (matchesFederation, federationAddress) =>
    !!(matchesFederation && federationAddress)
);

export const selectFilterMatchesPhone = createSelector(
  selectContactsFilter,
  selectFilterFederationWithAddress,
  (filter, federation) =>
    !federation &&
    !!filter.match(
      /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/
    )
);

export const selectFilterMatchesEmail = createSelector(
  selectContactsFilter,
  selectFilterFederationWithAddress,
  (filter, federation) =>
    !federation &&
    !!filter.match(
      // eslint-disable-next-line
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
);

export const selectBetaCode = state =>
  state.appFlow.betaInfo ? state.appFlow.betaInfo.code : null;

export const selectBetaLinkTitle = state =>
  state.appFlow.betaInfo ? state.appFlow.betaInfo.linkTitle : "";
export const selectBetaLink = state =>
  state.appFlow.betaInfo ? state.appFlow.betaInfo.link : "";

export const selectNeedsBetaRequest = state =>
  !state.appFlow.betaAccess && !state.appFlow.hasCompletedOnboarding;

export const selectNeedsBeta = state =>
  selectNeedsBetaRequest(state) && selectBetaCode(state);

export const selectHasBackedUpKeys = state =>
  state.appFlow.backedUpKeysOrWords || false;

export const selectFilterMatchesLumen = createSelector(
  selectContactsFilter,
  filter => filter.length === 56 && filter.startsWith("G")
);

export const selectNormalizedContactsFilter = createSelector(
  selectContactsFilter,
  selectFilterMatchesPhone,
  selectFilterMatchesLumen,
  (filter, isPhone, isLumen) => {
    if (isPhone) {
      return normalizePhone(filter);
    }

    if (isLumen) {
      // return what they enter exactly
      return filter;
    }

    return filter.trim().toLowerCase();
  }
);

export const selectFirstName = state => state.name.firstName || "";
export const selectLastName = state => state.name.lastName || "";
export const selectPhone = state => state.keypairLinks.phone || "";
export const selectEmail = state => state.keypairLinks.email || "";
export const selectUserName = state => state.keypairLinks.userName || "";
export const selectPhoneVerified = state =>
  state.keypairLinks.phoneVerified || false;
export const selectEmailVerified = state =>
  state.keypairLinks.emailVerified || false;

export const selectFederationAddresses = createSelector(
  selectPhone,
  selectPhoneVerified,
  selectEmail,
  selectEmailVerified,
  selectUserName,
  (phone, phoneVerified, email, emailVerified, userName) => {
    return [
      phone && phoneVerified ? phone : null,
      email && emailVerified ? email : null,
      userName ? userName : null
    ];
  }
);

export const selectHasFederationAddress = state => {
  const [phone, email, userName] = selectFederationAddresses(state);
  return !!(phone || email || userName);
};

export const selectFilterMatchType = createSelector(
  selectFilterFederationWithAddress,
  selectFilterMatchesPhone,
  selectFilterMatchesEmail,
  selectFilterMatchesLumen,
  (matchFederation, matchPhone, matchEmail, matchLumen) => {
    if (matchFederation) return "federation";
    if (matchPhone) return "phone";
    if (matchEmail) return "email";
    if (matchLumen) return "lumen";
    return "";
  }
);

export const selectContacts = state => state.contacts || [];

export const selectNeedsTouchId = state => state.security.touchId || false;

export const selectContactsInputLinks = createSelector(
  selectContacts,
  contacts =>
    contacts.map(contact => ({
      linkType: contact.type,
      link: contact.value
    }))
);

export const selectInflationDestination = state =>
  state.inflationDestination || "";

export const selectHasCompletedIntro = state => state.appFlow.hasCompletedIntro;
export const selectHasCompletedOnboarding = state =>
  state.appFlow.hasCompletedOnboarding;

export const selectHasGrantedAndroidContactPermissions = state =>
  state.appFlow.hasGrantedAndroidContactPermission || false;

export const selectPreferredCurrency = state =>
  state.preferredCurrency || "USD";

export const selectRawMnemonicString = state => state.keypair.mnemonic || "";
export const selectPublicKey = state => state.keypair.publicKey;
export const selectRawSecretKey = state => state.keypair.secretKey;

export const selectHasEncryptedSecretKey = createSelector(
  selectRawSecretKey,
  sk => sk && sk.length && sk.length !== 56 && !sk.startsWith("S")
);

export const selectDecryptedSecretKey = state =>
  state.protectedKeypair.decryptedSecretKey || "";

export const selectDecryptedMnemonic = state =>
  state.protectedKeypair.decryptedMnemonic || "";

export const selectMnemonicString = createSelector(
  selectHasEncryptedSecretKey,
  selectDecryptedMnemonic,
  selectRawMnemonicString,
  (secretKeyIsEncrypted, decryptedMnenomic, rawMnenomic) =>
    secretKeyIsEncrypted ? decryptedMnenomic : rawMnenomic
);

export const selectMnemonic = state => selectMnemonicString(state).split(" ");

export const selectFailedPinGuesses = state =>
  state.protectedKeypair.failedGuesses || 0;

export const selectProcessPendingPinPrompt = state =>
  state.protectedKeypair.processPendingPromptPin || false;

export const selectSecretKey = createSelector(
  selectHasEncryptedSecretKey,
  selectDecryptedSecretKey,
  selectRawSecretKey,
  (secretKeyIsEncrypted, decryptedSecretKey, rawSecretKey) =>
    secretKeyIsEncrypted ? decryptedSecretKey : rawSecretKey
);

export const selectSecretKeyIsDecrypted = createSelector(
  selectSecretKey,
  sk => !!sk
);

export const selectSecretCanProcess = createSelector(
  selectHasEncryptedSecretKey,
  selectSecretKeyIsDecrypted,
  (hasEncryptedKey, encryptedKeyIsDecrypted) =>
    !hasEncryptedKey || !!encryptedKeyIsDecrypted
);

export const selectSignedValue = state => state.keypair.signedValue;

// export const selectPushRequestId = state => state.keypair.pushRequestId;

export const selectPreferredCurrencySymbol = createSelector(
  selectPreferredCurrency,
  preferredCurrency => {
    switch (preferredCurrency) {
      case "USD":
        return "$";
      case "EUR":
        return "€";
      case "AUD":
        return "A$";
      case "BRL":
        return "R$";
      case "CAD":
        return "C$";
      case "CHF":
        return "CHF";
      case "CLP":
        return "$";
      case "CNY":
        return "¥";
      case "CZK":
        return "Kč";
      case "DKK":
        return "kr";
      case "GBP":
        return "£";
      case "HKD":
        return "$";
      case "HUF":
        return "Ft";
      case "IDR":
        return "Rp";
      case "ILS":
        return "₪";
      case "INR":
        return "₹";
      case "JPY":
        return "¥";
      case "KRW":
        return "₩";
      case "MXN":
        return "$";
      case "MYR":
        return "RM";
      case "NOK":
        return "kr";
      case "NZD":
        return "$";
      case "PHP":
        return "₱";
      case "PKR":
        return "₨";
      case "PLN":
        return "zł";
      case "RUB":
        return "руб";
      case "SEK":
        return "kr";
      case "SGD":
        return "S$";
      case "THB":
        return "฿";
      case "TRY":
        return "TL";
      case "TWD":
        return "NT$";
      case "ZAR":
        return "R";
      default:
        return "*";
    }
  }
);

export const selectLumenRate = createSelector(
  state => state.lumenPrice.rate || "0",
  rate => new Big(round(rate))
);

export const selectBitcoinRate = createSelector(
  state => state.bitcoinPrice.rate || "0",
  rate => new Big(round(rate))
);

export const selectEthereumRate = createSelector(
  state => state.ethereumPrice.rate || "0",
  rate => new Big(round(rate))
);

export const selectLitecoinRate = createSelector(
  state => state.litecoinPrice.rate || "0",
  rate => new Big(round(rate))
);

export const selectMobiusRate = createSelector(
  state => state.mobiusPrice.rate || "0",
  rate => new Big(round(rate))
);

export const selectLumenCap = createSelector(
  state => state.lumenPrice.marketCap,
  marketCap => "$" + numberWithCommas(parseInt(marketCap, 10))
);

export const selectLumenUpdatedAt = state => state.lumenPrice.date;

export const selectLumenRank = createSelector(
  state => state.lumenPrice.rank,
  rank => originalSuffixOf(parseInt(rank, 10))
);

export const selectLumenDisplayRate = createSelector(selectLumenRate, rate =>
  rate.toFixed(2)
);

export const selectBitcoinDisplayRate = createSelector(
  selectBitcoinRate,
  rate => rate.toFixed(2)
);

export const selectEthereumDisplayRate = createSelector(
  selectEthereumRate,
  rate => rate.toFixed(2)
);

export const selectLitecoinDisplayRate = createSelector(
  selectLitecoinRate,
  rate => rate.toFixed(2)
);

export const selectMobiusDisplayRate = createSelector(selectMobiusRate, rate =>
  rate.toFixed(2)
);

export const selectLumenPercentChange = createSelector(
  state => state.lumenPrice.percentChange24 || "",
  percentChange => ({ negative: percentChange.includes("-"), percentChange })
);

export const selectBitcoinPercentChange = createSelector(
  state => state.bitcoinPrice.percentChange24 || "",
  percentChange => ({ negative: percentChange.includes("-"), percentChange })
);

export const selectEthereumPercentChange = createSelector(
  state => state.ethereumPrice.percentChange24 || "",
  percentChange => ({ negative: percentChange.includes("-"), percentChange })
);

export const selectLitecoinPercentChange = createSelector(
  state => state.litecoinPrice.percentChange24 || "",
  percentChange => ({ negative: percentChange.includes("-"), percentChange })
);

export const selectMobiusPercentChange = createSelector(
  state => state.mobiusPrice.percentChange24 || "",
  percentChange => ({ negative: percentChange.includes("-"), percentChange })
);

const TEN_DAYS = 1000 * 60 * 60 * 24 * 10;
export const selectPendingTransactions = createSelector(
  state => state.pendingTransactions || {},
  pendingTransactions =>
    Object.keys(pendingTransactions)
      .map(key => pendingTransactions[key])
      .map(transaction => ({
        ...transaction,
        amount: new Big(transaction.amount)
      }))
      .filter(
        pendingTransaction => pendingTransaction.date - Date.now() < TEN_DAYS
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date))
);

export const selectPendingProcessingTransactions = createSelector(
  selectPendingTransactions,
  pendingTransactions =>
    pendingTransactions.filter(
      pendingTransaction =>
        pendingTransaction.status === PENDING_STATUS.PROCESSING
    )
);

export const selectHasMatchingInflationDestination = state => {
  const desiredInflationDestination = selectInflationDestination(state);
  if (desiredInflationDestination) {
    return (
      state.stellarAccount.inflationDestination === desiredInflationDestination
    );
  }

  return true;
};

const selectLumenPendingBalance = createSelector(
  selectPendingTransactions,
  selectHasMatchingInflationDestination,
  (pendingTransactions, hasMatchingInflation) => {
    const baseAmount =
      !pendingTransactions.length || hasMatchingInflation
        ? new Big(0)
        : stellarNetworkFee;

    return pendingTransactions.reduce(
      (pendingTransactionTotal, pendingTransaction) =>
        pendingTransactionTotal
          .plus(new Big(pendingTransaction.amount))
          .plus(stellarNetworkFee),
      baseAmount
    );
  }
);

export const selectAvailableLumenBalance = createSelector(
  state => state.stellarAccount.balance || 0,
  selectLumenPendingBalance,
  (balance, pendingBalance) => new Big(round(balance)).minus(pendingBalance)
);

const selectIncomingLumenBalance = createSelector(
  state => state.incomingPendingTransactions || [],
  incomingPending =>
    incomingPending.reduce(
      (acc, ip) => acc.plus(new Big(ip.amount)),
      new Big(0)
    )
);

export const selectLumenBalance = createSelector(
  selectAvailableLumenBalance,
  selectIncomingLumenBalance,
  (availableBalance, incomingPendingBalance) =>
    availableBalance.plus(incomingPendingBalance)
);

export const selectZeroBalance = createSelector(selectLumenBalance, balance =>
  balance.equals(0)
);

export const selectLumenSequence = createSelector(
  state => state.stellarAccount.sequence || 0,
  sequence => new Big(sequence)
);

export const selectHasIncomingBalance = createSelector(
  selectIncomingLumenBalance,
  balance => balance.greaterThan(0)
);

export const selectIncomingDisplayLumenBalance = createSelector(
  selectIncomingLumenBalance,
  ib => ib.toString()
);

export const selectLumenDisplayBalance = createSelector(
  selectLumenBalance,
  balance => balance.toString()
);

const selectBitcoinBalance = createSelector(
  state => state.otherBalances.bitcoinBalance || 0,
  balance => new Big(round(balance))
);

const selectEthereumBalance = createSelector(
  state => state.otherBalances.ethereumBalance || 0,
  balance => new Big(round(balance))
);

const selectLitecoinBalance = createSelector(
  state => state.otherBalances.litecoinBalance || 0,
  balance => new Big(round(balance))
);

const selectMobiusBalance = createSelector(
  state => state.otherBalances.mobiusBalance || 0,
  balance => new Big(round(balance))
);

export const selectBitcoinDisplayBalance = createSelector(
  selectBitcoinBalance,
  balance => balance.toString()
);

export const selectEthereumDisplayBalance = createSelector(
  selectEthereumBalance,
  balance => balance.toString()
);

export const selectLitecoinDisplayBalance = createSelector(
  selectLitecoinBalance,
  balance => balance.toString()
);

export const selectMobiusDisplayBalance = createSelector(
  selectMobiusBalance,
  balance => balance.toString()
);

export const selectLumenFiatDisplayBalance = createSelector(
  selectLumenRate,
  selectLumenBalance,
  (rate, balance) => balance.times(rate).toFixed(2)
);

export const selectBitcoinFiatDisplayBalance = createSelector(
  selectBitcoinRate,
  selectBitcoinBalance,
  (rate, balance) => balance.times(rate).toFixed(2)
);

export const selectEthereumFiatDisplayBalance = createSelector(
  selectEthereumRate,
  selectEthereumBalance,
  (rate, balance) => balance.times(rate).toFixed(2)
);

export const selectLitecoinFiatDisplayBalance = createSelector(
  selectLitecoinRate,
  selectLitecoinBalance,
  (rate, balance) => balance.times(rate).toFixed(2)
);

export const selectMobiusFiatDisplayBalance = createSelector(
  selectMobiusRate,
  selectMobiusBalance,
  (rate, balance) => balance.times(rate).toFixed(2)
);

export const selectBitcoinZeroBalance = createSelector(
  selectBitcoinBalance,
  balance => balance.equals(0)
);

export const selectLitecoinZeroBalance = createSelector(
  selectLitecoinBalance,
  balance => balance.equals(0)
);

export const selectEthereumZeroBalance = createSelector(
  selectEthereumBalance,
  balance => balance.equals(0)
);

export const selectMobiusZeroBalance = createSelector(
  selectMobiusBalance,
  balance => balance.equals(0)
);

export const selectHasNonPendingTransactions = createSelector(
  state => state.transactions || {},
  transactions => Object.keys(transactions).length > 0
);

export const selectTransactionCursor = createSelector(
  state => state.transactions || {},
  transactions => {
    const keys = Object.keys(transactions);
    const lastTransaction =
      transactions[
        keys.sort(
          (aId, bId) =>
            new Date(transactions[aId].createdAt) <
            new Date(transactions[bId].createdAt)
              ? 1
              : -1
        )[keys.length - 1]
      ];

    return lastTransaction ? lastTransaction.pagingToken : null;
  }
);

const contactFilterSearch = filterInput => contact =>
  (contact.name &&
    contact.name.toLowerCase().includes(filterInput.toLowerCase())) ||
  (contact.value &&
    contact.value.toLowerCase().includes(filterInput.toLowerCase())) ||
  (contact.type === "phone" &&
    normalizePhoneInput(contact.value).includes(
      normalizePhoneInput(filterInput)
    ));

const selectLumenContacts = createSelector(
  selectContacts,
  selectContactsFilter,
  state => state.lumenContacts || [],
  (contacts, filter, lumenContacts) =>
    lumenContacts
      .map(lumenContact => {
        const contact =
          contacts.find(
            contact =>
              contact.type === lumenContact.linkType &&
              contact.value === lumenContact.link
          ) || {};

        return {
          ...lumenContact,
          ...contact,
          displayType: "lumen"
        };
      })
      .filter(contactFilterSearch(filter))
      .sort((a, b) => {
        const textA = a.name.toLowerCase();
        const textB = b.name.toLowerCase();
        return textA < textB ? -1 : textA > textB ? 1 : 0;
      })
      .reduce(
        (acc, contact, index, list) =>
          // dont add dupe contacts, and prefer email display if available
          acc.find(c => c.publicKey === contact.publicKey) ||
          list.find(
            c =>
              c.publicKey === contact.publicKey &&
              c.type === "email" &&
              contact.type === "phone"
          )
            ? acc
            : [...acc, contact],
        []
      )
);

const selectNonLumenContacts = createSelector(
  selectLumenContacts,
  selectContacts,
  selectContactsFilter,
  (lumenContacts, contacts, filter) =>
    contacts.filter(
      contact =>
        contactFilterSearch(filter)(contact) &&
        !lumenContacts.find(c => c.name === contact.name)
    )
);

export const selectFavorites = createSelector(
  state => state.favorites,
  favorites =>
    Object.keys(favorites).map(d => {
      const r = favorites[d];
      return { ...r, id: d };
    })
);

export const selectFavoritesForTransfer = createSelector(
  selectFavorites,
  favorites =>
    favorites.map(favorite => ({
      type: "lumen",
      name: favorite.label,
      displayValue: favorite.value,
      value: favorite.value,
      forceSearch: true
    }))
);

export const selectGroupedContacts = createSelector(
  selectLumenContacts,
  selectNonLumenContacts,
  selectFavoritesForTransfer,
  (lumenContacts, nonLumenContacts, favorites) => {
    return [
      favorites.length > 0 && { title: "Saved Wallets", data: favorites },
      lumenContacts.length > 0 && { title: "Lumenettes", data: lumenContacts },
      nonLumenContacts.length > 0 && {
        title: "All Contacts",
        data: nonLumenContacts
      }
    ].filter(Boolean);
  }
);

export const selectContactsCount = createSelector(
  selectLumenContacts,
  selectNonLumenContacts,
  (a, b) => a.length + b.length
);

const selectIncomingPendingTransactions = createSelector(
  state => state.incomingPendingTransactions || {},
  selectLumenContacts,
  (incomingTransactions, lumenContacts) => {
    return incomingTransactions.map((ic, ndx) => {
      const lumenContact = lumenContacts.find(
        lc => lc.publicKey === ic.publicKey
      );
      const date = new Date(ic.createdAt);
      const month = monthName(date.getMonth());
      const year = date.getFullYear();

      return {
        id: `ic--${ndx}`,
        amount: new Big(ic.amount).toString(),
        with: lumenContact ? lumenContact.name : "Someone",
        memo: ic.pendingMemo,
        incomingPending: true,
        outgoing: false,
        from: ic.publicKey,
        date: `${month} ${date.getDate()}, ${year}`
      };
    });
  }
);

export const selectGroupedTransactions = createSelector(
  selectPublicKey,
  selectPendingTransactions,
  selectIncomingPendingTransactions,
  state => state.transactions || {},
  selectLumenContacts,
  (
    publicKey,
    pendingTransactions,
    incomingPendingTransactions,
    transactions,
    lumenContacts
  ) => {
    const mappedPendingTransactions = pendingTransactions
      .map(pendingTransaction => {
        const date = new Date(pendingTransaction.date);
        const month = monthName(date.getMonth());
        const year = date.getFullYear();
        return {
          id: pendingTransaction.date,
          pending: true,
          outgoing: true,
          pendingType: pendingTransaction.type,
          pendingValue: pendingTransaction.value,
          pendingStatus: pendingTransaction.status,
          with: pendingTransaction.name || "someone",
          amount: new Big(pendingTransaction.amount).toString(),
          memo: pendingTransaction.memo,
          date: `${month} ${date.getDate()}, ${year}`
        };
      })
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (a.pendingStatus > b.pendingStatus) {
          return -1;
        } else if (a.pendingStatus < b.pendingStatus) {
          return 1;
        } else if (dateA > dateB) {
          return -1;
        } else if (dateA < dateB) {
          return 1;
        } else {
          return 0;
        }
      });

    const pendingAndIncomingPending = [
      ...incomingPendingTransactions,
      ...mappedPendingTransactions
    ];

    const pendingGroup =
      pendingAndIncomingPending.length > 0
        ? {
            title: "Pending",
            data: pendingAndIncomingPending
          }
        : null;

    const groupedTransactions = Object.keys(transactions)
      .sort(
        (aId, bId) =>
          new Date(transactions[aId].createdAt) <
          new Date(transactions[bId].createdAt)
            ? 1
            : -1
      )
      .reduce((acc, transactionId) => {
        const transaction = transactions[transactionId];
        const date = new Date(transaction.createdAt);
        const month = monthName(date.getMonth());
        const year = date.getFullYear();
        const groupKey = `${month} ${year}`;
        const outgoing = transaction.from === publicKey;
        const transactionPair = outgoing ? transaction.to : transaction.from;
        const matchedContact = lumenContacts.find(
          lc => lc.publicKey === transactionPair
        );

        return {
          ...acc,
          [groupKey]: [
            ...(acc[groupKey] || []),
            {
              id: transaction.id,
              outgoing,
              with: matchedContact
                ? matchedContact.name
                : outgoing ? "someone" : "Someone",
              from: transaction.from,
              to: transaction.to,
              memo: transaction.memo,
              amount: new Big(transaction.amount).toString(),
              date: `${month} ${date.getDate()}, ${year}`
            }
          ]
        };
      }, {});

    const sortedGroups = Object.keys(groupedTransactions)
      .sort(
        (a, b) =>
          new Date(groupedTransactions[b][0].createdAt) -
          new Date(groupedTransactions[a][0].createdAt)
      )
      .map(key => ({ title: key, data: groupedTransactions[key] }));

    return [...(pendingGroup ? [pendingGroup] : []), ...sortedGroups];
  }
);

export const selectIsMaintenanceMode = state =>
  state.maintenanceMode && state.maintenanceMode.maintenanceMode;

export const selectMaintenanceModeReason = state =>
  selectIsMaintenanceMode(state) ? state.maintenanceMode.maintenanceReason : "";

export const selectIsMaintenanceModeForceUpgrade = state =>
  state.maintenanceMode && state.maintenanceMode.maintenanceForceUpgrade;
