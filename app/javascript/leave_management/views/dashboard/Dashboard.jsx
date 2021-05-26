import React, { useState, useEffect } from 'react';
import {
  Button,
  Badge,
  Table,
  Card, CardBody, CardHeader, Nav, Row, Col,
} from "reactstrap";
import ReactTable from "../../components/ReactTable/ReactTable";
import Jsona from 'jsona';
import apiCall from '../../helpers/apiCall';

export default function Dashboard(props) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    apiCall.fetchEntities('/leave_requests.json')
      .then((res) => {
        const dataFormatter = new Jsona();
        const eventData = dataFormatter.deserialize(res.data);
        setEvents(eventData);
      });
  }, []);
  
  const columns = [
    {
      Header: "First Name",
      accessor: "firstName"
    },
    {
      Header: "Last Name",
      accessor: "lastName"
    },
    {
      Header: "Age",
      accessor: "age"
    },
  ];
  
  return (
    <>
      <Card className="shadow">
        <CardHeader className="border-0 text-white bg-primary pb-6 px-5">
          <Row className="pt-4">
            <Col lg="6">
              <h6 className="fullcalendar-title h2 text-white d-inline-block mb-0 mr-1">
                Leave Requests
              </h6>
              <Nav aria-label="breadcrumb" className="d-none d-inline-block ml-lg-4">
                <ol className="breadcrumb breadcrumb-links breadcrumb-dark">
                  <li className="breadcrumb-item"><i className="fas fa-home" /></li>
                  <li className="breadcrumb-item active" aria-current="page">Dashboard</li>
                  <li className="breadcrumb-item" onClick={() => props.history.push('/admin/calendar')}>Calendar</li>
                </ol>
              </Nav>
            </Col>
          </Row>
        </CardHeader>
        <CardBody className="mt--6">
          <div className="bg-white shadow-lg p-5" style={{ borderRadius: 5 }}>
            <ReactTable
              resizable={false}
              data={events}
              loading={false}
              columns={[
                {
                  Header: "Username",
                  id: "name",
                  Cell: (row) => {
                    const {user} = row.original;
                    return `${user.first_name} ${user.last_name}`;
                  },
                },
                {
                  Header: "Start Date",
                  accessor: "start",
                },
                {
                  Header: "End Date",
                  accessor: "end",
                },
                {
                  id: "duration",
                  Header: "Duration",
                  Cell: (row) => {
                    const {start, end} = row.original;
                    const numberOfDays = Math.abs(new Date(start) - new Date(end))/86400000;
                    return numberOfDays;
                  },
                },
                {
                  Header: "Reason",
                  accessor: "title"
                },
                {
                  id: "status",
                  Header: "Status",
                  Cell: (row) => {
                    const {status} = row.original;
                    return (
                      <Badge color="" className="badge-dot float-right">
                        <i className="bg-info" />
                        {status}
                      </Badge>
                    )
                  },
                }
              ]}
              defaultPageSize={5}
              showPaginationBottom
              className="-striped -highlight"
            />
          </div>
        </CardBody>
      </Card>
    </>
  );
};