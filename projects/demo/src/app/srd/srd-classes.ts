export class CorporateAction {
  cActionId: number;
  accountingSystem: number;
  corpRefId: string;
  assetName: string;
  assetCode: string;
  isin: string;
  rcvDateTime: string;
  caDate: string;
  recordDate: string;
  deadline: string;
  clientDeadline: string;
  threshold: number;
  qtyAvailable: number;
  status: number;
  caType: number;
  srdIndicator: boolean;
  mandatoryIndicator: string;
  tableInfo: any[];
  highlight: boolean;
  refIdAndAssetName: string;
}

export class CorporateEvent {
  cntAttachments: number;
  caEventId: number;
  accountingSystem: number;
  sender: number;
  reciever: number;
  rcvDateTime: string;
  senderMessageId: string;
  relatedMessageId: string;
  depoAccount: string;
  corpRefId: string;
  caTypeId: number;
  isSrd: boolean;
  caEventProcStatusId: number;
  mandatoryIndicator: string;
  assetName: string;
  assetCode: string;
  isin: string;
  caEventExtStatusId: number;
  qtyAvailable: number;
  qtyDesc: string;
  qtyMain: number;
  recordDate: string;
  meetingDate: string;
  threshold: number;
  place: string;
  web: string;
  deadline: string;
  clientDeadline: string;
  caEventStatusId: number;
  closedDate: string;
  swiftId: number;
  tableInfo: any[];
}

export class Shareholder {
  cpId: number;
  ownerId: number;
  vaultId: number;
  name: string;
  accountType: string;
  regAddress: string;
  passport: string;
  registration: string;
  email: string;
  qtyWillBe: number;
  qtyAvailable: number;
  qtyDate: string;
  recordDate: string;
  wayOfInform: string;
  informDateTime: string;
  manualStatus: number;
}

export class Dictionaries {
  accountingSystems: DictionaryClass[];
  activityStatuses: DictionaryClass[];
  activityTypes: DictionaryClass[];

  senders: DictionaryClass[];
  eventStatuses: DictionaryClass[];
  eventProcStatuses: DictionaryClass[];

  swiftStatuses: DictionaryClass[];
  vaults: DictionaryClass[];

  manualStatuses: DictionaryClass[];
}

export class NotifyShareholders {
  corpAction: CorporateAction;
  corpEvent: CorporateEvent;
  shareholders: Shareholder[];
}

export class DictionaryClass {
  value: number;
  title: string;
  titleRus: string;
  titleEng: string;
}

export class RequestCorporateActionsBase {
  caTypeId?: number;
  begDate?: string;
  endDate?: string;
  isin?: string;
  caStatusId = '1';
  isOnlyActive = true;
  isOnlySRD = false;
  poa = 0;

  constructor() {}
}
