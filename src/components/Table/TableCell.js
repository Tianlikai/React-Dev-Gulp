import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

//升序
const ASC = 'asc';
//降序
const DESC = 'desc';

const factory = () => {
  class TableCell extends Component {
    static propTypes = {
      children: PropTypes.node,
      className: PropTypes.string,
      column: PropTypes.number,
      numeric: PropTypes.bool,
      onClick: PropTypes.func,
      row: PropTypes.number,
      sorted: PropTypes.oneOf([ASC, DESC]),
      tagName: PropTypes.oneOf(['td', 'th']),
      theme: PropTypes.shape({
        asc: PropTypes.string,
        headCell: PropTypes.string,
        numeric: PropTypes.string,
        rowCell: PropTypes.string,
        sorted: PropTypes.string,
        sortIcon: PropTypes.string,
        tableCell: PropTypes.string,
      }),
    };

    static defaultProps = {
      children: PropTypes.node,
      className: '',
      numeric: false,
      tagName: 'td',
    };

    handleClick = (event) => {
      const { onClick, row, column } = this.props;
      if (onClick) onClick(event, column, row);
    }

    render() {
      const {
        children,
        className,
        numeric,
        row,    // eslint-disable-line
        column, // eslint-disable-line
        sorted,
        tagName,
        theme,
        ...other
      } = this.props;

    //   const _className = classnames(, {
    //     [theme.headCell]: tagName === 'th',
    //     [theme.rowCell]: tagName === 'td',
    //     [theme.sorted]: sorted,
    //     [theme.numeric]: numeric,
    //   }, className);

      const props = {
        ...other,
        // className: _className,
        onClick: this.handleClick,
      };

      return (
        React.createElement(tagName, props, [
          sorted ,
          children,
        ])
      );
    }
  }

  return TableCell;
};

const TableCell = factory();
export { factory as tableCellFactory };
export { TableCell };