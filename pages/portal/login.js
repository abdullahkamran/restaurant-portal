import Head from 'next/head'

import { MDBContainer, MDBBtn, MDBCol, MDBCard, MDBCardHeader, MDBCardBody, MDBCardTitle, MDBModal, MDBModalHeader, MDBModalBody, MDBModalFooter } from 'mdbreact';

import {
  Form, Input, Button, Alert, Spin,
} from 'antd';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';


import { ajaxFetch } from '../../utils/ajaxUtils';
import { getCookie } from '../../utils/cookieUtils';

export default function Login() {

  const router = useRouter();
  const [isLoading, setLoading] = useState(false);
  const [alertState, setAlertState] = useState({});

  useEffect(() => {
    if (getCookie('access_token')) {
      setLoading(true);
      router.push('/portal/admin-panel');
      return;
    }
    console.log(router.query);
    if (router.query.logout != null) {
      setAlertState({
        visible: true,
        type: 'success',
        message: 'You are now logged out.',
      });
    }
  }, []);

  function urlEncodeFormData(formData) {
    const values = [];
    Object.keys(formData).forEach(key => {
      values.push(`${key}=${formData[key]}`);
    });
    return values.join('&');
  }

  function onFinish(formData) {
    setAlertState({});
    setLoading(true);
    ajaxFetch({
      url: 'http://localhost:5000/api/v1/login',
      method: 'POST',
      contentType: 'application/x-www-form-urlencoded',
      body: urlEncodeFormData(formData),
      withCredentials: true,
    }, (xhr) => {
      if (xhr.status === 200) {
        router.push('/portal/admin-panel');
      } else {
        setAlertState({
          visible: true,
          type: 'error',
          message: JSON.parse(xhr.response).message,
        });
        setLoading(false);
      }
    });
  }

  return (
    <MDBModal isOpen centered>
      <MDBCard>
        <MDBCardHeader color="primary-color" tag="h3">
          Lahore Restaurant - Portal
        </MDBCardHeader>
        {alertState.visible && <Alert
            message={alertState.message}
            type={alertState.type}
            closable
            onClose={() => setAlertState({})}
          />
        }
        <MDBCardBody>
          <Spin spinning={isLoading}>
            <MDBCardTitle>Login</MDBCardTitle>
            <Form
              name="basic"
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              onFinish={onFinish}
            >
              <Form.Item
                label="Username"
                name="username"
                rules={[
                  {
                    required: true,
                    message: 'Please input your username!',
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Please input your password!',
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                wrapperCol={{
                  offset: 8,
                  span: 16,
                }}
              >
                <Button type="primary" htmlType="submit">
                  Login
                </Button>
              </Form.Item>
            </Form>
            </Spin>
        </MDBCardBody>
      </MDBCard>
    </MDBModal>


  )
}
