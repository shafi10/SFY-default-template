export const callPathaoConfig = async () => {
  const payload = {
    // required properties
    type: "pathao",

    // payload contains credentials and default settings
    payload: {
      // pathao credentials
      username: "kazisujoy@gmail.com",
      password: "??Brainstation23??",

      // default courier configs
      defaultDeliveryType: "home",
      defaultPackageType: "box",
      defaultWeight: 25,
      defaultCODAmount: 500,
      defaultParcelNote: "Default note",
      shouldEnableCoodByDefault: true,
    },
  };
  const respose = await fetch("/api/admin/courier-config", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const jsonResponse = await respose.json();
  console.log(jsonResponse);
};

export const callRedxConfig = async () => {
  const payload = {
    // required properties
    type: "redx",

    // payload contains credentials and default settings
    payload: {
      // redx credentials
      apiToken:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMDMwNDE2IiwiaWF0IjoxNzYxMDM2MDk0LCJpc3MiOiIyaXRzdTV2UnNINlJndXdlTzdOMjJjUkJJYXBVb3ExSCIsInNob3BfaWQiOjEwMzA0MTYsInVzZXJfaWQiOjEwNjM4ODcwfQ.dNmCwPVTHKSWdzxt1w__nUH_bVtiGT_sietahjIaoj4",

      // default courier configs
      defaultDeliveryType: "home",
      defaultPackageType: "box",
      defaultWeight: 25,
      defaultCODAmount: 500,
      defaultParcelNote: "Default note",
      shouldEnableCoodByDefault: true,
    },
  };
  const respose = await fetch("/api/admin/courier-config", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const jsonResponse = await respose.json();
  console.log(jsonResponse);
};

export const callSteadfastConfig = async () => {
  const payload = {
    // required properties
    type: "steadfast",

    // payload contains credentials and default settings
    payload: {
      // steadfast credentials
      apiKey: "sdpe46ft5byis0guiwkv8fjzf7bhz61b",
      secretKey: "6j6zsaoettq8s0fmxe8vdvt7",

      // default courier configs
      defaultDeliveryType: "home",
      defaultPackageType: "box",
      defaultWeight: 25,
      defaultCODAmount: 500,
      defaultParcelNote: "Default note",
      shouldEnableCoodByDefault: true,
    },
  };
  const respose = await fetch("/api/admin/courier-config", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const jsonResponse = await respose.json();
  console.log(jsonResponse);
};

export const generateHookCredential = async () => {
  const respose = await fetch(
    "/api/admin/courier-config/create-hook-credential/redx",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const jsonResponse = await respose.json();
  console.log(jsonResponse);
};

export const callGetPathaoConfig = async () => {
  const respose = await fetch("/api/admin/courier-config/pathao", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const jsonResponse = await respose.json();
  console.log(jsonResponse);
};

export const callGetPathaoPickupLocationList = async () => {
  const respose = await fetch("/api/admin/shipment/pathao/pickup-locations", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const jsonResponse = await respose.json();
  console.log(jsonResponse);
};
