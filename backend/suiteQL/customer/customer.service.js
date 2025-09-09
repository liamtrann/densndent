const { runQueryWithPagination } = require("../util");

class CustomerService {
  async findByEmail(email, limit, offset) {
    if (!email) throw new Error("Email is required");
    const sql = `SELECT c.id, c.email, c.entityid, c.companyname, c.firstname, c.lastname, c.phone, c.category, c.searchstage, c.custentity_prefer_delivery, c.custentity_favourite_item, ba.addressname AS billing_address_name, sa.addressname AS shipping_address_name, eab.addrtext AS billing_addrtext, eab.city AS billing_city, eab.country AS billing_country, eab.state AS billing_state, eab.zip AS billing_zip, eas.addrtext AS shipping_addrtext, eas.city AS shipping_city, eas.country AS shipping_country, eas.state AS shipping_state, eas.zip AS shipping_zip FROM customer c LEFT JOIN transactionbillingaddressbook ba ON ba.addressbookaddress = c.defaultbillingaddress LEFT JOIN transactionShippingAddressbook sa ON sa.addressbookaddress = c.defaultshippingaddress LEFT JOIN entityaddress eab ON eab.nkey = c.defaultbillingaddress LEFT JOIN entityaddress eas ON eas.nkey = c.defaultshippingaddress WHERE c.email = '${email}'`;
    const results = await runQueryWithPagination(sql, limit, offset);
    return results.items || [];
  }

  async findByStage(stage, limit, offset) {
    const allowedStages = ["Lead", "Customer", "Prospect"];
    if (!allowedStages.includes(stage)) {
      throw new Error("Invalid stage value");
    }
    const sql = `SELECT c.id, c.email, c.entityid, c.companyname, c.firstname, c.lastname, c.phone, c.category, c.searchstage, c.custentity_prefer_delivery, c.custentity_favourite_item, ba.addressname AS billing_address_name, sa.addressname AS shipping_address_name, eab.addrtext AS billing_addrtext, eab.city AS billing_city, eab.country AS billing_country, eab.state AS billing_state, eab.zip AS billing_zip, eas.addrtext AS shipping_addrtext, eas.city AS shipping_city, eas.country AS shipping_country, eas.state AS shipping_state, eas.zip AS shipping_zip FROM customer c LEFT JOIN transactionbillingaddressbook ba ON ba.addressbookaddress = c.defaultbillingaddress LEFT JOIN transactionShippingAddressbook sa ON sa.addressbookaddress = c.defaultshippingaddress LEFT JOIN entityaddress eab ON eab.nkey = c.defaultbillingaddress LEFT JOIN entityaddress eas ON eas.nkey = c.defaultshippingaddress WHERE c.searchstage = '${stage}' ORDER BY c.id DESC`;
    const results = await runQueryWithPagination(sql, limit, offset);
    return results.items || [];
  }
}

module.exports = new CustomerService();
