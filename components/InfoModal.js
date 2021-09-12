import {
  Input,
  Form,
  InputNumber,
  Modal,
} from 'antd';

import { ajaxFetch } from '../utils/ajaxUtils';

const formItemLayout = {
  // labelCol: {
  //   span: 6,
  // },
  // wrapperCol: {
  //   span: 14,
  // },
};

import { useEffect } from 'react';

export default function InfoModal({ visible = false, setVisible, initialValues = {}, setAlertState }) {

  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
  }, [initialValues]);

  const hideModal = () => {
    setVisible(false);
  };

  const submitForm = () => {
    form.submit();
  }

  const onFinish = (values) => {
    ajaxFetch({
      url: `http://localhost:5000/api/v1/category/${initialValues._id || ''}`,
      method: initialValues._id ? 'PUT' : 'POST',
      body: values,
    }, (xhr) => {
      if (xhr.status === 200 || xhr.status === 201) {
        console.log('success');
        setAlertState({
          isOpen: true,
          color: 'success',
          messages: ['Saved'],
        });
      } else {
        console.log('error');
        setAlertState({
          isOpen: true,
          color: 'danger',
          messages: ['Something went wrong.'],
        });
      }
      setVisible(false);
    });
  };


  return (
    <Modal
      title={`${initialValues._id ? 'Edit' : 'Add'} Category`}
      visible={visible}
      onOk={submitForm}
      onCancel={hideModal}
      maskClosable={false}
      okText="Save"
      cancelText="Cancel"
    >
      <Form
        name="validate_other"
        layout="vertical"
        form={form}
        {...formItemLayout}
        onFinish={onFinish}
        initialValues={initialValues}
      >
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <Input.TextArea />
        </Form.Item>

        <Form.Item label="Order in Menu" name="order" rules={[{ required: true }]}>
          <InputNumber min={0} />
        </Form.Item>
      </Form>
    </Modal>
  );
}