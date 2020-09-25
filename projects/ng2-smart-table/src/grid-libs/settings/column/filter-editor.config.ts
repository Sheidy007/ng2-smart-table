export class FilterOrEditorConfig {
  listSettings?: {
    resetText?: string;
    selectText?: string;
    listMembers: {
      value: string | number,
      title: string
    }[]
  };
  checkboxSettings?: {
    false: string | boolean | number;
    true: string | boolean | number;
  };
  completer?: {
    selectAllText?: string;
    selectText?: string;
    valueField: string,
    titleField: string
  };
}


