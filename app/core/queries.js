import gql from 'graphql-tag';

export const keyPairData = gql`
  query keyPairData($publicKey: String!, $signedValue: String!) {
    keyPairData(publicKey: $publicKey, signedValue: $signedValue) {
      link
      linkType
      verified
      firstName
      lastName
    }
  }
`;

export const checkMaintenance = gql`
  query checkMaintenance {
    maintenanceMode
  }
`;

export const inflationDestination = gql`
  query inflationDestination {
    inflationDestination
  }
`;

export const betaInfo = gql`
  query betaInfo {
    betaInfo {
      code
      link
      linkTitle
    }
  }
`;

export const publicLinks = gql`
  query publicLinks(
    $hashLinks: [String]
    $publicKey: String!
    $signedValue: String!
    $verified: Boolean
  ) {
    publicLinks(
      hashLinks: $hashLinks
      publicKey: $publicKey
      signedValue: $signedValue
      verified: $verified
    ) {
      link
      linkType
      publicKey
      verified
    }
  }
`;

export const createPendingTransfer = gql`
  mutation createPendingTransfer(
    $publicKey: String!
    $signedValue: String!
    $pushRequestId: String
    $firstName: String!
    $lastName: String!
    $amount: String!
    $type: String!
    $value: String!
    $fiat: String!
    $memo: String
  ) {
    createPendingTransfer(
      publicKey: $publicKey
      signedValue: $signedValue
      pushRequestId: $pushRequestId
      firstName: $firstName
      lastName: $lastName
      amount: $amount
      type: $type
      value: $value
      fiat: $fiat
      memo: $memo
    ) {
      id
    }
  }
`;

export const recordTransaction = gql`
  mutation createTransfer(
    $publicKey: String!
    $signedValue: String!
    $pendingId: Int
    $publicKeyTo: String!
    $amount: String!
    $memo: String
    $fiat: String
  ) {
    createTransfer(
      publicKey: $publicKey
      signedValue: $signedValue
      pendingId: $pendingId
      publicKeyTo: $publicKeyTo
      amount: $amount
      memo: $memo
      fiat: $fiat
    ) {
      id
    }
  }
`;

export const upsertPublicLink = gql`
  mutation upsertPublicLink(
    $publicKey: String!
    $signedValue: String!
    $link: InputLink!
    $firstName: String!
    $lastName: String!
  ) {
    upsertPublicLink(
      publicKey: $publicKey
      signedValue: $signedValue
      link: $link
      firstName: $firstName
      lastName: $lastName
    )
  }
`;

export const verifyPhoneNumber = gql`
  mutation verifyPhone($publicKey: String!, $code: String!) {
    verifyPhone(publicKey: $publicKey, verificationCode: $code)
  }
`;

export const verifyEmailAddress = gql`
  mutation verifyEmail($publicKey: String!, $code: String!) {
    verifyEmail(publicKey: $publicKey, verificationCode: $code)
  }
`;

export const resendVerification = gql`
  mutation resendVerification(
    $publicKey: String!
    $signedValue: String!
    $linkType: String!
  ) {
    resendVerification(
      publicKey: $publicKey
      signedValue: $signedValue
      linkType: $linkType
    )
  }
`;

export const deleteAccount = gql`
  mutation deleteAccount($publicKey: String!, $signedValue: String!) {
    deleteAccount(publicKey: $publicKey, signedValue: $signedValue)
  }
`;

export const incomingPending = gql`
  query incomingPending($publicKey: String!, $signedValue: String!) {
    incomingPending(publicKey: $publicKey, signedValue: $signedValue) {
      publicKey
      pendingMemo
      amount
      createdAt
    }
  }
`;

export const cancelPending = gql`
  mutation cancelPending(
    $publicKey: String!
    $signedValue: String!
    $pendingId: Int!
    $fromFailure: Boolean
  ) {
    cancelPending(
      publicKey: $publicKey
      signedValue: $signedValue
      pendingId: $pendingId
      fromFailure: $fromFailure
    )
  }
`;

export const recordPushRequestId = gql`
  mutation recordPushRequestId(
    $publicKey: String!
    $signedValue: String!
    $pushRequestId: String!
  ) {
    recordPushRequestId(
      publicKey: $publicKey
      signedValue: $signedValue
      pushRequestId: $pushRequestId
    )
  }
`;
