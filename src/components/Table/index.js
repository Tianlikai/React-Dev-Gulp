// import { themr } from 'react-css-themr';
// import { TABLE } from '../identifiers';
// import { Checkbox } from '../checkbox';1
// import { FontIcon } from '../font_icon';

import { tableFactory } from './Table';
import { tableHeadFactory } from './TableHead';
import { tableRowFactory } from './TableRow';
import { tableCellFactory } from './TableCell';
// import theme from './theme.css';

// const applyTheme = Component => themr(TABLE, theme)(Component);
const ThemedTableCell = tableCellFactory();
const ThemedTableHead = tableHeadFactory(ThemedTableCell);
const ThemedTableRow = tableRowFactory(ThemedTableCell);
const ThemedTable = tableFactory(ThemedTableHead, ThemedTableRow);

export default ThemedTable;
export { ThemedTable as Table };
export { ThemedTableHead as TableHead };
export { ThemedTableRow as TableRow };
export { ThemedTableCell as TableCell };