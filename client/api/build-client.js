import axios from "axios";

// depend on rendering app on server side or on browser
export default ({ req }) => {
  if (typeof window === "undefined") {
    // on server
    return axios.create({
      baseURL: `http://ingress-nginx-controller.ingress-nginx.svc.cluster.local`,
      headers: req.headers,
    });
  } else {
    // on client
    return axios.create({ baseURL: "/" });
  }
};
