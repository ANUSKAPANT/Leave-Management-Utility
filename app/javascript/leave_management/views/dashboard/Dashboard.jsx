import React, { useState, useEffect } from 'react';
import {
    Button,
    Badge,
    Table,
    Card, CardBody, CardHeader, Nav, Row, Col, Modal, Input,
} from "reactstrap";
import ReactTable from "../../components/ReactTable/ReactTable";
import Jsona from 'jsona';
import apiCall from '../../helpers/apiCall';
import NotifyUser from '../../components/Alert/NotifyUser';

export default function Dashboard(props) {
  const [events, setEvents] = useState([]);
  const [updateLeaveRequest, setUpdateLeaveRequest] = useState(false)
  const [leaveTitle, setLeaveTitle] = useState('')
  const [approved, setApproved] = useState(false)
  const [rejected, setRejected] = useState(false)
  const [leaveRequestId, setLeaveRequestId] = useState(undefined)

  const statusColorMap = {
    pending: "bg-info",
    approved: "bg-success",
    rejected: "bg-warning",
  };
  const isAdmin = () => props.globalState.userData.role === "admin";

  useEffect(() => {
    apiCall.fetchEntities('/leave_requests.json')
      .then((res) => {
        const dataFormatter = new Jsona();
        const eventData = dataFormatter.deserialize(res.data);
        setEvents(eventData);
      });
  }, []);

  const handleActions = (status, id) => {
    const postData = {
      status,
    };
    apiCall.submitEntity( postData, `/leave_requests/${id}.json`, "patch")
      .then((res) => {
        const dataFormatter = new Jsona();
        const data = dataFormatter.deserialize(res.data);
        const newEvents = events.map((el) => {
          if(el.id === id) {
            el = {...data, className: statusColorMap[data.status]};
          }
          return el;
        });
        setEvents(newEvents);
        NotifyUser(`Successfully ${status}!`, 'bc', `${status === 'approved' ? 'success' : 'danger'}`, props.globalState.notificationRef);
      });

    setUpdateLeaveRequest(false)
  }

    const onRowClick = (state, rowInfo) => {
        return {
            onClick: e => {
                setUpdateLeaveRequest(true)
                setApproved(rowInfo.original.status === 'approved')
                setRejected(rowInfo.original.status === 'rejected')
                setLeaveRequestId(rowInfo.original.id)
                setLeaveTitle(rowInfo.original.title)
            }
        }
    }
  
  return (
    <>
        <Card className="shadow mb-0">
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
          <div className="bg-white shadow-lg p-5 pb-7" style={{ borderRadius: 5 }}>
            <ReactTable
              resizable={false}
              data={events}
              loading={false}
              columns={[
                {
                  Header: "Username",
                  id: "username",
                  Cell: (row) => {
                    const {user} = row.original;
                    return `${user.first_name} ${user.last_name}`;
                  },
                  style: { whiteSpace: "unset"},
                },
                {
                  Header: "Start Date",
                  accessor: "start",
                  style: { whiteSpace: "unset"},
                },
                {
                  Header: "End Date",
                  accessor: "end_date",
                  style: { whiteSpace: "unset"},
                },
                {
                  id: "duration",
                  Header: "Duration",
                  Cell: (row) => {
                    const {start, end_date} = row.original;

                    // we modified end date to include only till the last day of leave so need to add 1
                    return (Math.abs(new Date(start) - new Date(end_date))/86400000 + 1);
                  },
                },
                {
                  Header: "Reason",
                  accessor: "title",
                  style: { whiteSpace: "unset"},
                },
                {
                  id: "status",
                  accessor: "status",
                  Header: "Status",
                  Cell: (row) => {
                    const {status} = row.original;
                    return (
                      <Badge color="" className="badge-dot float-right text-capitalize">
                        <i className={statusColorMap[status]} />
                        {status}
                      </Badge>
                    )
                  },
                  filterable: true,
                },
                {
                  Header: 'Actions',
                  show: isAdmin(),
                  Cell: (row) => (
                    <div className="actions-right">
                      { row.original.status === "pending" && (
                        <Button
                          onClick={() => {
                            const id = row.original.id;
                            handleActions('approved', id);
                          }}
                          color="success"
                          size="sm"
                          className="btn-icon btn-link like"
                        >
                          <i className="tim-icons icon-check-2 text-white font-weight-bold" />
                        </Button>
                      )}
                      {row.original.status === "pending" && (
                        <Button
                          onClick={() => {
                            const id = row.original.id;
                            handleActions('rejected', id);
                          }}
                          color="danger"
                          size="sm"
                          className="btn-icon btn-link like"
                        >
                          <i className="tim-icons icon-simple-remove text-white font-weight-bold" />
                        </Button>
                      )}
                    </div>
                  ),
                  filterable: false,
                  sortable: false,
                },
              ]}
              defaultPageSize={5}
              showPaginationBottom
              getTrProps={onRowClick}
              className="-striped -highlight text-capitalize"
            />
          </div>
        </CardBody>
      </Card>

        <Modal
            isOpen={updateLeaveRequest}
            toggle={() => setUpdateLeaveRequest(false)}
            className="modal-dialog-centered modal-secondary"
        >
            <div className="modal-header p-1">
                <button
                    aria-hidden
                    className="close"
                    data-dismiss="modal"
                    type="button"
                    onClick={() => setUpdateLeaveRequest(false)}
                >
                    <i className="tim-icons icon-simple-remove" />
                </button>
            </div>

            <div className="modal-body">
                <label className="form-control-label">Reason</label>
                <Input
                    className="form-control-alternative edit-event--title"
                    placeholder="Reason"
                    type="text"
                    defaultValue={leaveTitle}
                    disabled
                />
                <br/>

                {!approved && (
                    <>
                        <Button
                            onClick={() => handleActions('approved', leaveRequestId)}
                            color="success"
                            size="sm"
                            className="btn-icon btn-link like"
                        >
                            <i className="tim-icons icon-check-2 text-white font-weight-bold"/>
                        </Button>
                        <label className="form-control-label">
                            Approve
                        </label>
                    </>
                    )}
                <br />
                {  !rejected &&
                    <>
                        <Button
                        onClick={() => handleActions('rejected', leaveRequestId)}
                        color="danger"
                        size="sm"
                        className="btn-icon btn-link like"
                        >
                        <i className="tim-icons icon-simple-remove text-white font-weight-bold" />
                        </Button>
                        <label className="form-control-label">
                        Reject
                        </label>
                    </>
                }
            </div>
        </Modal>
    </>
  );
};
