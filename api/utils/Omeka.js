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

export const fetchItemData = async (
  baseAddress,
  endpoint,
  id,
  params = null
) => {
  var address = `http://${baseAddress}/api/${endpoint}/${id}`;
  if (params) {
    address += `?key_identity=${params.key_identity}&key_credential=${params.key_credential}`;
  }
  const res = await axios.get(address);
  var data = [];
  data.push(["Title", res.data["o:title"], 1]);
  data.push(["id", id, id]);
  var keys = Object.keys(res.data);
  for (var i = 0; i < keys.length; i++) {
    if (
      res.data[keys[i]] &&
      res.data[keys[i]][0] &&
      res.data[keys[i]][0]["property_id"]
    ) {
      data.push([
        res.data[keys[i]][0]["property_label"],
        res.data[keys[i]][0]["@value"],
        res.data[keys[i]][0]["property_id"],
      ]);
    }
  }
  //returns data in a format where title and id are retrieved from user input
  //and properties are in the format of property title as key and value/property id as an array
  return data;
};

export const fetchOne = async (baseAddress, endpoint, id, params = null) => {
  var address = `http://${baseAddress}/api/${endpoint}/${id}`;
  if (params) {
    address += `?key_identity=${params.key_identity}&key_credential=${params.key_credential}`;
    console.log("address", address);
  }
  const res = await axios.get(address);
  return res.data;
};

export const getResourceTemplate = (baseAddress, templateId) => {
  return axios.get(
    "http://" + baseAddress + "/api/resource_templates/" + templateId
  );
};

export const getPropertiesInResourceTemplate = (baseAddress, templateId) => {
  return getResourceTemplate(baseAddress, templateId).then((response) => {
    let requests = response.data["o:resource_template_property"].map(
      (property) => axios.get(property["o:property"]["@id"])
    );
    return axios.all(requests);
  });
};

export const getPropertyIds = (baseAddress, templateId) => {
  return getResourceTemplate(baseAddress, templateId).then((res) => {
    let requests = res.data["o:resource_template_property"].map(
      (prop) => prop["o:property"]["o:id"]
    );
    return requests;
  });
};

export const createItem = (baseAddress, values) => {
  return axios.post("http://" + userInfo.host + "/api/items", payload, {
    params: {
      key_identity: userInfo.key_identity,
      key_credential: userInfo.key_credential,
    },
    headers: headers,
  });
};
