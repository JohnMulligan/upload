import axios from "axios";
import * as SecureStore from "expo-secure-store";

const PER_PAGE = 4;

export const fetchItemsFilter = async (
  baseAddress,
  endpoint,
  keys,
  keyword,
  params,
  sortBy = "o:modified",
  sortOrder = "asc"
) => {
  const res = await axios.get(
    `http://${baseAddress}/api/${endpoint}?fulltext_search=${keyword}&key_identity=${
      keys.split(",")[0]
    }&key_credential=${keys.split(",")[1]}&sort_by=o:modified`
  );
  const data = res.data.map((each) => ({
    ...each,
    key: each["o:id"],
  }));
  return data;
};

export const fetch = async (
  baseAddress,
  endpoint,
  loadpage,
  itemSetId,
  params,
  start,
  sortBy = "id",
  sortOrder = "asc"
) => {
  // console.log(baseAddress, endpoint, loadpage, itemSetId, params, start);
  const res = await axios.get(`http://${baseAddress}/api/${endpoint}`, {
    params: {
      ...params,
      item_set_id: itemSetId !== -1 ? itemSetId : null,
      sort_by: sortBy,
      sort_order: sortOrder,
      page: loadpage,
      per_page: PER_PAGE,
    },
  });

  const data = res.data.map((each) => ({
    ...each,
    key: each["o:id"],
  }));
  // console.log('data', data);

  return data;
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
  // console.log('res gotten~');
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
      // console.log('test', keys[i]);
      data.push([
        res.data[keys[i]][0]["property_label"],
        res.data[keys[i]][0]["@value"],
        res.data[keys[i]][0]["property_id"],
        keys[i],
      ]);
    }
  }
  // console.log('data', data)
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

export const getResourceTemplate = async (baseAddress, templateId) => {
  const res = await axios.get(
    "http://" + baseAddress + "/api/resource_templates/" + templateId
  );
  return res;
};

export const getPropertiesInResourceTemplate = (baseAddress, templateId) => {
  // console.log(baseAddress, templateId)
  return getResourceTemplate(baseAddress, templateId).then((response) => {
    let requests = response.data["o:resource_template_property"].map(
      (property) => axios.get(property["o:property"]["@id"])
    );
    return axios.all(requests);
  });
};

export const getProperties = (baseAddress, templateId) => {
  return getResourceTemplate(baseAddress, templateId).then((res) => {
    let requests = res.data["o:resource_template_property"].map(
      (prop) => prop["o:property"]
    );
    return requests;
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

// export const patchItem = (itemId, payload) => {
//   SecureStore.getItemAsync("host").then((host) => {
//     SecureStore.getItemAsync("keys").then((keys) => {
//       console.log(`http://${host}/api/items/${itemId}?key_identity=${
//           keys.split(",")[0]
//         }&key_credential=${keys.split(",")[1]}`)
//       return axios.patch(
//         `${host}/api/items/${itemId}?key_identity=${
//           keys.split(",")[0]
//         }&key_credential=${keys.split(",")[1]}`,
//         payload
//       );
//     });
//   });
// };

export const getThumbnail = async (baseAddress, id, keys) => {
  const res = await axios.get(
    `http://${baseAddress}/api/items/${id}?key_identity=${
      keys.split(",")[0]
    }&key_credential=${keys.split(",")[1]}`
  );
  return res.data["thumbnail_display_urls"]["square"];
};

export const getImage = async (baseAddress, id, keys) => {
  console.log("id", id);
  const res = await axios.get(
    `http://${baseAddress}/api/media/${id}?key_identity=${
      keys.split(",")[0]
    }&key_credential=${keys.split(",")[1]}`
  );
  // console.log("hi", res.data["o:thumbnail_urls"]["square"]);
  return res.data["o:thumbnail_urls"]["square"];
};

export const getMedia = async (baseAddress, id, keys) => {
  const res = await axios.get(
    `http://${baseAddress}/api/items/${id}?key_identity=${
      keys.split(",")[0]
    }&key_credential=${keys.split(",")[1]}`,
    { params: { page: 1, per_page: 10 } }
  );
  return res.data["o:media"];
};
