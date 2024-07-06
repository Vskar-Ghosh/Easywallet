import React, { useEffect, useState } from "react";
import PageTitle from "../../components/PageTitle";
import { Table, message } from "antd";
import TransferFundModel from "./TransferFundModel";
import { useDispatch, useSelector } from "react-redux";
import { SetHideLoading, SetShowLoading } from "../../redux/loadingSlice";
import { getTransactionsOfUser } from "../../apicalls/transaction";
import moment from "moment";
import DepositModal from "./DepositModal";

const Transactions = () => {
  const [showTransferFundModel, setShowTransferFundModel] = useState(false);
  const [showDepositModel, setShowDepositModel] = useState(false);
  const { user } = useSelector((state) => state.users);
  const colums = [
    {
      title: "Date",
      dataIndex: "date",
      render: (text, record) => {
        return moment(record.createdAt).format("DD-MM-YYYY hh:mm:ss A");
      },
    },
    {
      title: "Transactions ID",
      dataIndex: "_id",
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (text, record) => {
        if (record.sender._id === record.receiver._id) {
          return "Deposit";
        } else if (record.sender._id === user._id) {
          return "Debit";
        } else {
          return "Credit";
        }
      },
    },
    {
      title: "Reference Account",
      dataIndex: "",
      render: (text, record) => {
        return record.sender._id === user._id ? (
          <div>
            <h1 className="text-sm"></h1>
            {record.receiver.firstName} {record.receiver.lastName}
          </div>
        ) : (
          <div>
            <h1 className="text-sm"></h1>
            {record.sender.firstName} {record.sender.lastName}
          </div>
        );
      },
    },
    {
      title: "Reference",
      dataIndex: "reference",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
  ];
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const getData = async () => {
    try {
      dispatch(SetShowLoading());
      const response = await getTransactionsOfUser();
      if (response.success) {
        setData(response.data);
      }
      dispatch(SetHideLoading());
    } catch (error) {
      dispatch(SetHideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center">
        <PageTitle title="Transactions" />

        <div className="flex gap-1">
          <div
            className="primary-outline-btn"
            onClick={() => setShowTransferFundModel(true)}
          >
            Transfar
          </div>
          <div
            className="primary-contained-btn"
            onClick={() => setShowDepositModel(true)}
          >
            Deposit{" "}
          </div>
        </div>
      </div>

      <Table columns={colums} dataSource={data} className="mt-3" />

      {showTransferFundModel && (
        <TransferFundModel
          showTransferFundModel={showTransferFundModel}
          setShowTransferFundModel={setShowTransferFundModel}
          reloadData={getData}
        />
      )}
      {showDepositModel && (
        <DepositModal
          showDepositModel={showDepositModel}
          setShowDepositModel={setShowDepositModel}
          reloadData={getData}
        />
      )}
    </div>
  );
};

export default Transactions;
