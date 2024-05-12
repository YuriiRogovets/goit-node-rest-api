import contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js"
import {createContactSchema, updateContactSchema} from "../schemas/contactsSchemas.js"


export const getAllContacts = async (req, res, next) => {
    try {
        const contacts = await contactsService.listContacts();
        res.status(200).json(contacts); 
    } catch (error) {
        
        next(error);
    }
};

export const getOneContact = async (req, res, next) => {
    const { id } = req.params;
    try {
        const contact = await contactsService.getContactById(id);
        if (contact === null) {
            throw HttpError(404);
        }
        res.status(200).json(contact); 

    } catch (error) {
        
        next(error);
    }

};

export const deleteContact = async (req, res, next) => {
    const { id } = req.params;
    try {
        const delContact = await contactsService.removeContact(id);
        console.log(delContact);
        if (delContact === null) {
            throw HttpError(404);
        }
        res.status(200).json(delContact); 

    } catch (error) {
        next (error)
    }

};

export const createContact = async (req, res, next) => {
    const { name, email, phone } = req.body;
    try {
    const contact = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone
    }
    const { error } = createContactSchema.validate(contact, {abortEarly: false})
    
    if (typeof error !== "undefined") {
         return res.status(400).send(error.details.map((error) => error.message).join(", "))
    } else {
        
        const newContact = await contactsService.addContact(name, email, phone);
        res.status(201).json(newContact); 
        }

    } catch (error) {
        
        next(error);
    }
};

export const updateContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = req.body;
                
        const contact = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone
        }
        const { error } = updateContactSchema.validate(contact, {abortEarly: false})
    
        if (typeof error !== "undefined") {
         return res.status(400).send(error.details.map((error) => error.message).join(", "))
        } else {        
            const newContact = await contactsService.updateContact(id, data);
            console.log(newContact);
            res.status(200).json(newContact); 
        }

    } catch (error) {
        
        next(error);
    }
};