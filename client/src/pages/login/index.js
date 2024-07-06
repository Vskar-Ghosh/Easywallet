import React from "react";
import { Form, Col, Row, message } from "antd";
import { useNavigate } from "react-router-dom";
import { LoginUser } from "../../apicalls/users";

const Login = () => {
  const navigate = useNavigate();
  const onfinish = async (values) => {
    try {
      const response = await LoginUser(values);
      if (response.success) {
        message.success(response.message);
        localStorage.setItem("token", response.data);
        window.location.href = "/";
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };
  return (
    <div className=" bg-primary flex h-screen items-center justify-center">
      <div className=" card w-400 p-2">
        <h1 className="text-2xl">EasyWallet - Login</h1>
        <hr />

        <Form layout="vertical" onFinish={onfinish}>
          <Row>
            <Col span={23}>
              <Form.Item label="Email" name="email">
                <input type="email" required />
              </Form.Item>
            </Col>
            <Col span={23}>
              <Form.Item label="Password" name="password">
                <input type="password" required />
              </Form.Item>
            </Col>
          </Row>

          <button type="submit" className="primary-contained-btn">
            Login
          </button>

          <div onClick={() => navigate("/register")}>
            <p className="text-sm underline">Don't have any account?SignIn</p>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
