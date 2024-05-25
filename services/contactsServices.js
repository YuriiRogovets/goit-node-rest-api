import * as fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const contactsPath = path.resolve("db", "contacts.json");

async function writeFile(contacts) {
  await fs.writeFile(contactsPath, JSON.stringify(contacts, undefined, 2));
}

async function listContacts() {
    const data = await fs.readFile(contactsPath, { encoding: "utf-8" });
    return JSON.parse(data);
}

async function getContactById(contactId) {
    const contacts = await listContacts();
    const searchContact = contacts.find((contact) => contact.id === contactId);

  if (typeof searchContact === "undefined") {
    return null;
  }

  return searchContact;
}
   

async function removeContact(contactId) {
    const contacts = await listContacts();
    const index = contacts.findIndex((contact) => contact.id === contactId);

  if (index === -1) {
    return null;
  }

  const deletedContact = contacts[index];

  contacts.splice(index, 1);

  await writeFile(contacts);

  return deletedContact;
}

async function addContact(name, email, phone) {
    const contacts = await listContacts();
    const newContact = {
        id: crypto.randomUUID(),
        name,
        email,
        phone,
    };

    contacts.push(newContact);

    await writeFile(contacts);

    return newContact;
}

async function updateContact(contactId, data) {
  const contacts = await listContacts();

  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) {
    return null;
  }

  const updateContact = contacts[index];

  for (let key in data) {
    if (data.hasOwnProperty(key)) {
        updateContact[key] = data[key];
    }
  }

  contacts.splice(index, 1, updateContact);

  await writeFile(contacts);

  return updateContact;
}

export default { listContacts, removeContact, getContactById, addContact, updateContact };