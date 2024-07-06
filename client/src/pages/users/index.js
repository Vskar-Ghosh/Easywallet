import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { SetHideLoading, SetShowLoading } from "../../redux/loadingSlice";
import { Table, message } from "antd";
import { getAllUsers, updateUserVerifiedStatus } from "../../apicalls/users";
import PageTitle from "../../components/PageTitle";

const Users = () => {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(SetShowLoading());
      const response = await getAllUsers();

      dispatch(SetHideLoading());

      if (response.success) {
        setUsers(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(SetHideLoading());
      message.error(error.message);
    }
  };

  const updateStatus = async (record, isVerified) => {
    try {
      dispatch(SetShowLoading());
      const response = await updateUserVerifiedStatus({
        selectedUser: record._id,
        isVerified,
      });
      dispatch(SetHideLoading());
      if (response.success) {
        message.success(response.message);
        getData();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(SetHideLoading());
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: "First Name",
      dataIndex: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
    },
    {
      title: "Verified",
      dataIndex: "isVerified",
      render: (text, record) => {
        return text ? "Yes" : "No";
      },
    },
    {
      title: "Action",
      dataIndex: "actions",
      render: (text, record) => {
        return (
          <div className="flex gap-1">
            {record.isVerified ? (
              <button
                className="primary-outline-btn"
                onClick={() => updateStatus(record, false)}
              >
                Suspend
              </button>
            ) : (
              <button
                className="primary-outline-btn"
                onClick={() => updateStatus(record, true)}
              >
                Activate
              </button>
            )}
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      <PageTitle title="Users" />
      <Table dataSource={users} columns={columns} className="mt-3" />
    </div>
  );
};

export default Users;
