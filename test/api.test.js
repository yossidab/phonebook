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

  describe('GET /api/contacts', () => {
    before(async () => {
      await Contact.create({ firstName: 'John', lastName: 'Doe', phone: '1234567890', address: '123 Main St' });
    });

    it('should get contacts', async () => {
      const res = await request(app)
        .get('/api/contacts')
        .expect(200);

      expect(res.body.contacts).to.be.an('array');
      expect(res.body.contacts[0]).to.include({ firstName: 'John', lastName: 'Doe' });
      logger.debug('Test GET /api/contacts passed');
    });
  });

  describe('POST /api/contacts', () => {
    it('should create a new contact', async () => {
      const res = await request(app)
        .post('/api/contacts')
        .send({ firstName: 'Jane', lastName: 'Doe', phone: '0987654321', address: '456 Elm St' })
        .expect(201);

      expect(res.body).to.include({ firstName: 'Jane', lastName: 'Doe' });
      logger.debug('Test POST /api/contacts passed');
    });
  });

  describe('GET /api/contacts/:id', () => {
    let contact;

    before(async () => {
      contact = await Contact.create({ firstName: 'Test', lastName: 'User', phone: '1111111111', address: '789 Test Ave' });
    });

    it('should get a contact by ID', async () => {
      const res = await request(app)
        .get(`/api/contacts/${contact._id}`)
        .expect(200);

      expect(res.body).to.include({ firstName: 'Test', lastName: 'User' });
      logger.debug('Test GET /api/contacts/:id passed');
    });
  });

  describe('PUT /api/contacts/:id', () => {
    let contact;

    before(async () => {
      contact = await Contact.create({ firstName: 'Update', lastName: 'User', phone: '2222222222', address: '101 Update St' });
    });

    it('should update a contact by ID', async () => {
      const res = await request(app)
        .put(`/api/contacts/${contact._id}`)
        .send({ address: 'Updated Address' })
        .expect(200);

      expect(res.body).to.include({ address: 'Updated Address' });
      logger.debug('Test PUT /api/contacts/:id passed');
    });
  });

  describe('DELETE /api/contacts/:id', () => {
    let contact;

    before(async () => {
      contact = await Contact.create({ firstName: 'Delete', lastName: 'User', phone: '3333333333', address: '202 Delete St' });
    });

    it('should delete a contact by ID', async () => {
      const res = await request(app)
        .delete(`/api/contacts/${contact._id}`)
        .expect(200);

      expect(res.body).to.include({ message: 'Contact deleted' });
      logger.debug('Test DELETE /api/contacts/:id passed');
    });
  });
});
