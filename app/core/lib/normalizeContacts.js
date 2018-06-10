import normalizePhone from "./normalizePhone";

const removeDupeValues = (acc, record) => {
  if (record && record.value && !acc.find(r => r.value === record.value)) {
    return [...acc, record];
  }

  return acc;
};

export default (contacts, myPhone, myEmail) =>
  contacts
    .map(contact => {
      const first = (contact.givenName || "").trim();
      const last = (contact.familyName || "").trim();

      return {
        ...contact,
        name: `${first}${first && last ? " " : ""}${last}`
      };
    })
    .filter(contact => contact.name)
    .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
    .reduce(
      (acc, i) =>
        acc.find(a => a.recordID === i.recordID) ? acc : [...acc, i],
      []
    )
    .map(contact => {
      const baseInfo = {
        contactId: contact.recordID,
        name: contact.name
      };

      const emails = (contact.emails || contact.emailAddresses || [])
        .map((email, ndx) => ({
          ...baseInfo,
          type: "email",
          id: `email-${contact.recordID}-${ndx}`,
          displayValue: email.email.trim(),
          value: email.email.trim().toLowerCase(),
          label: email.label
        }))
        .filter(email => email.value !== myEmail.trim().toLowerCase())
        .reduce(removeDupeValues, []);

      const phoneNumbers = (contact.phoneNumbers || [])
        .map((phoneNumber, ndx) => ({
          ...baseInfo,
          type: "phone",
          id: `phone-${contact.recordID}-${ndx}`,
          displayValue: phoneNumber.number,
          value: normalizePhone(phoneNumber.number),
          label: phoneNumber.label
        }))
        .filter(p => p.value !== myPhone)
        .reduce(removeDupeValues, []);

      return [...emails, ...phoneNumbers];
    })
    .reduce(
      (acc, contactEmailsAndPhones) => [...acc, ...contactEmailsAndPhones],
      []
    );
