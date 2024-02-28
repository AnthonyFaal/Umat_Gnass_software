const { expect } = require('chai');
const { registerUser } = require('./');

describe('registerUser function', () => {
  it('should register a user and return a token', async () => {
    const req = {
      body: {
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'testpassword',
      },
    };
    const res = {
      json: (result) => {
        // Assuming your response includes userId and token
        expect(result).to.have.property('userId');
        expect(result).to.have.property('token');
      },
      status: (code) => {
        expect(code).to.equal(200);
        return res;
      },
    };

    await registerUser(req, res);
  });
});

// Add more tests to cover different scenarios and edge cases
