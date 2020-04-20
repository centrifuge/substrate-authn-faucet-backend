import { users } from '../models';

const username = 'admin2@blockxlabs.com';

describe('#getUserByUserName', function() {
  it('should return a user object by passing username', async function(done) {
    const user = await users.findOne({ where: { username } });
    if (user !== null) {
      expect(user.username).toBe(username);
      done();
    }
  });
});
