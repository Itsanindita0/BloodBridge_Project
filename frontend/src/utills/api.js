export const api = async (url, method = "GET", body = null, token = "") => {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  };

  if (body) options.body = JSON.stringify(body);
  
  const res = await fetch(url, options);
  return res.json();
};
