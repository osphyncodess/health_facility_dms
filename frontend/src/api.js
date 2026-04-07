import axios from "axios";
var API_URL = "http://localhost:8000"; // your PHP server
API_URL = "http://10.47.211.208:8000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = "Bearer " + token;
  return config;
});

// Auto refresh
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      const res = await axios.get("http://localhost:8000/auth/refresh.php", {
        withCredentials: true,
      });

      localStorage.setItem("access_token", res.data.access_token);

      err.config.headers.Authorization = "Bearer " + res.data.access_token;
      return axios(err.config);
    }
    return Promise.reject(err);
  },
);

export default api;

export const createPatient = async (patient, returnText = false) => {
  const res = await fetch(`${API_URL}/patients/create.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(patient),
  });

  if (returnText) {
    return res.text();
  } else {
    return res.json();
  }
};

export const createRecords = async (data, url, returnText = false) => {
  try {
    const res = await api.post(`${url}.php`, data); // Axios automatically JSON.stringifies

    return res.data; // Axios doesn't have res.text(), res.data contains response
  } catch (error) {
    // Optional: handle error consistently
    if (error.response) {
      // Server responded with status code outside 2xx
      throw error.response.data;
    } else {
      // Network error or other
      throw error;
    }
  }
};

export const Left = (text, length) => {
  var newText = "";
  for (let index = 0; index < length; index++) {
    var element = text[index];

    newText += element;
  }

  return newText;
};

export const makeFormValues = (formData = []) => {
  const formInValues = {};

  formData.forEach((c) => {
    if (c.type === "select") {
      formInValues[c.name] = c.default;
    } else if (c.type === "select-many") {
      formInValues[c.name] = [];
    } else {
      formInValues[c.name] = "";
    }
  });

  return formInValues;
};

export const getLabelID = (text = "", getLabel = false) => {
  const array = String(text).split(",");

  if (getLabel) {
    return array[1];
  } else {
    return array[0];
  }
};

export const getRecords = async (url, returnText = false) => {
  const res = await fetch(`${API_URL}/get_${url}.php`);
  if (returnText) {
    return res.text();
  } else {
    return res.json();
  }
};

export const getMonthRange = (date = new Date()) => {
  const current = new Date(date);
  const firstDay = new Date(current.getFullYear(), current.getMonth(), 1);

  const lastDay = new Date(current.getFullYear(), current.getMonth() + 1, 0);

  return { firstDay, lastDay };
};
export const getMonthDayRange = (date = new Date()) => {
  const current = new Date(date);

  const currYear = current.getFullYear();
  const currMonth = current.getMonth() + 1;
  const currDay = current.getDate();

  const lastDay = new Date(currYear, currMonth, 0).getDate();

  const monthRange = [];
  for (let i = 1; i <= lastDay; i++) {
    monthRange.push(i);
  }

  const years = [];
  for (let i = currYear; i >= currYear - 10; i--) {
    years.push(i);
  }

  return {
    currYear,
    currMonth,
    currDay,
    monthRange,
    years,
  };
};

export const formatDate = (date, iso = false) => {
  const d = new Date(date);

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return iso ? `${year}-${month}-${day}` : `${day}/${month}/${year}`;
};
export const Proper = (str) => {
  return str
    .split(" ") // Split string into words
    .map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(), // Capitalize first letter
    )
    .join(" "); // Join words back into a string
};
export const getMonth2Digit = (monthInt = "", isNum = false) => {
  const obj = {
    January: "01",
    February: "02",
    March: "03",
    April: "04",
    May: "05",
    June: "06",
    July: "07",
    August: "08",
    September: "09",
    October: "10",
    November: "11",
    December: "12",
  };
  if (!isNum) {
    return obj[monthInt];
  } else {
    const num = Number(monthInt);

    return num < 10 ? `0${num}` : num;
  }
};
