const OrderList = ({ orders }) => {
  return (
    <div>
      <ul>
        {orders.map((o) => (
          <li key={o.id}>{o.ticket.title + " " + o.status}</li>
        ))}
      </ul>
    </div>
  );
};

OrderList.getInitialProps = async (context, client) => {
  const { data } = await client.get(`/api/orders`);
  return { orders: data };
};
export default OrderList;
