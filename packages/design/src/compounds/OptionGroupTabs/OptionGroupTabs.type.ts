/* @layer renderer-app @kind types */
type OptionGroupTab = { id: string; label: string; count: number };

type OptionGroupTabsProps = {
  tabs: OptionGroupTab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  query: string;
  onQueryChange: (query: string) => void;
  showAdvanced: boolean;
  onShowAdvancedChange: (show: boolean) => void;
  advancedCount: number;
};

export type { OptionGroupTabsProps };
