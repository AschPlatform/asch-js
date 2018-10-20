import * as Buffer from "buffer";

declare module "buffer";

/*
  crypto.js
*/
interface KeyBuffer {
  keypair: {
    publicKey: Uint8Array;
    secretKey: Uint8Array;
  };
  publicKey?: string;
  privateKey?: string;
}

declare enum SendingMode {
  DIRECT = 0,
  REQUEST = 1
}

interface MainchainTransaction {
  type: number;
  timestamp: number;
  fee: number;
  message?: string;
  args: any[];
  senderPublicKey?: string;
  senderId: string;
  signatures?: string[];
  id?: string;
  secondSignature?: string;
  requestorId?: string;
  height?: number;
  mode?: SendingMode;
}

interface Crypto {
  getBytes: (transaction: MainchainTransaction, skipSignature?: boolean, skipSecondSignature?: boolean) => ArrayBuffer | Uint8Array;
  getHash: (transaction: MainchainTransaction, skipSignature?: boolean, skipSecondSignature?: boolean) => Uint8Array;
  getId: (transaction: MainchainTransaction) => string;
  getFee: (transaction: MainchainTransaction) => number;
  sign: (transaction: any, keys: any) => any;
  secondSign: (transaction: MainchainTransaction, keys: KeyBuffer) => string;
  getKeys: (secret: string) => KeyBuffer;
  getAddress: (publicKey: string | Uint8Array) => string;
  verify: (transaction: MainchainTransaction) => boolean;
  verifySecondSignature: (transaction: MainchainTransaction, publicKey: string) => boolean;
  fixedPoint: number;
  signBytes: (bytes: any, keys: any)  => any;
  toLocalBuffer: (buf: Buffer) => ArrayBuffer | Uint8Array;
  verifyBytes: (bytes: string, signature: string, publicKey: string) => boolean;
  isAddress: (address: string) => boolean;
  isBase58CheckAddress: (address: string) => boolean;
}

/*
  chain.js
*/
interface ChainOptions {
  name: string;
  desc: string;
  link: string;
  icon: string;
  delegates: string[];
  unlockDelegates: number;
}

interface InnerTransactionOptions {
  args: any[];
  fee: string;
  type: number;
}

interface SidechainTransaction {
  fee: string;
  timestamp: number;
  senderPublicKey: string;
  type: number;
  args: any[];
  signature: string;
}

interface Chain {
  createChain: (options: ChainOptions, secret: string, secondSecret?: string) => MainchainTransaction;
  createInnerTransaction: (options: InnerTransactionOptions, secret: string) => SidechainTransaction;
}

/*
 basic.js
*/
interface Basic {
  setName: (username: string, secret: string, secondSecret?: string) => MainchainTransaction;
  setSecondSecret: (secret: string, secondSecret: string) => MainchainTransaction;
}

/*
  transfer.js
*/
interface Transfer {
  createInTransfer: (dappName: string, currency: string, amount: string, secret: string, secondSecret?: string) => MainchainTransaction;
  createOutTransfer: (sender: string, chain: string, recipient: string, currency: string, amount: string, wid: string, seq: number) => MainchainTransaction;
  signOutTransfer: (transaction: MainchainTransaction, secret: string) => string;
}

/*
  delegate.js
*/
interface Delegate {
  createDelegate: (secret: string, secondSecret?: string) => MainchainTransaction;
}

/*
  signature.js
*/
interface Signature {
  /**
   * @deprecated Use instead basic.setSecondSecret(secret, secondSecret)
   */
  createSignature: (secret: string, secondSecret: string) => MainchainTransaction;
}

/*
  vote.js
*/
interface Vote {
  createVote: (keyList: string[], secret: string, secondSecret?: string) => MainchainTransaction;
  deleteVote: (keyList: string[], secret: string, secondSecret?: string) => MainchainTransaction;
}

/*
  transaction.js
*/
interface CreateTransactionExParams {
  secret: string;
  type: number;
  fee: number;
  message?: string;
  args: string[];
  secondSecret?: string;
}

interface MultiSigTransactionParams {
  type: number;
  fee: number;
  senderId: string;
  requestId: string;
  mode: SendingMode;
  args: any[];
}

interface Transaction {
  createTransaction: (recipientId: string, amount: string, message: string, secret: string, secondSecret?: string) => MainchainTransaction;
  createTransactionEx: (params: CreateTransactionExParams) => MainchainTransaction;
  calculateFee: (amount: number) => number;
  createLock: (height: number, amount: number, secret: string, secondSecret?: string) => MainchainTransaction;
  unlock: (secret: string, secondSecret?: string) => MainchainTransaction;
  createMultiSigTransaction: (parmas: MultiSigTransactionParams) => any;
  signMultiSigTransaction: (transaction: any, secret: string) => any;
}

