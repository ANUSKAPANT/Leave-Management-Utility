/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import ReactTableLibrary from 'react-table-v6';
import { filterCaseInsensitive } from '../../utils';
import Loading from '../../loading';
import NoData from '../../noData';

interface Props {
  loading: boolean;
  [x: string]: any;
}

const ReactTable:React.FC<Props> = (props) => {
  const { loading, ...tableProps } = props;
  
  return (
    <ReactTableLibrary
      NoDataComponent={loading ? Loading : NoData}
      defaultFilterMethod={filterCaseInsensitive}
      {...tableProps}
    />
  );
};

export default ReactTable;