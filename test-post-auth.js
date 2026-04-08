const http = require('http');
const { SignJWT } = require('jose');

async function run() {
  const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "supersecret");
  
  const token = await new SignJWT({ role: 'ADMIN' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('2h')
    .sign(JWT_SECRET);

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
      'Cookie': `auth_token=${token}`
    }
  }, res => {
    let body = '';
    res.on('data', d => body += d);
    res.on('end', () => console.log(`Status: ${res.statusCode}\nBody: ${body}`));
  });

  req.on('error', console.error);
  req.write(data);
  req.end();
}

run();
