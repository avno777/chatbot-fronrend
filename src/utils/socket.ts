import io from "socket.io-client";
import { getConfig } from "../services/configService";

const socket = io(getConfig().socketUrl, {
  transports: ["websocket"],
});

export default socket;
