import React from "react";
import { useDispatch, useSelector } from "react-redux";
import PageTitle from "../../components/PageTitle";

const Home = () => {
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  return (
    <div>
      <PageTitle
        title={`Hello ${user.firstName} ${user.lastName}, welcome to the Easywalet`}
      />

      <div className="bg-secondry p-2 mt-3 w-50 br-3 flex flex-col gap-1 uppercase">
        <div className="flex justify-between">
          <h1 className="text-lg">Account Number</h1>
          <h1 className="text-lg">{user._id}</h1>
        </div>
        <div className="flex justify-between">
          <h1 className="text-lg">Balance</h1>
          <h1 className="text-lg">${user.balance || 0}</h1>
        </div>
      </div>

      <div className="card p-2 mt-3 w-50 br-3 flex flex-col gap-1 uppercase">
        <div className="flex justify-between">
          <h1 className="text-lg">First Name</h1>
          <h1 className="text-lg">{user.firstName}</h1>
        </div>
        <div className="flex justify-between">
          <h1 className="text-lg">Last Name</h1>
          <h1 className="text-lg">{user.lastName}</h1>
        </div>
        <div className="flex justify-between">
          <h1 className="text-lg">Email</h1>
          <h1 className="text-lg">{user.email}</h1>
        </div>
        <div className="flex justify-between">
          <h1 className="text-lg">Mobile</h1>
          <h1 className="text-lg">{user.phoneNumber}</h1>
        </div>
        <div className="flex justify-between">
          <h1 className="text-lg">Identification Type</h1>
          <h1 className="text-lg">{user.identificationType}</h1>
        </div>
        <div className="flex justify-between">
          <h1 className="text-lg">Identification Number</h1>
          <h1 className="text-lg">{user.identificationNumber}</h1>
        </div>
      </div>
    </div>
  );
};

export default Home;
