import axios from "axios";

let BASE_URL = "http://localhost:8088";

/**
 * @description base functiom to make get api call
 * @param URL
 * @returns
 */
async function GET_API_CALL(URL) {
  let uri = BASE_URL + URL;
  let apiResponse;
  await axios
    .get(uri, {
      headers: {
        "Content-Type": "application/json"
      },
    })
    .then(response => {
      //handle response
      if (response.status === 200) {
        apiResponse = response.data;
      }
    })
    .catch(error => {
      // Handle error
         apiResponse = error.response;
    });
  return apiResponse;
}

/**
 * @description base function to make post api call
 * @param URI
 * @param params
 * @returns
 */
async function POST_API_CALL(URL, params) {
  let apiResponse;
  let uri = BASE_URL + URL;

  //post api call
  await axios
    .post(
      uri,
      params,
      {
        headers: {
          "Content-Type": "application/json"
        },
      },
      { timeout: 5000 }
    )
    .then(response => {
      // if (response) {
      if (response.status === 200 || response.status === 201) {
        apiResponse = response;
      }
      // } else {
      //   apiErrorHandler(response);
      // }
    })
    .catch(function (error) {
      apiResponse = error;
      // apiErrorHandler(error.response);
    });
  return apiResponse;
}

// /**
//  * @description base function to upload file post api call
//  * @param URI
//  * @param params
//  * @returns
//  */
// async function POST_UPLOAD_FILE_API_CALL(URL, params) {
//   let apiResponse;
//   let uri = BASE_URL + URL;

//   //post api call
//   await axios
//     .post(
//       uri,
//       params,
//       {
//         headers: {
//           Authorization: "SKLMAuth userAuthId=" + sessionStorage.getItem("UserAuthId"),
//           "Content-Type": "multipart/form-data",
//         },
//       },
//       { timeout: 5000 }
//     )
//     .then(response => {
//       // if (response) {
//       if (response.status === code.SUCCESS_RESPONSE_CODE || response.status === code.CREATED_RESPONSE_CODE) {
//         apiResponse = response.data;
//       }
//       // } else {
//       //   apiErrorHandler(response);
//       // }
//     })
//     .catch(function (error) {
//       // apiResponse = error;
//       apiErrorHandler(error.response);
//     });
//   return apiResponse;
// }

export { GET_API_CALL, POST_API_CALL };
