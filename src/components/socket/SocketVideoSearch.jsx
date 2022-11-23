import React from "react";

import { Formik, Form, Field, ErrorMessage } from "formik";

import { useSocket } from "../../utils/socket";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const SocketVideoSearch = () => {
  const socket = useSocket();

  const initialFormValues = { youtubeVideoLink: "" };

  const submitVideoChangeRequest = (values, { resetForm }) => {
    console.log(values);

    socket.emit("change-video", values.youtubeVideoLink);

    resetForm({ values: initialFormValues });
  };

  return (
    <div className="pb-2">
      <Formik
        initialValues={initialFormValues}
        onSubmit={submitVideoChangeRequest}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="flex flex-row">
              <Field
                type="text"
                name="youtubeVideoLink"
                placeholder="Enter YouTube Video Url..."
                className="block w-full border border-black p-2 focus-visible:none flex-grow"
              />
              <ErrorMessage name="youtubeVideoLink">
                {(msg) => <div className="text-red-500 italic">{msg}</div>}
              </ErrorMessage>
              <button
                type="submit"
                disabled={isSubmitting}
                className="border border-black border-l-0 px-8 py-2 hover:bg-gray-200"
              >
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SocketVideoSearch;
