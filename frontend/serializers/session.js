import { Serializer } from "jsonapi-serializer";

const SessionSerializer = new Serializer("sessions", {
  attributes: ["email", "password"],
});

export default SessionSerializer;
