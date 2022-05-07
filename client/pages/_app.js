import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";
import Header from "../components/header";

const AppComp = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

AppComp.getInitialProps = async ({ ctx, Component }) => {
  const client = buildClient(ctx);
  const { data } = await client.get(`/api/users/currentuser`);

  const pageProps =
    (await Component.getInitialProps?.(ctx, client, data.currentUser)) || {};

  return { pageProps, currentUser: data.currentUser };
};

export default AppComp;
