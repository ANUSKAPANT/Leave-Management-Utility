import React from "react";
import { 
  Button, ButtonGroup, Card, CardHeader, CardBody, Container,
  FormGroup, Form, Input, Modal, Row, Col, Nav, Label,
} from "reactstrap";
import dayjs from 'dayjs';
// JavaScript library that creates a callendar with events
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interaction from "@fullcalendar/interaction";
import ConfirmationDeleteAlert from "../../components/Alert/ConfirmationDeleteAlert";
import Jsona from 'jsona';
import apiCall from '../../helpers/apiCall';
import NotifyUser from '../../components/Alert/NotifyUser';

let calendar;
const statusColorMap = {
  pending: "bg-info",
  approved: "bg-success",
  rejected: "bg-danger",
};

class FullCalendar extends React.Component {
  state = {
    events: [],
    alert: null,
    errors: {},
    errorMessages: [],
    leaveType: 'sick_leave'
  };

  isAdmin = () => this.props.globalState.userData.role === "admin";

  componentDidMount() {
    apiCall.fetchEntities('/leave_requests.json')
      .then((res) => {
        const dataFormatter = new Jsona();
        const data = dataFormatter.deserialize(res.data);
        const events = data.map((el) => ({...el, className: statusColorMap[el.status]}));
        this.setState({
          events: events,
        });
        this.createCalendar(events);
      });
  };

  createCalendar = (events) => {
    calendar = new Calendar(this.refs.calendar, {
      plugins: [interaction, dayGridPlugin],
      headerToolbar:false,
      selectable: true,
      editable: true,
      events: events,
      // selectable dates
      selectAllow: (selectInfo) => {
        return dayjs().diff(selectInfo.start)/86400000 <= 1;
      },
      // Add new event
      select: info => {
        // end date should be the last day of the leave, better not include the present day
        let endDate = new Date(info.endStr)
        endDate.setDate(endDate.getDate() -1)
        endDate.toLocaleString()

        this.setState({
          createLeaveRequest: true,
          startDate: info.startStr,
          endDate: endDate,
          radios: "bg-info"
        });
      },
      // Edit calendar event action
      eventClick: ({ event }) => {
        this.setState({
          updateLeaveRequest: true,
          eventId: event.id,
          eventTitle: event.title,
          leaveType: event.extendedProps.leave_type,
          eventStatus: event.extendedProps.status,
          userName: event.extendedProps.user.first_name + ' ' + event.extendedProps.user.last_name,
          radios: "bg-info",
          event: event,
        });
      }
    });
    calendar.render();
    this.setState({
      currentDate: calendar.view.title
    });
  };

  changeView = newView => {
    calendar.changeView(newView);
    this.setState({
      currentDate: calendar.view.title
    });
  };

  //expect error to be of format {leave: Array(1)}
  generateErrorMessage = (errors) => {
    let errorMessages = []
    Object.keys(errors).forEach((key) => {
      errorMessages.push(`${key} ${errors[key][0]}`)
    })

    return errorMessages
  }

  addNewEvent = () => {
    const postData = {
      leave_request: {
        title: this.state.eventTitle,
        start: this.state.startDate,
        end_date: this.state.endDate,
        status: "pending",
        leave_type: this.state.leaveType
      }
    };
    apiCall.submitEntity(postData, '/leave_requests.json')
      .then((res) => {
        const dataFormatter = new Jsona();
        const data = dataFormatter.deserialize(res.data);
        const { events } = this.state;
        const newEvents = [...events, {...data, className: statusColorMap[data.status]}];
        calendar.addEvent({...data, className: statusColorMap[data.status]});
        this.setState({
          events: newEvents,
          createLeaveRequest: false,
          startDate: undefined,
          endDate: undefined,
          radios: "bg-info",
          eventTitle: undefined,
          leave_type: 'sick_leave'
        });
        this.resetToDefaultState();
      })
      .catch((error) => {
        this.setState({
          errors: error.response.data,
          errorMessages: this.generateErrorMessage(error.response.data)
        })
      });
  };

