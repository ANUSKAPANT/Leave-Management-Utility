import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

// reactstrap components
import { 
  Button, Card, CardHeader, CardBody, CardFooter, CardTitle, FormGroup,
  Form, Input, InputGroupAddon, InputGroupText, InputGroup, Col,
} from 'reactstrap';
import axios from 'axios';
import NotificationAlert from 'react-notification-alert';

const Login:React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  let notificationAlert;

  useEffect(() => {
    document.body.classList.toggle('login-page');
    return () => {
      document.body.classList.toggle('login-page');
    }
  }, []);

  const handleSubmit = (event) => {
    const csrf = document.querySelector("meta[name='csrf-token']").getAttribute('content');
    event.preventDefault();

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
        notify('bc');
      }
    }).catch(() => {
      notify('bc');
    });
  }

  const notify = (place) => {
    const type = 'danger';
    let options = {};
    options = {
      place,
      message: (
        <div>
          <div>
            <i className='tim-icons icon-bell-55 pr-2' />
            Login Unsuccessful!
          </div>
        </div>
      ),
      type,
      icon: '',
      autoDismiss: 7,
    };
    notificationAlert.notificationAlert(options);
  }

  return (
    <>
      <div className="rna-container">
        <NotificationAlert ref={(n) => { notificationAlert = n; }} />
      </div>
      <div className="bg-gradient-info">
        <div className="container d-flex flex-column min-vh-100 justify-content-center align-items-center">
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
                    <Input placeholder="Email" type="text" name="email" onChange={(e) => setEmail(e.target.value)} />
                  </InputGroup>
                    <InputGroup>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="tim-icons icon-lock-circle" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input placeholder="Password" type="password" name="password" onChange={(e) => setPassword(e.target.value)} />
                    </InputGroup>
                  </FormGroup>
                </Form>
              </CardBody>
              <CardFooter>
              <Button block className="mb-3" color="primary" onClick={handleSubmit} size="lg">
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

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Login />,
    document.body.appendChild(document.createElement('div')),
  );
});
