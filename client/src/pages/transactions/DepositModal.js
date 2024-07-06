import { Form, Modal, message } from "antd";
import React, { useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import { depositFunds } from "../../apicalls/transaction";
const DepositModal = ({
  showDepositModel,
  setShowDepositModel,
  reloadData,
}) => {
  const [form] = Form.useForm();
  const [amount, setAmount] = useState(0);

  const onChangeValue = (valueChange) => {
    if (valueChange.amount) {
      setAmount(valueChange.amount);
    }
  };
  const onToken = async (token) => {
    try {
      const response = await depositFunds({ token, amount });
      if (response.success) {
        reloadData();
        setShowDepositModel(false);
        message.success(response.message);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <Modal
      title="Deposit"
      open={showDepositModel}
      onCancel={() => setShowDepositModel(false)}
      footer={null}
    >
      <div className="flex-col gap-1">
        <Form layout="vertical" form={form} onValuesChange={onChangeValue}>
          <Form.Item
            label="Amount"
            name="amount"
            rules={[{ required: true, message: "Plese input amount" }]}
          >
            <input type="number" />
          </Form.Item>
          <div className="flex justify-end gap-3">
            <button className="primary-outline-btn">Cancel</button>
            <StripeCheckout
              token={onToken}
              currency="USD"
              shippingAddress
              amount={amount * 100}
              stripeKey="pk_test_51Oi0LzCa4wilIjAOD9Dr5ddoWcZIOzE3svkhO2sSPcTQrZ86a7l4VDYS0dSsNhnE9wibqJ1tv5ZywAJFxb1X97tA008TcfKuPh"
            >
              <button className="primary-contained-btn">Deposit</button>
            </StripeCheckout>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default DepositModal;