  updateEvent = (e) => {
    e.preventDefault();
    const id = this.state.eventId;
    const postData = {
      title: this.state.eventTitle,
      status: this.state.eventStatus,
      leave_type: this.state.leaveType
    };
    apiCall.submitEntity( postData, `/leave_requests/${id}.json`, "patch")
      .then((res) => {
        const dataFormatter = new Jsona();
        const data = dataFormatter.deserialize(res.data);
        const { events } = this.state;
        const newEvents = events.map((el) => {
          if(el.id.toString() === id) {
            el = {...data, className: statusColorMap[data.status]};
          }
          return el;
        });
        this.setState({
          updateLeaveRequest: false,
          events: newEvents,
          radios: "bg-info",
          eventTitle: undefined,
          eventId: undefined,
          event: undefined,
          leaveType: 'sick_leave'
        });
        NotifyUser(`Successfully updated`, 'bc', 'success', this.props.globalState.notificationRef);
        this.createCalendar(newEvents);
      });
  };

  deleteEvent = (id) => {
    apiCall.deleteEntity(`/leave_requests/${id}`)
      .then(() => {
        const { events } = this.state;
        const newEvents = events.filter((el) => el.id.toString() !== id);
        this.setState({
          events: newEvents,
          radios: "bg-info",
          eventTitle: undefined, 
          eventId: undefined,
          alert: <ConfirmationDeleteAlert hideAlert={() => this.setState({ alert: false, })} deleted />,
        });
        this.createCalendar(newEvents);
      });
  };

  deleteEventAlert = () => {
    this.setState({
      alert: (
        <ConfirmationDeleteAlert deleteMethod={() => this.deleteEvent(this.state.eventId)} hideAlert={() => this.setState({ alert: false, })} />
      )
    });
  };

  resetToDefaultState = () => {
    this.setState({
      updateLeaveRequest: false,
      createLeaveRequest: false,
      errors: {},
      errorMessages: [],
      leaveType: 'sick_leave',
      eventTitle: ''
    })
  }

  addOrUpdate = (e) => {
    if(this.state.updateLeaveRequest) {
      this.updateEvent(e)
    }
    else {
      this.addNewEvent()
    }
  }

