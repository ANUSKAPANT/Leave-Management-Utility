import React from 'react';
import ReactDOM from 'react-dom';

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Col,
} from 'reactstrap';
import axios from 'axios';
import NotificationAlert from 'react-notification-alert';
// import cardPrimaryImage from 'black-dashboard/assets/img/card-primary.png';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }

  componentDidMount() {
    document.body.classList.toggle('login-page');
  }

  componentWillUnmount() {
    document.body.classList.toggle('login-page');
  }

    handleChange =(event) => {
      const { target } = event;
      const { value } = target;
      const { name } = target;
      this.setState({
        [name]: value,
      });
    }

    handleSubmit =(event) => {
      const csrf = document.querySelector("meta[name='csrf-token']").getAttribute('content');
      event.preventDefault();

      const { email, password } = this.state;
      axios({
        method: 'post',
        url: '/users/sign_in.json',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrf,
        },
        data: {
          user: { email, password },
        },
      }).then((response) => {
        if (response.status === 201) {
          window.location.href = '/';
        } else {
          this.notify('bc');
        }
      }).catch(() => {
        this.notify('bc');
      });
    }

    notify = (place) => {
      const type = 'danger';
      let options = {};
      options = {
        place,
        message: (
          <div>
            <div>
              Login Unsuccessful!
            </div>
          </div>
        ),
        type,
        icon: 'tim-icons icon-bell-55',
        autoDismiss: 7,
      };
      this.notificationAlert.notificationAlert(options);
    }

    render() {
      return (
        <>
          <div className="rna-container">
            <NotificationAlert ref={(n) => { this.notificationAlert = n; }} />
          </div>
          <div className="wrapper wrapper-full-page">
            <div className="full-page login-page">
              <div className="content">
                <Container>
                  <Col className="ml-auto mr-auto" lg="4" md="6">
                    <Form className="form">
                      <Card className="card-login card-white">
                        <CardHeader>
                          {/* <img
                            alt="..."
                            src={cardPrimaryImage}
                          /> */}
                          <CardTitle tag="h1">Log in</CardTitle>
                        </CardHeader>
                        <CardBody>
                          <InputGroup>
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <i className="tim-icons icon-email-85" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input placeholder="Email" type="text" name="email" onChange={this.handleChange} />
                          </InputGroup>
                          <InputGroup>
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <i className="tim-icons icon-lock-circle" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input placeholder="Password" type="password" name="password" onChange={this.handleChange} />
                          </InputGroup>
                        </CardBody>
                        <CardFooter>
                          <Button
                            block
                            className="mb-3"
                            color="primary"
                            onClick={this.handleSubmit}
                            size="lg"
                          >
                            Get Started
                          </Button>

                        </CardFooter>
                      </Card>
                    </Form>
                  </Col>
                </Container>
              </div>
            </div>
          </div>

        </>
      );
    }
}
document.body.classList.add('white-content');

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Login />,
    document.body.appendChild(document.createElement('div')),
  );
});
