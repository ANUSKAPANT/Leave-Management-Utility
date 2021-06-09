import React from "react";
import { 
  Button, Card, CardHeader, CardBody, FormGroup, Form, Input, Modal, Row, Col, Nav,
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

interface Props {
  globalState: any;
  history: any;
}

interface State {
  events: object[];
  modalAdd: boolean;
  startDate: string;
  endDate: string;
  radios: string;
  modalChange: boolean;
  currentDate: string;
  eventId: string;
  eventTitle: string;
  eventStatus: string;
  userName: string;
  event: object;
  alert: any;
}

class FullCalendar extends React.Component<Props, State>  {
  state: State = {
    events: [],
    alert: null,
    eventId: '',
    eventTitle: '',
    eventStatus: '',
    startDate: '',
    endDate: '',
    userName: '',
    modalAdd: false,
    modalChange: false,
    event: {},
    currentDate: '',
    radios: '',
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
    let calendarEl: HTMLElement = document.querySelector('.calendar');
    calendar = new Calendar(calendarEl, {
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
        this.setState({
          modalAdd: true,
          startDate: info.startStr,
          endDate: info.endStr,
          radios: "bg-info"
        });
      },
      // Edit calendar event action
      eventClick: ({ event }) => {
        this.setState({
          modalChange: true,
          eventId: event.id,
          eventTitle: event.title,
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

  addNewEvent = (e) => {
    e.preventDefault();
    const postData = {
      leave_request: {
        title: this.state.eventTitle,
        start: this.state.startDate,
        end: this.state.endDate,
        status: "pending",
      }
    };
    apiCall.submitEntity(postData, '/leave_requests.json')
      .then((res) => {
        const dataFormatter = new Jsona();
        const data:any = dataFormatter.deserialize(res.data);
        const { events } = this.state;
        const newEvents = [...events, {...data, className: statusColorMap[data.status]}];
        calendar.addEvent({...data, className: statusColorMap[data.status]});
        this.setState({
          events: newEvents,
          modalAdd: false,
          startDate: undefined,
          endDate: undefined,
          radios: "bg-info",
          eventTitle: undefined
        });
      });
  };

  updateEvent = (e) => {
    e.preventDefault();
    const id = this.state.eventId;
    const postData = {
      title: this.state.eventTitle,
      status: this.state.eventStatus,
    };
    apiCall.submitEntity( postData, `/leave_requests/${id}.json`, "patch")
      .then((res) => {
        const dataFormatter = new Jsona();
        const data:any = dataFormatter.deserialize(res.data);
        const { events } = this.state;
        const newEvents = events.map((el:any) => {
          if(el.id.toString() === id) {
            el = {...data, className: statusColorMap[data.status]};
          }
          return el;
        });
        this.setState({
          modalChange: false,
          events: newEvents,
          radios: "bg-info",
          eventTitle: undefined,
          eventId: undefined,
          event: undefined
        });
        NotifyUser(`Successfully updated`, 'bc', 'success', this.props.globalState.notificationRef);
        this.createCalendar(newEvents);
      });
  };

  deleteEvent = (id) => {
    apiCall.deleteEntity(`/leave_requests/${id}`)
      .then(() => {
        const { events } = this.state;
        const newEvents = events.filter((el:any) => el.id.toString() !== id);
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
                    <li className="breadcrumb-item" onClick={() => this.props.history.push('/admin/dashboard')}><i className="fas fa-home" /> - Dashboard</li>
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
        <Modal
          isOpen={this.state.modalAdd}
          toggle={() => this.setState({ modalAdd: false })}
          className="modal-dialog-centered modal-secondary"
        >
          <div className="modal-header p-2">
            <button
              aria-hidden
              className="close"
              data-dismiss="modal"
              type="button"
              onClick={() => this.setState({ modalAdd: false })}
            >
              <i className="tim-icons icon-simple-remove" />
            </button>
          </div>
          <div className="modal-body py-0">
            <form className="new-event--form" onSubmit={(e) => this.addNewEvent(e)}>
              <FormGroup>
                <label className="form-control-label">Reason</label>
                <Input
                  className="form-control-alternative new-event--title"
                  placeholder="Reason"
                  type="text"
                  onChange={e =>
                    this.setState({ eventTitle: e.target.value })
                  }
                />
              </FormGroup>
            </form>
          </div>
          <div className="modal-footer">
            <Button className="new-event--add" color="primary" type="button" onClick={(e) => this.addNewEvent(e)}>
              Request Leave
            </Button>
          </div>
        </Modal>
        <Modal
          isOpen={this.state.modalChange}
          toggle={() => this.setState({ modalChange: false })}
          className="modal-dialog-centered modal-secondary"
        >
          <div className="modal-header p-1">
            <button
              aria-hidden
              className="close"
              data-dismiss="modal"
              type="button"
              onClick={() => this.setState({ modalChange: false })}
            >
              <i className="tim-icons icon-simple-remove" />
            </button>
          </div>
          <div className="modal-body">
            <label className="font-weight-bold">
              {this.state.userName}
            </label>
            <Form className="edit-event--form" type="submit" onSubmit={(e) => this.updateEvent(e)}>
              <FormGroup>
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
              </FormGroup>
              {this.isAdmin() && (
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
            <Button color="primary" type="submit" onClick={(e) => this.updateEvent(e)}>
              Update
            </Button>
            <Button color="danger" onClick={() => this.setState({ modalChange: false }, () => this.deleteEventAlert())}>
              Delete
            </Button>
          </div>
        </Modal>
      </>
    );
  }
}

export default FullCalendar;