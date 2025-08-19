// Utility to delay a function call with setTimeout, and return a cleanup function
export function delayCall(fn, delay = 100) {
  const timeout = setTimeout(fn, delay);
  return () => clearTimeout(timeout);
}

// Template for customer POST body. Use this and only fill in the data you need.
export function createCustomerBody({
  email = "",
  lastName = "",
  firstName = "",
  entityStatusId = 6,
  subsidiaryId = 2,
  categoryId = 15,
  isPerson = true,
  homePhone = "",
  mobilePhone = "",
  addr1 = "",
  city = "",
  state = "",
  zip = "",
  countryId = "CA",
  defaultBilling = true,
  defaultShipping = true,
} = {}) {
  return {
    email,
    lastName,
    firstName,
    entityStatus: { id: entityStatusId },
    subsidiary: { id: subsidiaryId },
    category: { id: categoryId },
    isPerson,
    homePhone,
    mobilePhone,
    addressBook: {
      items: [
        {
          addressBookAddress: {
            addr1,
            city,
            state,
            zip,
            country: { id: countryId },
          },
          defaultBilling,
          defaultShipping,
        },
      ],
    },
  };
}

// Template for customer UPDATE body. Only includes updatable fields.
export function createUpdateCustomerBody({
  lastName = "",
  firstName = "",
  homePhone = "",
  mobilePhone = "",
  addr1 = "",
  city = "",
  state = "",
  zip = "",
  countryId = "CA",
  defaultBilling = true,
  defaultShipping = true,
} = {}) {
  return {
    lastName,
    firstName,
    homePhone,
    mobilePhone,
    addressBook: {
      items: [
        {
          addressBookAddress: {
            addr1,
            city,
            state,
            zip,
            country: { id: countryId },
          },
          defaultBilling,
          defaultShipping,
        },
      ],
    },
  };
}
