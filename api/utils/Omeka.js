import axios from "axios";

const PER_PAGE = 9999;

export const fetch = async (
  baseAddress,
  endpoint,
  itemSetId,
  params,
  start,
  limit,
  sortBy = "id",
  sortOrder = "asc"
) => {
  const perPage = limit + (start % limit);
  const page = Math.ceil(start / perPage) + 1;

  const res = await axios.get(`http://${baseAddress}/api/${endpoint}`, {
    params: {
      ...params,
      item_set_id: itemSetId !== -1 ? itemSetId : null,
      sort_by: sortBy,
      sort_order: sortOrder,
      page,
      per_page: perPage,
    },
  });

  const data = res.data.map((each) => ({
    ...each,
    key: each["o:id"],
  }));

  return data.slice(0, limit);
};

export const fetchResourceTemplates = async (baseAddress) => {
  const res = await axios.get(
    `http://${baseAddress}/api/resource_templates?per_page=${PER_PAGE}`
  );
  return res.data;
};

export const fetchOne = async (baseAddress, endpoint, id) => {
  const res = await axios.get(`http://${baseAddress}/api/${endpoint}/${id}`);
  return res.data;
};

export const getResourceTemplate = (baseAddress, templateId) => {
  return axios.get(
    "http://" + baseAddress + "/api/resource_templates/" + templateId
  );
};

export const getPropertiesInResourceTemplate = (baseAddress, templateId) => {
  return getResourceTemplate(baseAddress, templateId).then((response) => {
    let requests = response.data[
      "o:resource_template_property"
    ].map((property) => axios.get(property["o:property"]["@id"]));
    return axios.all(requests);
  });
};

export const getPropertyIds = (baseAddress, templateId) => {
  return getResourceTemplate(baseAddress, templateId).then(res => {
    let requests = res.data["o:resource_template_property"].map(prop => prop["o:property"]["o:id"]);
    return requests;
  })
}

export const createItem = (baseAddress, values) => {
  return axios.post("http://" + userInfo.host + "/api/items", payload, {
    params: {
      key_identity: userInfo.key_identity,
      key_credential: userInfo.key_credential,
    },
    headers: headers,
  });
}