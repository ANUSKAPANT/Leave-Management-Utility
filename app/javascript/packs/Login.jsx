import React from 'react';
import ReactDOM from 'react-dom';

// reactstrap components
import { 
  Button, Card, CardHeader, CardBody, CardFooter, CardTitle, FormGroup, Row, Form, Input, InputGroupAddon, InputGroupText, InputGroup, Container, Col,
} from 'reactstrap';
import axios from 'axios';
import NotificationAlert from 'react-notification-alert';

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
        <div className="bg-gradient-info">
          <div class="container d-flex flex-column min-vh-100 justify-content-center align-items-center">
            <Col lg="4" md="6" className="mx-auto my-auto">
              <Card className="bg-white">
                <CardHeader className="bg-transparent">
                  <CardTitle tag="h1">Log in</CardTitle>
                </CardHeader>
                <CardBody>
                  <Form role="form">
                    <FormGroup>
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
                    </FormGroup>
                  </Form>
                </CardBody>
                <CardFooter>
                <Button block className="mb-3" color="primary" onClick={this.handleSubmit} size="lg">
                  Get Started
                </Button>
                </CardFooter>
              </Card>
            </Col>
          </div>
        </div>
      </>
    );
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Login />,
    document.body.appendChild(document.createElement('div')),
  );
});
