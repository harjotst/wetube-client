import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useAuth } from "../utils/auth";
import { createRoom, joinRoom } from "../utils/routes";
import { useNavigate } from "react-router-dom";

const CreateOrJoinRoom = () => {
  const { login } = useAuth();

  const navigate = useNavigate();

  const [create, setCreate] = useState(true);

  const initialFormValues = { username: "", roomId: "", videoUrl: "" };

  const validateFormData = (values) => {
    const errors = {};
    if (!values.username) errors.username = "Username Is Required";
    if (!create && !values.roomId) errors.roomId = "Room ID Is Required";
    if (create && !values.videoUrl) errors.videoUrl = "URL Is Required";
    return errors;
  };

  const submitFormData = (values, { setSubmitting, setErrors, resetForm }) => {
    setSubmitting(true);
    if (values.username && values.videoUrl) {
      createRoom(values.username, values.videoUrl)
        .then((value) => {
          login(value.data, value.headers.authorization);
          navigate("../room");
        })
        .catch((error) => {
          setErrors({
            [error.response.data.reason]: error.response.data.message,
          });
        })
        .finally(() => {
          setSubmitting(false);
        });
    } else if (values.username && values.roomId) {
      joinRoom(values.username, values.roomId)
        .then((value) => {
          login(value.data, value.headers.authorization);
          navigate("../room");
        })
        .catch((error) => {
          setErrors({
            [error.response.data.reason]: error.response.data.message,
          });
        })
        .finally(() => {
          setSubmitting(false);
        });
    }
  };

  const InputSection = ({ label, field }) => {
    return (
      <>
        <label htmlFor={field} className="my-2">
          {label}:
        </label>
        <Field
          type="text"
          name={field}
          className="block w-full border border-black p-1 my-1"
        />
        <ErrorMessage name={field}>
          {(msg) => <div className="text-red-500 italic">{msg}</div>}
        </ErrorMessage>
      </>
    );
  };

  return (
    <div className="border-black border-2 rounded-lg p-4 w-96 h-min">
      <div id="info" className="pb-3 text-justify">
        <h1 className="text-center text-2xl pb-1">Create or Join a Room!</h1>
        {create ? (
          <>
            Enter a Username and YouTube Video Url to create a private watch
            room for you and your friends.
          </>
        ) : (
          <>
            Enter a unique username and the room id of an existing watch room to
            join your friends.
          </>
        )}
      </div>
      <Formik
        initialValues={initialFormValues}
        validate={validateFormData}
        onSubmit={submitFormData}
      >
        {({ isSubmitting, errors, resetForm }) => (
          <>
            <ul className="flex flex-wrap text-xl font-medium text-center mb-1">
              <li className="w-1/2">
                <button
                  className={`border border-black p-2 w-full h-full ${
                    create ? "bg-gray-400" : "bg-white hover:bg-gray-200"
                  }`}
                  onClick={() => {
                    setCreate(true);
                    resetForm();
                  }}
                >
                  Create a Room
                </button>
              </li>
              <li className="w-1/2">
                <button
                  className={`border border-black border-l-0 p-2 w-full h-full ${
                    !create ? "bg-gray-400" : "bg-white hover:bg-gray-200"
                  }`}
                  onClick={() => {
                    setCreate(false);
                    resetForm();
                  }}
                >
                  Join a Room
                </button>
              </li>
            </ul>
            <Form>
              <InputSection label="Username" field="username" />
              {create ? (
                <InputSection label="YouTube Video Url" field="videoUrl" />
              ) : (
                <InputSection label="Room ID" field="roomId" />
              )}
              <p>{errors.general}</p>
              <button
                type="submit"
                disabled={isSubmitting}
                className="border border-black mt-3 p-2 w-full place-self-end hover:bg-gray-200"
              >
                {create ? "Create Room" : "Join Room"}
              </button>
            </Form>
          </>
        )}
      </Formik>
    </div>
  );
};

export default CreateOrJoinRoom;
