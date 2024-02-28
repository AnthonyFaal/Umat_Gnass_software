const pool = require('../config/dbConfig');

const createProfile = async (req, res) => {
    const {  profile_image, contact, gender, department, id, level } = req.body;
  
    const client = await pool.connect();
    try {
      const createProfileQuery = `
        INSERT INTO profiles(profile_image, contact, gender, department, user_id, level)
        VALUES($1, $2, $3, $4, $5, $6)
        RETURNING *`;
  
      const values = [ profile_image, contact, gender, department, id, level];
      const result = await client.query(createProfileQuery, values);
  
      res.json({ profile: result.rows[0] });
    } catch (error) {
      console.error('Error creating profile:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    } finally {
      client.release();
    }
  };
 

  const updateProfile = async (req, res) => {
    const { profile_id, profile_image, contact, gender, department, id, level } = req.body;
  
    const client = await pool.connect();
    try {
      const updateProfileQuery = `
        UPDATE profiles
        SET profile_image = $2, contact = $3, gender = $4, department = $5, level = $7
        WHERE profile_id = $1 AND user_id = $6
        RETURNING *`;
  
      const values = [profile_id, profile_image, contact, gender, department, id, level];
      const result = await client.query(updateProfileQuery, values);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Profile not found' });
      }
  
      res.json({ updatedProfile: result.rows[0] });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    } finally {
      client.release();
    }
  };

  const getProfileById = async (req, res) => {
    const { profileId } = req.params;
  
    const client = await pool.connect();
    try {
      const getProfileQuery = 'SELECT * FROM profiles WHERE profile_id = $1';
      const result = await client.query(getProfileQuery, [profileId]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Profile not found' });
      }
  
      res.json({ profile: result.rows[0] });
    } catch (error) {
      console.error('Error fetching profile:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    } finally {
      client.release();
    }
  };
  


module.exports ={createProfile, getProfileById,updateProfile}
