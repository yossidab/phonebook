const request = require('supertest');
const { expect } = require('chai');
const app = require('../server');
const mongoose = require('mongoose');
const Contact = require('../models/contact');
const logger = require('../logger');

describe('API Tests', () => {
  before(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  after(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  describe('GET /api/contacts/get-contacts', () => {
    before(async () => {
      await Contact.create({ firstName: 'John', lastName: 'Doe', phone: '1234567890', address: '123 Main St' });
    });

    it('should get contacts', async () => {
      const res = await request(app)
        .get('/api/contacts/get-contacts')
        .expect(200);

      expect(res.body.contacts).to.be.an('array');
      expect(res.body.contacts[0]).to.include({ firstName: 'John', lastName: 'Doe' });
      logger.debug('Test GET /api/contacts/get-contacts passed');
    });
  });

  describe('POST /api/contacts/create-contact', () => {
    it('should create a new contact', async () => {
      const res = await request(app)
        .post('/api/contacts/create-contact')
        .send({ firstName: 'Yossi', lastName: 'Dabush', phone: '0987654321', address: '456 Elm St' })
        .expect(201);

      expect(res.body).to.include({ firstName: 'Yossi', lastName: 'Dabush' });
      logger.debug('Test POST /api/contacts/create-contact passed');
    });
  });

  describe('GET /api/contacts/get-contact-by-id', () => {
    let contact;

    before(async () => {
      contact = await Contact.create({ firstName: 'Test', lastName: 'User', phone: '1111111111', address: '789 Test Ave' });
    });

    it('should get a contact by ID', async () => {
      const res = await request(app)
        .get(`/api/contacts/get-contact-by-id?id=${contact._id}`)
        .expect(200);

      expect(res.body).to.include({ firstName: 'Test', lastName: 'User' });
      logger.debug('Test GET /api/contacts/get-contact-by-id passed');
    });
  });

  describe('PUT /api/contacts/update-contact', () => {
    let contact;

    before(async () => {
      contact = await Contact.create({ firstName: 'Update', lastName: 'User', phone: '2222222222', address: '101 Update St' });
    });

    it('should update a contact by ID', async () => {
      const res = await request(app)
        .put(`/api/contacts/update-contact`)
        .send({
          _id: contact._id,
          phone: contact.phone,
          firstName: contact.firstName,
          lastName: contact.lastName,
          address: 'Updated Address' })
        .expect(200);

      expect(res.body).to.include({ address: 'Updated Address' });
      logger.debug('Test PUT /api/contacts/update-contact passed');
    });
  });

  describe('DELETE /api/contacts/delete-contact', () => {
    let contact;

    before(async () => {
      contact = await Contact.create({ firstName: 'Delete', lastName: 'User', phone: '3333333333', address: '202 Delete St' });
    });

    it('should delete a contact by ID', async () => {
      const res = await request(app)
        .delete(`/api/contacts/delete-contact?id=${contact._id}`)
        .expect(200);

      expect(res.body).to.include({ message: 'Contact deleted' });
      logger.debug('Test DELETE /api/contacts/delete-contact passed');
    });
  });
});
