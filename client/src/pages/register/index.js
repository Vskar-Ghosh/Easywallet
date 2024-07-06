import React from "react";
import { Form, Col, Row, message } from "antd";
import { useNavigate } from "react-router-dom";
import { RegisterUser } from "../../apicalls/users";

const Register = () => {
  const navigate = useNavigate();
  const onfinish = async (values) => {
    try {
      const response = await RegisterUser(values);
      if (response.success) {
        message.success(response.message);
        navigate("/login");
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };
  return (
    <div className=" m-3">
      <h1 className="text-2xl">EasyWallet - Register</h1>
      <hr />

      <Form layout="vertical" onFinish={onfinish}>
        <Row gutter={16} className=" gap-3">
          <Col span={7}>
            <Form.Item label="First Name" name="firstName">
              <input type="text" />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item label="Last Name" name="lastName">
              <input type="text" />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item label="Email" name="email">
              <input type="email" />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item label="Mobile" name="phoneNumber">
              <input type="number" />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item label="Indentification Type" name="identificationType">
              <select>
                <option value="National ID">National ID</option>
                <option value="Passport">Passport</option>
                <option value="Driving License">Driving License</option>
                <option value="Social Card">Social Card</option>
              </select>
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item
              label="Identification Number"
              name="identificationNumber"
            >
              <input type="number" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Address" name="address">
              <textarea type="text" />
            </Form.Item>
          </Col>

          <Col span={7}>
            <Form.Item label="Password" name="password">
              <input type="password" />
            </Form.Item>
          </Col>

          <Col span={7}>
            <Form.Item label="Confirm Password" name="confirmPassword">
              <input type="password" />
            </Form.Item>
          </Col>
        </Row>

        <div className="flex justify-end">
          <button type="submit" className="primary-contained-btn">
            Register
          </button>
        </div>

        <div onClick={() => navigate("/login")}>
          <p className="text-sm underline">Already have an account?Login</p>
        </div>
      </Form>
    </div>
  );
};

export default Register;
