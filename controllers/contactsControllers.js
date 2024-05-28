import HttpError from "../helpers/HttpError.js"
import { createContactSchema, updateContactSchema, updateStatusContactSchema } from "../schemas/contactsSchemas.js"
import Contact from "../models/contact.js"
import { isValidObjectId } from "mongoose";


export const getAllContacts = async (req, res, next) => {

    try {
        const contacts = await Contact.find({owner: req.user.id});
        res.status(200).send(contacts); 
    } catch (error) {
        
        next(error);
    }
};

export const getOneContact = async (req, res, next) => {
       
    try {
        const { id } = req.params;

    if (isValidObjectId(id) !== true) throw HttpError(400, `${id} is not valid id`);
        
        const contact = await Contact.findOne({_id:id, owner: req.user.id});

        if (contact === null) {
            throw HttpError(404);
        }

     
        res.status(200).send(contact); 

    } catch (error) {
        
        next(error);
    }

};

export const deleteContact = async (req, res, next) => {
    
    try {
         const { id } = req.params;
         if (isValidObjectId(id) !== true) throw HttpError(400, `${id} is not valid id`);

        const delContact = await Contact.findByIdAndDelete({_id:id, owner: req.user.id});
        
        if (delContact === null) {
            throw HttpError(404);
        }
        res.status(200).json(delContact); 

    } catch (error) {
        next (error)
    }

};

export const createContact = async (req, res, next) => {
        
    try {
        const contact = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            favorite: req.body.favorite,
            owner: req.user.id,
        };

        const { error } = createContactSchema.validate(contact, { abortEarly: false })
    
        if (typeof error !== "undefined") {
        
            throw HttpError(400, error.details[0].message);
            
        }
        
        const newContact = await Contact.create(contact);
                    
        res.status(201).json(newContact);
        

    } catch (error) {
        
        next(error);
    }
};

export const updateContact = async (req, res, next) => {
    try {
        const { id } = req.params;
         if (isValidObjectId(id) !== true) throw HttpError(400, `${id} is not valid id`);
        
        const data = req.body;
        // console.log(data);
        
        if (Object.keys(data).length === 0) {

             throw HttpError(400, "Body must have at least one field");
          
        }
                     
        const { error } = updateContactSchema.validate(data, { abortEarly: false });      
        
        if (error) {

            throw HttpError(400, error.message);
            
        }
        
        const updatedContact = await Contact.findByIdAndUpdate(id, data, { new: true });
        
        if (updatedContact === null) {
           
            throw HttpError(404);
        }

        if (updatedContact.owner.toString() !== req.user.id) {
             console.log(updatedContact.owner.toString() );
            throw HttpError(404);
          } 

        
        
        res.status(200).send(updatedContact);    

    } catch (error) {        
        next(error);
    }
};

export const updateStatusContact = async (req, res, next) => {

    try {
        const { id } = req.params;
        if (isValidObjectId(id) !== true) throw HttpError(400, `${id} is not valid id`);
        
        const data = req.body;
        
        const { error } = updateStatusContactSchema.validate(data, { abortEarly: false });      
    
        if (error) {

            throw HttpError(400, error.message);
            
        }


        const updatedContact = await Contact.findByIdAndUpdate(id, data, { new: true });

        if (updatedContact === null) {
            console.log("updatedContact === null");
                throw HttpError(404);
        }
        
        if (updatedContact.owner.toString() !== req.user.id) {
            throw HttpError(404);
          } 

        
        
        res.status(200).send(updatedContact);    
        
} catch (error) {
    next(error);
}

    
}