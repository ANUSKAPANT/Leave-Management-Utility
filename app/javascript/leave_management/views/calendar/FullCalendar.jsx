import React from "react";
import { 
  Button, ButtonGroup, Card, CardHeader, CardBody, Container,
  FormGroup, Form, Input, Modal, Row, Col, Nav,
} from "reactstrap";
import classnames from "classnames";
// JavaScript library that creates a callendar with events
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interaction from "@fullcalendar/interaction";
import ConfirmationDeleteAlert from "../../components/Alert/ConfirmationDeleteAlert";
import Jsona from 'jsona';
import apiCall from '../../helpers/apiCall';

let calendar;

class FullCalendar extends React.Component {
  state = {
    events: [],
    alert: null
  };

  componentDidMount() {
    apiCall.fetchEntities('/leave_requests.json')
      .then((res) => {
        const dataFormatter = new Jsona();
        const data = dataFormatter.deserialize(res.data);
        const events = data.map((el) => ({...el, className: 'bg-info'}));
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

  addNewEvent = () => {
    const postData = {
      leave_request: {
        title: this.state.eventTitle,
        start: this.state.startDate,
        end: this.state.endDate,
        status: 0,
      }
    };
    apiCall.submitEntity(postData, '/leave_requests.json')
      .then((res) => {
        const { data } = res;
        const { events } = this.state;
        const newEvents = [...events, {...data, className: 'bg-info'}];
        calendar.addEvent({...data, className: "bg-info"});
        this.setState({
          events: newEvents,
          modalAdd: false,
          events: newEvents,
          startDate: undefined,
          endDate: undefined,
          radios: "bg-info",
          eventTitle: undefined
        });
      });
  };

  updateEvent = () => {
    const id = this.state.eventId;
    const postData = {
      title: this.state.eventTitle,
    };
    apiCall.submitEntity( postData, `/leave_requests/${id}.json`, "patch")
      .then((res) => {
        const { data } = res;
        const { events } = this.state;
        const newEvents = events.map((el) => {
          if(el.id.toString() === id) {
            el = {...data, className: "bg-info"};
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

  render() {
    return (
      <>
        {this.state.alert}
        <Card className="card-calendar">
          <CardHeader className="bg-primary pb-5 px-5">
            <Row className="align-items-center py-4">
              <Col lg="6">
                <h6 className="fullcalendar-title h2 text-white d-inline-block mb-0 mr-1">
                  {this.state.currentDate}
                </h6>
                <Nav aria-label="breadcrumb" className="d-none d-lg-inline-block ml-lg-4">
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
            <form className="new-event--form">
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
            <Button className="new-event--add" color="primary" type="button" onClick={this.addNewEvent}>
              Request Leave
            </Button>
          </div>
        </Modal>
        <Modal
          isOpen={this.state.modalChange}
          toggle={() => this.setState({ modalChange: false })}
          className="modal-dialog-centered modal-secondary"
        >
          <div className="modal-header p-2">
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
            <Form className="edit-event--form">
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
              <FormGroup>
                <label className="form-control-label d-block mb-3">
                  Status color
                </label>
                <ButtonGroup
                  className="btn-group-toggle btn-group-colors event-tag mb-0"
                  data-toggle="buttons"
                >
                  <Button
                    className={classnames("bg-info", {
                      active: this.state.radios === "bg-info"
                    })}
                    color=""
                    type="button"
                    onClick={() => this.setState({ radios: "bg-info" })}
                  />
                  <Button
                    className={classnames("bg-warning", {
                      active: this.state.radios === "bg-warning"
                    })}
                    color=""
                    type="button"
                    onClick={() =>
                      this.setState({ radios: "bg-warning" })
                    }
                  />
                  <Button
                    className={classnames("bg-danger", {
                      active: this.state.radios === "bg-danger"
                    })}
                    color=""
                    type="button"
                    onClick={() => this.setState({ radios: "bg-danger" })}
                  />
                  <Button
                    className={classnames("bg-success", {
                      active: this.state.radios === "bg-success"
                    })}
                    color=""
                    type="button"
                    onClick={() =>
                      this.setState({ radios: "bg-success" })
                    }
                  />
                  <Button
                    className={classnames("bg-default", {
                      active: this.state.radios === "bg-default"
                    })}
                    color=""
                    type="button"
                    onClick={() =>
                      this.setState({ radios: "bg-default" })
                    }
                  />
                  <Button
                    className={classnames("bg-primary", {
                      active: this.state.radios === "bg-primary"
                    })}
                    color=""
                    type="button"
                    onClick={() => {
                      this.setState({ radios: "bg-primary" });
                    }}
                  />
                </ButtonGroup>
              </FormGroup>
              <input className="edit-event--id" type="hidden" />
            </Form>
          </div>
          <div className="modal-footer">
            <Button color="primary" onClick={this.updateEvent}>
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