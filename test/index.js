process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const { default: axios } = require("axios");

const session =
  "session=eyJqd3QiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKcFpDSTZJall5TnpNM1lXTm1PV1kwTm1KaU1tVm1NV0l5TWpCa1l5SXNJbVZ0WVdsc0lqb2lkR2h2Ym1kQWJXRnBiQzVqYjIwaUxDSnBZWFFpT2pFMk5URTNNelV5TkRkOS45Q3J3MWM2blpkTlktOV9faGdPS0QtZ2lEZUhOOHJkZWd2bFFSYkYzNnU0In0=%3D";

const doRequest = async () => {
  const { data: ticket } = await axios.post(
    `https://ticketing.dev/api/tickets`,
    { title: "abc", price: 5 },
    {
      headers: {
        Cookie: session,
      },
    }
  );

  await axios.put(
    `https://ticketing.dev/api/tickets/${ticket.id}`,
    { title: "abc", price: 10 },
    {
      headers: {
        Cookie: session,
      },
    }
  );

  await axios.put(
    `https://ticketing.dev/api/tickets/${ticket.id}`,
    { title: "abc", price: 20 },
    {
      headers: {
        Cookie: session,
      },
    }
  );
};

const start = () => {
  const loop = 200;
  for (let i = 0; i <= loop; i++) {
    doRequest();
    console.log("finished", i);
  }
};

start();
