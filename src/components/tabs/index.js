import { TabContent } from './TabContent';
import { tabFactory } from './Tab';
import { tabsFactory } from './Tabs';


const ThemedTabContent = TabContent;
const ThemedTab = tabFactory();
const ThemedTabs = tabsFactory(ThemedTab, ThemedTabContent);

export { ThemedTab as Tab };
export { ThemedTabs as Tabs };