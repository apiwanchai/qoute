"use client";
import { Form, Input, Button, Typography, message } from 'antd';
import { useRouter } from 'next/navigation'; 

const LoginPage = () => {
  const router = useRouter(); 

  const handleLogin = (values: { username: string; password: string }) => {
    if (values.username === 'admin' && values.password === 'password') {
      document.cookie = "token=authenticated; path=/;";
      message.success('Login successful!');
      router.push('/quotes'); 
    } else {
      message.error('Invalid credentials');
    }
  };

  return (
    <div style={{ maxWidth: 300, margin: '100px auto' }}>
      <Typography.Title level={2}>Login</Typography.Title>
      <Form onFinish={handleLogin}>
        <Form.Item name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
          <Input placeholder="Username" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">Login</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
