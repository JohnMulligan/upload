import axios from "axios";
import * as SecureStore from "expo-secure-store";

const PER_PAGE = 4;

// General fetch
export const fetch = async (
  baseAddress,
  endpoint,
  loadpage,
  itemSetId,
  params,
  start,
  sortBy,
  sortOrder
) => {
  const res = await axios.get(
    `http://${baseAddress}/api/${endpoint}?sort_by=o:modified&sort_order=desc`,
    {
      params: {
        ...params,
        item_set_id: itemSetId !== -1 ? itemSetId : null,
        sort_by: sortBy,
        sort_order: sortOrder,
        page: loadpage,
        per_page: PER_PAGE,
      },
    }
  );
  const data = res.data.map((each) => ({
    ...each,
    key: each["o:id"],
  }));
  return data;
};


// General fetch but the order of display is most recent - oldest
export const fetchItemsFilter = async (
  baseAddress,
  endpoint,
  keys,
  keyword,
  params,
  sortBy = "o:modified",
  sortOrder = "desc"
) => {
  const res = await axios.get(
    `http://${baseAddress}/api/${endpoint}?fulltext_search=${keyword}&key_identity=${
      keys.split(",")[0]
    }&key_credential=${keys.split(",")[1]}&sort_by=o:modified&sort_order=desc`
  );
  const data = res.data.map((each) => ({
    ...each,
    key: each["o:id"],
  }));
  return data;
};

// Gets the object data for each resource template currently available
export const fetchResourceTemplates = async (baseAddress) => {
  const res = await axios.get(
    `http://${baseAddress}/api/resource_templates?per_page=${PER_PAGE}`
  );
  return res.data;
};

// Returns item data in object form with: title, id, property_label, @value, and property_id
export const fetchItemData = async (
  baseAddress,
  endpoint,
  id,
  params = null
) => {
  const res = await axios.get(`http://${baseAddress}/api/${endpoint}/${id}`, {
    params,
  });
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
        keys[i],
      ]);
    }
  }
  //returns data in a format where title and id are retrieved from user input
  //and properties are in the format of property title as key and value/property id as an array
  return data;
};

// Get one item by ID
// only retrieves PUBLIC items
export const fetchOne = async (baseAddress, endpoint, id, params = null) => {
  var address = `http://${baseAddress}/api/${endpoint}/${id}`;
  const res = await axios.get(address, { params });
  return res.data;
};

// Get one resource template by ID
// Assumes all resource templates are public
export const getResourceTemplate = async (baseAddress, templateId) => {
  const res = await axios.get(
    "http://" + baseAddress + "/api/resource_templates/" + templateId
  );
  return res;
};

// Retrieve all property IDs in a given resource template
export const getPropertiesInResourceTemplate = (baseAddress, templateId) => {
  return getResourceTemplate(baseAddress, templateId).then((response) => {
    let requests = response.data["o:resource_template_property"].map(
      (property) => axios.get(property["o:property"]["@id"])
    );
    return axios.all(requests);
  });
};

// Returns a list of all the properties by their IDs
export const getPropertyIds = (baseAddress, templateId) => {
  return getResourceTemplate(baseAddress, templateId).then((res) => {
    let requests = res.data["o:resource_template_property"].map(
      (prop) => prop["o:property"]["o:id"]
    );
    return requests;
  });
};

// Get the thumbnail image attached to each item
export const getThumbnail = async (baseAddress, id, params) => {
  const res = await axios.get(`http://${baseAddress}/api/items/${id}`, {
    params,
  });
  return res.data["thumbnail_display_urls"]["square"];
};

// Get the full sized (square) image attached to each item
export const getImage = async (baseAddress, id, params = null) => {
  console.log("id", id);
  const res = await axios.get(`http://${baseAddress}/api/media/${id}`, {
    params,
  });
  return res.data["o:thumbnail_urls"]["square"];
};

// Get all media uploaded to each item
export const getMedia = async (baseAddress, id, params = null) => {
  params.page = 1;
  params.per_page = 10;
  const res = await axios.get(`http://${baseAddress}/api/items/${id}`, {
    params,
  });
  return res.data["o:media"];
};
