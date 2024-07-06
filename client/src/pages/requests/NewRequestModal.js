import { Form, Modal, message } from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { VerifyAccount, transferFunds } from "../../apicalls/transaction";

import { SetShowLoading, SetHideLoading } from "../../redux/loadingSlice";
import { sendRequest } from "../../apicalls/request";

const NewRequestModal = ({
  showNewRequestModal,
  setShowNewRequestModal,
  reloadData,
}) => {
  const [isVerified, setIsVerified] = useState("");
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.users);

  const verifyAccount = async () => {
    try {
      dispatch(SetShowLoading());
      const response = await VerifyAccount({
        receiver: form.getFieldValue("receiver"),
      });
      dispatch(SetHideLoading());
      if (response.success) {
        setIsVerified("true");
      } else {
        setIsVerified("false");
      }
    } catch (error) {
      dispatch(SetHideLoading());
      setIsVerified("false");
    }
  };

  const onfinish = async (values) => {
    try {
      dispatch(SetShowLoading());
      const payload = {
        ...values,
        sender: user._id,
        status: "success",
        description: values.description || "no description",
      };
      const response = await sendRequest(payload);
      if (response.success) {
        reloadData();
        setShowNewRequestModal(false);
        message.success(response.message);
      } else {
        message.error(response.message);
      }
      dispatch(SetHideLoading());
    } catch (error) {
      dispatch(SetHideLoading());
      message.error(error.message);
    }
  };
  return (
    <div>
      <Modal
        title="Transfer Funds"
        open={showNewRequestModal}
        onCancel={() => setShowNewRequestModal(false)}
        onClose={() => setShowNewRequestModal(false)}
        footer={null}
      >
        <Form layout="vertical" form={form} onFinish={onfinish}>
          <div className="flex gap-3 items-center">
            <Form.Item
              label="Account Number"
              name="receiver"
              className=" w-100"
            >
              <input type="text" />
            </Form.Item>
            <button
              type="button"
              className="primary-contained-btn mt-1"
              onClick={verifyAccount}
            >
              Verify
            </button>
          </div>
          {isVerified == "true" && (
            <div className="success-bg">
              <h1 className="text-sm">Account Verified successfully</h1>
            </div>
          )}
          {isVerified == "false" && (
            <div className="error-bg">
              <h1 className="text-sm">Invalid Account</h1>
            </div>
          )}
          <Form.Item
            label="Amount"
            name="amount"
            className=" w-100"
            rules={[
              { required: true, message: "Please input your amount" },
              { max: user.balance, message: "Insufficient Balance" },
            ]}
          >
            <input type="number" max={user.balance} />
          </Form.Item>
          <Form.Item label="Description" name="description" className=" w-100">
            <textarea type="text" />
          </Form.Item>

          <div className="flex justify-end gap-1">
            <button className="primary-outline-btn">Cancel</button>
            {isVerified === "true" && (
              <button className="primary-contained-btn">Request</button>
            )}
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default NewRequestModal;