  render() {
    return (
      <>
        {this.state.alert}
        <Card className="card-calendar mb-0">
          <CardHeader className="bg-primary pb-5 px-5">
            <Row className="align-items-center py-4">
              <Col lg="6">
                <h6 className="fullcalendar-title h2 text-white d-inline-block mb-0 mr-1">
                  {this.state.currentDate}
                </h6>
                <Nav aria-label="breadcrumb" className="d-none d-inline-block ml-lg-4">
                  <ol className="breadcrumb breadcrumb-links breadcrumb-dark">
                    <li className="breadcrumb-item"><i className="fas fa-home" /></li>
                    <li className="breadcrumb-item" onClick={() => this.props.history.push('/admin/dashboard')}>Dashboard</li>
                    <li className="breadcrumb-item active" aria-current="page">Calendar</li>
                  </ol>
                </Nav>
              </Col>
              <Col className="mt-3 mt-lg-0 text-lg-right" lg="6">
                <Button
                  className="fullcalendar-btn-prev btn-neutral"
                  color="default"
                  onClick={() => {
                    calendar.prev();
                    this.setState({
                      currentDate: calendar.view.title
                    });
                  }}
                  size="sm"
                >
                  <i className="fas fa-angle-left" />
                </Button>
                <Button
                  className="fullcalendar-btn-next btn-neutral"
                  color="default"
                  onClick={() => {
                    calendar.next();
                    this.setState({
                      currentDate: calendar.view.title
                    });
                  }}
                  size="sm"
                >
                  <i className="fas fa-angle-right" />
                </Button>
                <Button className="btn-neutral" color="default" data-calendar-view="month" onClick={() => this.changeView("dayGridMonth")} size="sm">
                  Month
                </Button>
                <Button className="btn-neutral" color="default" data-calendar-view="basicWeek" onClick={() => this.changeView("dayGridWeek")} size="sm">
                  Week
                </Button>
                <Button className="btn-neutral" color="default" data-calendar-view="basicDay" onClick={() => this.changeView("dayGridDay")} size="sm">
                  Day
                </Button>
              </Col>
            </Row>
          </CardHeader>
          <CardBody className="mt--6">
            <div className="bg-white shadow-lg px-5" style={{ borderRadius: 5 }}>
              <CardHeader className="fullcalendar-title h3">Calendar</CardHeader>
              <div
                className="calendar pt-3 pb-5"
                ref="calendar"
              />
            </div>
          </CardBody>
        </Card>
        
        {/* MODAL to create or update existing leave request */}
        <Modal
          isOpen={this.state.updateLeaveRequest || this.state.createLeaveRequest}
          toggle={() => this.resetToDefaultState()}
          className="modal-dialog-centered modal-secondary"
        >
          <div className="modal-header p-1">
            <button
              aria-hidden
              className="close"
              data-dismiss="modal"
              type="button"
              onClick={() => this.resetToDefaultState()}
            >
              <i className="tim-icons icon-simple-remove" />
            </button>
          </div>
          <div className="modal-body">
            {
              this.state.updateLeaveRequest && (
                <label className="font-weight-bold">
                  {this.state.userName}
                </label>
              )
            }
            
            <Form
              className="edit-event--form" 
              type="submit" 
              onSubmit={(e) => { this.addOrUpdate(e) }}
            >
              <FormGroup>
                <Label for="leaveType">
                  Leave Type
                </Label>
                <select
                    id="leaveType"
                    value={this.state.leaveType}
                    onChange={ e => this.setState({leaveType: e.target.value}) }
                    className={'form-control'}
                >
                  <option value={'sick_leave'}>
                    Sick Leave
                  </option>
                  <option value={'personal'}>
                    Personal Leave
                  </option>
                  <option value={'others'}>
                    Other
                  </option>
                </select>
                <label className="form-control-label">Reason</label>
                <Input
                  className="form-control-alternative edit-event--title"
                  placeholder="Reason"
                  type="text"
                  defaultValue={this.state.eventTitle}
                  onChange={e =>
                    this.setState({ eventTitle: e.target.value })
                  }
                />
                { this.state.errorMessages.map(message => <div className='red-text'>{message}</div>)  }
              </FormGroup>
              {this.state.updateLeaveRequest && this.isAdmin() && (
                <FormGroup>
                  <label className="form-control-label d-block mb-3 text-capitalize">
                    Status - {this.state.eventStatus}
                  </label>
                  <Button
                    onClick={() => this.setState({ eventStatus: "approved" })}
                    disabled={this.state.eventStatus === "approved"}
                    color="success"
                    size="sm"
                    className="btn-icon btn-link like"
                  >
                    <i className="tim-icons icon-check-2 text-white font-weight-bold" />
                  </Button>
                  <label className="form-control-label">
                    Approve
                  </label>
                  <br />
                  <Button
                    onClick={() => this.setState({ eventStatus: "rejected" })}
                    disabled={this.state.eventStatus === "rejected"}
                    color="danger"
                    size="sm"
                    className="btn-icon btn-link like"
                  >
                    <i className="tim-icons icon-simple-remove text-white font-weight-bold" />
                  </Button>
                  <label className="form-control-label">
                    Reject
                  </label>
                </FormGroup>
              )}
            </Form>
          </div>
          <div className="modal-footer">
            <Button color="primary" type="submit" onClick={(e) => this.addOrUpdate(e)}>
              { this.state.updateLeaveRequest ? 'Update':'Request Leave'}
            </Button>
            {this.state.updateLeaveRequest && (<Button color="danger" onClick={() => this.setState({ updateLeaveRequest: false }, () => this.deleteEventAlert())}>
              Delete
            </Button>)}
          </div>
        </Modal>
      </>
    );
  }
}

export default FullCalendar;