/*
  uia.js
*/
interface Uia {
  createIssuer: (name: string, desc: string, secret: string, secondSecret?: string) => MainchainTransaction;
  createAsset: (name: string, desc: string, maximum: number, precision: number, secret: string, secondSecret?: string) => MainchainTransaction;
  createIssue: (currency: string, amount: string, secret: string, secondSecret?: string) => MainchainTransaction;
  createTransfer: (currency: string, amount: string, recipientId: string, message: string, secret: string, secondSecret?: string) => MainchainTransaction;
}

/*
  group.js
*/
interface RegisterGroupParams {
  groupName: string;
  members: string[];
  min: number;
  max: number;
  m: number;
  updateInterval: number;
}

interface Group {
  registerGroup: (options: RegisterGroupParams, secret: string, secondSecret?: string) => MainchainTransaction;
  voteTransaction: (targetId: string, secret: string, secondSecret?: string) => MainchainTransaction;
  activateTransaction: (targetId: string, secret: string, secondSecret?: string) => MainchainTransaction;
  addMember: (address: string, weight: number, m: number, secret: string, secondSecret?: string) => MainchainTransaction;
  removeMember: (address: string, m: number, secret: string, secondSecret?: string) => MainchainTransaction;
  transformIntoGroupTransaction: (normalTransaction: MainchainTransaction, groupName: string, secret: string, secondSecret?: string) => MainchainTransaction;
}

/*
  agent.js
*/
interface Agent {
  registerAsAgent: (secret: string, secondSecret?: string) => MainchainTransaction;
  setAgent: (nickname: string, secret: string, secondSecret?: string) => MainchainTransaction;
  cancelAgent: (secret: string, secondSecret?: string) => MainchainTransaction;
}

/*
  proposal.js
*/
interface RegisterGatwayOptions {
  gatewayName: string;
  gatewayDesc: string;
  minmumMembers?: number;
  updateInterval?: number;
  currencySymbol: string;
  currencyDesc: string;
  currencyPrecision: number;
  proposalTitle?: string;
  proposalDesc?: string;
  proposalEndHeight: number;
}

interface InitGatewayOptions {
  gatewayName: string;
  gatewayMembers: string[];
  proposalTitle?: string;
  proposalDesc?: string;
  proposalEndHeight: number;
}

interface UpdateGatewayMemberOptions {
  gatewayName: string;
  fromAddress: string;
  toAddress: string;
  proposalTitle?: string;
  proposalDesc?: string;
  proposalEndHeight: number;
}

interface RevokeGatewayOptions {
  gatewayName: string;
  proposalTitle?: string;
  proposalDesc?: string;
  proposalEndHeight: number;
}

interface Proposal {
	registerGateway: (options: RegisterGatwayOptions, secret: string, secondSecret?: string) => MainchainTransaction;
	initGateway: (options: InitGatewayOptions, secret: string, secondSecret?: string) => MainchainTransaction;
	updateGatewayMember: (options: UpdateGatewayMemberOptions, secret: string, secondSecret?: string) => MainchainTransaction;
	revokeGateway: (options: RevokeGatewayOptions, secret: string, secondSecret?: string) => MainchainTransaction;
	activateProposal: (tid: string, secret: string, secondSecret?: string) => MainchainTransaction;
	upvoteProposal: (tid: string, secret: string, secondSecret?: string) => MainchainTransaction;
}

/*
  gateway.js
*/
interface Gateway {
  registerMember: (gateway: string, memberPublicKey: string, secret: string, secondSecret?: string) => MainchainTransaction;
}

/*
  options.js
*/
interface Options {
  set: (key: string, value: any) => void;
  get: (key: string) => any;
  getAll: () => any[];
}

/*
  slots.js
*/
interface Slots {
  interval: number;
  delegates: number;
  getTime: (time: number) => number;
  getRealTime: (epochTime?: string) => number;
  getSlotNumber: (epochTime?: number) => number;
  getSlotTime: (slot: number) => number;
  getNextSlot: () => number;
  getLastSlot: (nextSlot: string) => number;
  beginEpochTime: () => number;
}

/*
  format.js
*/
interface Format {
  timeAgo: (time: number) => string;
  fullTimestamp: (time: number) => string;
}

/*
  asch-js
*/
export = asch_js;

declare const asch_js: {
  basic: Basic,
  crypto: Crypto,
  chain: Chain,
  transfer: Transfer,
  delegate: Delegate,
  signature: Signature,
  transaction: Transaction,
  vote: Vote,
  uia: Uia,
  group: Group,
  agent: Agent,
  proposal: Proposal,
  gateway: Gateway,
  options: Options,
  utils: {
    slots: Slots,
    format: Format
  }
};
