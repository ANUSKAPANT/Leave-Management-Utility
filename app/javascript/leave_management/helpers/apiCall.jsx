import request from 'axios';

const BASE_URL = '';

const logEndpoint = (endpoint) => {
  // eslint-disable-next-line no-console
  console.log(BASE_URL + endpoint);
};

const getHeaders = () => {
  const csrf = document.querySelector("meta[name='csrf-token']").getAttribute('content');
  const headers = {
    'Content-Type': 'application/json',
    'X-CSRF-Token': csrf,
  };
  return headers;
};


function isArray(a) {
  return Array.isArray(a);
}

function isObject(o) {
  return o === Object(o) && !isArray(o) && typeof o !== 'function';
}

const keysToSnake = (o, depth = 2) => {
  if (depth <= 0) {
    return o;
  }
  if (isObject(0)) {
    const n = {};
    Object.keys(o)
      .forEach((k) => {
        n[camelToUnderscore(k)] = keysToSnake(o[k], depth - 1);
      });
    return n;
  } if (isArray(o)) {
    return o.map((i) => keysToSnake(i, depth - 1));
  }
  return o;
}

export default {
  /**
   * Retrieve list of entities from server using AJAX call.
   *
   * @returns {Promise} - Result of ajax call.
   */
  fetchEntities(endpoint, parameters, responseType = 'json') {
    logEndpoint(endpoint);
    return request({
      method: 'GET',
      url: BASE_URL + endpoint,
      headers: getHeaders(),
      params: keysToSnake(parameters),
      responseType,
    });
  },

  searchEntities(endpoint) {
    logEndpoint(endpoint);
    return request({
      method: 'GET',
      url: BASE_URL + endpoint,
      headers: getHeaders(),
      responseType: 'json',
    });
  },
  /**
   * Submit new entity to server using AJAX call.
   *
   * @param {Object} entity - Request body to post.
   * @returns {Promise} - Result of ajax call.
   */
  submitEntity(entity, endpoint, method = 'POST', changeData = true) {
    logEndpoint(endpoint);
    return request({
      method,
      url: BASE_URL + endpoint,
      headers: getHeaders(),
      responseType: 'json',
      data: changeData === true ? keysToSnake(entity) : entity,
    });
  },

  createEntity(entity, endpoint) {
    return this.submitEntity(entity, endpoint);
  },

  patchEntity(entity, endpoint, changeData = true) {
    return this.submitEntity(entity, endpoint, 'PATCH', changeData);
  },

  deleteEntity(endpoint) {
    logEndpoint(endpoint);
    return request({
      method: 'DELETE',
      url: BASE_URL + endpoint,
      headers: getHeaders(),
      responseType: 'json',
    });
  },
};
