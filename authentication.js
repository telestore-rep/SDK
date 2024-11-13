const elliptic = require("elliptic");

const coerceToBase64Url = (thing) => {
  // Array or ArrayBuffer to Uint8Array
  if (Array.isArray(thing)) {
    thing = Uint8Array.from(thing);
  }

  if (thing instanceof ArrayBuffer) {
    thing = new Uint8Array(thing);
  }

  // Uint8Array to base64
  if (thing instanceof Uint8Array) {
    let str = "";
    const len = thing.byteLength;

    for (let i = 0; i < len; i++) {
      str += String.fromCharCode(thing[i]);
    }
    thing = Buffer.from(str, "latin1").toString("base64");
  }

  if (typeof thing !== "string") {
    throw new Error("could not coerce to string");
  }

  // base64 to base64url
  // NOTE: "=" at the end of challenge is optional, strip it off here
  thing = thing.replace(/\+/g, "-").replace(/\//g, "_").replace(/=*$/g, "");

  return thing;
};

const base64URL_to_Uint8Array = (str) =>
  Uint8Array.from(
    Buffer.from(str.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString(
      "latin1"
    ),
    (c) => c.charCodeAt(0)
  );

async function fetchData(url, init) {
  try {
    const response = await fetch(url, init);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    // Retrieve the `Set-Cookie` header, if available
    const cookieHeader = response.headers.get("Set-Cookie") || null;
    const data = await response.json();
    return { cookieHeader, data };
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

// The authorization process consists of getting the challenge from server,
// signing the challenge and sending the signed challenge back to the server
async function authorize(apiUrl, privateKey) {
  // Getting the challenge
  const loginOptionsRes = await fetchData(apiUrl + "auth/v1/login_options", {
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (!loginOptionsRes.data.result) return;

  const options = loginOptionsRes.data.result;

  // Preparing the key
  const ec = new elliptic.eddsa("ed25519");
  const challengeBuf = base64URL_to_Uint8Array(options.challenge);

  let key = ec.keyFromSecret(privateKey);
  let public_key = key.getPublic();

  // Signing the challenge
  let signature = key.sign(challengeBuf).toBytes();

  const data = {
    challenge_id: options.challenge_id,
    credential: null,
    public_key: coerceToBase64Url(public_key),
    signature: coerceToBase64Url(signature),
  };

  // That can be any string
  const deviceGuid = "project_device";

  // Sending the signed challenge
  const loginRes = await fetchData(apiUrl + "auth/v1/login", {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(data),
    headers: {
      Accept: "application/json",
      Origin: "https://telestore.itbuild.app:8081",
      "Content-Type": "application/json",
      device_guid: deviceGuid,
    },
  });

  if (loginRes.data.result !== "Failure") {
    return loginRes.cookieHeader;
  }
  return null;
}

async function fetchWithAuthorization(url, cookieString) {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Cookie: cookieString, // Set the Cookie header
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (response.status === 401) {
      console.log("Unauthorized access - 401");
      return null; // Return null for 401
    } else if (response.ok) {
      return await response.json(); // Parse and return JSON data if successful
    } else {
      console.log("Request failed with status: " + response.status);
      return null; // Return null for other failures
    }
  } catch (error) {
    console.error("Error making the request:", error);
    return null; // Return null in case of error
  }
}

// This is API base URL
const apiUrl = "https://telestore.itbuild.app:8081/";

// This is a test private key, just as a demonstration
let pKey = "532be8142c2680590828a64ad46c64bbbe50709de1f23d52cdd69187ad9d62eb";

// Getting the authorization (session ID in a cookie string)
let cookieString;
authorize(apiUrl, pKey).then((result) => {
  cookieString = result;
  console.log(
    `Send that as a Cookie header with each subsequent request: "${result}"`
  );

  // Now we will test the authentication
  fetchWithAuthorization(apiUrl + "api/v1/teleuser_details", cookieString).then(
    (data) => {
      if (data) {
        console.log("Access granted with data:", data);
      } else {
        console.log("Access denied or request failed.");
      }
    }
  );
});

return;
