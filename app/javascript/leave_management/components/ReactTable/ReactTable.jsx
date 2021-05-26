/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import ReactTableLibrary from 'react-table-v6';
import PropTypes from 'prop-types';
import { filterCaseInsensitive } from '../../utils';
import Loading from '../../loading';
import NoData from '../../noData';

// import apiCall from '../../helpers/apiCall';

export default function ReactTable(props) {
  const {
    loading, ...tableProps
  } = props;

  return (
    <ReactTableLibrary
      NoDataComponent={loading ? Loading : NoData}
      defaultFilterMethod={filterCaseInsensitive}
      {...tableProps}
    />
  );
}

ReactTable.propTypes = {
  loading: PropTypes.bool.isRequired,
};

