const initializeInterop = StellarInterop => {
  const { StellarBase, CryptoJS, StellarHDWallet } = StellarInterop;
  const { AES, SHA256 } = CryptoJS;

  const waitForBridge = cb => {
    if (window.postMessage.length !== 1) {
      setTimeout(() => {
        waitForBridge(cb);
      }, 200);
    } else {
      cb();
    }
  };

  const sendMessage = data => window.postMessage(JSON.stringify(data));

  const generateKeypair = pkg => {
    const { id } = pkg;
    try {
      const mnemonic = StellarHDWallet.generateMnemonic();
      const wallet = StellarHDWallet.fromMnemonic(mnemonic);

      const publicKey = wallet.getPublicKey(0);
      const secretKey = wallet.getSecret(0);
      sendMessage({ id, mnemonic, publicKey, secretKey });
    } catch (e) {
      sendMessage({ id, error: e });
    }
  };

  const loadKeypairFromSecret = pkg => {
    const { id, data } = pkg;
    try {
      const { secretKey } = data;
      const pair = StellarBase.Keypair.fromSecret(secretKey);
      const publicKey = pair.publicKey();
      sendMessage({ id, publicKey, secretKey });
    } catch (e) {
      sendMessage({ id, error: e });
    }
  };

  const loadKeypairFromMnemonic = pkg => {
    const { id, data } = pkg;
    try {
      const { mnemonic } = data;
      const wallet = StellarHDWallet.fromMnemonic(mnemonic);
      sendMessage({
        id,
        publicKey: wallet.getPublicKey(0),
        secretKey: wallet.getSecret(0),
        mnemonic
      });
    } catch (e) {
      sendMessage({ id, error: e });
    }
  };

  const hashStrings = pkg => {
    const { id, data } = pkg;
    try {
      const { stringsToHash } = data;
      const hashedStrings = stringsToHash.map(stringToHash =>
        SHA256(stringToHash).toString()
      );
      sendMessage({ id, hashedStrings });
    } catch (e) {
      sendMessage({ id, error: e });
    }
  };

  const encryptString = pkg => {
    const { id, data } = pkg;
    try {
      const { decryptedString, password } = data;
      const encryptedString = AES.encrypt(decryptedString, password).toString();
      sendMessage({ id, encryptedString });
    } catch (e) {
      sendMessage({ id, error: e });
    }
  };

  const decryptString = pkg => {
    const { id, data } = pkg;
    try {
      const { encryptedString, password } = data;
      const decryptedString = AES.decrypt(encryptedString, password).toString(
        CryptoJS.enc.Utf8
      );

      sendMessage({ id, decryptedString });
    } catch (e) {
      sendMessage({ id, error: e });
    }
  };

  const createSignedValue = pkg => {
    const { id, data } = pkg;
    try {
      const { secretKey, value } = data;
      const keyPair = StellarBase.Keypair.fromSecret(secretKey);
      const signedValue = keyPair.sign(value).toString("hex");
      sendMessage({ id, signedValue });
    } catch (e) {
      sendMessage({ id, error: e });
    }
  };

  const createSignedTransaction = pkg => {
    const { id, data } = pkg;
    try {
      const {
        myPublicKey,
        mySecretKey,
        sequence,
        newAccount,
        contactPublicKey,
        useTestNetwork,
        needsInflationOperation,
        inflationDestination,
        amount,
        memo
      } = data;

      const account = new StellarBase.Account(myPublicKey, sequence);

      if (useTestNetwork) {
        StellarBase.Network.useTestNetwork();
      } else {
        StellarBase.Network.usePublicNetwork();
      }

      const setInflation =
        inflationDestination && needsInflationOperation
          ? StellarBase.Operation.setOptions({
              inflationDest: inflationDestination
            })
          : null;

      const operation = newAccount
        ? StellarBase.Operation.createAccount({
            destination: contactPublicKey,
            startingBalance: amount
          })
        : StellarBase.Operation.payment({
            destination: contactPublicKey,
            asset: StellarBase.Asset.native(),
            amount
          });

      const memoText = memo
        ? StellarBase.Memo.text(memo)
        : StellarBase.Memo.none();
      const transactionBuilder = new StellarBase.TransactionBuilder(account, {
        memo: memoText
      });

      if (setInflation) {
        transactionBuilder.addOperation(setInflation);
      }

      const transaction = transactionBuilder.addOperation(operation).build();

      const keypair = StellarBase.Keypair.fromSecret(mySecretKey);
      transaction.sign(keypair);

      const envelope = transaction.toEnvelope().toXDR("base64");
      sendMessage({ id, envelope });
    } catch (e) {
      sendMessage({ id, error: e });
    }
  };

  waitForBridge(() => {
    window.postMessage("__INITIALIZE_STELLAR_BRIDGE__");
    window.document.addEventListener("message", e => {
      const data = JSON.parse(e.data);

      switch (data.fn) {
        case "generateKeypair":
          generateKeypair(data);
          return;

        case "loadKeypairFromSecret":
          loadKeypairFromSecret(data);
          return;

        case "loadKeypairFromMnemonic":
          loadKeypairFromMnemonic(data);
          return;

        case "createSignedTransaction":
          createSignedTransaction(data);
          return;

        case "createSignedValue":
          createSignedValue(data);
          return;

        case "hashStrings":
          hashStrings(data);
          return;

        case "encryptString":
          encryptString(data);
          return;

        case "decryptString":
          decryptString(data);
          return;

        default:
          sendMessage({ id: data.id, error: "no matched function" });
          return;
      }
    });
  });
};

export default initializeInterop.toString();
