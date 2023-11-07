import { countryCoordinates } from "../assets/coordinates";

export function totalCustomers(customers) {
  return customers?.length;
}

export function totalNewCustomers(customers) {
  const newCustomers = customers?.filter((customer) =>
    newCustomer(customer?.created_at)
  );
  return newCustomers?.length;
}

function newCustomer(date) {
  var specificDate = new Date(date);
  var currentDate = new Date();
  var timeDifference = currentDate - specificDate;
  var daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  return daysDifference <= 30 ? true : false;
}

export function totalCountries(countries) {
  const country = getUniqueCountries(countries, "country");
  return country?.length;
}

export function getUniqueCountries(countries, property) {
  const uniqueCountriesSet = new Set();

  countries?.forEach((country) => {
    if (country?.default_address?.country) {
      uniqueCountriesSet?.add(country?.default_address?.[property]);
    }
  });

  return Array.from(uniqueCountriesSet);
}

export function activeCustomers(customers) {
  let activeCustomer = customers?.filter(
    (customer) => customer?.state === "enabled"
  );
  return activeCustomer?.length;
}

export function totalOrders(customers) {
  return customers?.reduce(
    (totalOrder, customer) => totalOrder + customer?.orders_count,
    0
  );
}

export function totalSpent(customers) {
  return customers?.reduce(
    (totalSpent, customer) => totalSpent + +customer?.total_spent,
    0
  );
}

export function countriesSummery(customers) {
  const countryData = {};

  customers?.forEach((customer) => {
    const country = customer?.default_address?.country;
    if (country) {
      if (!countryData?.[country]) {
        countryData[country] = {
          customers: 0,
          orders: 0,
          totalSpent: 0,
        };
      }

      countryData[country].customers++;
      countryData[country].orders += customer.orders_count;
      countryData[country].totalSpent += parseFloat(customer.total_spent);
    }
  });

  const result = Object.entries(countryData).map(([country, data]) => {
    const { lat, lng } = countryCoordinates[country];
    return {
      country: country,
      customers: data.customers,
      total_orders: data.orders,
      total_spent: data.totalSpent?.toFixed(2),
      lat,
      lng,
    };
  });
  return result;
}

export function getCustomersByCountry(countries, countryName) {
  let filteredCountry = countries?.filter(
    (customer) => customer?.default_address?.country === countryName
  );
  return filteredCountry;
}

export function getCustomersWithoutDefaultAddress(countries) {
  let usersWithoutAddress = countries.filter(
    (country) => !country?.default_address?.country
  );
  let totalOrder = usersWithoutAddress?.reduce(
    (acc, user) => acc + user?.orders_count,
    0
  );

  let totalSpent = usersWithoutAddress?.reduce(
    (acc, user) => acc + +user?.total_spent,
    0
  );

  return {
    totalUsers: usersWithoutAddress?.length,
    totalOrder,
    totalSpent,
  };
}
