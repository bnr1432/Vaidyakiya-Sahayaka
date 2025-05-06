create database vaidya;

use vaidya;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  mobile VARCHAR(20) NOT NULL,
  age INT NOT NULL,
  address TEXT NOT NULL,
  gender VARCHAR(10) NOT NULL,
  bloodGroup VARCHAR(5) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user'
);

INSERT INTO users (firstName, lastName, email, mobile, age, address, gender, bloodGroup, password, role)
VALUES ('Admin', 'User', 'admin@yourdomain.com', '1234567890', 35, 'Admin Address', 'Male', 'O+', 'hashed_admin_password', 'admin');



SELECT * FROM users WHERE email = 'admin@gmail.com';

select * from users ;

drop table users;





CREATE TABLE IF NOT EXISTS children (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  age INT NOT NULL,
  bloodGroup VARCHAR(5) NOT NULL,
  mobile VARCHAR(20) NOT NULL,
  gender VARCHAR(10) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

select * from children;


	CREATE TABLE hospitals (
	  hospital_id INT AUTO_INCREMENT PRIMARY KEY,
	  name VARCHAR(100) NOT NULL,
	  description TEXT,
	  direction TEXT,
	  image_url TEXT,
	  disease VARCHAR(100) NOT NULL
	);






INSERT INTO hospitals (name, description, direction, image_url, disease)
VALUES 
('Victoria Hospital', 'Government hospital providing general and emergency care', 'https://maps.google.com/?q=Victoria+Hospital,+KR+Road,+Bangalore', '🏨', 'Fever'),
('NIMHANS (National Institute of Mental Health and Neuro Sciences)', 'Specialized in mental health and neuro sciences', 'https://maps.google.com/?q=NIMHANS,+Hosur+Road,+Bangalore', '🏨', 'Cold'),
('Bangalore Medical College and Research Institute', 'Offers a variety of healthcare services', 'https://maps.google.com/?q=Bangalore+Medical+College,+Krishna+Raja+Road,+Bangalore', '🏨', 'Diabetes'),
('Minto Eye Hospital', 'Specialized in ophthalmic care and surgeries', 'https://maps.google.com/?q=Minto+Eye+Hospital,+Shivaji+Nagar,+Bangalore', '🏨', 'Asthma'),
('K.C. General Hospital', 'Provides general healthcare services and emergency care', 'https://maps.google.com/?q=KC+General+Hospital,+Malleswaram,+Bangalore', '🏨', 'Malaria'),
('Bangalore City Hospital', 'Offers a range of general healthcare services', 'https://maps.google.com/?q=Bangalore+City+Hospital,+Shivaji+Nagar,+Bangalore', '🏨', 'Heart Disease'),
('Chigateri General Hospital', 'Provides general health services to the public', 'https://maps.google.com/?q=Chigateri+General+Hospital,+Bangalore', '🏨', 'Cancer'),
('Vivekananda Hospital', 'Provides a wide range of medical services', 'https://maps.google.com/?q=Vivekananda+Hospital,+Basavanagudi,+Bangalore', '🏨', 'Allergy'),
('Bangalore Rajiv Gandhi Institute of Chest Diseases', 'Specializes in respiratory diseases and chest care', 'https://maps.google.com/?q=Rajiv+Gandhi+Institute+of+Chest+Diseases,+Bangalore', '🏨', 'Covid-19'),
('Halasuru Government Hospital', 'Provides general health services and emergency care', 'https://maps.google.com/?q=Halasuru+Government+Hospital,+Bangalore', '🏨', 'Hypertension');




CREATE TABLE feedback (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS search_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  disease VARCHAR(100) NOT NULL,
  hospitals JSON NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

select * from search_history;

TRUNCATE TABLE search_history;

