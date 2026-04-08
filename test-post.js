const http = require('http');

const data = JSON.stringify({
  title: "Test Project",
  titleHe: "בדיקה",
  images: ["http://res.cloudinary.com/demo/image.jpeg"],
  architect: "Test Architect",
  photographer: "Test Photo",
  lightingConsultant: "Test Light",
  location: "Test Loc"
});

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/projects',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
    // Fake the token to bypass auth check if possible, or just see if we get 401 
    // actually, let's just see if we get 401 or 500
  }
}, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log(`Status: ${res.statusCode}\nBody: ${body}`));
});

req.on('error', console.error);
req.write(data);
req.end();
