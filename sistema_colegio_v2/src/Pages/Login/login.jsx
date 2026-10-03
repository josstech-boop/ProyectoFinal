import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const Login = () => {
  const onFinish = (values) => {
    console.log('Datos del formulario:', values);
    message.success('Iniciando sesión...');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#F8FAFC' }}>
      <Card title="Sistema de Asistencias" style={{ width: 350, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Form name="login" onFinish={onFinish}>
          <Form.Item name="correo" rules={[{ required: true, message: 'Por favor ingresa tu correo!' }]}>
            <Input prefix={<UserOutlined />} placeholder="Correo electrónico" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: 'Por favor ingresa tu contraseña!' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Contraseña" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Iniciar Sesión
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;