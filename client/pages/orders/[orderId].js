import Router from "next/router";
import { useEffect, useState } from "react";
import useRequest from "../../hooks/use-request";

const OrderShow = ({ order }) => {
  // console.log(order);
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: `/api/payments`,
    method: "post",
    body: { orderId: order.id, token: "any" },
    onSuccess: (res) => {
      console.log(res);
      Router.push(`/orders`);
    },
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const ms = new Date(order.expiredAt) - new Date();

      setTimeLeft(Math.round(ms / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  const pay = async (e) => {
    e.preventDefault();
    await doRequest();
  };

  if (timeLeft < 0) {
    return <div>Order expired</div>;
  }

  return (
    <div>
      <div>{`${timeLeft} seconds util order expired`}</div>
      {errors}
      <button className="btn btn-primary" onClick={pay}>
        Pay
      </button>
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  console.log(orderId, context.query);
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};
export default OrderShow;
