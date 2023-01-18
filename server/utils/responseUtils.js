const responseUtils = {
  // Authorization required
  basicAuthChallenge: (response) => {
    response.writeHead(401, {
      'WWW-Authenticate': 'Basic',
    });
    return response.end();
  },

  // Sending the requested content for the user
  sendJson: (response, payload, code = 200) => {
    response.writeHead(code, {
      'Content-Type': 'application/json',
    });
    return response.end(JSON.stringify(payload));
  },

  // Created resource and responding
  createdResource: (response, payload) => {
    return sendJson(response, payload, 201);
  },

  // Response without content
  noContent: (response) => {
    response.statusCode = 204;
    return response.end();
  },

  // Something
  badRequest: (response, errorMsg) => {
    if (errorMsg)
      return sendJson(
        response,
        {
          error: errorMsg,
        },
        400
      );

    response.statusCode = 400;
    return response.end();
  },

  // No permit for the user
  unauthorized: (response) => {
    response.writeHead(401, {
      'WWW-Authenticate': 'Basic',
    });
    return response.end();
  },

  // User is requesting something that is not allowed
  forbidden: (response) => {
    response.statusCode = 403;
    return response.end();
  },

  // User is requesting something that is not found
  notFound: (response) => {
    response.statusCode = 404;
    return response.end();
  },

  // Standard HTTP Method for requesting is wrong
  methodNotAllowed: (response) => {
    response.statusCode = 405;
    return response.end();
  },

  // Content type not accepted
  contentTypeNotAcceptable: (response) => {
    response.statusCode = 406;
    return response.end();
  },

  // If error occurs in the server side
  internalServerError: (response) => {
    response.statusCode = 500;
    return response.end();
  },

  // Redirects client user to different page
  redirectToPage: (response, page) => {
    response.writeHead(302, {
      Location: page,
    });
    response.end();
  },
};

export default responseUtils;
