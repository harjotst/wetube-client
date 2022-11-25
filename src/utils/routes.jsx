import axios from "axios";

const URL = "http://localhost:4000/api/v1/";

const createRoom = (username, videoUrl) => {
  return axios({
    method: "post",
    url: URL + "rooms/create-room",
    data: {
      username,
      videoUrl,
    },
  });
};

const joinRoom = (username, roomId) => {
  return axios({
    method: "post",
    url: URL + "rooms/join-room",
    data: {
      username,
      roomId,
    },
  });
};

const leaveRoom = (token) => {
  return axios({
    method: "delete",
    url: URL + "rooms/leave-room",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export { createRoom, joinRoom, leaveRoom };
